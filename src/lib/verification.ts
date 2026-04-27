/**
 * Verification core — turns open periods into verified badges and keeps the
 * leaderboard cache fresh.
 *
 * Three entry points:
 *   - `verifyOpenPeriod(company, period)` — check if a just-closed period
 *     has received enough donations; flip `is_verified` if so.
 *   - `checkMrrDrift(company)` — compare current MRR to pledge-time baseline;
 *     set `mrrDriftFlag` if thresholds crossed.
 *   - `updateLeaderboardCache()` — recompute the full leaderboard_cache table.
 *
 * All called from `/api/cron/daily`. Each function is self-contained and
 * exception-safe — the cron wraps calls in try/catch per company.
 */

import { db } from "@/db";
import {
  companies,
  donations,
  leaderboardCache,
  revenueSnapshots,
  verificationPeriods,
} from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { fetchRolling30DayRevenue, persistRevenueSnapshot } from "@/lib/stripe-revenue";
import { getStripeKey } from "@/lib/crypto";
import { fetchDonationsForCompany } from "@/lib/every-org-api";

const GRACE_DAYS = 7;
const MRR_GREW_THRESHOLD = 0.20;   // +20%
const MRR_DROPPED_THRESHOLD = 0.30; // -30%

export interface VerifyResult {
  companyId: string;
  periodId: string;
  outcome: "verified" | "still_short_in_grace" | "lapsed" | "skipped";
  totalDonatedCents: number;
  pledgedCents: number;
}

/**
 * Attempts to verify a single open period. Reconciles donations via the
 * Partner API, compares sum-in-window to `pledgedCents`, and flips state.
 *
 * `period` must have `isVerified = false` and `periodEnd < now`. Caller
 * decides grace vs past-grace.
 */
