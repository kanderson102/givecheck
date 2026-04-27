# GiveCheck — Completed Work

All items moved here from `todos.md` once completed, with the date marked done.

---

## 2026-04-27 — P0.4 Backend Core & Agent Baseline

### P0.4 Verification Loop Backend
- [x] Fixed-dollar pledge model implemented (`pledgedMonthlyCents`) with $10 minimum and whole-dollar validation
- [x] Verification periods lock `pledgedCents` at period start
- [x] MRR drift baseline fields added (`mrrAtPledgeCents`, `mrrDriftFlag`)
- [x] Every.org donation links include `partnerDonorId={companyId}`
- [x] `POST /api/every-org/webhook` verifies HMAC signatures and idempotently upserts donations by `every_org_id`
- [x] Webhook handles donation success, refund, subscription cancellation, and unknown `partnerDonorId` ignore cases
- [x] `src/lib/verification.ts` verifies due periods, lapses failed companies after grace, opens next periods, applies queued pledge decreases, and refreshes `leaderboard_cache`
- [x] `GET /api/cron/daily` secured by `CRON_SECRET`
- [x] `vercel.json` schedules daily cron at 16:00 UTC

### Agentic Dev Baseline
- [x] `AGENTS.md` is the canonical project agent instruction file
- [x] `CLAUDE.md` points to `AGENTS.md`
- [x] `.claude/` removed from Git tracking and ignored as local tool state
- [x] Shared project skills committed under `.agents/skills`
- [x] ESLint config fixed for ESLint 9 / Next 15 compatibility
- [x] `npm run lint` and `npm run build` pass

---

## 2026-04-15 — Foundations, Infrastructure & Security Hardening

### Core Infrastructure
- [x] **Neon Postgres provisioned** (production branch)
- [x] **Schema pushed to DB** — all 8 tables live (`companies`, `revenue_snapshots`, `donations`, `verification_periods`, `leaderboard_cache`, `follows`, `giving_allocations`, `waitlist`) via `npx drizzle-kit push`
- [x] **DATABASE_URL set** in `.env.local` and Vercel (all environments)
- [x] **Drizzle ORM** configured — `src/db/schema.ts`, `src/db/index.ts` (lazy proxy with error handling), `drizzle.config.ts`
- [x] **Schema includes** `netRevenueCents` (nullable), `nextMrgPledgePct` (queued decreases), `periodAnchor`, proper indexes and foreign keys

### Auth (Clerk)
- [x] Installed `@clerk/nextjs`, configured `ClerkProvider` in root layout
- [x] Middleware (`src/middleware.ts`) protects `/dashboard(.*)` and `/onboarding(.*)`
- [x] `src/app/login/[[...rest]]/page.tsx` uses Clerk `<SignIn />` with custom cyan theme
- [x] `src/app/signup/[[...rest]]/page.tsx` uses Clerk `<SignUp />` with matching theme
- [x] First-login flow maps Clerk user → `companies` table via `/api/onboarding/company` (idempotent)

### Waitlist
- [x] `POST /api/waitlist` — stores emails in DB, email regex validation, rate limited (5/60s per IP)
- [x] Waitlist form (`src/components/waitlist-form.tsx`) wired to API with loading/error states

### Stripe Connect Integration
- [x] OAuth callback flow (`/api/onboarding/stripe-callback`) with CSRF state cookies
- [x] Restricted key flow (`/api/onboarding/stripe-connect`) — validates `Balance: Read` via live Stripe API call, encrypts with AES-256-GCM before storage
- [x] **Encryption utilities** (`src/lib/crypto.ts`) — legacy plaintext migration path (`isEncrypted()` + `getStripeKey()`)
- [x] **STRIPE_KEY_ENCRYPTION_KEY generated** and set in `.env.local` + Vercel
- [x] Donation processing endpoint scaffolded (`/api/donations/process`) — returns 501 until Every.org integration complete

### Nonprofit Search (Every.org)
- [x] `GET /api/nonprofits/search` wired to Every.org Partners API
- [x] `EVERY_ORG_API_KEY` set in `.env.local` + Vercel
- [x] Graceful fallback to local mock data when key missing or API fails
- [x] In-memory cache with 5-min TTL
- [x] Rate limited (30/60s per user)
- [x] Cause filter validation against 17-value allowlist

### Revenue API
- [x] `GET /api/dashboard/revenue` — returns latest snapshot's MRR (net or gross), graceful `{ currentMrr: 0 }` when empty

### Dashboard APIs (all live)
- [x] `PATCH /api/dashboard/settings` — profile updates with sanitization
- [x] `POST /api/dashboard/pledge` — handles increase (immediate) vs decrease (queued to next period), opens verification period on first pledge
- [x] `GET/POST /api/dashboard/allocations` — enforces sum=100%, max 20 entries, type validation

### Follow System
- [x] `GET/POST/DELETE /api/follows` — DB-backed (migrated from localStorage)
- [x] Unique index prevents duplicate follows per user/target
- [x] Rate limited (30/60s)

