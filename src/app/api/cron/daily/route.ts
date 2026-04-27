import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies, verificationPeriods } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";
import {
  verifyOpenPeriod,
  checkMrrDrift,
  updateLeaderboardCache,
} from "@/lib/verification";

/**
 * GET /api/cron/daily
 *
 * Runs at 16:00 UTC every day via Vercel Cron.
 * Vercel cron schedules are UTC-only, so this is noon ET during daylight time
 * and 11:00 ET during standard time.
 * See vercel.json for the schedule. Secured by `Authorization: Bearer $CRON_SECRET`.
 *
 * Two phases:
 *   1. For every period where `periodEnd < today AND is_verified = false`:
 *      - Inside grace (ends within last 7 days) → try `verifyOpenPeriod` again
 *      - Past grace → lapse
 *      - On verify success → also run `checkMrrDrift` and open next period
 *        (handled inside `verifyOpenPeriod`)
 *   2. Refresh leaderboard cache for everyone via `updateLeaderboardCache()`
 *
 * Per-company try/catch — one failure shouldn't block others.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const summary = {
    verified: 0,
    stillInGrace: 0,
    lapsed: 0,
    skipped: 0,
    errors: 0,
    companiesChecked: 0,
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // Phase 1 — due periods
  const duePeriods = await db
    .select({
      id: verificationPeriods.id,
      companyId: verificationPeriods.companyId,
      periodStart: verificationPeriods.periodStart,
      periodEnd: verificationPeriods.periodEnd,
      pledgedCents: verificationPeriods.pledgedCents,
    })
    .from(verificationPeriods)
    .where(
      and(
        eq(verificationPeriods.isVerified, false),
        lt(verificationPeriods.periodEnd, todayStr)
      )
    );

  for (const period of duePeriods) {
    summary.companiesChecked += 1;
    try {
      const result = await verifyOpenPeriod(period.companyId, period);
      if (result.outcome === "verified") {
        summary.verified += 1;
        // Drift check fires on period close only
        try {
          await checkMrrDrift(period.companyId);
        } catch (err) {
          console.error(`cron: checkMrrDrift(${period.companyId}) failed`, err);
        }
      } else if (result.outcome === "still_short_in_grace") {
        summary.stillInGrace += 1;
      } else if (result.outcome === "lapsed") {
        summary.lapsed += 1;
      } else {
        summary.skipped += 1;
      }
    } catch (err) {
      summary.errors += 1;
      console.error(`cron: verifyOpenPeriod(${period.companyId}, ${period.id}) failed`, err);
    }
  }

  // Phase 2 — leaderboard refresh
  let leaderboardError: string | null = null;
  try {
    await updateLeaderboardCache();
  } catch (err) {
    leaderboardError = err instanceof Error ? err.message : String(err);
    console.error("cron: updateLeaderboardCache failed", err);
  }

  // Defensive: companies with status="lapsed" but a successful recent period
  // should flip back to "verified" (covers re-subscribe flows)
  try {
    const lapsed = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.status, "lapsed"));
    for (const c of lapsed) {
      const [latest] = await db
        .select({ isVerified: verificationPeriods.isVerified })
        .from(verificationPeriods)
        .where(eq(verificationPeriods.companyId, c.id))
        .orderBy(verificationPeriods.periodEnd)
        .limit(1);
      if (latest?.isVerified) {
        await db
          .update(companies)
          .set({ status: "verified", updatedAt: new Date() })
          .where(eq(companies.id, c.id));
      }
    }
  } catch (err) {
    console.error("cron: lapsed-company recovery failed", err);
  }

  return NextResponse.json({
    ok: true,
    durationMs: Date.now() - startedAt,
    summary,
    leaderboardError,
  });
}