export async function verifyOpenPeriod(
  companyId: string,
  period: {
    id: string;
    periodStart: string;
    periodEnd: string;
    pledgedCents: number | null;
  }
): Promise<VerifyResult> {
  const pledgedCents = period.pledgedCents;
  if (!pledgedCents || pledgedCents <= 0) {
    return {
      companyId,
      periodId: period.id,
      outcome: "skipped",
      totalDonatedCents: 0,
      pledgedCents: 0,
    };
  }

  const windowStart = new Date(period.periodStart + "T00:00:00Z");
  const windowEnd = new Date(period.periodEnd + "T23:59:59Z");

  // 1. Reconcile via Partner API poll (backfill anything webhook missed)
  const apiDonations = await fetchDonationsForCompany(companyId, windowStart, windowEnd);
  for (const d of apiDonations) {
    // Strict partnerDonorId match — though the API filter should handle it,
    // double-check defensively.
    if (d.partnerDonorId && d.partnerDonorId !== companyId) continue;

    await db
      .insert(donations)
      .values({
        companyId,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd,
        amountCents: d.amountCents,
        recipientName: d.recipientName,
        recipientSlug: d.recipientSlug,
        everyOrgId: d.everyOrgId,
        recipientType: "nonprofit",
        donatedAt: d.createdAt,
        status: "succeeded",
        verified: true,
        verifiedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: donations.everyOrgId,
        set: { amountCents: d.amountCents, status: "succeeded" },
      });
  }

  // 2. Sum donations in window (excluding refunds)
  const [{ total }] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${donations.amountCents}), 0)::bigint`,
    })
    .from(donations)
    .where(
      and(
        eq(donations.companyId, companyId),
        eq(donations.status, "succeeded"),
        gte(donations.periodStart, period.periodStart),
        lte(donations.periodEnd, period.periodEnd)
      )
    );

  const totalDonatedCents = Number(total);

  // 3. Verify or not
  if (totalDonatedCents >= pledgedCents) {
    await db
      .update(verificationPeriods)
      .set({
        isVerified: true,
        verifiedAt: new Date(),
        totalDonatedCents,
      })
      .where(eq(verificationPeriods.id, period.id));

    // Open next period — carry pledged amount, apply queued change if any
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (company) {
      const nextPledgedCents =
        company.nextPledgedMonthlyCents ?? company.pledgedMonthlyCents;
      const nextStart = new Date(period.periodEnd + "T00:00:00Z");
      const nextEnd = new Date(nextStart.getTime() + 30 * 24 * 60 * 60 * 1000);

      await db.insert(verificationPeriods).values({
        companyId,
        periodStart: nextStart.toISOString().slice(0, 10),
        periodEnd: nextEnd.toISOString().slice(0, 10),
        pledgedCents: nextPledgedCents,
        isVerified: false,
      });

      const updates: Partial<typeof companies.$inferInsert> = {
        status: "verified",
        periodAnchor: nextStart,
        updatedAt: new Date(),
      };
      if (company.nextPledgedMonthlyCents != null) {
        updates.pledgedMonthlyCents = company.nextPledgedMonthlyCents;
        updates.nextPledgedMonthlyCents = null;
      }

      await db.update(companies).set(updates).where(eq(companies.id, companyId));
    }

    return {
      companyId,
      periodId: period.id,
      outcome: "verified",
      totalDonatedCents,
      pledgedCents,
    };
  }

  // Not verified — caller decides grace vs lapse via `periodEnd` age
  const now = Date.now();
  const ageMs = now - new Date(period.periodEnd + "T23:59:59Z").getTime();
  const pastGrace = ageMs > GRACE_DAYS * 24 * 60 * 60 * 1000;

  if (pastGrace) {
    await db
      .update(verificationPeriods)
      .set({ totalDonatedCents })
      .where(eq(verificationPeriods.id, period.id));

    await db
      .update(companies)
      .set({ status: "lapsed", updatedAt: new Date() })
      .where(eq(companies.id, companyId));

    return {
      companyId,
      periodId: period.id,
      outcome: "lapsed",
      totalDonatedCents,
      pledgedCents,
    };
  }

  return {
    companyId,
    periodId: period.id,
    outcome: "still_short_in_grace",
    totalDonatedCents,
    pledgedCents,
  };
}

/**
 * Fetches fresh MRR, compares to `mrrAtPledgeCents`, sets `mrrDriftFlag`
 * when asymmetric thresholds are crossed.
 */
export async function checkMrrDrift(companyId: string): Promise<void> {
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (!company || !company.mrrAtPledgeCents || !company.stripeAccountId) return;

  const key = await getStripeKey(company.id);
  if (!key) return;

  let currentMrrCents: number;
  try {
    const revenue = await fetchRolling30DayRevenue(key);
    await persistRevenueSnapshot(company.id, revenue);
    currentMrrCents = revenue.netRevenueCents;
  } catch (err) {
    console.error(`checkMrrDrift(${companyId}): Stripe fetch failed`, err);
    return;
  }

  const baseline = company.mrrAtPledgeCents;
  const delta = (currentMrrCents - baseline) / baseline;

  let flag: "grew" | "dropped" | null = null;
  if (delta >= MRR_GREW_THRESHOLD) flag = "grew";
  else if (delta <= -MRR_DROPPED_THRESHOLD) flag = "dropped";

  if (flag !== company.mrrDriftFlag) {
    await db
      .update(companies)
      .set({ mrrDriftFlag: flag, updatedAt: new Date() })
      .where(eq(companies.id, companyId));
  }
}

/**
 * Recomputes the full `leaderboard_cache` table.
 *
 * Strategy:
 *   1. Aggregate donation sums over three rolling windows (7d / 30d / YTD)
 *   2. For each active company: derive pct, streak, 10% club
 *   3. Compute ranks with window functions (single SQL)
 *   4. Track category leader changes via `categoryLeaderSince`
 */
export async function updateLeaderboardCache(): Promise<void> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  // Active companies = those with a pledged amount
  const activeCompanies = await db
    .select({
      id: companies.id,
      category: companies.category,
      pledgedMonthlyCents: companies.pledgedMonthlyCents,
      status: companies.status,
    })
    .from(companies);

  for (const c of activeCompanies) {
    if (!c.pledgedMonthlyCents || c.pledgedMonthlyCents <= 0) continue;

    // Sums over rolling windows (strict partnerDonorId match implicit by FK)
    const [{ last7 }] = await db
      .select({
        last7: sql<number>`COALESCE(SUM(${donations.amountCents}), 0)::bigint`,
      })
      .from(donations)
      .where(
        and(
          eq(donations.companyId, c.id),
          eq(donations.status, "succeeded"),
          gte(donations.donatedAt, sevenDaysAgo)
        )
      );

    const [{ last30 }] = await db
      .select({
        last30: sql<number>`COALESCE(SUM(${donations.amountCents}), 0)::bigint`,
      })
      .from(donations)
      .where(
        and(
          eq(donations.companyId, c.id),
          eq(donations.status, "succeeded"),
          gte(donations.donatedAt, thirtyDaysAgo)
        )
      );

    const [{ ytd }] = await db
      .select({
        ytd: sql<number>`COALESCE(SUM(${donations.amountCents}), 0)::bigint`,
      })
      .from(donations)
      .where(
        and(
          eq(donations.companyId, c.id),
          eq(donations.status, "succeeded"),
          gte(donations.donatedAt, yearStart)
        )
      );

    // Current MRG pct / amount — derive from latest snapshot
    const [snapshot] = await db
      .select({
        grossRevenueCents: revenueSnapshots.grossRevenueCents,
        netRevenueCents: revenueSnapshots.netRevenueCents,
      })
      .from(revenueSnapshots)
      .where(eq(revenueSnapshots.companyId, c.id))
      .orderBy(sql`${revenueSnapshots.createdAt} DESC`)
      .limit(1);

    const currentMrrCents = snapshot
      ? snapshot.netRevenueCents ?? snapshot.grossRevenueCents
      : null;
    const currentMrgPct =
      currentMrrCents && currentMrrCents > 0
        ? Math.round((c.pledgedMonthlyCents / currentMrrCents) * 10000) / 100
        : null;

    // Verified streak — count consecutive `is_verified = true` periods from
    // most recent, walking backwards.
    const recentPeriods = await db
      .select({
        isVerified: verificationPeriods.isVerified,
        periodEnd: verificationPeriods.periodEnd,
      })
      .from(verificationPeriods)
      .where(eq(verificationPeriods.companyId, c.id))
      .orderBy(sql`${verificationPeriods.periodEnd} DESC`)
      .limit(24);

    let verifiedStreak = 0;
    // Skip the currently-open period (isVerified=false, periodEnd in future)
    for (const p of recentPeriods) {
      const ended = new Date(p.periodEnd + "T00:00:00Z") < now;
      if (!ended) continue;
      if (p.isVerified) verifiedStreak += 1;
      else break;
    }

    const [{ lastVerifiedAt }] = await db
      .select({
        lastVerifiedAt: sql<Date | null>`MAX(${verificationPeriods.verifiedAt})`,
      })
      .from(verificationPeriods)
      .where(
        and(eq(verificationPeriods.companyId, c.id), eq(verificationPeriods.isVerified, true))
      );

    await db
      .insert(leaderboardCache)
      .values({
        companyId: c.id,
        category: c.category,
        currentMrgPct: currentMrgPct !== null ? String(currentMrgPct) : null,
        currentMrgAmount: c.pledgedMonthlyCents,
        is10PctClub: currentMrgPct !== null && currentMrgPct >= 10,
        verifiedStreak,
        donatedLast7dCents: Number(last7),
        donatedLast30dCents: Number(last30),
        donatedYtdCents: Number(ytd),
        lastVerifiedAt,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: leaderboardCache.companyId,
        set: {
          category: c.category,
          currentMrgPct: currentMrgPct !== null ? String(currentMrgPct) : null,
          currentMrgAmount: c.pledgedMonthlyCents,
          is10PctClub: currentMrgPct !== null && currentMrgPct >= 10,
          verifiedStreak,
          donatedLast7dCents: Number(last7),
          donatedLast30dCents: Number(last30),
          donatedYtdCents: Number(ytd),
          lastVerifiedAt,
          updatedAt: now,
        },
      });
  }

  // Ranks via single SQL pass using window functions
  await db.execute(sql`
    WITH ranked AS (
      SELECT
        company_id,
        DENSE_RANK() OVER (ORDER BY current_mrg_pct DESC NULLS LAST) AS rank_pct,
        DENSE_RANK() OVER (ORDER BY current_mrg_amount DESC NULLS LAST) AS rank_amt,
        DENSE_RANK() OVER (
          PARTITION BY category
          ORDER BY current_mrg_pct DESC NULLS LAST
        ) AS rank_pct_cat
      FROM leaderboard_cache
    )
    UPDATE leaderboard_cache lc
       SET rank_by_pct = ranked.rank_pct,
           rank_by_amount = ranked.rank_amt,
           rank_by_pct_in_category = ranked.rank_pct_cat
      FROM ranked
     WHERE lc.company_id = ranked.company_id;
  `);

  // Category-leader bookkeeping: set categoryLeaderSince for new #1s, clear
  // it when a company is displaced.
  await db.execute(sql`
    UPDATE leaderboard_cache
       SET category_leader_since = NOW()
     WHERE rank_by_pct_in_category = 1
       AND category_leader_since IS NULL;
  `);
  await db.execute(sql`
    UPDATE leaderboard_cache
       SET category_leader_since = NULL
     WHERE (rank_by_pct_in_category IS NULL OR rank_by_pct_in_category <> 1)
       AND category_leader_since IS NOT NULL;
  `);
}
