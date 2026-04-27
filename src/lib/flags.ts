/**
 * Feature flags
 *
 * Rules:
 *   - NEXT_PUBLIC_ prefix → readable client + server
 *   - No prefix → server-only (API routes, server components)
 *
 * Setting flags per environment:
 *   local dev   → .env.local
 *   PR preview  → Vercel project settings → Environment variables (Preview)
 *   production  → Vercel project settings → Environment variables (Production)
 *
 * How to use:
 *   import { flags } from "@/lib/flags";
 *   if (flags.realLeaderboardData) { ... } else { ... return MOCK_DATA }
 */

export const flags = {
  /**
   * P0.4 — flip to `true` once the Every.org webhook + cron is running live
   * and you've confirmed at least one real verification round-trip works.
   * Until then, leaderboard / badge / company pages render their mock data.
   */
  realLeaderboardData: process.env.NEXT_PUBLIC_REAL_DATA === "true",
  realBadgeData: process.env.NEXT_PUBLIC_REAL_DATA === "true",
  realCompanyPage: process.env.NEXT_PUBLIC_REAL_DATA === "true",

  /**
   * P0.4 — set to `true` once CRON_SECRET and EVERY_ORG_WEBHOOK_SECRET are
   * in Vercel env and the daily cron has run at least once successfully.
   */
  cronEnabled: process.env.CRON_ENABLED === "true",
} as const;
