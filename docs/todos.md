# GiveCheck — Todo List (MVP → Launch)

**Goal:** Ship a robust MVP. Testing + staging environment come **last**, right before go-live.

**Current state:** Foundation shipped — Clerk auth, Neon DB with schema, Stripe Connect, Every.org search, all pages and API routes, Sentry, security headers, error pages, env validation, input sanitization, rate limiting.

**Completed work:** See [`docs/done.md`](./done.md).

---

## P0 — Ship the Product (Core Revenue + Donation Pipeline)

These are the features that make GiveCheck actually work. Without these, there's no product — just a landing page.

### P0.1 — Stripe revenue sync ✅
- [x] Implement `src/lib/stripe-revenue.ts` — fetch `balance_transactions` for last 30 days using company's decrypted restricted key
- [x] Write rolling 30-day MRR to `revenue_snapshots` table (`persistRevenueSnapshot`)
- [x] Handle pagination (Stripe returns 100 max per page)
- [x] Cache latest snapshot per company (6-hour TTL via `getLatestFreshSnapshot`, 5-min Stripe API memo)
- [x] Wire dashboard + `/api/dashboard/revenue` to pull real data
- [x] Normalize unit convention: API returns `currentMrrCents` (integer cents); all callers divide by 100 for dollar display

### P0.2 — Every.org donation execution ✅
- [x] Implement `POST /api/donations/process` — generates pre-filled Every.org URLs (one per allocation), computes dollar share from fixed-dollar monthly pledge
- [x] Returns intents with `amountCents`, `amountDollars`, `donationUrl`, `supportedForDirectDonation` flag
- [x] Bucket funds flagged `supportedForDirectDonation: false` until admin flow is built
- [x] Pass `partnerDonorId={companyId}` through Every.org URLs for webhook reconciliation
- [x] Wire Every.org Partner Webhooks to populate `donations` table with `every_org_id`, `amount_cents`, etc.

### P0.3 — Wire payment processing on confirm page ✅
- [x] Replaced disabled card form with per-allocation "Set up donation" buttons (opens Every.org in new tab)
- [x] Tracks which links have been clicked; shows "All donation links opened" state when done
- [x] Removed misleading "Payment processing coming soon" banner
- [x] Bucket fund allocations show "Processed internally" pill with explanation

