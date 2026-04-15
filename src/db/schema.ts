import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  decimal,
  boolean,
  timestamp,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ── Companies ──────────────────────────────────────────────────────
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    website: text("website"),
    logoUrl: text("logo_url"),
    description: text("description"),
    category: text("category"),
    stripeAccountId: text("stripe_account_id"),
    clerkUserId: text("clerk_user_id"),
    ownerEmail: text("owner_email").notNull(),
    tier: text("tier").default("free").notNull(), // free, standard, premium
    monthlySaasFeeCents: integer("monthly_saas_fee_cents").default(0),
    nextBillingDate: date("next_billing_date"),
    status: text("status").default("pending").notNull(), // pending, verified, lapsed, inactive
    mrgPledgePct: decimal("mrg_pledge_pct", { precision: 5, scale: 2 }),    // founder's committed giving %
    nextMrgPledgePct: decimal("next_mrg_pledge_pct", { precision: 5, scale: 2 }), // queued decrease for next period
    periodAnchor: timestamp("period_anchor"),                                // start of current 30-day window
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("companies_slug_idx").on(table.slug)]
);

// ── Revenue Snapshots ──────────────────────────────────────────────
export const revenueSnapshots = pgTable("revenue_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  grossRevenueCents: bigint("gross_revenue_cents", { mode: "number" }).notNull(),
  netRevenueCents: bigint("net_revenue_cents", { mode: "number" }),          // gross minus refunds (nullable for existing rows)
  source: text("source").notNull(), // stripe, lemon_squeezy, manual
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Donations ──────────────────────────────────────────────────────
export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
  recipientName: text("recipient_name").notNull(),
  everyOrgId: text("every_org_id").notNull(),
  recipientType: text("recipient_type").notNull(), // custom_search, curated, bucket_fund
  verified: boolean("verified").default(true),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Verification Periods ───────────────────────────────────────────
export const verificationPeriods = pgTable("verification_periods", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  totalRevenueCents: bigint("total_revenue_cents", { mode: "number" }),
  totalDonatedCents: bigint("total_donated_cents", { mode: "number" }),
  givingPercentage: decimal("giving_percentage", {
    precision: 5,
    scale: 2,
  }),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Leaderboard Cache ──────────────────────────────────────────────
export const leaderboardCache = pgTable("leaderboard_cache", {
  companyId: uuid("company_id")
    .references(() => companies.id)
    .primaryKey(),
  currentMrgPct: decimal("current_mrg_pct", { precision: 5, scale: 2 }),
  currentMrgAmount: bigint("current_mrg_amount", { mode: "number" }),
  rankByPct: integer("rank_by_pct"),
  rankByAmount: integer("rank_by_amount"),
  is10PctClub: boolean("is_10pct_club"),
  lastVerifiedAt: timestamp("last_verified_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Follows ───────────────────────────────────────────────────────
export const follows = pgTable(
  "follows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    targetSlug: text("target_slug").notNull(),
    targetType: text("target_type").notNull(), // "company" | "person" | "nonprofit"
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("follows_user_target_idx").on(
      table.clerkUserId,
      table.targetSlug,
      table.targetType
    ),
  ]
);

// ── Giving Allocations ────────────────────────────────────────────
export const givingAllocations = pgTable("giving_allocations", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientSlug: text("recipient_slug").notNull(),
  recipientType: text("recipient_type").notNull(), // "nonprofit" | "bucket_fund"
  allocationPct: integer("allocation_pct").notNull(), // 1-100, all rows for a company must sum to 100
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Waitlist ───────────────────────────────────────────────────────
export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("waitlist_email_idx").on(table.email)]
);
