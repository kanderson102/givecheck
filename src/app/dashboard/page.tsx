import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Trophy,
  ShieldCheck,
  BarChart3,
  Calendar,
  ExternalLink,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { BadgePreview } from "@/components/badge-preview";
import { RevenueChart } from "@/components/revenue-chart";
import { dashboardStats } from "@/lib/mock-data";
import { db } from "@/db";
import { companies, verificationPeriods } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import {
  fetchRolling30DayRevenue,
  fetchRevenueHistory,
  persistRevenueSnapshot,
  getLatestFreshSnapshot,
} from "@/lib/stripe-revenue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — GiveCheck",
  description: "Manage your verified giving, track your donations, and monitor your leaderboard rank.",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const clerkUser = await currentUser();
  const firstName = clerkUser?.firstName ?? clerkUser?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "there";

  // Check for real company record
  let company = null;
  try {
    const rows = await db
      .select()
      .from(companies)
      .where(eq(companies.clerkUserId, userId))
      .limit(1);
    company = rows[0] ?? null;
  } catch {
    // DB not yet configured — safe to ignore, show mock data
  }

  const hasStripe = !!company?.stripeAccountId;
  const displayName = company?.name ?? "your company";
  const profileSlug = company?.slug ?? null;

  // Fetch rolling 30-day net revenue + 6-month chart history if Stripe is connected
  // The key may be encrypted (new) or plaintext (legacy) — getStripeKey handles both,
  // and the fetch functions call it internally, so we pass the stored value as-is.
  let rolling30Day = null;
  let revenueHistory = null;
  if (hasStripe && company) {
    try {
      [rolling30Day, revenueHistory] = await Promise.all([
        fetchRolling30DayRevenue(
          company.stripeAccountId!,
          company.periodAnchor ?? undefined
        ),
        fetchRevenueHistory(company.stripeAccountId!),
      ]);

      // Persist snapshot to DB (once per 6h per company) so the verification
      // cron + public leaderboard have historical data to work with. Fire-and-forget
      // — persistence failing shouldn't break the dashboard render.
      try {
        const fresh = await getLatestFreshSnapshot(company.id, 360);
        if (!fresh && rolling30Day) {
          await persistRevenueSnapshot(company.id, rolling30Day);
        }
      } catch (persistErr) {
        console.error("Failed to persist revenue snapshot:", persistErr);
      }
    } catch (err) {
      console.error("Failed to fetch Stripe revenue:", err);
    }
  }

  const stats = dashboardStats; // mock fallback for chart shape
  const currentMrr = rolling30Day ? rolling30Day.netRevenueCents / 100 : null;

  // Count verified months from DB
  let verifiedMonths = 0;
  if (company) {
    try {
      const result = await db
        .select({ count: count() })
        .from(verificationPeriods)
        .where(
          and(
            eq(verificationPeriods.companyId, company.id),
            eq(verificationPeriods.isVerified, true)
          )
        );
      verifiedMonths = Number(result[0]?.count ?? 0);
    } catch {
      // ignore — DB may not have rows yet
    }
  }

  const mrgPledgePct = company?.mrgPledgePct ? Number(company.mrgPledgePct) : null;
  const nextMrgPledgePct = company?.nextMrgPledgePct ? Number(company.nextMrgPledgePct) : null;
  const periodAnchor = company?.periodAnchor ?? null;
  const periodEnd = periodAnchor
    ? new Date(new Date(periodAnchor).getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;
  const isPeriodActive = periodEnd ? periodEnd > new Date() : false;

  // Badge status: verified only after real verification, pending when pledge set, inactive otherwise
  const badgeStatus: "verified" | "pending" | "inactive" =
    verifiedMonths > 0 ? "verified" : mrgPledgePct !== null ? "pending" : "inactive";

  // Check if allocations exist
  let hasAllocations = false;
  if (company) {
    try {
      const { givingAllocations } = await import("@/db/schema");
      const allocRows = await db
        .select({ id: givingAllocations.id })
        .from(givingAllocations)
        .where(eq(givingAllocations.companyId, company.id))
        .limit(1);
      hasAllocations = allocRows.length > 0;
    } catch {
      // ignore — table may not exist yet
    }
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">

          {/* Setup banners — shown until real data is connected */}
          {!company && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3.5">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-orange-800">
                  Complete your profile to appear on the leaderboard
                </p>
                <p className="mt-0.5 text-xs text-orange-600">
                  Add your company details so we know who you are.
                </p>
              </div>
              <Link
                href="/onboarding"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex-shrink-0 border-orange-300 text-orange-700 hover:bg-orange-100 text-xs h-8 px-3"
                )}
              >
                Set up profile
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {company && !hasStripe && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3.5">
              <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cyan-800">
                  Connect Stripe to verify your giving percentage
                </p>
                <p className="mt-0.5 text-xs text-cyan-600">
                  Read-only access — we can never move money. Needed to appear on the leaderboard.
                </p>
              </div>
              <Link
                href="/dashboard/settings"
                className={cn(
                  buttonVariants(),
                  "flex-shrink-0 bg-cyan-600 hover:bg-cyan-700 text-white text-xs h-8 px-3"
                )}
              >
                Connect Stripe
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-cyan-950">
                Dashboard
              </h1>
              <p className="mt-1 text-cyan-600">
                Welcome back{company ? `, ${displayName}` : `, ${firstName}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {company && (mrgPledgePct ?? 0) >= 10 && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 px-3 py-1">
                  <Trophy className="mr-1.5 h-3.5 w-3.5" />
                  10% Club Member
                </Badge>
              )}
              {profileSlug && (
                <Link
                  href={`/company/${profileSlug}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-cyan-200 text-cyan-700 hover:bg-cyan-50 cursor-pointer"
                  )}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public Profile
                </Link>
              )}
            </div>
          </div>

          {/* Period countdown */}
          {periodEnd && isPeriodActive && (
            <div className="mt-6 flex items-center gap-2 text-sm text-cyan-600">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>
                Current period ends{" "}
                <strong className="text-cyan-800">
                  {periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </strong>
              </span>
              {nextMrgPledgePct !== null && (
                <span className="ml-2 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs text-amber-700">
                  Changing to {nextMrgPledgePct}% next period
                </span>
              )}
            </div>
          )}

          {/* Set Giving % CTA — shown when Stripe connected but no pledge yet */}
          {hasStripe && mrgPledgePct === null && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3.5">
              <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-orange-800">
                  Set your giving percentage to appear on the leaderboard
                </p>
                <p className="mt-0.5 text-xs text-orange-600">
                  Your first period starts the day you make your donation. Giving % is based on the last 30 days of net revenue.
                </p>
              </div>
              <Link
                href="/dashboard/pledge"
                className={cn(
                  buttonVariants(),
                  "flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 px-3"
                )}
              >
                Set Giving %
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Allocation CTA — shown when pledge is set but no allocations */}
          {mrgPledgePct !== null && !hasAllocations && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3.5">
              <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cyan-800">
                  Choose where your giving goes
                </p>
                <p className="mt-0.5 text-xs text-cyan-600">
                  Allocate your {mrgPledgePct}% across nonprofits and funds.
                </p>
              </div>
              <Link
                href="/dashboard/allocations"
                className={cn(
                  buttonVariants(),
                  "flex-shrink-0 bg-cyan-600 hover:bg-cyan-700 text-white text-xs h-8 px-3"
                )}
              >
                Set Allocations
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Manage Allocations link — shown when allocations exist */}
          {mrgPledgePct !== null && hasAllocations && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <ShieldCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">
                  Giving allocations configured
                </p>
              </div>
              <Link
                href="/dashboard/allocations"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex-shrink-0 border-green-300 text-green-700 hover:bg-green-100 text-xs h-8 px-3"
                )}
              >
                Manage Allocations
              </Link>
            </div>
          )}

          {/* Stat cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: DollarSign,
                label: "Net Revenue",
                value: currentMrr !== null
                  ? `$${currentMrr.toLocaleString()}`
                  : hasStripe ? "Loading…" : "—",
                sub: hasStripe
                  ? currentMrr === 0
                    ? "No charges found yet"
                    : "Net revenue · last 30 days"
                  : "Connect Stripe to see",
                accent: false,
              },
              {
                icon: TrendingUp,
                label: "Giving Rate",
                value: mrgPledgePct !== null
                  ? `${mrgPledgePct}%`
                  : "—",
                sub: mrgPledgePct !== null
                  ? isPeriodActive
                    ? "Pledged · period in progress"
                    : "Set up a new period"
                  : hasStripe
                    ? "Set your giving %"
                    : "Connect Stripe to set",
                accent: true,
              },
              {
                icon: Trophy,
                label: "Leaderboard Rank",
                value: hasStripe && mrgPledgePct !== null ? "Active" : "—",
                sub: hasStripe && mrgPledgePct !== null
                  ? "Rank updates daily"
                  : "Pending verification",
                accent: false,
              },
              {
                icon: Calendar,
                label: "Verified Months",
                value: `${verifiedMonths}`,
                sub: "Periods with verified giving",
                accent: false,
              },
            ].map((card) => (
              <Card
                key={card.label}
                className={`border transition-shadow duration-200 hover:shadow-md ${
                  card.accent
                    ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
                    : "border-cyan-100 bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        card.accent
                          ? "bg-orange-100 text-orange-600"
                          : "bg-cyan-50 text-cyan-600"
                      }`}
                    >
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600">{card.label}</p>
                      <p className="font-heading text-2xl font-bold text-cyan-950">
                        {card.value}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-cyan-500">{card.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Revenue chart */}
            <Card className="border-cyan-100 bg-white/80 backdrop-blur-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-cyan-900">
                  <BarChart3 className="h-5 w-5 text-cyan-600" />
                  Revenue & Giving History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasStripe && revenueHistory ? (
                  <RevenueChart
                    data={revenueHistory.history.map((m) => ({
                      month: m.month,
                      revenue: m.revenueCents / 100,
                      donated: m.donatedCents / 100,
                    }))}
                  />
                ) : hasStripe ? (
                  <RevenueChart data={stats.revenueHistory} />
                ) : (
                  <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-200 text-center">
                    <BarChart3 className="h-8 w-8 text-cyan-300" />
                    <p className="text-sm text-cyan-400">Connect Stripe to see your history</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Badge */}
            <Card className="border-cyan-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-cyan-900">
                  <ShieldCheck className="h-5 w-5 text-cyan-600" />
                  Your Badge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <BadgePreview
                    percentage={mrgPledgePct ?? 0}
                    companyName={displayName}
                    is10PctClub={(mrgPledgePct ?? 0) >= 10}
                    status={badgeStatus}
                  />
                </div>

                {/* Badge status explainer */}
                {badgeStatus === "pending" && (
                  <p className="text-xs text-center text-cyan-500 bg-cyan-50 rounded-lg p-2">
                    Your badge shows &quot;Pending Verification&quot;. Complete your first 30-day giving period to earn the &quot;Verified&quot; badge.
                  </p>
                )}
                {badgeStatus === "inactive" && (
                  <p className="text-xs text-center text-gray-400 bg-gray-50 rounded-lg p-2">
                    Set your giving percentage and complete onboarding to activate your badge.
                  </p>
                )}

                {hasStripe && mrgPledgePct !== null ? (
                  <>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-cyan-900">
                        Add your badge in 2 steps:
                      </h4>
                      <ol className="space-y-1.5 text-xs text-cyan-700 list-decimal list-inside leading-relaxed">
                        <li>
                          Copy the snippet below and paste it into your website&apos;s HTML.
                        </li>
                        <li>
                          The badge updates after each verified 30-day period. If your giving lapses, it grays out automatically.
                        </li>
                      </ol>
                    </div>
                    <div className="rounded-lg border border-cyan-100 bg-cyan-50/60 p-3">
                      <p className="mb-2 text-xs font-medium text-cyan-700">Embed Code</p>
                      <code className="block break-all text-xs text-cyan-600 leading-relaxed font-mono">
                        {`<div id="givecheck-badge-container" data-slug="${profileSlug ?? "your-slug"}"></div>`}
                        <br />
                        {`<script src="https://givecheck.org/api/badge/script.js" async></script>`}
                      </code>
                    </div>
                    <Button className="w-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer">
                      Copy Embed Code
                    </Button>
                  </>
                ) : (
                  <p className="text-center text-xs text-cyan-400">
                    {hasStripe
                      ? "Set your giving % to activate your badge."
                      : "Connect Stripe and set your giving % to activate your badge."}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent donations — placeholder until Every.org integration is live */}
          {hasStripe && (
            <Card className="mt-6 border-cyan-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-cyan-900">
                  <DollarSign className="h-5 w-5 text-cyan-600" />
                  Recent Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                  <DollarSign className="h-8 w-8 text-cyan-300" />
                  <p className="text-sm text-cyan-500">
                    Donation tracking will appear here once you make your first verified donation.
                  </p>
                  {mrgPledgePct !== null && (
                    <p className="text-xs text-cyan-400">
                      Your pledge is set — donations through GiveCheck are coming soon.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
