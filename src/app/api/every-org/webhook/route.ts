import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies, donations, verificationPeriods } from "@/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * POST /api/every-org/webhook
 *
 * Handles Every.org Partner Webhook events. Real-time half of our
 * belt-and-suspenders donation tracking — webhook captures charges as they
 * happen, daily cron's Partner API poll reconciles anything missed.
 *
 * Idempotent on `every_org_id` (unique index). Strict `partnerDonorId` match —
 * donations without a partnerDonorId matching a company are ignored.
 *
 * Docs: https://docs.every.org/docs/webhooks/partner-webhook
 *
 * Event-name tolerant: we handle what we recognize and 200 on the rest so
 * Every.org doesn't retry forever. Exact event names pending confirmation from
 * team@every.org — see the "Outreach" section of the P0.4 plan.
 */

// Accept a small family of header names defensively — Every.org docs don't pin
// this down precisely and it varies across their products.
const SIGNATURE_HEADERS = [
  "every-org-signature",
  "x-every-org-signature",
  "signature",
];

function verifySignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.EVERY_ORG_WEBHOOK_SECRET;
  if (!secret) {
    console.error("every-org webhook: EVERY_ORG_WEBHOOK_SECRET not set");
    return false;
  }

  let provided: string | null = null;
  for (const h of SIGNATURE_HEADERS) {
    const v = headers.get(h);
    if (v) {
      provided = v;
      break;
    }
  }
  if (!provided) return false;

  // Support `sha256=...` prefix or bare hex
  const providedHex = provided.startsWith("sha256=") ? provided.slice(7) : provided;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(providedHex, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

interface ParsedDonation {
  everyOrgId: string;
  partnerDonorId: string;
  amountCents: number;
  recipientName: string;
  recipientSlug: string;
  recipientType: string;
  donatedAt: Date;
}

function parseDonationPayload(body: unknown): ParsedDonation | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  // Payload may be nested under `donation`, `data`, or be top-level
  const d = (b.donation ?? b.data ?? b) as Record<string, unknown>;

  const everyOrgId = (d.id ?? d.donationId ?? d.everyOrgId) as string | undefined;
  const partnerDonorId = (d.partnerDonorId ?? d.externalDonorId) as string | undefined;
  const amountRaw = d.amountCents ?? d.amount ?? d.amountInCents;
  const recipientName = (d.recipientName ?? d.nonprofitName ?? d.toName) as string | undefined;
  const recipientSlug = (d.recipientSlug ?? d.nonprofitSlug ?? d.toSlug ?? d.slug) as
    | string
    | undefined;
  const createdAtRaw = (d.createdAt ?? d.date ?? d.timestamp) as string | undefined;

  if (!everyOrgId || !partnerDonorId || !recipientName || !recipientSlug || !createdAtRaw) {
    return null;
  }

  let amountCents: number;
  if (typeof amountRaw === "number") {
    amountCents =
      amountRaw < 100_000 && !Number.isInteger(amountRaw)
        ? Math.round(amountRaw * 100)
        : Math.round(amountRaw);
  } else if (typeof amountRaw === "string") {
    const n = Number(amountRaw);
    if (isNaN(n)) return null;
    amountCents = Math.round(n);
  } else {
    return null;
  }

  const donatedAt = new Date(createdAtRaw);
  if (isNaN(donatedAt.getTime())) return null;

  return {
    everyOrgId,
    partnerDonorId,
    amountCents,
    recipientName,
    recipientSlug,
    recipientType: "nonprofit",
    donatedAt,
  };
}

