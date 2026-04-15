# GiveCheck — Organized Todo List

**Current state:** Landing page, leaderboard, categories, dashboard, login — all UI mockups with mock data. Backend infrastructure scaffolded (DB schema, Clerk middleware, API routes). All content pages built. Mock data stays until post-waitlist when real companies exist.

---

## Priority 1 — Core Infrastructure (Unblocks Everything)

### 1a. Neon DB setup (prod + dev)
- [ ] Provision Neon Postgres for `dev` and `prod`
- [x] Implement schema from `docs/givecheck_product_spec.md` (companies, revenue_snapshots, donations, verification_periods, leaderboard_cache) — `src/db/schema.ts`
- [ ] Add connection via `.env.local` + Vercel env vars
- [x] Set up Drizzle for type-safe queries — `src/db/index.ts`, `drizzle.config.ts`

### 1b. Clerk auth (login flow)
- [x] Install `@clerk/nextjs`, configure middleware — `src/middleware.ts`
- [ ] Replace static login page (`src/app/login/page.tsx`) with Clerk sign-in/sign-up
- [x] Protect dashboard and settings routes — middleware configured
- [ ] Map Clerk user → `companies` table on first login

### 1c. Waitlist API (quick win)
- [x] Create `POST /api/waitlist` endpoint, store emails in DB — `src/app/api/waitlist/route.ts`
- [x] Wire up `src/components/waitlist-form.tsx` to call it

## Priority 2 — Revenue & Donation Pipeline (The Product)

### 2a. Stripe Connect
- [x] OAuth flow scaffolded (`/api/onboarding/stripe-connect`, `/api/onboarding/stripe-callback`)
- [ ] Implement with real Stripe API key (requires `STRIPE_SECRET_KEY`)
- [ ] Store `stripe_account_id` in companies table
- [ ] Revenue sync: pull `balance_transactions` for prior month → `revenue_snapshots`
- [x] Reference the FAQ page (4d) for Stripe API setup documentation that explains the connection to users

### 2b. Every.org API
- [ ] Integrate Every.org API for donation routing (requires `EVERY_ORG_API_KEY`)
- [ ] Build nonprofit search (powers the Nonprofits page in 3c)
- [x] Donation processing endpoint scaffolded (`POST /api/donations/process`) — `src/app/api/donations/process/route.ts`
- [ ] Auto-verify donations against revenue for MRG % calculation

### 2c. Automated monthly verification
- [ ] Cron on 1st of month: Stripe pull → MRG % calc → Every.org verify → update leaderboard_cache
- [ ] Badge enforcement: mark companies "lapsed" if verification fails

## Priority 3 — Key User-Facing Pages

### 3a. Dashboard overhaul
- [ ] Wire to real data post-waitlist (keep mock data during waitlist period)
- [ ] Settings: company profile, logo, website URL
- [ ] Multi-org support (if founder has multiple companies)
- [ ] Donation management: which nonprofits, amounts, schedule
- [ ] Badge embed code (mockup exists — wire to real slug)

### 3b. Public profile page
- [x] New route: `/company/[slug]/page.tsx`
- [x] Shows: company name, giving %, amount, verified months, donation history, badge
- [ ] Link from leaderboard rows (wire up clickable links)

### 3c. Nonprofits page
- [x] New route: `/nonprofits/page.tsx` — built with mock data and search UI
- [ ] Wire search bar to Every.org API (requires `EVERY_ORG_API_KEY`)
- [ ] Category filters (environment, education, health, etc.)
- [ ] "Start donating" CTA → donation flow

### 3d. Embeddable badge page + endpoint
- [x] `/badge` page: explains the badge, shows embed code, previews both variants
- [x] `GET /api/badge` returns badge data structure — `src/app/api/badge/route.ts`
- [ ] `GET /api/badge/script.js`: dynamic JS rendering badge from `data-slug`
- [ ] Badge grays out / "Unverified" if lapsed

### 3e. Bucket funds page
- [x] `/funds` page: curated thematic funds (HtC Commons Fund, Open Source Fund, Climate Fund, Education, Health)
- [ ] Wire donate buttons to actual donation flow

## Priority 4 — Content, Legal & SEO (Pre-Launch)

### 4a. Legal pages (required before launch)
- [x] `/privacy` — Privacy Policy
- [x] `/terms` — Terms & Conditions
- [x] Fix dead footer links — all footer links point to real routes

### 4b. About page
- [x] `/about` — Story, mission, team, high-level how-it-works

### 4c. Contact page
- [x] `/contact` — Contact form UI + info (hello@givecheck.com)
- [ ] Wire form to actually send emails (Resend or similar)

