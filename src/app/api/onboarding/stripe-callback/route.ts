import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

/**
 * GET /api/onboarding/stripe-callback
 *
 * Handles Stripe's OAuth redirect after the user authorizes GiveCheck.
 *
 * Flow:
 *   1. Verify state param matches cookie (CSRF protection)
 *   2. Exchange `code` for stripe_user_id via Stripe token endpoint
 *   3. Store stripe_user_id (acct_xxx) as the company's stripeAccountId
 *   4. Redirect to dashboard
 */
export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/login", appUrl));
  }

  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // User denied authorization
  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard?stripe=denied`, appUrl)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard?stripe=error&reason=missing_params", appUrl)
    );
  }

  // Verify CSRF state
  const cookieStore = await cookies();
  const savedState = cookieStore.get("stripe_oauth_state")?.value;
  cookieStore.delete("stripe_oauth_state");

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/dashboard?stripe=error&reason=invalid_state", appUrl)
    );
  }

  try {
    // Exchange code for stripe_user_id
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const stripeAccountId = response.stripe_user_id;
    if (!stripeAccountId) {
      throw new Error("No stripe_user_id in response");
    }

    // Store the connected account ID
    await db
      .update(companies)
      .set({
        stripeAccountId,
        status: "verified",
        updatedAt: new Date(),
      })
      .where(eq(companies.clerkUserId, userId));

    return NextResponse.redirect(
      new URL("/dashboard?stripe=connected", appUrl)
    );
  } catch (err) {
    console.error("Stripe OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/dashboard?stripe=error&reason=token_exchange_failed", appUrl)
    );
  }
}
