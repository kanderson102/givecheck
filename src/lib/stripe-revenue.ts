import Stripe from "stripe";
import { getStripeKey } from "@/lib/crypto";
import { db } from "@/db";
import { revenueSnapshots } from "@/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export interface MonthlyRevenue {
  month: string;       // "Jan 2026"
  revenueCents: number;
  donatedCents: number;
}

export interface RevenueHistory {
  history: MonthlyRevenue[];
}

export interface Rolling30DayRevenue {
  grossRevenueCents: number;
  refundCents: number;
  netRevenueCents: number;  // gross minus refunds — the MRG base
  windowStart: Date;
  windowEnd: Date;
}

const EXCLUDED_TYPES = new Set([
  "payout", "stripe_fee", "network_cost", "adjustment", "obligation_reversal",
]);

// Simple in-memory cache for Stripe revenue data (avoids hammering Stripe on every page load)
const revenueCache = new Map<string, { data: Rolling30DayRevenue; expiry: number }>();
const historyCache = new Map<string, { data: RevenueHistory; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches rolling 30-day net revenue from Stripe.
 * Window: anchorDate (or today-30d) → today.
 * Subtracts refunds from gross charges for a net figure.
 *
 * Results are cached for 5 minutes to avoid excessive Stripe API calls.
 */
export async function fetchRolling30DayRevenue(
  encryptedKey: string,
  anchorDate?: Date
): Promise<Rolling30DayRevenue> {
  const cacheKey = `${encryptedKey}:${anchorDate?.toISOString() ?? "default"}`;
  const cached = revenueCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const apiKey = getStripeKey(encryptedKey);
  const stripe = new Stripe(apiKey, { apiVersion: "2026-03-25.dahlia" });

  const windowEnd = new Date();
  const windowStart = anchorDate
    ? new Date(anchorDate)
    : new Date(windowEnd.getTime() - 30 * 24 * 60 * 60 * 1000);

  const start = Math.floor(windowStart.getTime() / 1000);
  const end = Math.floor(windowEnd.getTime() / 1000);

  let grossCents = 0;
  let refundCents = 0;
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const params: Stripe.BalanceTransactionListParams = {
      created: { gte: start, lte: end },
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    };

    const txns = await stripe.balanceTransactions.list(params);

    for (const txn of txns.data) {
      if (EXCLUDED_TYPES.has(txn.type)) continue;

      if (txn.type === "refund") {
        // Refunds have negative amounts — use absolute value
        refundCents += Math.abs(txn.amount);
      } else if (txn.amount > 0) {
        grossCents += txn.amount;
      }
      // Negative non-refund, non-excluded txns (e.g. disputes) are ignored
      // to avoid double-counting. Disputes have their own type and should
      // be handled explicitly if needed in the future.
    }

    hasMore = txns.has_more;
    if (txns.data.length > 0) {
      startingAfter = txns.data[txns.data.length - 1].id;
    } else {
      hasMore = false;
    }
  }

  const result: Rolling30DayRevenue = {
    grossRevenueCents: grossCents,
    refundCents,
    netRevenueCents: Math.max(0, grossCents - refundCents),
    windowStart,
    windowEnd,
  };

  revenueCache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL });
  return result;
}

/**
 * Fetches 6-month revenue history (calendar months) for the dashboard chart.
 * Now subtracts refunds for a net revenue figure consistent with the stat card.
 *
 * Results are cached for 5 minutes.
 */
