import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import { stripHtml } from "@/lib/sanitize";
import { randomBytes } from "crypto";

function toSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  // If the name was all special chars / emoji, generate a random slug
  if (!slug) {
    return `company-${randomBytes(4).toString("hex")}`;
  }
  return slug;
}

/**
 * POST /api/onboarding/company
 * Creates a company record for the authenticated Clerk user.
 * Called during the onboarding flow after sign-up.
 *
 * Idempotent: if the user already has a company, returns it instead of 409.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`company-create:${userId}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  // Check if user already has a company — return it (idempotent)
  const existing = await db
    .select()
    .from(companies)
    .where(eq(companies.clerkUserId, userId))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ company: existing[0] });
  }

  const body = await req.json();
  const { name, website, category, description } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "Company name must be 100 characters or fewer." }, { status: 400 });
  }

  if (description && typeof description === "string" && description.length > 500) {
    return NextResponse.json({ error: "Bio must be 500 characters or fewer." }, { status: 400 });
  }

  if (website && typeof website === "string") {
    if (website.trim().length > 2048) {
      return NextResponse.json({ error: "Website URL is too long." }, { status: 400 });
    }
    try {
      new URL(website.trim().startsWith("http") ? website.trim() : `https://${website.trim()}`);
    } catch {
      return NextResponse.json({ error: "Please enter a valid website URL." }, { status: 400 });
    }
  }

  const allowedCategories = [
    "saas", "ecommerce", "agency", "consulting", "marketplace",
    "fintech", "healthtech", "edtech", "devtools", "ai-ml",
    "creator-economy", "nonprofit", "other",
  ];
  if (category && !allowedCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  const clerkUser = await currentUser();
  const ownerEmail = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";

  // Generate slug with collision retry (up to 3 attempts)
  let slug = toSlug(name.trim());
  for (let attempt = 0; attempt < 3; attempt++) {
    const slugCheck = await db
      .select({ slug: companies.slug })
      .from(companies)
      .where(eq(companies.slug, slug))
      .limit(1);

    if (slugCheck.length === 0) break;

    // Append random suffix on collision
    slug = `${toSlug(name.trim()).slice(0, 50)}-${randomBytes(3).toString("hex")}`;
  }

  const [company] = await db
    .insert(companies)
    .values({
      name: stripHtml(name.trim()),
      slug,
      website: website?.trim() || null,
      category: category || null,
      description: description ? stripHtml(description.trim()) : null,
      clerkUserId: userId,
      ownerEmail,
      status: "pending",
    })
    .returning();

  return NextResponse.json({ company });
}

/**
 * GET /api/onboarding/company
 * Returns the company record for the authenticated user (if any).
 * Used by the dashboard to check onboarding status.
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.clerkUserId, userId))
    .limit(1);

  return NextResponse.json({ company: company ?? null });
}