### P0.4 — Verification loop backend core ✅
- [x] Fixed-dollar pledge model: store `pledgedMonthlyCents`, enforce $10 minimum, enforce whole dollars
- [x] Lock `verification_periods.pledged_cents` at period start
- [x] Track `mrrAtPledgeCents` and `mrrDriftFlag` for later dashboard drift messaging
- [x] **Every.org Partner Webhook endpoint** — `POST /api/every-org/webhook` (docs: https://docs.every.org/docs/webhooks/partner-webhook)
  - Verify webhook signature
  - On `donation.created` / `donation.succeeded`: upsert row into `donations` table with `every_org_id`, `amount_cents`, `recipient_name`, period info
  - Match incoming donation to a company by `partnerDonorId`
  - Idempotent on `every_org_id` to handle webhook retries
  - Handle `donation.refunded` and `subscription.cancelled`
- [x] Daily Vercel Cron at noon ET: verify due periods and update `leaderboard_cache`
- [x] Check donations vs locked `pledged_cents` for each due `verification_period`
- [x] Set `verification_periods.is_verified = true` when met and open the next period
- [x] Apply queued `next_pledged_monthly_cents` at period rollover
- [x] Set company `status = "lapsed"` if verification fails after grace period

### P0.4 — Verification rollout / QA
- [ ] Confirm exact Every.org production webhook event names and signature header with real payloads
- [ ] Set `EVERY_ORG_WEBHOOK_SECRET`, `CRON_SECRET`, and `CRON_ENABLED=true` in Vercel
- [ ] Run manual webhook idempotency test from `docs/stories/p0.4-verification-loop.md`
- [ ] Run manual cron verification/lapse test against a seeded verification period
- [ ] Decide whether to alias `donation.confirmed` to the existing `donation.created` / `donation.succeeded` handler after seeing production payloads

### P0.5 — Wire leaderboard + profiles to real DB
- [ ] Leaderboard page: query `companies` + `leaderboard_cache` instead of mock data
- [ ] `/company/[slug]`: query real company from DB, 404 fallback
- [ ] `/profile/[slug]`: same
- [ ] Dashboard leaderboard rank: compute from `leaderboard_cache`

### P0.6 — Badge endpoint (live)
- [ ] `GET /api/badge?slug=...` — query real DB (currently returns mock)
- [ ] `GET /api/badge/script.js` — dynamic JS widget rendering badge from `data-slug`
- [ ] Badge grays out / shows "Unverified" if `status = "lapsed"`
- [ ] `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` on both endpoints

---

## P1 — Polish & Required-for-Launch

### P1.1 — Contact form backend
- [ ] Add `/api/contact` endpoint
- [ ] Integrate Resend (or similar) to send emails to `hello@givecheck.com`
- [ ] Wire `src/app/contact/page.tsx` to real API (currently simulated `setTimeout`)
- [ ] Rate limit (5/60s per IP)

### P1.2 — Nonprofit search UX (currently disabled UI)
- [ ] Enable the search input in `src/app/nonprofits/page.tsx` (currently shows "Coming Soon")
- [ ] Wire to existing `/api/nonprofits/search` endpoint (API is already live)
- [ ] Enable category filter pills
- [ ] Wire "Start donating" CTA → donation flow

### P1.3 — Logo design
- [ ] Replace `ShieldCheck` icon with proper brand logo (22 files reference it)
- [ ] Create logo in SVG (ideally as a shared component at `src/components/logo.tsx`)
- [ ] Update favicon, OG images

### P1.4 — Social proof banner
- [ ] Landing page currently shows "Join 200+ founders on the waitlist" (static)
- [ ] Either wire to real waitlist count or show "Be first to join" until we have real numbers
- [ ] Same for any other fake stats on homepage

### P1.5 — Dashboard enhancements
- [ ] Wire dashboard stats to real DB data (currently uses `mock-data.ts`)
- [ ] Logo upload in settings (schema has `logoUrl` field — needs upload endpoint + Vercel Blob or S3)
- [ ] Donation management UI (edit allocations, see donation history)
- [ ] Multi-org support (if founder has multiple companies) — deferred, rare for MVP

### P1.6 — SEO & meta
- [ ] Per-page meta descriptions and titles (currently only root has them)
- [ ] Open Graph images for social sharing
- [ ] `sitemap.xml` generator
- [ ] `robots.txt`
- [ ] JSON-LD structured data on company profiles
- [ ] Canonical URLs

---

## P2 — Production-Readiness Hardening

### P2.1 — Email infrastructure
- [ ] Set up Resend account
- [ ] `RESEND_API_KEY` env var
- [ ] Transactional email templates:
  - Contact form → team notification
  - Donation receipts
  - Verification success/failure
  - Pledge change confirmations

### P2.2 — Stripe webhooks
- [ ] `POST /api/stripe/webhook` — verify `stripe-signature` header with `STRIPE_WEBHOOK_SECRET`
- [ ] Store processed event IDs in DB (webhook idempotency)
- [ ] Handle: account updates, payment failures, subscription lifecycle
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Vercel

### P2.3 — Uptime monitoring
- [ ] Create UptimeRobot account (free)
- [ ] Monitor `https://givecheck.org/api/health`
- [ ] Alert email on downtime (5-min check interval)

### P2.4 — Sentry tuning
- [ ] Set up Sentry alerts for error spikes (email or Slack)
- [ ] Tag errors with `companyId`, `endpoint`, `clerkUserId` for debugging
- [ ] Lower `tracesSampleRate` from 1.0 to 0.1 in production (currently sampling 100%, will burn through free tier)

### P2.5 — Structured logging
- [ ] Replace ad-hoc `console.error` with a logger (keep it simple — Vercel's built-in is fine)
- [ ] Log format: `{ level, message, endpoint, companyId, action, timestamp }`
- [ ] Log all Stripe API calls + all pledge/allocation changes for audit trail

### P2.6 — Additional security
- [ ] CSRF verification on POST/PATCH/DELETE routes (check `Origin`/`Referer` headers)
- [ ] Request body size limits to prevent storage abuse
- [ ] Full CSP header in `next.config.ts` once badge embed is built (deferred — needs careful setup for cross-origin badge)
- [ ] Audit all `console.log`/`console.error` for accidental secret leaks

### P2.7 — Dependency security
- [ ] Run `npm audit --audit-level=high` — fix any findings
- [ ] Consider Socket.dev or Snyk for ongoing supply chain monitoring (optional for MVP)

### P2.8 — NEXT_PUBLIC_APP_URL
- [ ] Set to production domain in Vercel once DNS is configured

### P2.9 — DNS / domain
- [ ] Point `givecheck.org` (or chosen domain) to Vercel
- [ ] Verify SSL cert provisioned
- [ ] Set up apex + www redirects

---

## P3 — Scalability (Post-Launch, or When Traffic Demands)

Not needed for MVP launch. Add as traffic grows.

### P3.1 — Redis caching (Upstash)
- [ ] Set up Upstash Redis (free tier)
- [ ] Move rate limiter to `@upstash/ratelimit` (multi-instance safe)
- [ ] Cache leaderboard data (refresh on verification cron)
- [ ] Cache nonprofit search beyond current in-memory 5-min TTL

### P3.2 — ISR + edge caching
- [ ] Leaderboard page: ISR with 1-hour revalidation
- [ ] `/company/[slug]` + `/profile/[slug]`: ISR with 1-hour revalidation
- [ ] Badge endpoints: aggressive edge caching (one viral badge shouldn't spike compute)

### P3.3 — DB performance
- [ ] Add indexes: `companies.clerk_user_id`, `companies.status`, `donations(company_id, period_start)`
- [ ] Monitor slow queries in Neon dashboard
- [ ] Consider read replicas if leaderboard queries slow down (unlikely at MVP scale)

---

## P4 — Pre-Launch Final Pass (DO THIS LAST)

Do these **in order** in the final week before go-live.

### P4.1 — Proper migration discipline (before any post-launch schema changes)
- [ ] Switch from `drizzle-kit push` to `drizzle-kit generate` + `drizzle-kit migrate`
- [ ] Commit `drizzle/migrations/` to git as the schema history
- [ ] Document rollback procedure for each migration

### P4.2 — Neon staging branch
- [ ] Upgrade Neon to Launch plan ($19/mo) for branching
- [ ] Create `staging` branch from `production`
- [ ] Set staging `DATABASE_URL` in Vercel preview environment
- [ ] Document in `docs/environments.md`

### P4.3 — Testing framework
- [ ] Install Vitest (unit + integration), Playwright (E2E)
- [ ] Configure Vitest with tsconfig path aliases
- [ ] Add scripts: `test`, `test:unit`, `test:integration`, `test:e2e`, `test:ci`

### P4.4 — Critical path tests
**Unit tests:**
- [ ] Crypto: encryption/decryption roundtrip, legacy plaintext migration
- [ ] Rate limiter: counting, window expiry, cleanup
- [ ] Pledge logic: increase immediate vs decrease queued, boundary values
- [ ] Allocation validation: sum=100%, max 20, type enum
- [ ] Slug generation: uniqueness, special chars, collisions
- [ ] Sanitization: HTML/script stripping

**Integration tests (against staging Neon branch):**
- [ ] `POST /api/onboarding/company` — create, idempotent, validation
- [ ] `POST /api/onboarding/stripe-connect` — valid key, invalid, permission errors
- [ ] `PATCH /api/dashboard/settings` — update, unauth, invalid
- [ ] `POST /api/dashboard/pledge` — set, increase, decrease-queued, out-of-range
- [ ] `GET/POST /api/dashboard/allocations` — save, sum≠100 rejected, list
- [ ] `GET/POST/DELETE /api/follows` — CRUD, unauth, duplicate
- [ ] `POST /api/waitlist` — add, duplicate dedupe, rate limit
- [ ] `GET /api/dashboard/revenue` — returns 0 when empty, returns latest snapshot otherwise

**E2E tests (Playwright):**
- [ ] Onboarding: sign up → company → Stripe key → dashboard
- [ ] Dashboard: pledge → allocation → confirm
- [ ] Leaderboard: loads, search works, company links navigate
- [ ] Public profile: loads without auth
- [ ] Badge: renders, grays out for lapsed

### P4.5 — Test data fixtures
- [ ] Seed script (`src/db/seed.ts`) — 3-5 test companies with revenue, donations, periods
- [ ] Teardown script (`src/db/teardown.ts`) — TRUNCATE all except `waitlist`

### P4.6 — CI/CD upgrades
- [ ] Add to GitHub Actions workflow:
  - Lint: `npx eslint .`
  - Typecheck: `npx tsc --noEmit`
  - Unit tests: `npx vitest run`
  - Integration tests: against Neon branch per PR
  - E2E tests: against Vercel preview deploy
- [ ] Path-based filtering (content changes skip tests, API/DB changes run full suite)
- [ ] Fail pipeline on any step failure

### P4.7 — Final pre-launch audit
- [ ] Full SEO audit: meta tags, OG images, page speed (PageSpeed Insights)
- [ ] GEO audit: international considerations, currency display, regional compliance
- [ ] Security audit: verify all env vars set in Vercel prod + preview
- [ ] Verify `.env.local` not in any commit: `git log --all --full-history -- .env.local`
- [ ] Review `/api/health` returns 200 in production
- [ ] Test full onboarding + donation flow on production with real Stripe test key
- [ ] Load-test key endpoints (waitlist, leaderboard) — k6 or Artillery, ~100 concurrent users

### P4.8 — Launch
- [ ] Announce on Product Hunt, Twitter, Indie Hackers
- [ ] Send waitlist email blast
- [ ] Monitor Sentry + UptimeRobot for first 48 hours

---

## Suggested Timeline

| Phase | Focus | Est. Time |
|-------|-------|-----------|
| **Week 1-2** | P0.1-P0.3 (Stripe sync, Every.org donations, payment processing) | 5-7 days |
| **Week 3** | P0.4-P0.6 (Verification cron, real data wiring, badge endpoint) | 4-5 days |
| **Week 4** | P1.1-P1.4 (contact form, nonprofit search UX, logo, social proof) | 3-4 days |
| **Week 5** | P1.5-P1.6 (dashboard polish, SEO) + P2.1-P2.4 (email, webhooks, monitoring) | 4-5 days |
| **Week 6** | P4 (testing, staging, CI/CD, final audit) | 5-6 days |
| **Launch** | P4.8 | 1 day |

**Total:** ~5-6 weeks from today to launch.

---

## Deferred

**Marketing Launch Plan** — See `docs/marketing_launch_plan.md`.

**Post-launch scalability** — P3 items only when traffic demands.

---

## Reference

- [`docs/done.md`](./done.md) — Everything completed with dates
- [`docs/devops-guide.md`](./devops-guide.md) — Branching, CI/CD, cost breakdown
- [`docs/givecheck_product_spec.md`](./givecheck_product_spec.md) — Product spec
- [`docs/givecheck_strategy.md`](./givecheck_strategy.md) — Strategy

## Infrastructure Cost Estimate

**At launch: $0/mo.** All services in free tiers.

**First upgrade ($19/mo):** Neon Launch — unlocks staging branches (triggered by P4.2).

| Service | Free Tier | Upgrade Trigger | Paid |
|---------|-----------|-----------------|------|
| Neon | 0.5 GB, 1 branch | Staging branches (P4.2) | $19/mo |
| Clerk | 10k MAU | >10k users | $25/mo |
| Vercel | 100 GB BW, 6k build mins | Team features | $20/mo |
| Sentry | 5k errors/mo | High error volume | $26/mo |
| Upstash Redis | 10k cmds/day | High traffic | $2/mo |
| UptimeRobot | 50 monitors, 5-min | 1-min checks | $7/mo |

**Moderate traffic:** ~$50-70/mo. See `docs/devops-guide.md` for full breakdown.
