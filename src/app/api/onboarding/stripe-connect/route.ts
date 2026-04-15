import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encrypt } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/onboarding/stripe-connect
 *
 * Accepts a Stripe Restricted API Key from the user and validates it has the
 * permissions GiveCheck needs (read access to Balance Transactions).
 *
 * The user creates this key in their own Stripe dashboard:
 *   Developers → API Keys → Restricted keys → Create restricted key
 *   Permission needed: Balance → Read
 *
 * The key is encrypted with AES-256-GCM before storage.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`stripe-connect:${userId}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.clerkUserId, userId))
    .limit(1);

  if (!company) {
    return NextResponse.json(
      { error: "Complete your company profile first." },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { apiKey } = body;

  if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("rk_")) {
    return NextResponse.json(
      { error: "Please provide a valid Stripe restricted key (starts with rk_)." },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(apiKey, { apiVersion: "2026-03-25.dahlia" });

    // Validate by fetching one balance transaction — confirms read access works
    await stripe.balanceTransactions.list({ limit: 1 });

    // Encrypt the key before storing
    const encryptedKey = encrypt(apiKey);

    await db
      .update(companies)
      .set({
        stripeAccountId: encryptedKey,
        status: "verified",
        updatedAt: new Date(),
      })
      .where(eq(companies.id, company.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Stripe.errors.StripeAuthenticationError
        ? "That key is invalid or has been revoked. Please check and try again."
        : err instanceof Stripe.errors.StripePermissionError
        ? "That key doesn't have Balance read access. Please check the permissions."
        : "Could not validate the key. Please try again.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
