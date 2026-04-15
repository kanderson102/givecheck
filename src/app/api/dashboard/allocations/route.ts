import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies, givingAllocations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

/**
 * GET /api/dashboard/allocations
 * Returns all giving allocations for the authenticated user's company.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(companies)
      .where(eq(companies.clerkUserId, userId))
      .limit(1);
    const company = rows[0];
    if (!company) {
      return NextResponse.json({ allocations: [] });
    }

    const allocations = await db
      .select({
        id: givingAllocations.id,
        recipientName: givingAllocations.recipientName,
        recipientSlug: givingAllocations.recipientSlug,
        recipientType: givingAllocations.recipientType,
        allocationPct: givingAllocations.allocationPct,
      })
      .from(givingAllocations)
      .where(eq(givingAllocations.companyId, company.id));

    return NextResponse.json({ allocations });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch allocations." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dashboard/allocations
 * Save allocations (replaces all existing allocations for the company).
 * Body: { allocations: [{ recipientName, recipientSlug, recipientType, allocationPct }] }
 * Validates: sum = 100, each 1-100, max 20 entries.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(userId, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { allocations } = body;

    if (!Array.isArray(allocations) || allocations.length === 0) {
      return NextResponse.json(
        { error: "At least one allocation is required." },
        { status: 400 }
      );
    }

    if (allocations.length > 20) {
      return NextResponse.json(
        { error: "Maximum 20 allocation entries allowed." },
        { status: 400 }
      );
    }

    // Validate each entry
    for (const a of allocations) {
      if (
        !a.recipientName ||
        !a.recipientSlug ||
        !["nonprofit", "bucket_fund"].includes(a.recipientType)
      ) {
        return NextResponse.json(
          { error: "Each allocation needs a valid name, slug, and type." },
          { status: 400 }
        );
      }
      const pct = Number(a.allocationPct);
      if (!Number.isInteger(pct) || pct < 1 || pct > 100) {
        return NextResponse.json(
          { error: "Each allocation percentage must be an integer between 1 and 100." },
          { status: 400 }
        );
      }
    }

    // Validate sum = 100
    const total = allocations.reduce(
      (sum: number, a: { allocationPct: number }) => sum + Number(a.allocationPct),
      0
    );
    if (total !== 100) {
      return NextResponse.json(
        { error: `Allocations must sum to 100%. Currently: ${total}%.` },
        { status: 400 }
      );
    }

    // Get company
    const rows = await db
      .select()
      .from(companies)
      .where(eq(companies.clerkUserId, userId))
      .limit(1);
    const company = rows[0];
    if (!company) {
      return NextResponse.json(
        { error: "Company not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    // Replace all allocations: delete existing, insert new
    await db
      .delete(givingAllocations)
      .where(eq(givingAllocations.companyId, company.id));

    const now = new Date();
    await db.insert(givingAllocations).values(
      allocations.map(
        (a: {
          recipientName: string;
          recipientSlug: string;
          recipientType: string;
          allocationPct: number;
        }) => ({
          companyId: company.id,
          recipientName: a.recipientName,
          recipientSlug: a.recipientSlug,
          recipientType: a.recipientType,
          allocationPct: Number(a.allocationPct),
          createdAt: now,
          updatedAt: now,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Allocations saved successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save allocations." },
      { status: 500 }
    );
  }
}
