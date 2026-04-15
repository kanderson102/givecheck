import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, revenueSnapshots } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * GET /api/dashboard/revenue
 *
 * Returns the most recent revenue snapshot for the authenticated user's company.
 * Used by the pledge page and allocation pages to show dollar amounts.
 *
 * Returns { currentMrr: 0 } if no snapshots exist yet (graceful default).
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.clerkUserId, userId))
      .limit(1);

    if (!company) {
      return NextResponse.json({ currentMrr: 0 });
    }

    const [latestSnapshot] = await db
      .select({
        grossRevenueCents: revenueSnapshots.grossRevenueCents,
        netRevenueCents: revenueSnapshots.netRevenueCents,
        periodStart: revenueSnapshots.periodStart,
        periodEnd: revenueSnapshots.periodEnd,
        verified: revenueSnapshots.verified,
      })
      .from(revenueSnapshots)
      .where(eq(revenueSnapshots.companyId, company.id))
      .orderBy(desc(revenueSnapshots.periodEnd))
      .limit(1);

    if (!latestSnapshot) {
      return NextResponse.json({ currentMrr: 0 });
    }

    // Use net revenue if available, otherwise gross
    const revenueCents =
      latestSnapshot.netRevenueCents ?? latestSnapshot.grossRevenueCents;

    return NextResponse.json({
      currentMrr: revenueCents,
      periodStart: latestSnapshot.periodStart,
      periodEnd: latestSnapshot.periodEnd,
      verified: latestSnapshot.verified,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch revenue data." },
      { status: 500 }
    );
  }
}