### 4d. FAQ page (robust, like TrustMRR)
- [x] `/faq` — 7 collapsible sections: Getting Started, Verification & Privacy, Stripe Connection, Donations & Every.org, Badges & Leaderboard, Pricing & Billing, Future Features

### 4e. Blog + 20 high-value articles
- [x] `/blog` — Blog infrastructure with category filtering
- [x] **20 articles** all written with full content — `src/lib/blog-data.ts`
- [x] Individual article pages at `/blog/[slug]` with related posts
- [ ] Competitor/alternative articles (#3-6) linked in footer

### 4f. Logo design (required before launch)
- [ ] Replace ShieldCheck icon with proper brand logo
- [ ] Design work (Figma or contractor)

### 4g. Social proof banner → real data
- [ ] Currently fake stats — wire to real DB counts, show waitlist count, or hide until launch

### 4h. SEO & GEO audit (final pre-launch step)
- [ ] Full SEO audit: meta tags, OG images, sitemaps, structured data, page speed
- [ ] GEO audit: international considerations, currency display, regional compliance
- [ ] Run as the final step before launch after all pages are built

## Priority 5 — Pre-Go-Live Audit Fixes

_Identified during the 2026-04-14 business logic + UI audit. All audit issues with code fixes have been applied; these items require new feature work or infrastructure._

### 5a. Verification completion loop
- [ ] Build cron job or webhook that runs at period end (every 30 days per company)
- [ ] Check actual donations (from `donations` table) against pledged MRG %
- [ ] Set `verification_periods.is_verified = true` if donations met the pledge
- [ ] Set company `status = "lapsed"` if verification fails
- [ ] Apply queued `next_mrg_pledge_pct` at period rollover (decrease takes effect)
- [ ] Open a new verification period automatically on rollover

### 5b. Wire leaderboard + company profiles to real DB
- [ ] Leaderboard page: query `companies` + `leaderboard_cache` tables instead of mock data
- [ ] Company profile (`/company/[slug]`): query real company from DB, fall back to 404
- [ ] Individual profile (`/profile/[slug]`): same — wire to real data
- [ ] Leaderboard rank on dashboard: compute from `leaderboard_cache` instead of showing placeholder

### 5c. Generate + set `STRIPE_KEY_ENCRYPTION_KEY` env var
- [ ] Generate key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Add to Vercel env vars (prod + preview) and `.env.local`
- [ ] One-time migration: re-encrypt any existing plaintext `stripe_account_id` values in DB

### 5d. Production rate limiting
- [ ] Replace in-memory rate limiter with Redis-backed solution (e.g. `@upstash/ratelimit`) for multi-instance deployments
- [ ] Tune limits per endpoint based on real traffic patterns

### 5e. Wire real payment processing on confirmation page
- [ ] Integrate Stripe Checkout or Every.org subscription API in `/dashboard/allocations/confirm`
- [ ] Replace placeholder card form with real Stripe Elements or Every.org payment widget
- [ ] Create actual monthly donation subscriptions on "Confirm & Start Giving"
- [ ] Handle payment failures, retries, and cancellations
- [ ] Send email receipts on successful donations

### 5f. Revenue API endpoint
- [x] Create `GET /api/dashboard/revenue` that returns `{ currentMrr }` from latest revenue snapshot
- [x] Used by pledge page and allocation pages for dollar amount calculations
- [x] Gracefully returns `{ currentMrr: 0 }` when no snapshots exist

### 5g. Migrate follows from localStorage to DB
- [ ] Follow button now calls `/api/follows` (DB-backed) instead of localStorage
- [ ] One-time: existing localStorage follows are lost — acceptable since feature was in mock/dev phase
- [ ] Run `drizzle-kit push` or migration to create `follows` and `giving_allocations` tables in prod DB

## Priority 6 — CI/CD, Testing & Staging Environment

### 6a. Testing framework setup
- [ ] Install Vitest for unit/integration tests, Playwright for E2E
- [ ] Configure Vitest with path aliases matching `tsconfig.json`
- [ ] Add test scripts to `package.json`: `test`, `test:unit`, `test:e2e`, `test:ci`

### 6b. Unit tests (critical business logic)
- [ ] Crypto utils: encryption/decryption roundtrip, key rotation, legacy plaintext handling
- [ ] Rate limiter: request counting, window expiry, IP-based limits
- [ ] Pledge logic: increase vs decrease behavior, queued decreases, boundary values
- [ ] Allocation validation: sum=100% enforcement, empty allocations, duplicate recipients
- [ ] Slug generation: uniqueness, special character handling, collision avoidance

### 6c. Integration tests (API routes against real DB)
- [ ] `POST /api/onboarding/company` — create company, idempotent duplicate, missing fields
- [ ] `POST /api/onboarding/stripe-connect` — valid key, invalid key, already-connected
- [ ] `PATCH /api/dashboard/settings` — update profile, unauthorized user, invalid fields
- [ ] `POST /api/dashboard/pledge` — set pledge, increase, decrease (queued), out-of-range
- [ ] `GET/POST /api/dashboard/allocations` — save allocations, sum≠100 rejected, list allocations
- [ ] `GET/POST/DELETE /api/follows` — follow, unfollow, duplicate follow, unauthorized
- [ ] `POST /api/waitlist` — add email, duplicate email, rate limit enforcement

### 6d. E2E tests (Playwright against preview deploy)
- [ ] Onboarding flow: sign up → company creation → Stripe key entry → dashboard redirect
- [ ] Dashboard: pledge setting → allocation setup → confirmation
- [ ] Leaderboard: page loads, search works, company links navigate correctly
- [ ] Public profile: accessible without auth, shows correct company data
- [ ] Badge embed: renders correctly, grays out for lapsed companies

### 6e. Test data & fixtures
- [ ] Seed script: creates 3–5 test companies with revenue snapshots, donations, verification periods
- [ ] Stripe test mode setup: test restricted key with `Balance: Read` permission
- [ ] Clerk test user: use `+` email trick (e.g. `kyle+testco@domain.com`) for isolated test accounts
- [ ] Teardown script: truncates all tables except `waitlist` for clean re-runs
- [ ] Document test credentials in `.env.example` comments (not the actual values)

### 6f. CI pipeline (GitHub Actions)
- [ ] Add lint step: `npx eslint .`
- [ ] Add typecheck step: `npx tsc --noEmit`
- [ ] Add unit/integration test step: `npx vitest run`
- [ ] Add E2E test step: run Playwright against Vercel preview deploy
- [ ] Fail the pipeline if any step fails (block merge)
- [ ] Add `npm audit --audit-level=high` for dependency vulnerability scanning

### 6g. Staging environment
- [ ] Create Neon branch `staging` from `prod` (instant, zero-cost)
- [ ] Set up separate Clerk application or use Clerk test mode for staging
- [ ] Use Stripe test mode keys for staging
- [ ] Vercel preview deploys use staging env vars automatically
- [ ] CI spins up a Neon branch per PR, runs migrations + seeds + tests, tears down on merge/close
- [ ] Document staging access and env var mapping in `docs/environments.md`

## Priority 7 — Security Hardening

### 7a. Environment validation
- [x] Add env validation at app startup (`src/lib/env.ts`) — fails fast with clear error messages
- [x] Add `STRIPE_KEY_ENCRYPTION_KEY` to `.env.example`
- [x] Validate key format (64-char hex string for 32-byte key)

### 7b. Input sanitization & limits
- [x] Max-length checks on all text fields: company name (100), bio (500), website URL (2048)
- [x] Validate URL format for website field (must be valid URL)
- [x] Sanitize HTML/script tags from user-submitted text (company name, bio) — `src/lib/sanitize.ts`
- [x] Validate category against allowed enum values
- [x] Max-length on follows targetSlug (200)

### 7c. Content Security Policy
- [x] Add `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` headers in `next.config.ts`
- [ ] Add full CSP header (script-src, style-src, img-src) — deferred until badge embed is built
- [ ] Critical for embeddable badge: badge script.js must work cross-origin but prevent XSS

### 7d. API security
- [ ] Verify all POST/PATCH/DELETE routes check `Origin`/`Referer` headers (CSRF protection)
- [ ] Add request body size limits to prevent storage abuse
- [ ] Stripe webhook endpoint: verify `stripe-signature` header with `STRIPE_WEBHOOK_SECRET`
- [ ] Rate limit auth endpoints (Clerk handles this, but verify)

### 7e. Dependency & supply chain security
- [ ] Add `npm audit --audit-level=high` to CI pipeline
- [ ] Consider Socket.dev or Snyk for ongoing supply chain monitoring
- [ ] Pin major dependency versions in `package.json` to prevent surprise breaks
- [ ] Review and minimize third-party dependencies with broad permissions

### 7f. Secrets management
- [ ] Audit all env vars are set in Vercel for both prod and preview
- [ ] Ensure `.env.local` is in `.gitignore` (already done)
- [ ] Rotate `STRIPE_KEY_ENCRYPTION_KEY` procedure documented (re-encrypt existing keys)
- [ ] Never log secrets — audit all `console.log`/`console.error` calls for accidental leaks

## Priority 8 — Observability & Fail-Safes

### 8a. Error tracking
- [x] Integrate Sentry (`@sentry/nextjs`) — installed via wizard, source maps enabled, tunnel at `/monitoring`
- [ ] Set up Sentry alerts for error spikes (email or Slack)
- [ ] Tag errors with `companyId`, `endpoint`, `clerkUserId` for debugging

### 8b. Structured logging
- [ ] Replace ad-hoc `console.error` calls with structured logger (Pino or Vercel's built-in)
- [ ] Log format: `{ level, message, endpoint, companyId, action, timestamp }`
- [ ] Log all Stripe API calls (success + failure) for audit trail
- [ ] Log all pledge changes and allocation updates

### 8c. Error boundaries & error pages
- [x] Create `src/app/not-found.tsx` — branded 404 page
- [x] Create `src/app/error.tsx` — branded 500 page with "try again" action and error digest
- [x] Create `src/components/error-boundary.tsx` — reusable error boundary for wrapping dashboard sections
- [x] Create `src/app/dashboard/error.tsx` — dashboard-specific error boundary with recovery UI
- [ ] Add fallback UI for individual component failures (charts, forms)

### 8d. Health checks & uptime monitoring
- [x] Create `GET /api/health` — pings DB, returns `{ status, dbConnected, latencyMs, timestamp }`
- [ ] Set up UptimeRobot or Betterstack for external monitoring (free tier)
- [ ] Alert on downtime via email or Slack

### 8e. Webhook reliability
- [ ] Stripe webhook handler: deduplicate using event ID stored in DB
- [ ] Idempotent processing — re-processing the same event is a no-op
- [ ] Dead letter queue: log failed webhook events for manual retry
- [ ] Monitor webhook delivery in Stripe dashboard

## Priority 9 — Scalability & Performance

### 9a. Caching layer (Upstash Redis)
- [ ] Set up Upstash Redis (serverless, free tier: 10k commands/day)
- [ ] Move rate limiting to Redis (`@upstash/ratelimit`) — works across serverless instances
- [ ] Cache nonprofit search results (5-min TTL, already partially implemented)
- [ ] Cache leaderboard data (refresh on verification cron, not per-request)

### 9b. Edge caching & ISR
- [ ] Leaderboard page: use ISR with 1-hour revalidation (data changes at most daily)
- [ ] Company profiles: ISR with 1-hour revalidation
- [ ] Badge endpoint: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- [ ] Badge `script.js`: aggressive edge caching — one viral badge shouldn't spike compute

### 9c. Database performance
- [ ] Neon HTTP adapter handles connection pooling (already in use) — no action needed unless switching to WebSocket
- [ ] Add indexes for common queries: `companies.clerk_user_id`, `companies.status`, `donations.company_id + period_start`
- [ ] Monitor slow queries via Neon dashboard
- [ ] Consider read replicas if leaderboard queries become expensive (unlikely at launch scale)

### 9d. Database migration safety
- [ ] Always use `drizzle-kit generate` → review SQL → `drizzle-kit migrate` (never `push` in prod)
- [ ] Use **expand-and-contract** pattern for breaking changes: add new column → backfill → remove old column in separate deploy
- [ ] Test every migration on a Neon branch before running against prod
- [ ] Keep migration files in `drizzle/` tracked in git — they are your schema history
- [ ] Document rollback procedures for each migration

---

## Deferred — Marketing Launch Plan
_See `docs/marketing_launch_plan.md` for details._

---

## Suggested Build Sequence

| Phase | Items | ~Time |
|-------|-------|-------|
| **Now** | Provision Neon, run migrations, set env vars, clear test data | 2-3 hrs |
| **Week 1** | 1b (Clerk login), onboarding E2E test, Stripe test mode setup | 2-3 days |
| **Week 2** | 2a (Stripe revenue sync), 5a (verification cron), 5b (wire real data) | 4-5 days |
| **Week 3** | 6a-6f (CI/CD pipeline + test suite), 8a (Sentry), 7a (env validation) | 3-4 days |
| **Week 4** | 2b (Every.org), 5e (payment processing), 7b-7d (security hardening) | 4-5 days |
| **Pre-launch** | 6d (E2E test pass), 4h (SEO audit), 4f (logo), DNS/domain | 2-3 days |
| **Post-launch** | 9a-9b (Redis caching, ISR), marketing launch plan items | Ongoing |

## Onboarding Testing Guide

**Stripe test mode setup:**
1. Toggle to **Test Mode** in Stripe dashboard
2. Create a test restricted key with `Balance: Read` permission
3. For OAuth flow, test mode uses the same `STRIPE_CONNECT_CLIENT_ID` — no real charges
4. Generate test balance data: `stripe trigger balance.available` (Stripe CLI)

**Test user flow:**
1. Create Clerk test user via `+` email trick: `kyle+testcompany@yourdomain.com`
2. Sign in as that user → go through onboarding with test restricted key
3. Verify company appears in DB with encrypted `stripe_account_id`

**Clean reset between test runs:**
```sql
TRUNCATE companies, revenue_snapshots, donations, verification_periods,
         leaderboard_cache, follows, giving_allocations CASCADE;
```

## Key Files to Create/Modify

**New API routes:**
- `src/app/api/waitlist/route.ts` ✅
- `src/app/api/onboarding/stripe-connect/route.ts` ✅ (scaffolded)
- `src/app/api/onboarding/stripe-callback/route.ts` ✅ (scaffolded)
- `src/app/api/badge/script.js/route.ts`
- `src/app/api/donations/process/route.ts` ✅ (scaffolded)
- `src/app/api/health/route.ts` — health check endpoint
- `src/app/api/dashboard/revenue/route.ts` — revenue data endpoint

**New pages:**
- `src/app/company/[slug]/page.tsx` ✅
- `src/app/nonprofits/page.tsx` ✅
- `src/app/badge/page.tsx` ✅
- `src/app/funds/page.tsx` ✅
- `src/app/faq/page.tsx` ✅
- `src/app/blog/page.tsx` + 20 article pages ✅
- `src/app/privacy/page.tsx` ✅
- `src/app/terms/page.tsx` ✅
- `src/app/about/page.tsx` ✅
- `src/app/contact/page.tsx` ✅
- `src/app/not-found.tsx` — branded 404 page
- `src/app/error.tsx` — branded 500 page

**Modify:**
- `src/app/login/page.tsx` — rewrite with Clerk
- `src/app/dashboard/page.tsx` — wire to real data (post-waitlist)
- `src/components/waitlist-form.tsx` ✅ — wired to API
- `src/components/footer.tsx` ✅ — all links point to real routes
- `.github/workflows/vercel-deploy.yml` — add lint, typecheck, test steps

**New infrastructure:**
- `src/db/schema.ts` ✅
- `src/db/index.ts` ✅
- `drizzle.config.ts` ✅
- `.env.example` ✅
- `src/middleware.ts` ✅
- `src/lib/blog-data.ts` ✅
- `src/lib/env.ts` — Zod env validation
- `vitest.config.ts` — test configuration
- `playwright.config.ts` — E2E test configuration
- `src/db/seed.ts` — test data seeding script
- `src/db/teardown.ts` — test data cleanup script
- `docs/environments.md` — staging/prod env documentation

**New docs:**
- `docs/marketing_launch_plan.md`
- `docs/devops-guide.md` ✅ — full devops workflow, branching, CI/CD, cost breakdown
- `docs/environments.md` — staging vs prod setup guide
- `docs/migration-safety.md` — DB migration procedures and rollback guide

---

## CI Pipeline Timing & Path-Based Filtering

The CI pipeline uses **path-based filtering** so small changes don't trigger the full suite:

| Change Type | Files | What Runs | Duration |
|-------------|-------|-----------|----------|
| Content (blog, docs, copy) | `blog-data.ts`, `docs/**`, `*.md` | Lint + typecheck + deploy preview | ~2 min |
| UI/components | `src/components/**`, `page.tsx`, CSS | Lint + typecheck + unit tests + E2E | ~4-5 min |
| API/DB/infra | `src/app/api/**`, `src/db/**`, `src/lib/**` | Full suite (lint + typecheck + unit + integration + E2E) | ~5-6 min |

## Infrastructure Cost Estimate

**At launch: $0/mo** — all services fit in free tiers.

**First upgrade (~$19/mo):** Neon Launch plan for staging branches and >0.5 GB storage.

| Service | Free Tier | Upgrade Trigger | Paid |
|---------|-----------|-----------------|------|
| Neon | 0.5 GB, 1 branch | Staging branches | $19/mo |
| Clerk | 10k MAU | >10k users | $25/mo |
| Vercel | 100 GB BW, 6k build mins | Team features | $20/mo |
| GitHub Actions | 2000 CI mins/mo | Unlikely to exceed | Free |
| Upstash Redis | 10k cmds/day | High traffic | $2/mo |
| Sentry | 5k errors/mo | High error volume | $26/mo |
| UptimeRobot | 50 monitors, 5-min checks | 1-min checks | $7/mo |

**Moderate traffic estimate: ~$50-70/mo.** See `docs/devops-guide.md` for full details.
