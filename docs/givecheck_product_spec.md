# GiveCheck — Product & Technical Spec

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│                  GiveCheck Web App            │
│                                              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │ Onboard  │  │ Dashboard │  │  Public   │  │
│  │  Flow    │  │  (Member) │  │Leaderboard│  │
│  └────┬─────┘  └─────┬─────┘  └──────────┘  │
│       │               │                      │
│  ┌────▼───────────────▼─────────────────┐    │
│  │        Verification Engine           │    │
│  │  ┌─────────┐  ┌──────────────────┐   │    │
│  │  │ Income  │  │    Donation      │   │    │
│  │  │ Verify  │  │     Verify       │   │    │
│  │  └────┬────┘  └───────┬──────────┘   │    │
│  └───────│───────────────│──────────────┘    │
│          │               │                   │
└──────────│───────────────│───────────────────┘
           │               │
    ┌──────▼──────┐  ┌─────▼──────────┐
    │  Stripe API │  │  Every.org     │
    │  (read-only)│  │  API Network   │
    └─────────────┘  └────────────────┘
```

## Tech Stack (Recommended)

- **Frontend:** Next.js (App Router) — fast to ship, good SEO for leaderboard pages
- **Database:** PostgreSQL (Neon or Supabase are recommended for serverless scaling)
- **Auth:** Clerk (handles B2B auth, user impersonation, and fast onboarding)
- **Payments:** Stripe (for annual fee collection AND for Stripe Connect income verification)
- **Donation processing:** Every.org API (100% of donations routed here)
- **Badge widget:** Dynamic JS embed script for real-time enforcement
- **Hosting:** Vercel
- **Email:** Resend or Beehiiv transactional

## Database Schema (Core Tables)

### companies
```sql
id                  UUID PRIMARY KEY
name                TEXT NOT NULL
slug                TEXT UNIQUE NOT NULL  -- for public profile URL
website             TEXT
stripe_account_id   TEXT                  -- Stripe Connect account
owner_email         TEXT NOT NULL
tier                TEXT DEFAULT 'free'   -- free, standard, premium
monthly_saas_fee_cents INTEGER DEFAULT 0
next_billing_date   DATE
status              TEXT DEFAULT 'pending' -- pending, verified, lapsed, inactive
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### revenue_snapshots
```sql
id                  UUID PRIMARY KEY
company_id          UUID REFERENCES companies
period_start        DATE NOT NULL         -- first of month
period_end          DATE NOT NULL         -- last of month
gross_revenue_cents BIGINT NOT NULL
source              TEXT NOT NULL          -- 'stripe', 'lemon_squeezy', 'manual'
verified            BOOLEAN DEFAULT FALSE
verified_at         TIMESTAMP
created_at          TIMESTAMP
```

### donations
```sql
id                  UUID PRIMARY KEY
company_id          UUID REFERENCES companies
period_start        DATE NOT NULL
period_end          DATE NOT NULL
amount_cents        BIGINT NOT NULL
recipient_name      TEXT NOT NULL
every_org_id        TEXT NOT NULL          -- API reference ID
recipient_type      TEXT NOT NULL          -- 'custom_search', 'curated', 'bucket_fund'
verified            BOOLEAN DEFAULT TRUE   -- auto-verified via API
verified_at         TIMESTAMP
created_at          TIMESTAMP
```

### verification_periods
```sql
id                  UUID PRIMARY KEY
company_id          UUID REFERENCES companies
period_start        DATE NOT NULL          -- month start
period_end          DATE NOT NULL          -- month end
total_revenue_cents BIGINT
total_donated_cents BIGINT
giving_percentage   DECIMAL(5,2)           -- e.g., 10.50
is_verified         BOOLEAN DEFAULT FALSE
verified_at         TIMESTAMP
created_at          TIMESTAMP
```

### leaderboard_cache
```sql
company_id          UUID REFERENCES companies
current_mrg_pct     DECIMAL(5,2)           -- current verified monthly giving %
current_mrg_amount  BIGINT                 -- current verified monthly giving $
rank_by_pct         INTEGER
rank_by_amount      INTEGER
is_10pct_club       BOOLEAN                -- giving_pct >= 10.0
last_verified_at    TIMESTAMP
updated_at          TIMESTAMP
```

### curated_nonprofits (future — not in MVP)
```sql
id                  UUID PRIMARY KEY
name                TEXT NOT NULL
ein                 TEXT                   -- US tax ID
candid_id           TEXT
category            TEXT                   -- environment, education, health, etc.
charity_navigator   DECIMAL(3,1)           -- rating
website             TEXT
status              TEXT DEFAULT 'active'
created_at          TIMESTAMP
```

