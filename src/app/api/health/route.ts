import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

/**
 * GET /api/health
 *
 * Health check endpoint for uptime monitoring (UptimeRobot, Betterstack, etc.).
 * Returns 200 if the app and database are reachable, 503 otherwise.
 */
export async function GET() {
  const start = Date.now();
  let dbConnected = false;
  let dbLatencyMs: number | null = null;

  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - dbStart;
    dbConnected = true;
  } catch {
    // DB unreachable — report but don't crash
  }

  const status = dbConnected ? "healthy" : "degraded";
  const httpStatus = dbConnected ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: {
        connected: dbConnected,
        latencyMs: dbLatencyMs,
      },
      responseMs: Date.now() - start,
    },
    { status: httpStatus }
  );
}