export async function fetchRevenueHistory(
  encryptedKey: string
): Promise<RevenueHistory> {
  const cached = historyCache.get(encryptedKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const apiKey = getStripeKey(encryptedKey);
  const stripe = new Stripe(apiKey, { apiVersion: "2026-03-25.dahlia" });

  const now = new Date();
  const months: MonthlyRevenue[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = Math.floor(date.getTime() / 1000);
    const end = Math.floor(
      new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).getTime() / 1000
    );

    let grossCents = 0;
    let monthRefundCents = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: Stripe.BalanceTransactionListParams = {
        created: { gte: start, lte: end },
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      };

      const txns = await stripe.balanceTransactions.list(params);

      for (const txn of txns.data) {
        if (EXCLUDED_TYPES.has(txn.type)) continue;

        if (txn.type === "refund") {
          monthRefundCents += Math.abs(txn.amount);
        } else if (txn.amount > 0) {
          grossCents += txn.amount;
        }
      }

      hasMore = txns.has_more;
      if (txns.data.length > 0) {
        startingAfter = txns.data[txns.data.length - 1].id;
      } else {
        hasMore = false;
      }
    }

    months.push({
      month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      revenueCents: Math.max(0, grossCents - monthRefundCents),
      donatedCents: 0, // populated from donations table once Every.org is wired
    });
  }

  const result: RevenueHistory = { history: months };
  historyCache.set(encryptedKey, { data: result, expiry: Date.now() + CACHE_TTL });
  return result;
}

/**
 * Persists a rolling 30-day revenue snapshot to the database.
 * Idempotent for the same period — if a snapshot already exists for the same
 * company + periodEnd date, returns it without creating a duplicate.
 */
export async function persistRevenueSnapshot(
  companyId: string,
  revenue: Rolling30DayRevenue
): Promise<{
  id: string;
  grossRevenueCents: number;
  netRevenueCents: number | null;
  periodStart: string;
  periodEnd: string;
  createdAt: Date;
}> {
  const periodStartStr = revenue.windowStart.toISOString().slice(0, 10);
  const periodEndStr = revenue.windowEnd.toISOString().slice(0, 10);

  // Check if a snapshot already exists for this exact period end
  const existing = await db
    .select()
    .from(revenueSnapshots)
    .where(
      and(
        eq(revenueSnapshots.companyId, companyId),
        eq(revenueSnapshots.periodEnd, periodEndStr)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return {
      id: existing[0].id,
      grossRevenueCents: existing[0].grossRevenueCents,
      netRevenueCents: existing[0].netRevenueCents,
      periodStart: existing[0].periodStart,
      periodEnd: existing[0].periodEnd,
      createdAt: existing[0].createdAt,
    };
  }

  const [inserted] = await db
    .insert(revenueSnapshots)
    .values({
      companyId,
      periodStart: periodStartStr,
      periodEnd: periodEndStr,
      grossRevenueCents: revenue.grossRevenueCents,
      netRevenueCents: revenue.netRevenueCents,
      source: "stripe",
      verified: false,
    })
    .returning({
      id: revenueSnapshots.id,
      grossRevenueCents: revenueSnapshots.grossRevenueCents,
      netRevenueCents: revenueSnapshots.netRevenueCents,
      periodStart: revenueSnapshots.periodStart,
      periodEnd: revenueSnapshots.periodEnd,
      createdAt: revenueSnapshots.createdAt,
    });

  return inserted;
}

/**
 * Returns the latest stored snapshot for a company if it's fresh
 * (younger than `maxAgeMinutes`). Otherwise returns null so callers
 * know they should fetch live from Stripe.
 */
export async function getLatestFreshSnapshot(
  companyId: string,
  maxAgeMinutes: number = 360 // 6 hours default
): Promise<{
  grossRevenueCents: number;
  netRevenueCents: number | null;
  periodStart: string;
  periodEnd: string;
  createdAt: Date;
} | null> {
  const threshold = new Date(Date.now() - maxAgeMinutes * 60 * 1000);

  const [snapshot] = await db
    .select({
      grossRevenueCents: revenueSnapshots.grossRevenueCents,
      netRevenueCents: revenueSnapshots.netRevenueCents,
      periodStart: revenueSnapshots.periodStart,
      periodEnd: revenueSnapshots.periodEnd,
      createdAt: revenueSnapshots.createdAt,
    })
    .from(revenueSnapshots)
    .where(
      and(
        eq(revenueSnapshots.companyId, companyId),
        gte(revenueSnapshots.createdAt, threshold)
      )
    )
    .orderBy(desc(revenueSnapshots.createdAt))
    .limit(1);

  return snapshot ?? null;
}
