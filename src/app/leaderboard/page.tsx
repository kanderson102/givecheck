"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, ShieldCheck } from "lucide-react";
import {
  leaderboardData,
  categories,
  givingTiers,
  founders,
  type CompanyCategory,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type LeaderboardView = "companies" | "individuals";

const PAGE_SIZE = 50;

const givenPerMonthFilters = [
  { label: "All", min: 0 },
  { label: "$100+", min: 10000 },
  { label: "$500+", min: 50000 },
  { label: "$1K+", min: 100000 },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
  return null;
}

export default function LeaderboardPage() {
  const [view, setView] = useState<LeaderboardView>("companies");
  const [filterTab, setFilterTab] = useState<"industry" | "tier">("industry");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [givenMin, setGivenMin] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sortedFounders = useMemo(() => {
    return [...founders].sort(
      (a, b) =>
        b.totalGivingPct - a.totalGivingPct ||
        b.totalGivingCents - a.totalGivingCents
    );
  }, []);

  const filtered = useMemo(() => {
    let data = [...leaderboardData];

    if (filterTab === "industry" && selectedCategory !== "all") {
      data = data.filter(
        (e) => e.category === (selectedCategory as CompanyCategory)
      );
    }

    if (filterTab === "tier" && selectedTier !== "all") {
      const tier = givingTiers.find((t) => t.slug === selectedTier);
      if (tier) {
        data = data.filter((e) => {
          if (tier.maxPct !== undefined) {
            return e.givingPct >= tier.minPct && e.givingPct <= tier.maxPct;
          }
          return e.givingPct >= tier.minPct;
        });
      }
    }

    if (givenMin > 0) {
      data = data.filter((e) => e.amountCents >= givenMin);
    }

    return data.sort(
      (a, b) => b.givingPct - a.givingPct || b.amountCents - a.amountCents
    );
  }, [filterTab, selectedCategory, selectedTier, givenMin]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const topThree = filtered.length >= 3 ? filtered.slice(0, 3) : null;

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          {/* Header */}
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-cyan-200 bg-cyan-50 text-cyan-700 px-3 py-1"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              100% API-Verified
            </Badge>
            <h1 className="font-heading text-4xl font-bold text-cyan-950 sm:text-5xl">
              The Giving Leaderboard
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-cyan-700">
              Ranked by verified Monthly Recurring Giving percentage. The great
              equalizer — a bootstrapper at 15% outranks a funded startup at 2%.
            </p>
          </div>

          {/* View toggle: Companies vs Individuals */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-lg border border-cyan-200 bg-white p-1">
              <button
                onClick={() => { setView("companies"); setVisibleCount(PAGE_SIZE); }}
                className={cn(
                  "rounded-md px-5 py-2 text-sm font-medium transition-colors cursor-pointer",
                  view === "companies"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 hover:bg-cyan-50"
                )}
              >
                Companies
              </button>
              <button
                onClick={() => { setView("individuals"); setVisibleCount(PAGE_SIZE); }}
                className={cn(
                  "rounded-md px-5 py-2 text-sm font-medium transition-colors cursor-pointer",
                  view === "individuals"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 hover:bg-cyan-50"
                )}
              >
                Individuals
              </button>
            </div>
          </div>

          {view === "individuals" ? (
            <>
              {/* Individuals leaderboard */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="grid grid-cols-[3rem_1fr_6rem_7rem] gap-x-4 border-b border-cyan-100 bg-cyan-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-cyan-600 sm:grid-cols-[3rem_1fr_7rem_7rem_7rem]">
                  <span>#</span>
                  <span>Person</span>
                  <span className="text-right">Avg MRG %</span>
                  <span className="hidden text-right sm:block">Total Given/mo</span>
                  <span className="text-right">Companies</span>
                </div>

                {sortedFounders.length === 0 ? (
                  <div className="px-6 py-12 text-center text-cyan-500">
                    No individuals found.
                  </div>
                ) : (
                  sortedFounders.slice(0, visibleCount).map((founder, idx) => {
                    const companyCount = founder.companySlugs.length;
                    return (
                      <div
                        key={founder.slug}
                        className="grid grid-cols-[3rem_1fr_6rem_7rem] items-center gap-x-4 border-b border-cyan-50 px-6 py-4 transition-colors duration-150 hover:bg-cyan-50/40 sm:grid-cols-[3rem_1fr_7rem_7rem_7rem]"
                      >
                        <div className="flex items-center gap-1">
                          {getRankIcon(idx + 1) ?? (
                            <span className="font-heading text-lg font-bold text-cyan-300">
                              {idx + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 truncate">
                          <Avatar className="h-8 w-8 shrink-0 border border-cyan-100">
                            <AvatarFallback className="bg-cyan-50 text-cyan-700 text-xs font-bold">
                              {founder.avatarFallback}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col truncate">
                            <Link
                              href={`/profile/${founder.slug}`}
                              className="truncate font-medium text-cyan-900 hover:text-cyan-600 transition-colors"
                            >
                              {founder.name}
                            </Link>
                            <span className="text-xs text-cyan-500 truncate">
                              {founder.title}
                            </span>
                          </div>
                        </div>
                        <span className="text-right font-heading text-lg font-bold text-cyan-900">
                          {founder.totalGivingPct}%
                        </span>
                        <span className="hidden text-right text-sm text-cyan-600 sm:block">
                          ${(founder.totalGivingCents / 100).toLocaleString()}/mo
                        </span>
                        <div className="flex justify-end">
                          <Badge
                            variant="secondary"
                            className="border-cyan-200 bg-cyan-50 text-cyan-600"
                          >
                            {companyCount} {companyCount === 1 ? "company" : "companies"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {visibleCount < sortedFounders.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-6 py-3 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-50 cursor-pointer"
                  >
                    Show more
                  </button>
                </div>
              )}
            </>
          ) : (
          <>
          {/* Filter tabs */}
          <div className="mt-6 flex flex-col items-center gap-4">
            {/* Tab toggle */}
            <div className="inline-flex rounded-lg border border-cyan-200 bg-white p-1">
              <button
                onClick={() => {
                  setFilterTab("industry");
                  setSelectedTier("all");
                }}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                  filterTab === "industry"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 hover:bg-cyan-50"
                )}
              >
                By Industry
              </button>
              <button
                onClick={() => {
                  setFilterTab("tier");
                  setSelectedCategory("all");
                }}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                  filterTab === "tier"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 hover:bg-cyan-50"
                )}
              >
                By Giving Tier
              </button>
            </div>

            {/* Category / Tier pills */}
            <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {filterTab === "industry" ? (
                <>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                      selectedCategory === "all"
                        ? "bg-cyan-600 text-white"
                        : "border border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                        selectedCategory === cat.slug
                          ? "bg-cyan-600 text-white"
                          : "border border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </>
              ) : (
                givingTiers.map((tier) => (
                  <button
                    key={tier.slug}
                    onClick={() => setSelectedTier(tier.slug)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                      selectedTier === tier.slug
                        ? "bg-cyan-600 text-white"
                        : "border border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"
                    )}
                  >
                    {tier.label}
                  </button>
                ))
              )}
            </div>

            {/* Given/mo filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-cyan-600">
                Given/mo:
              </span>
              {givenPerMonthFilters.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setGivenMin(f.min)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    givenMin === f.min
                      ? "bg-cyan-100 text-cyan-800"
                      : "text-cyan-500 hover:text-cyan-700"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Podium - Top 3 */}
          {topThree && (
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[1, 0, 2].map((orderIdx) => {
                const e = topThree[orderIdx];
                const isFirst = orderIdx === 0;

                return (
                  <div
                    key={e.slug}
                    className={`relative flex flex-col items-center rounded-2xl border p-6 text-center backdrop-blur-sm transition-shadow duration-200 hover:shadow-lg ${
                      isFirst
                        ? "border-orange-200 bg-gradient-to-b from-orange-50 to-white sm:-mt-4 sm:pb-8"
                        : "border-cyan-200 bg-white/80"
                    }`}
                  >
                    <div className="mb-3">
                      {getRankIcon(
                        orderIdx === 0 ? 1 : orderIdx === 1 ? 2 : 3
                      )}
                    </div>
                    <Avatar className="h-14 w-14 border-2 border-cyan-200">
                      <AvatarFallback
                        className={`font-heading text-lg font-bold ${
                          isFirst
                            ? "bg-orange-100 text-orange-700"
                            : "bg-cyan-50 text-cyan-700"
                        }`}
                      >
                        {e.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <Link href={`/company/${e.slug}`} className="mt-3 font-heading text-lg font-bold text-cyan-900 hover:text-cyan-600 transition-colors">
                      {e.company}
                    </Link>
                    <div className="mt-1 font-heading text-3xl font-bold text-cyan-600">
                      {e.givingPct}%
                    </div>
                    <p className="text-sm text-cyan-500">
                      Monthly Recurring Giving
                    </p>
                    <p className="mt-1 text-sm font-medium text-cyan-700">
                      ${(e.amountCents / 100).toLocaleString()}/mo
                    </p>
                    {e.is10PctClub && (
                      <Badge className="mt-3 bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                        10% Club
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Full table */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="grid grid-cols-[3rem_1fr_5rem_6rem] gap-x-4 border-b border-cyan-100 bg-cyan-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-cyan-600 sm:grid-cols-[3rem_1fr_7rem_7rem_7rem]">
              <span>#</span>
              <span>Company</span>
              <span className="text-right">MRG %</span>
              <span className="hidden text-right sm:block">Given/mo</span>
              <span className="text-right">Status</span>
            </div>

            {visible.length === 0 ? (
              <div className="px-6 py-12 text-center text-cyan-500">
                No companies match the current filters.
              </div>
            ) : (
              visible.map((entry, idx) => {
                const categoryInfo = categories.find(
                  (c) => c.slug === entry.category
                );
                return (
                  <div
                    key={entry.slug}
                    className="grid grid-cols-[3rem_1fr_5rem_6rem] items-center gap-x-4 border-b border-cyan-50 px-6 py-4 transition-colors duration-150 hover:bg-cyan-50/40 sm:grid-cols-[3rem_1fr_7rem_7rem_7rem]"
                  >
                    <div className="flex items-center gap-1">
                      {getRankIcon(idx + 1) ?? (
                        <span className="font-heading text-lg font-bold text-cyan-300">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 truncate">
                      <Avatar className="h-8 w-8 shrink-0 border border-cyan-100">
                        <AvatarFallback className="bg-cyan-50 text-cyan-700 text-xs font-bold">
                          {entry.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2 truncate">
                        <Link href={`/company/${entry.slug}`} className="truncate font-medium text-cyan-900 hover:text-cyan-600 transition-colors">
                          {entry.company}
                        </Link>
                        {categoryInfo && (
                          <Link
                            href={`/categories/${categoryInfo.slug}`}
                            className="hidden shrink-0 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-600 hover:bg-cyan-100 transition-colors sm:inline-block cursor-pointer"
                          >
                            {categoryInfo.label}
                          </Link>
                        )}
                      </div>
                    </div>
                    <span className="text-right font-heading text-lg font-bold text-cyan-900">
                      {entry.givingPct}%
                    </span>
                    <span className="hidden text-right text-sm text-cyan-600 sm:block">
                      ${(entry.amountCents / 100).toLocaleString()}/mo
                    </span>
                    <div className="flex justify-end">
                      {entry.is10PctClub ? (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                          10% Club
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="border-cyan-200 bg-cyan-50 text-cyan-600"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Show more button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-6 py-3 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-50 cursor-pointer"
              >
                Show more ({Math.min(PAGE_SIZE, filtered.length - visibleCount)}{" "}
                more startups)
              </button>
            </div>
          )}
          </>
          )}

          <p className="mt-8 text-center text-sm text-cyan-500">
            Rankings update daily based on rolling 30-day net revenue (charges
            minus refunds), verified via Stripe. New members are active from
            their first donation — no waiting for the next calendar month.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