export async function POST(req: NextRequest) {
  // Must read raw body for signature verification
  const rawBody = await req.text();

  if (!verifySignature(rawBody, req.headers)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (parsed as Record<string, unknown>)?.type as string | undefined;

  try {
    switch (eventType) {
      case "donation.created":
      case "donation.succeeded":
        return await handleDonationSucceeded(parsed);

      case "donation.refunded":
        return await handleDonationRefunded(parsed);

      case "subscription.cancelled":
      case "subscription.canceled":
        return await handleSubscriptionCancelled(parsed);

      default:
        // Unknown / unhandled — 200 so Every.org doesn't retry forever
        console.log(`every-org webhook: ignoring event type "${eventType}"`);
        return NextResponse.json({ ok: true, ignored: true });
    }
  } catch (err) {
    console.error("every-org webhook: handler failed", err);
    // 500 so Every.org retries — this is likely a transient DB issue
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleDonationSucceeded(payload: unknown): Promise<NextResponse> {
  const d = parseDonationPayload(payload);
  if (!d) {
    console.error("every-org webhook: unparseable donation payload", payload);
    return NextResponse.json({ error: "Unparseable payload" }, { status: 400 });
  }

  // Strict match: partnerDonorId must identify a company we own
  const [company] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.id, d.partnerDonorId))
    .limit(1);

  if (!company) {
    console.log(
      `every-org webhook: donation ${d.everyOrgId} partnerDonorId=${d.partnerDonorId} not found, ignoring`
    );
    return NextResponse.json({ ok: true, ignored: "unknown_partner_donor_id" });
  }

  // Find the verification_period that encloses the donation date (for
  // period tagging). If none, fall back to ±30d around donation date.
  const donatedDateStr = d.donatedAt.toISOString().slice(0, 10);
  const [enclosingPeriod] = await db
    .select({
      periodStart: verificationPeriods.periodStart,
      periodEnd: verificationPeriods.periodEnd,
    })
    .from(verificationPeriods)
    .where(
      and(
        eq(verificationPeriods.companyId, company.id),
        lte(verificationPeriods.periodStart, donatedDateStr),
        gte(verificationPeriods.periodEnd, donatedDateStr)
      )
    )
    .limit(1);

  const periodStart =
    enclosingPeriod?.periodStart ??
    new Date(d.donatedAt.getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
  const periodEnd =
    enclosingPeriod?.periodEnd ??
    new Date(d.donatedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

  // Upsert — idempotent on every_org_id
  await db
    .insert(donations)
    .values({
      companyId: company.id,
      periodStart,
      periodEnd,
      amountCents: d.amountCents,
      recipientName: d.recipientName,
      recipientSlug: d.recipientSlug,
      everyOrgId: d.everyOrgId,
      recipientType: d.recipientType,
      donatedAt: d.donatedAt,
      status: "succeeded",
      verified: true,
      verifiedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: donations.everyOrgId,
      set: {
        amountCents: d.amountCents,
        status: "succeeded",
        verifiedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}

async function handleDonationRefunded(payload: unknown): Promise<NextResponse> {
  const d = parseDonationPayload(payload);
  if (!d) return NextResponse.json({ error: "Unparseable" }, { status: 400 });

  // Mark the donation as refunded; keep the row so we have audit trail.
  // MVP: we do NOT retroactively un-verify a period if a refund lands late.
  // (deferred to P1 per plan)
  await db
    .update(donations)
    .set({ status: "refunded" })
    .where(eq(donations.everyOrgId, d.everyOrgId));

  return NextResponse.json({ ok: true });
}

async function handleSubscriptionCancelled(payload: unknown): Promise<NextResponse> {
  // Best-effort: pull partnerDonorId off the payload and flag the company so
  // the dashboard can surface a banner.
  const b = payload as Record<string, unknown>;
  const inner = (b.data ?? b.subscription ?? b) as Record<string, unknown>;
  const partnerDonorId = (inner.partnerDonorId ?? inner.externalDonorId) as string | undefined;
  if (!partnerDonorId) return NextResponse.json({ ok: true, ignored: "no_partner_donor_id" });

  await db
    .update(companies)
    .set({ everyOrgSubCancelledAt: new Date() })
    .where(eq(companies.id, partnerDonorId));

  return NextResponse.json({ ok: true });
}
