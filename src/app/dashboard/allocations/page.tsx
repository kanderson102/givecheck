"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useFollows } from "@/components/follow-button";
import {
  ArrowLeft,
  Search,
  Plus,
  X,
  Loader2,
  Heart,
  Boxes,
  Globe,
  ArrowRight,
  Info,
} from "lucide-react";

// ── Bucket Funds ──────────────────────────────────────────────────
const BUCKET_FUNDS = [
  {
    name: "HtC Commons Fund",
    slug: "htc-commons-fund",
    description:
      "Support hackathon prizes and builder grants through Hack the Commons.",
  },
  {
    name: "Open Source Fund",
    slug: "open-source-fund",
    description:
      "Keep open source alive. Donations distributed to maintainers and projects.",
  },
  {
    name: "Climate Fund",
    slug: "climate-fund",
    description:
      "Fight climate change with pooled donations to verified environmental orgs.",
  },
  {
    name: "Education Fund",
    slug: "education-fund",
    description:
      "Expand access to education worldwide — scholarships, platforms, and programs.",
  },
  {
    name: "Health & Wellness Fund",
    slug: "health-wellness-fund",
    description:
      "Support global health initiatives, mental health programs, and medical research.",
  },
];

const CAUSE_CATEGORIES = [
  "education",
  "environment",
  "health",
  "animals",
  "arts-culture",
  "human-services",
  "international",
  "poverty",
  "civil-rights",
  "youth-development",
  "housing",
  "veterans",
  "disaster-relief",
  "mental-health",
];

interface AllocationEntry {
  recipientName: string;
  recipientSlug: string;
  recipientType: "nonprofit" | "bucket_fund";
  allocationPct: number;
}

interface SearchResult {
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  impactAreas: string[];
  everyOrgUrl: string;
}