### Pages Built (23 routes live)
**Marketing/Public:**
- [x] `/` — Landing page with waitlist, pricing slider, badge previews
- [x] `/leaderboard` — Full leaderboard with search + filters
- [x] `/leaderboard` layout (client-side filters wrapper)
- [x] `/categories` + `/categories/[slug]` — Category browsing
- [x] `/company/[slug]` — Public company profile with donation history
- [x] `/profile/[slug]` — Individual profile page
- [x] `/nonprofits` + `/nonprofits/[slug]` — Nonprofit browsing
- [x] `/funds` — Curated bucket funds (HtC Commons, Open Source, Climate, Education, Health)
- [x] `/badge` — Explains badge, shows embed code, previews both variants
- [x] `/faq` — 7 collapsible sections (Getting Started, Verification, Stripe, Donations, Badges, Pricing, Future)
- [x] `/about` — Story, mission, team, high-level how-it-works
- [x] `/contact` — Contact form UI with info (hello@givecheck.com)
- [x] `/blog` + `/blog/[slug]` — 24 blog articles with category filtering and related posts

**Legal (required for launch):**
- [x] `/privacy` — Privacy Policy
- [x] `/terms` — Terms & Conditions

**Auth:**
- [x] `/login` (Clerk `<SignIn />`)
- [x] `/signup` (Clerk `<SignUp />`)

**Authenticated:**
- [x] `/onboarding` — 3-step flow (name/website → category/bio → Stripe key)
- [x] `/dashboard` — Main dashboard with stats, pledge card, badge preview, revenue chart
- [x] `/dashboard/pledge` — Change fixed-dollar monthly pledge with queue logic for decreases
- [x] `/dashboard/allocations` + `/dashboard/allocations/confirm` — Allocation setup with sum=100% enforcement
- [x] `/dashboard/settings` — Company profile editor
- [x] `/dashboard/following` — Follow list

**Error/404:**
- [x] `/not-found` — Branded 404 page
- [x] `/error` — Branded 500 page with "try again" and error digest
- [x] `/dashboard/error` — Dashboard-specific error boundary with recovery UI
- [x] `/global-error` — Global error boundary fallback

### Observability (Sentry)
- [x] `@sentry/nextjs` installed via wizard (including Sentry MCP)
- [x] `sentry.server.config.ts`, `sentry.edge.config.ts`, `src/instrumentation.ts`, `src/instrumentation-client.ts` all configured
- [x] Source maps upload enabled (widenClientFileUpload: true)
- [x] Tunnel route at `/monitoring` to bypass ad blockers
- [x] `tracesSampleRate: 1`, `enableLogs: true`
- [x] `SENTRY_AUTH_TOKEN` set in `.env.local` + Vercel for source map uploads
- [x] Error tracking deeply integrated (auto-captures unhandled server + client errors)
- [x] Sentry example files deleted (`/sentry-example-page`, `/api/sentry-example-api`)

### Error Handling
- [x] `src/app/not-found.tsx` — branded 404
- [x] `src/app/error.tsx` — branded 500 with retry + error digest
- [x] `src/app/dashboard/error.tsx` — dashboard-scoped error boundary with recovery UI
- [x] `src/app/global-error.tsx` — global fallback
- [x] `src/components/error-boundary.tsx` — reusable class component for wrapping sections

### Health & Monitoring
- [x] `GET /api/health` — pings DB with latency measurement, returns 200/503

### Security Hardening
- [x] **Environment validation** at startup (`src/lib/env.ts`) — fails fast with clear errors, validates `STRIPE_KEY_ENCRYPTION_KEY` hex format
- [x] **Security headers** in `next.config.ts` — `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [x] **Input validation** on all user-input routes:
  - Company name max 100 chars
  - Bio/description max 500 chars
  - Website URL max 2048 chars with URL format validation
  - Category validated against 13-value enum
  - Follows targetSlug max 200 chars, type enum
- [x] **HTML sanitization** (`src/lib/sanitize.ts`) applied to company name + bio in onboarding and settings routes
- [x] **Rate limiting** on all mutating endpoints (sliding-window, per-user or per-IP):
  - Waitlist: 5/60s per IP
  - Onboarding: 5/60s per user
  - Stripe connect: 5/60s per user
  - Pledge: 5/60s per user
  - Settings: 10/60s per user
  - Allocations: 10/60s per user
  - Follows: 30/60s per user
  - Nonprofit search: 30/60s per user
  - Donations: 10/60s per user
- [x] **Auth required** on all dashboard + onboarding API routes (401 if unauthenticated)
- [x] **CSRF protection** via Stripe OAuth state cookies

### DevOps / Deployment
- [x] GitHub Actions workflow (`.github/workflows/vercel-deploy.yml`) — separate preview (PR) + production (main) jobs
- [x] Vercel connected to GitHub
- [x] `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets configured
- [x] `.gitignore` covers `.env*` (with `!.env.example` exception), `.vercel/`, `.clerk/`, `.cursor/`, `.claude/`, `.env.sentry-build-plugin`
- [x] Initial production push to `main` completed (87 files, 23k+ lines)

### Documentation
- [x] `docs/givecheck_product_spec.md` — Product and technical spec
- [x] `docs/givecheck_strategy.md` — Strategic vision, market positioning
- [x] `docs/marketing_launch_plan.md` — GTM strategy
- [x] `docs/todos.md` — Living todo list
- [x] `docs/devops-guide.md` — Branching, CI/CD, cost breakdown, quick reference
- [x] `docs/done.md` — This file
- [x] `.env.example` — All env vars documented with inline instructions

### Footer & Navigation
- [x] All footer links point to real routes (no dead links)
- [x] Competitor/alternative comparison links in footer (5 articles: vs. B Corp, vs. 1% for the Planet, vs. Pledge 1%, vs. Founders Pledge, vs. Giving What We Can)
