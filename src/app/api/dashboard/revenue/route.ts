import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, revenueSnapshots } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  fetchRolling30DayRevenue,
  persistRevenueSnapshot,
  getLatestFreshSnapshot,
} from "@/lib/stripe-revenue";
import { rateLimit } from "@/lib/rate-limit";

/**
 * GET /api/dashboard/revenue
 *
 * Returns the most recent rolling 30-day net revenue for the authenticated
 * user's company. Strategy:
 *
 *   1. If the company has a stored snapshot younger than 6 hours, return it.
 *   2. Otherwise, fetch live from Stripe, persist the snapshot, and return.
 *   3. If Stripe fails (e.g. revoked key), fall back to the last stored snapshot
 *      or `{ currentMrrCents: 0 }` so the dashboard never crashes.
 *
 * Response shape: `{ currentMrrCents, periodStart?, periodEnd?, source? }`.
 * All amounts are in integer cents — callers must divide by 100 for dollar display.
 *
 * Rate limited (30/60s per user) so a user mashing refresh on the dashboard
 * can't pummel Stripe.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`revenue:${userId}`, 30, 60_000);
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
      return NextResponse.json({ currentMrrCents: 0 });
    }

    // Fast path — fresh stored snapshot (< 6h old)
    const fresh = await getLatestFreshSnapshot(company.id, 360);
    if (fresh) {
      const revenueCents = fresh.netRevenueCents ?? fresh.grossRevenueCents;
      return NextResponse.json({
        currentMrrCents: revenueCents,
        periodStart: fresh.periodStart,
        periodEnd: fresh.periodEnd,
        source: "cached",
      });
    }

    // No fresh snapshot — try to fetch live from Stripe
    if (company.stripeAccountId) {
      try {
        const live = await fetchRolling30DayRevenue(company.stripeAccountId);
        const snapshot = await persistRevenueSnapshot(company.id, live);
        const revenueCents =
          snapshot.netRevenueCents ?? snapshot.grossRevenueCents;
        return NextResponse.json({
          currentMrrCents: revenueCents,
          periodStart: snapshot.periodStart,
          periodEnd: snapshot.periodEnd,
          source: "live",
        });
      } catch (stripeErr) {
        // Stripe fetch failed — fall through to last-stored-snapshot fallback
        console.error("Stripe revenue fetch failed:", stripeErr);
      }
    }

    // Fallback — latest stored snapshot regardless of age
    const [latest] = await db
      .select({
        grossRevenueCents: revenueSnapshots.grossRevenueCents,
        netRevenueCents: revenueSnapshots.netRevenueCents,
        periodStart: revenueSnapshots.periodStart,
        periodEnd: revenueSnapshots.periodEnd,
      })
      .from(revenueSnapshots)
      .where(eq(revenueSnapshots.companyId, company.id))
      .orderBy(desc(revenueSnapshots.createdAt))
      .limit(1);

    if (!latest) {
      return NextResponse.json({ currentMrrCents: 0 });
    }

    const revenueCents = latest.netRevenueCents ?? latest.grossRevenueCents;
    return NextResponse.json({
      currentMrrCents: revenueCents,
      periodStart: latest.periodStart,
      periodEnd: latest.periodEnd,
      source: "stale",
    });
  } catch (err) {
    console.error("Revenue endpoint failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch revenue data." },
      { status: 500 }
    );
  }
}
