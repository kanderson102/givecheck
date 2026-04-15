import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { follows } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

/**
 * GET /api/follows
 * Returns all follows for the authenticated user.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db
      .select({
        id: follows.id,
        targetSlug: follows.targetSlug,
        targetType: follows.targetType,
        createdAt: follows.createdAt,
      })
      .from(follows)
      .where(eq(follows.clerkUserId, userId));

    return NextResponse.json({ follows: rows });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch follows." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/follows
 * Add a follow (upsert — idempotent).
 * Body: { targetSlug: string, targetType: "company" | "person" | "nonprofit" }
 */
export async function POST(req: NextRequest) {
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

  try {
    const body = await req.json();
    const { targetSlug, targetType } = body;

    if (
      !targetSlug ||
      typeof targetSlug !== "string" ||
      targetSlug.length > 200 ||
      !["company", "person", "nonprofit"].includes(targetType)
    ) {
      return NextResponse.json(
        { error: "Valid targetSlug and targetType are required." },
        { status: 400 }
      );
    }

    // Check if already following (upsert)
    const existing = await db
      .select({ id: follows.id })
      .from(follows)
      .where(
        and(
          eq(follows.clerkUserId, userId),
          eq(follows.targetSlug, targetSlug),
          eq(follows.targetType, targetType)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ success: true, action: "already_following" });
    }

    await db.insert(follows).values({
      clerkUserId: userId,
      targetSlug,
      targetType,
    });

    return NextResponse.json({ success: true, action: "followed" });
  } catch {
    return NextResponse.json(
      { error: "Failed to follow." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/follows
 * Remove a follow.
 * Body: { targetSlug: string, targetType: "company" | "person" | "nonprofit" }
 */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { targetSlug, targetType } = body;

    if (!targetSlug || !targetType) {
      return NextResponse.json(
        { error: "targetSlug and targetType are required." },
        { status: 400 }
      );
    }

    await db
      .delete(follows)
      .where(
        and(
          eq(follows.clerkUserId, userId),
          eq(follows.targetSlug, targetSlug),
          eq(follows.targetType, targetType)
        )
      );

    return NextResponse.json({ success: true, action: "unfollowed" });
  } catch {
    return NextResponse.json(
      { error: "Failed to unfollow." },
      { status: 500 }
    );
  }
}
