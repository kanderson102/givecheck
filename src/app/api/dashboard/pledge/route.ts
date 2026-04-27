import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies, verificationPeriods } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import {
  fetchRolling30DayRevenue,
  getLatestFreshSnapshot,
  persistRevenueSnapshot,
} from "@/lib/stripe-revenue";
import { getStripeKey } from "@/lib/crypto";

const MIN_PLEDGE_CENTS = 1000; // $10/mo — Every.org recurring minimum

/**
 * POST /api/dashboard/pledge
 *
 * Authoritative pledge amount is a fixed monthly **dollar** amount
 * (`pledgedMonthlyCents`). We also keep a derived `mrgPledgePct` for display
 * and leaderboard ranking, but billing reality is the fixed $.
 *
 * Accepts either:
 *   - `{ pledgedMonthlyCents: number }` (preferred)
 *   - `{ pledgePct: number }` (legacy; converted using the company's current MRR)
 *
 * Validation:
 *   - amount >= $10/mo
 *   - whole dollars (cents % 100 === 0)
 *
 * Behavior:
 *   - First pledge → open new 30-day verification period with `pledgedCents` locked
 *   - Increase mid-period → applies to current period immediately (user must
 *     resubscribe on Every.org to actually charge the higher amount)
 *   - Decrease mid-period → queued in `nextPledgedMonthlyCents`, applied at
 *     next period open
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = rateLimit(`pledge:${userId}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  let pledgedMonthlyCents: number | null =
    typeof body.pledgedMonthlyCents === "number" ? Math.round(body.pledgedMonthlyCents) : null;
  const legacyPct: number | null =
    typeof body.pledgePct === "number" ? body.pledgePct : null;

  if (pledgedMonthlyCents === null && legacyPct === null) {
    return NextResponse.json(
      { error: "Provide pledgedMonthlyCents (preferred) or pledgePct." },
      { status: 400 }
    );
  }

  // Load company up front — we need it for MRR lookup + period state
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.clerkUserId, userId))
    .limit(1);

  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  // Snapshot MRR (used for drift baseline + legacy-% conversion + derived %)
  let currentMrrCents: number | null = null;
  if (company.stripeAccountId) {
    try {
      const fresh = await getLatestFreshSnapshot(company.id, 360);
      if (fresh) {
        currentMrrCents = fresh.netRevenueCents ?? fresh.grossRevenueCents;
      } else {
        const key = await getStripeKey(company.id);
        if (key) {
          const revenue = await fetchRolling30DayRevenue(key);
          await persistRevenueSnapshot(company.id, revenue);
          currentMrrCents = revenue.netRevenueCents;
        }
      }
    } catch (err) {
      console.error("pledge: MRR snapshot failed", err);
      // Non-fatal — dollar-mode pledges proceed without MRR; percent-mode fails below
    }
  }

  // Convert legacy % input → cents using current MRR
  if (pledgedMonthlyCents === null) {
    if (currentMrrCents === null || currentMrrCents <= 0) {
      return NextResponse.json(
        {
          error:
            "Can't convert % to dollars without current MRR. Connect Stripe or submit pledgedMonthlyCents directly.",
        },
        { status: 400 }
      );
    }
    if (legacyPct === null || legacyPct < 0.1 || legacyPct > 100) {
      return NextResponse.json(
        { error: "Pledge percentage must be between 0.1 and 100." },
        { status: 400 }
      );
    }
    // Round to nearest whole dollar (Every.org constraint)
    pledgedMonthlyCents = Math.round((legacyPct / 100) * currentMrrCents / 100) * 100;
  }

  // Validate fixed-dollar constraints
  if (pledgedMonthlyCents < MIN_PLEDGE_CENTS) {
    return NextResponse.json(
      { error: "Pledge must be at least $10/month (Every.org minimum for recurring donations)." },
      { status: 400 }
    );
  }
  if (pledgedMonthlyCents % 100 !== 0) {
    return NextResponse.json(
      { error: "Pledge must be a whole-dollar amount (Every.org requirement)." },
      { status: 400 }
    );
  }

  // Derived % for display — null if MRR unknown
  const derivedPct =
    currentMrrCents && currentMrrCents > 0
      ? Math.round((pledgedMonthlyCents / currentMrrCents) * 10000) / 100
      : null;

  const currentPledgedCents = company.pledgedMonthlyCents ?? null;
  const isDecrease = currentPledgedCents !== null && pledgedMonthlyCents < currentPledgedCents;
  const isIncrease = currentPledgedCents !== null && pledgedMonthlyCents > currentPledgedCents;

  const now = new Date();
  const nowStr = now.toISOString().slice(0, 10);

  const openPeriods = await db
    .select()
    .from(verificationPeriods)
    .where(
      and(
        eq(verificationPeriods.companyId, company.id),
        eq(verificationPeriods.isVerified, false),
        gt(verificationPeriods.periodEnd, nowStr)
      )
    )
    .limit(1);

  const hasOpenPeriod = openPeriods.length > 0;

  // ── Decrease mid-period: queue for next period ────────────────────
  if (isDecrease && hasOpenPeriod) {
    await db
      .update(companies)
      .set({
        nextPledgedMonthlyCents: pledgedMonthlyCents,
        updatedAt: now,
      })
      .where(eq(companies.id, company.id));

    const periodEnd = new Date(openPeriods[0].periodEnd + "T00:00:00Z");
    return NextResponse.json({
      success: true,
      queued: true,
      pledgedMonthlyCents,
      derivedPct,
      message: `Your pledge will decrease to $${pledgedMonthlyCents / 100}/mo at the start of your next period on ${periodEnd.toLocaleDateString()}. Donations already set up stay as-is until then.`,
      nextVerification: periodEnd.toISOString(),
    });
  }

  // ── Increase mid-period: applies to current period ────────────────
  if (isIncrease && hasOpenPeriod) {
    await db
      .update(companies)
      .set({
        pledgedMonthlyCents,
        nextPledgedMonthlyCents: null,
        mrgPledgePct: derivedPct !== null ? String(derivedPct) : null,
        updatedAt: now,
      })
      .where(eq(companies.id, company.id));

    await db
      .update(verificationPeriods)
      .set({
        pledgedCents: pledgedMonthlyCents,
        givingPercentage: derivedPct !== null ? String(derivedPct) : null,
      })
      .where(eq(verificationPeriods.id, openPeriods[0].id));

    const periodEnd = new Date(openPeriods[0].periodEnd + "T00:00:00Z");
    return NextResponse.json({
      success: true,
      queued: false,
      pledgedMonthlyCents,
      derivedPct,
      message: `Pledge increased to $${pledgedMonthlyCents / 100}/mo. Resubscribe on Every.org at the higher amount to stay verified this period.`,
      nextVerification: periodEnd.toISOString(),
    });
  }

  // ── Fresh pledge: open new 30-day period ──────────────────────────
  const periodStart = now;
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await db
    .update(companies)
    .set({
      pledgedMonthlyCents,
      nextPledgedMonthlyCents: null,
      mrgPledgePct: derivedPct !== null ? String(derivedPct) : null,
      mrrAtPledgeCents: currentMrrCents,
      mrrDriftFlag: null,
      periodAnchor: periodStart,
      updatedAt: now,
    })
    .where(eq(companies.id, company.id));

  await db.insert(verificationPeriods).values({
    companyId: company.id,
    periodStart: periodStart.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    pledgedCents: pledgedMonthlyCents,
    givingPercentage: derivedPct !== null ? String(derivedPct) : null,
    isVerified: false,
  });

  return NextResponse.json({
    success: true,
    queued: false,
    pledgedMonthlyCents,
    derivedPct,
    nextVerification: periodEnd.toISOString(),
  });
}
