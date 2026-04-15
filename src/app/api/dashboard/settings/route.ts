import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import { stripHtml } from "@/lib/sanitize";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = rateLimit(`settings:${userId}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
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

  await db
    .update(companies)
    .set({
      name: stripHtml(name.trim()),
      website: website?.trim() || null,
      category: category || null,
      description: description ? stripHtml(description.trim()) : null,
      updatedAt: new Date(),
    })
    .where(eq(companies.clerkUserId, userId));

  return NextResponse.json({ success: true });
}