## API Endpoints (Core)

### Auth & Onboarding
- `POST /api/auth/signup` — create account
- `POST /api/onboarding/stripe-connect` — initiate Stripe Connect OAuth
- `GET /api/onboarding/stripe-callback` — handle Stripe Connect callback

### Revenue & Donations
- `GET /api/revenue/sync` — pull latest revenue from Stripe
- `POST /api/donations/process` — trigger Every.org outgoing donation
- `GET /api/verification/:companyId/:period` — get verification status for a period

### Public
- `GET /api/leaderboard` — public leaderboard (paginated, filterable, default sort `ORDER BY current_mrg_pct DESC, current_mrg_amount DESC`)
- `GET /api/profile/:slug` — public company profile
- `GET /api/badge/script.js` — dynamic JS badge script serving real-time state

## Badge Widget

Embeddable HTML snippet that companies add to their site:

```html
<!-- GiveCheck Badge -->
<div id="givecheck-badge-container" data-slug="company-slug"></div>
<script src="https://giverank.com/api/badge/script.js" async></script>
```

Badge dynamically renders via JS (works inside Static Sites / SSG architectures by fetching on the client):
- Current verified giving %
- "10% Club" treatment if ≥ 10%
- Grayed out/Unverified if subscription lapses or MRG target missed.

## Stripe Connect Integration

### What We Read (Read-Only)
- `balance_transactions` — to calculate gross revenue per period
- `charges` — successful charges for revenue verification
- `payouts` — as secondary verification of money movement

### What We Don't Access
- Customer data, payment methods, or any personal information
- (Refund amounts are read from `balance_transactions` to calculate net revenue, but no customer PII is accessed)

### Flow
1. Company creates a restricted Stripe API key (Balance → Read Only) in their Stripe dashboard
2. Pastes key into GiveCheck dashboard → stored as `stripe_account_id`
3. On pledge creation, `period_anchor` is set to today; `verification_periods` row created with `period_end = today + 30 days`
4. GiveCheck calculates **net revenue** = gross `balance_transactions` (positive inflows) minus refunds, over the rolling 30-day window
5. Looks up the company's pledged MRG percentage (`mrg_pledge_pct`)
6. At period end: calculates the required SaaS fee (0.29% of net revenue, capped at $29) and cross-verifies Every.org donation

## Verification Workflow

### Automated 100% On-Platform Flow — Rolling 30-Day Window
Verification is anchored to the founder's actual donation date, not the calendar month:
1. Founder sets their giving % → `period_anchor = today`, `period_end = today + 30 days`.
2. GiveCheck pulls rolling 30-day `balance_transactions` from Stripe → calculates **net revenue** (gross charges minus refunds).
3. Donation amount = `net_revenue × mrg_pledge_pct / 100`. If net revenue = $0 and a % is pledged, badge grays out — no fee charged.
4. At period end (day 30): calculates 0.29% GiveCheck SaaS fee on net revenue (capped at $29). If revenue < committed dollar amount, fee is reduced to match actual donated amount.
5. Verifies via Every.org API that donation was made and confirmed.
6. On success: `is_verified = true`, badge renews, new period opens from that donation date.
7. **Mid-period % change (increase):** takes effect immediately for the next period. Current period badge fee prorated.
8. **Mid-period % change (decrease):** queued in `next_mrg_pledge_pct`, takes effect at period end (donations are non-refundable).
9. **Missed period:** if >30 days pass without a donation, badge grays out. Next donation date becomes the new `period_anchor`.

## MVP Build Order

1. **Landing page + waitlist** — explain concept, collect emails (1–2 days)
2. **Auth + company onboarding** — signup, basic profile (1–2 days)
3. **Stripe Connect** — OAuth flow, revenue sync (2–3 days)
4. **Every.org Routing** — UI to pick charity + Stripe billing logic (2–3 days)
5. **Public profile page** — company's giving history, verified % (1 day)
6. **Leaderboard** — ranked list, filterable (1–2 days)
7. **JS Badge widget** — Dynamic script serving badge UI (1 day)

**Total estimated MVP: 10–15 days of focused building.**

## Post-MVP Roadmap

- [ ] Multi-processor support (Lemon Squeezy, Gumroad, PayPal)
- [ ] Curated nonprofit directory + on-platform donations via Every.org
- [ ] Bucket funds with community voting
- [ ] Referral system
- [ ] Email notifications (rank changes, verification reminders)
- [ ] Subscription upgrade/downgrade UI
- [ ] International currency support
- [ ] Public API for third-party integrations
