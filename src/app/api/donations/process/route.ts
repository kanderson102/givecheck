import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/donations/process
 *
 * Processes a donation through Every.org API.
 *
 * TODO: Implement when Every.org API key is configured.
 * Flow:
 *   1. Verify authenticated user via Clerk
 *   2. Validate donation amount and recipient (Every.org nonprofit ID)
 *   3. Create donation via Every.org API
 *   4. Store donation record in donations table
 *   5. Return confirmation with receipt details
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
    const { nonprofitId, amountCents } = body;

    if (!nonprofitId || !amountCents || amountCents < 100) {
      return NextResponse.json(
        { error: "A valid nonprofit and amount ($1 minimum) are required." },
        { status: 400 }
      );
    }

    // Placeholder — requires EVERY_ORG_API_KEY env var
    return NextResponse.json(
      {
        error: "Every.org integration is not yet configured. Add EVERY_ORG_API_KEY to your environment variables.",
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
