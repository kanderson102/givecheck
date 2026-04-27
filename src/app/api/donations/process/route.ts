import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, givingAllocations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/donations/process
 *
 * MVP flow (no Partner API access required):
 *   1. Auth check
 *   2. Load company (must have a fixed-dollar pledge: `pledgedMonthlyCents`)
 *   3. Load allocations
 *   4. Split the pledged $ across allocations by `allocationPct`, rounded to
 *      whole dollars (Every.org requirement)
 *   5. For each allocation generate an Every.org donation URL
 *      (`?amount=X&frequency=MONTHLY&method=card&partnerDonorId={companyId}`)
 *   6. Return the list — the confirm page shows one "Set up donation" link per
 *      allocation and the user completes each on Every.org
 *
 * Bucket funds (`recipient_type = bucket_fund`) don't have an Every.org slug —
 * they'll be processed internally once the admin flow is built. For MVP we mark
 * them `supportedForDirectDonation: false`.
 *
 * Every.org constraints enforced here:
 *   - Per-allocation amount >= $10 (their recurring minimum)
 *   - Whole dollars only
 *
 * We do NOT write to the `donations` table — that's populated from Every.org
 * webhooks once a donation is actually confirmed. Here we only generate the
 * links the user needs to click.
 */

interface DonationIntent {
  recipientName: string;
  recipientSlug: string;
  recipientType: string;
  allocationPct: number;
  amountCents: number;
  amountDollars: number;
  donationUrl: string | null;
  supportedForDirectDonation: boolean;
}

function buildEveryOrgUrl(
  slug: string,
  amountDollars: number,
  partnerDonorId: string
): string {
  // `partnerDonorId` round-trips via Every.org's Partner Webhook payload so we
  // can match donations back to the right company.
  // Docs: https://docs.every.org/docs/webhooks/partner-webhook
  const params = new URLSearchParams({
    amount: String(Math.round(amountDollars)), // whole dollars only
    frequency: "MONTHLY",
    method: "card",
    partnerDonorId,
    utm_source: "givecheck",
    utm_medium: "referral",
  });
  return `https://www.every.org/${encodeURIComponent(slug)}?${params.toString()}`;
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`donations:${userId}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.clerkUserId, userId))
      .limit(1);

    if (!company) {
      return NextResponse.json(
        { error: "Company not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    const pledgedMonthlyCents = company.pledgedMonthlyCents;
    if (!pledgedMonthlyCents || pledgedMonthlyCents < 1000) {
      return NextResponse.json(
        { error: "Set a monthly pledge of at least $10 before generating donation links." },
        { status: 400 }
      );
    }

    const allocations = await db
      .select({
        recipientName: givingAllocations.recipientName,
        recipientSlug: givingAllocations.recipientSlug,
        recipientType: givingAllocations.recipientType,
        allocationPct: givingAllocations.allocationPct,
      })
      .from(givingAllocations)
      .where(eq(givingAllocations.companyId, company.id));

    if (allocations.length === 0) {
      return NextResponse.json(
        { error: "Add at least one allocation before setting up donations." },
        { status: 400 }
      );
    }

    // Split pledged dollars across allocations, rounded to whole dollars
    const intents: DonationIntent[] = allocations.map((a) => {
      const rawCents = (a.allocationPct / 100) * pledgedMonthlyCents;
      const amountDollars = Math.round(rawCents / 100); // whole dollars
      const amountCents = amountDollars * 100;
      const supportedForDirectDonation = a.recipientType === "nonprofit";

      return {
        recipientName: a.recipientName,
        recipientSlug: a.recipientSlug,
        recipientType: a.recipientType,
        allocationPct: a.allocationPct,
        amountCents,
        amountDollars,
        donationUrl:
          supportedForDirectDonation && amountDollars >= 10
            ? buildEveryOrgUrl(a.recipientSlug, amountDollars, company.id)
            : null,
        supportedForDirectDonation,
      };
    });

    // Surface any allocation that falls below Every.org's $10 recurring minimum
    const undersized = intents.filter(
      (i) => i.supportedForDirectDonation && i.amountDollars < 10
    );
    if (undersized.length > 0) {
      return NextResponse.json(
        {
          error: `These allocations fall below Every.org's $10/mo recurring minimum: ${undersized
            .map((i) => `${i.recipientName} ($${i.amountDollars})`)
            .join(", ")}. Increase your pledge or consolidate allocations.`,
          undersized: undersized.map((i) => ({
            recipientName: i.recipientName,
            amountDollars: i.amountDollars,
          })),
        },
        { status: 400 }
      );
    }

    const totalGivingCents = intents.reduce((sum, i) => sum + i.amountCents, 0);

    return NextResponse.json({
      pledgedMonthlyCents,
      totalGivingCents, // may differ from pledgedMonthlyCents by rounding ± $1 per allocation
      intents,
    });
  } catch (err) {
    console.error("donations/process failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