export default function AllocationsPage() {
  const router = useRouter();
  const follows = useFollows();
  const followedNonprofits = follows.filter((f) => f.type === "nonprofit");

  // ── State ──────────────────────────────────────────────────────
  const [allocations, setAllocations] = useState<AllocationEntry[]>([]);
  const [pledgePct, setPledgePct] = useState<number | null>(null);
  const [currentMrrCents, setCurrentMrrCents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCause, setSearchCause] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // ── Load existing data ─────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [companyRes, allocRes] = await Promise.all([
          fetch("/api/onboarding/company"),
          fetch("/api/dashboard/allocations"),
        ]);

        const { company } = await companyRes.json();
        if (company?.mrgPledgePct) {
          setPledgePct(Number(company.mrgPledgePct));
        }

        const { allocations: existing } = await allocRes.json();
        if (existing && existing.length > 0) {
          setAllocations(
            existing.map(
              (a: {
                recipientName: string;
                recipientSlug: string;
                recipientType: string;
                allocationPct: number;
              }) => ({
                recipientName: a.recipientName,
                recipientSlug: a.recipientSlug,
                recipientType: a.recipientType as "nonprofit" | "bucket_fund",
                allocationPct: a.allocationPct,
              })
            )
          );
        }

        // Try to get MRR
        if (company?.stripeAccountId) {
          try {
            const revRes = await fetch("/api/dashboard/revenue");
            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData.currentMrrCents !== undefined) {
                setCurrentMrrCents(revData.currentMrrCents);
              }
            }
          } catch {
            // Fine — revenue endpoint may not exist
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Computed values ────────────────────────────────────────────
  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocationPct, 0);
  const currentMrrDollars =
    currentMrrCents !== null ? currentMrrCents / 100 : null;
  const totalGivingDollars =
    pledgePct !== null && currentMrrDollars !== null
      ? (pledgePct / 100) * currentMrrDollars
      : null;
  const isComplete = totalAllocated === 100;

  // ── Search handler ─────────────────────────────────────────────
  const handleSearch = useCallback(
    async (q?: string, cause?: string) => {
      const query = q ?? searchQuery;
      const causeFilter = cause ?? searchCause;
      if (!query.trim() && !causeFilter) return;

      setSearching(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (causeFilter) params.set("cause", causeFilter);
        params.set("take", "20");

        const res = await fetch(`/api/nonprofits/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.nonprofits ?? []);
        }
      } catch {
        // Silently fail
      } finally {
        setSearching(false);
      }
    },
    [searchQuery, searchCause]
  );

  // ── Add/remove/update allocations ──────────────────────────────
  function addRecipient(
    name: string,
    slug: string,
    type: "nonprofit" | "bucket_fund"
  ) {
    if (allocations.some((a) => a.recipientSlug === slug)) return; // already added
    setAllocations((prev) => [
      ...prev,
      { recipientName: name, recipientSlug: slug, recipientType: type, allocationPct: 1 },
    ]);
  }

  function removeRecipient(slug: string) {
    setAllocations((prev) => prev.filter((a) => a.recipientSlug !== slug));
  }

  function updatePct(slug: string, pct: number) {
    setAllocations((prev) =>
      prev.map((a) => (a.recipientSlug === slug ? { ...a, allocationPct: pct } : a))
    );
  }

  // ── Save ───────────────────────────────────────────────────────
  async function handleSave() {
    if (!isComplete) return;
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/dashboard/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allocations }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save.");

      router.push("/dashboard/allocations/confirm");
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save allocations.");
    } finally {
      setSaving(false);
    }
  }

  const isAdded = (slug: string) => allocations.some((a) => a.recipientSlug === slug);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-heading text-3xl font-bold text-cyan-950">
              Allocate Your Giving
            </h1>
          </div>

          {/* Context bar */}
          <div className="mb-8 rounded-xl border border-cyan-200 bg-cyan-50/80 p-4 space-y-1">
            {pledgePct !== null && (
              <p className="text-sm font-medium text-cyan-800">
                Your pledge: <strong>{pledgePct}%</strong> of net revenue
              </p>
            )}
            {totalGivingDollars !== null && (
              <p className="text-sm text-cyan-600">
                Based on your last 30 days: <strong>${currentMrrDollars!.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong> net
                revenue → <strong>${totalGivingDollars.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo</strong> in giving
              </p>
            )}
            <p className="text-xs text-cyan-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Dollar amounts are estimates based on your most recent 30-day revenue.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Sources (3/5 width) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Followed Nonprofits */}
              <Card className="border-cyan-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                    <Heart className="h-4 w-4 text-cyan-600" />
                    Your Followed Nonprofits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {followedNonprofits.length === 0 ? (
                    <p className="text-sm text-cyan-400 py-2">
                      Follow nonprofits from the{" "}
                      <Link href="/nonprofits" className="underline text-cyan-600">
                        directory
                      </Link>{" "}
                      to see them here.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {followedNonprofits.map((f) => (
                        <div
                          key={f.slug}
                          className="flex items-center justify-between rounded-lg border border-cyan-100 px-3 py-2"
                        >
                          <span className="text-sm text-cyan-800 font-medium">
                            {f.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isAdded(f.slug)}
                            onClick={() =>
                              addRecipient(
                                f.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                                f.slug,
                                "nonprofit"
                              )
                            }
                            className="h-7 px-2.5 text-xs border-cyan-200 text-cyan-700 cursor-pointer disabled:opacity-40"
                          >
                            {isAdded(f.slug) ? "Added" : <><Plus className="h-3 w-3 mr-1" />Add</>}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bucket Funds */}
              <Card className="border-cyan-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                    <Boxes className="h-4 w-4 text-cyan-600" />
                    Bucket Funds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {BUCKET_FUNDS.map((fund) => (
                      <div
                        key={fund.slug}
                        className="flex items-start gap-3 rounded-lg border border-cyan-100 px-3 py-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-cyan-800">{fund.name}</p>
                          <p className="text-xs text-cyan-500 mt-0.5">{fund.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isAdded(fund.slug)}
                          onClick={() => addRecipient(fund.name, fund.slug, "bucket_fund")}
                          className="h-7 px-2.5 text-xs border-cyan-200 text-cyan-700 cursor-pointer flex-shrink-0 disabled:opacity-40"
                        >
                          {isAdded(fund.slug) ? "Added" : <><Plus className="h-3 w-3 mr-1" />Add</>}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Search Nonprofits */}
              <Card className="border-cyan-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                    <Globe className="h-4 w-4 text-cyan-600" />
                    Search Nonprofits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
                      <Input
                        placeholder="Search by name or keyword…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-9 border-cyan-200 text-cyan-900"
                      />
                    </div>
                    <Button
                      onClick={() => handleSearch()}
                      disabled={searching}
                      className="bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer"
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </div>

                  {/* Cause filter pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {CAUSE_CATEGORIES.map((cause) => (
                      <button
                        key={cause}
                        type="button"
                        onClick={() => {
                          const next = searchCause === cause ? "" : cause;
                          setSearchCause(next);
                          handleSearch(searchQuery, next);
                        }}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          searchCause === cause
                            ? "bg-cyan-600 text-white"
                            : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border border-cyan-200"
                        }`}
                      >
                        {cause.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>

                  {/* Results */}
                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {searchResults.map((np) => (
                        <div
                          key={np.slug}
                          className="flex items-start gap-3 rounded-lg border border-cyan-100 px-3 py-2.5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-cyan-800">{np.name}</p>
                            <p className="text-xs text-cyan-500 mt-0.5 line-clamp-2">
                              {np.description}
                            </p>
                            {np.impactAreas.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {np.impactAreas.slice(0, 3).map((area) => (
                                  <span
                                    key={area}
                                    className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] text-cyan-600"
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isAdded(np.slug)}
                            onClick={() => addRecipient(np.name, np.slug, "nonprofit")}
                            className="h-7 px-2.5 text-xs border-cyan-200 text-cyan-700 cursor-pointer flex-shrink-0 disabled:opacity-40"
                          >
                            {isAdded(np.slug) ? "Added" : <><Plus className="h-3 w-3 mr-1" />Add</>}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Allocation Builder (2/5 width) */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <Card className="border-cyan-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-base text-cyan-900">
                      Allocation Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allocations.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-cyan-400">
                          Add nonprofits or bucket funds from the left to start allocating.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Allocation rows */}
                        <div className="space-y-4">
                          {allocations.map((a) => (
                            <div key={a.recipientSlug} className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm font-medium text-cyan-800 truncate">
                                    {a.recipientName}
                                  </span>
                                  <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                      a.recipientType === "bucket_fund"
                                        ? "bg-orange-50 text-orange-600"
                                        : "bg-cyan-50 text-cyan-600"
                                    }`}
                                  >
                                    {a.recipientType === "bucket_fund" ? "Fund" : "Nonprofit"}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeRecipient(a.recipientSlug)}
                                  className="text-cyan-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <Slider
                                  value={[a.allocationPct]}
                                  min={1}
                                  max={100}
                                  step={1}
                                  onValueChange={(val: number | readonly number[]) =>
                                    updatePct(
                                      a.recipientSlug,
                                      Array.isArray(val) ? val[0] : val
                                    )
                                  }
                                  className="flex-1"
                                />
                                <div className="relative w-16 flex-shrink-0">
                                  <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={a.allocationPct}
                                    onChange={(e) => {
                                      const v = parseInt(e.target.value);
                                      if (!isNaN(v) && v >= 1 && v <= 100) {
                                        updatePct(a.recipientSlug, v);
                                      }
                                    }}
                                    className="h-7 text-xs text-center pr-5 border-cyan-200"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-cyan-400">
                                    %
                                  </span>
                                </div>
                              </div>
                              {totalGivingDollars !== null && (
                                <p className="text-[11px] text-cyan-500">
                                  ≈ $
                                  {((a.allocationPct / 100) * totalGivingDollars).toLocaleString(
                                    undefined,
                                    { maximumFractionDigits: 2 }
                                  )}
                                  /mo
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span
                              className={
                                isComplete ? "text-green-600 font-medium" : "text-cyan-600"
                              }
                            >
                              {totalAllocated}% allocated
                            </span>
                            <span className="text-cyan-400">/ 100% total</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-cyan-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isComplete
                                  ? "bg-green-500"
                                  : totalAllocated > 100
                                    ? "bg-red-500"
                                    : "bg-cyan-500"
                              }`}
                              style={{ width: `${Math.min(totalAllocated, 100)}%` }}
                            />
                          </div>
                          {totalGivingDollars !== null && (
                            <p className="text-xs text-cyan-500 text-right">
                              Total: ${totalGivingDollars.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo
                            </p>
                          )}
                        </div>

                        {/* Warnings */}
                        {totalAllocated > 100 && (
                          <p className="text-xs text-red-500 font-medium">
                            Allocations exceed 100%. Reduce some to continue.
                          </p>
                        )}
                        {totalAllocated > 0 && totalAllocated < 100 && (
                          <p className="text-xs text-amber-600">
                            {100 - totalAllocated}% remaining — add more or adjust sliders.
                          </p>
                        )}

                        {saveError && (
                          <p className="text-xs text-red-500">{saveError}</p>
                        )}

                        <Button
                          onClick={handleSave}
                          disabled={!isComplete || saving}
                          className="w-full bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 cursor-pointer"
                        >
                          {saving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                          ) : (
                            <>Save & Continue <ArrowRight className="ml-2 h-4 w-4" /></>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
