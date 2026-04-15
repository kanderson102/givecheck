import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { nonprofitDetails } from "@/lib/mock-data";

/**
 * GET /api/nonprofits/search?q=education&cause=education&take=20
 *
 * Proxies Every.org's search API server-side.
 * Falls back to searching local mock data when EVERY_ORG_API_KEY is not set.
 */

interface NormalizedNonprofit {
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  impactAreas: string[];
  everyOrgUrl: string;
}

// In-memory cache with 5-minute TTL
const cache = new Map<string, { data: NormalizedNonprofit[]; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const VALID_CAUSES = [
  "education",
  "environment",
  "health",
  "animals",
  "arts-culture",
  "human-services",
  "international",
  "religion",
  "science",
  "poverty",
  "civil-rights",
  "community-development",
  "youth-development",
  "housing",
  "veterans",
  "disaster-relief",
  "mental-health",
] as const;

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(userId, 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const cause = searchParams.get("cause") ?? "";
  const take = Math.min(Number(searchParams.get("take") ?? 20), 50);

  const apiKey = process.env.EVERY_ORG_API_KEY;

  // Use Every.org API if key is configured
  if (apiKey && query.trim()) {
    const cacheKey = `${query}|${cause}|${take}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ nonprofits: cached.data, source: "every_org_cached" });
    }

    try {
      const params = new URLSearchParams({
        apiKey,
        take: String(take),
      });
      if (cause && VALID_CAUSES.includes(cause as (typeof VALID_CAUSES)[number])) {
        params.set("causes", cause);
      }

      const res = await fetch(
        `https://partners.every.org/v0.2/search/${encodeURIComponent(query)}?${params.toString()}`,
        { signal: AbortSignal.timeout(8000) }
      );

      if (res.ok) {
        const data = await res.json();
        const nonprofits: NormalizedNonprofit[] = (
          data.nonprofits ?? []
        ).map(
          (np: {
            name?: string;
            slug?: string;
            description?: string;
            logoUrl?: string;
            nteeCodeMeaning?: { majorMeaning?: string };
            profileUrl?: string;
          }) => ({
            name: np.name ?? "",
            slug: np.slug ?? "",
            description: np.description ?? "",
            logoUrl: np.logoUrl ?? null,
            impactAreas: np.nteeCodeMeaning?.majorMeaning
              ? [np.nteeCodeMeaning.majorMeaning]
              : [],
            everyOrgUrl: np.profileUrl ?? `https://www.every.org/${np.slug ?? ""}`,
          })
        );

        cache.set(cacheKey, { data: nonprofits, expiresAt: Date.now() + CACHE_TTL });
        return NextResponse.json({ nonprofits, source: "every_org" });
      }
    } catch {
      // Fall through to local search on API error
    }
  }

  // Fallback: search local mock data
  const q = query.toLowerCase();
  let results = nonprofitDetails;

  if (q) {
    results = results.filter(
      (np) =>
        np.name.toLowerCase().includes(q) ||
        np.description.toLowerCase().includes(q) ||
        np.impactAreas.some((area) => area.toLowerCase().includes(q))
    );
  }

  if (cause) {
    results = results.filter((np) =>
      np.impactAreas.some((area) => area.toLowerCase().includes(cause.toLowerCase()))
    );
  }

  const nonprofits: NormalizedNonprofit[] = results.slice(0, take).map((np) => ({
    name: np.name,
    slug: np.slug,
    description: np.description,
    logoUrl: null,
    impactAreas: np.impactAreas,
    everyOrgUrl: np.donateUrl,
  }));

  return NextResponse.json({ nonprofits, source: "local" });
}
