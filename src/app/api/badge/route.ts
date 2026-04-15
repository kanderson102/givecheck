import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/badge?slug=company-slug
 *
 * Returns badge data for a company, consumed by the embeddable JS widget.
 *
 * TODO: Wire to real database when companies exist.
 * Response shape:
 *   {
 *     company: string,
 *     slug: string,
 *     givingPct: number,
 *     is10PctClub: boolean,
 *     status: "verified" | "lapsed" | "unverified",
 *     category: string,
 *     categoryRank: number
 *   }
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "slug parameter is required" },
      { status: 400 }
    );
  }

  // Placeholder — return mock data structure for now
  // In production, query leaderboard_cache + companies tables
  return NextResponse.json({
    company: "Example Company",
    slug,
    givingPct: 0,
    is10PctClub: false,
    status: "unverified",
    category: null,
    categoryRank: null,
    message: "Badge API is ready. Connect a database to serve real data.",
  });
}
