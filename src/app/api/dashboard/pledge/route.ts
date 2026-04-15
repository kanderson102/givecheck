import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies, verificationPeriods } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

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

  const body = await req.json();
  const { pledgePct } = body;

  if (typeof pledgePct !== "number" || pledgePct < 0.1 || pledgePct > 100) {
    return NextResponse.json(
      { error: "Pledge percentage must be between 0.1 and 100." },
      { status: 400 }
    );
  }

  const rows = await db
    .select()
    .from(companies)
    .where(eq(companies.clerkUserId, userId))
    .limit(1);

  const company = rows[0];
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  const currentPct = company.mrgPledgePct ? Number(company.mrgPledgePct) : null;
  const isDecrease = currentPct !== null && pledgePct < currentPct;
  const isIncrease = currentPct !== null && pledgePct > currentPct;

  // Check for an active open period
  const now = new Date();
  const nowStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

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

  if (isDecrease && hasOpenPeriod) {
    // Queue the decrease for next period — don't reset anchor
    await db
      .update(companies)
      .set({
        nextMrgPledgePct: String(pledgePct),
        updatedAt: now,
      })
      .where(eq(companies.clerkUserId, userId));

    const periodEnd = new Date(openPeriods[0].periodEnd + "T00:00:00Z");

    return NextResponse.json({
      success: true,
      queued: true,
      message: `Your giving % will decrease to ${pledgePct}% at the start of your next period.`,
      nextVerification: periodEnd.toISOString(),
    });
  }

  if (isIncrease && hasOpenPeriod) {
    // Increase takes effect immediately but does NOT reset the period anchor.
    // Update the pledge % and the existing open period's target, keep the same window.
    await db
      .update(companies)
      .set({
        mrgPledgePct: String(pledgePct),
        nextMrgPledgePct: null,
        updatedAt: now,
      })
      .where(eq(companies.clerkUserId, userId));

    await db
      .update(verificationPeriods)
      .set({ givingPercentage: String(pledgePct) })
      .where(eq(verificationPeriods.id, openPeriods[0].id));

    const periodEnd = new Date(openPeriods[0].periodEnd + "T00:00:00Z");

    return NextResponse.json({
      success: true,
      queued: false,
      message: `Pledge increased to ${pledgePct}%. Your current period deadline is unchanged.`,
      nextVerification: periodEnd.toISOString(),
    });
  }

  // No open period — set / change pledge and open a new verification period
  const periodStart = now;
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const periodStartStr = periodStart.toISOString().slice(0, 10);
  const periodEndStr = periodEnd.toISOString().slice(0, 10);

  await db
    .update(companies)
    .set({
      mrgPledgePct: String(pledgePct),
      nextMrgPledgePct: null,
      periodAnchor: periodStart,
      updatedAt: now,
    })
    .where(eq(companies.clerkUserId, userId));

  await db.insert(verificationPeriods).values({
    companyId: company.id,
    periodStart: periodStartStr,
    periodEnd: periodEndStr,
    givingPercentage: String(pledgePct),
    isVerified: false,
  });

  return NextResponse.json({
    success: true,
    queued: false,
    nextVerification: periodEnd.toISOString(),
  });
}
