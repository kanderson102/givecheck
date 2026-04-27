"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Info,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface AllocationRow {
  recipientName: string;
  recipientSlug: string;
  recipientType: string;
  allocationPct: number;
}

interface DonationIntent {
  recipientName: string;
  recipientSlug: string;
  recipientType: string;
  allocationPct: number;
  amountCents: number;
  amountDollars: number;
  donationUrl: string | null;
  supportedForDirectDonation: boolean;
}

export default function ConfirmPage() {
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [pledgePct, setPledgePct] = useState<number | null>(null);
  const [currentMrrCents, setCurrentMrrCents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [intents, setIntents] = useState<DonationIntent[]>([]);
  const [intentsError, setIntentsError] = useState<string | null>(null);
  const [clicked, setClicked] = useState<Set<string>>(new Set());

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

        const { allocations: rows } = await allocRes.json();
        if (rows) setAllocations(rows);

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
            // Fine
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalGivingDollars =
    pledgePct !== null && currentMrrCents !== null
      ? (pledgePct / 100) * (currentMrrCents / 100)
      : null;

  // Fee calculation: 0.29% of MRR, capped at $29/mo, free under $1K MRR
  const verificationFeeDollars = (() => {
    if (currentMrrCents === null) return null;
    const mrrDollars = currentMrrCents / 100;
    if (mrrDollars < 1000) return 0;
    return Math.min(mrrDollars * 0.0029, 29);
  })();

  async function handleGenerate() {
    setGenerating(true);
    setIntentsError(null);
    try {
      const res = await fetch("/api/donations/process", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setIntentsError(data.error || "Failed to generate donation links.");
        return;
      }
      setIntents(data.intents || []);
    } catch {
      setIntentsError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function markClicked(slug: string) {
    setClicked((prev) => new Set(prev).add(slug));
  }

  const allSupported = intents.filter((i) => i.supportedForDirectDonation);
  const allClicked =
    allSupported.length > 0 &&
    allSupported.every((i) => clicked.has(i.recipientSlug));

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

  if (allocations.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="mx-auto max-w-lg px-6 text-center">
            <p className="text-cyan-600 mb-4">No allocations found.</p>
            <Link
              href="/dashboard/allocations"
              className="text-sm text-cyan-600 underline"
            >
              Go back and set up your allocations
            </Link>
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
        <div className="mx-auto max-w-2xl px-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link
              href="/dashboard/allocations"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-heading text-3xl font-bold text-cyan-950">
                Review & Confirm
              </h1>
              <p className="mt-1 text-cyan-600">
                Review your giving allocation, then set up monthly donations on Every.org.
              </p>
            </div>
          </div>

          {/* Summary */}
          <Card className="border-cyan-100 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                <ShieldCheck className="h-4 w-4 text-cyan-600" />
                Giving Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-600">Your pledge</span>
                <span className="font-semibold text-cyan-900">
                  {pledgePct ?? "—"}% of net revenue
                </span>
              </div>
              {totalGivingDollars !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-600">Estimated monthly giving</span>
                  <span className="font-semibold text-cyan-900">
                    $
                    {totalGivingDollars.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              {/* Allocation breakdown */}
              <div className="border-t border-cyan-100 pt-3 space-y-2">
                {allocations.map((a) => (
                  <div
                    key={a.recipientSlug}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-800">{a.recipientName}</span>
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
                    <div className="text-right">
                      <span className="font-medium text-cyan-900">
                        {a.allocationPct}%
                      </span>
                      {totalGivingDollars !== null && (
                        <span className="text-xs text-cyan-500 ml-2">
                          ($
                          {((a.allocationPct / 100) * totalGivingDollars).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          )}
                          )
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-cyan-200 pt-3 flex justify-between text-sm font-semibold">
                <span className="text-cyan-900">Total</span>
                <div className="text-right">
                  <span className="text-cyan-900">100%</span>
                  {totalGivingDollars !== null && (
                    <span className="text-cyan-600 ml-2">
                      ($
                      {totalGivingDollars.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      /mo)
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fees */}
          <Card className="border-cyan-100 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                <Info className="h-4 w-4 text-cyan-600" />
                Fees & Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-cyan-600">GiveCheck verification fee</span>
                <span className="text-cyan-900">
                  {verificationFeeDollars !== null
                    ? verificationFeeDollars === 0
                      ? "Free (under $1K MRR)"
                      : `$${verificationFeeDollars.toFixed(2)}/mo`
                    : "0.29% of MRR, capped at $29/mo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-600">Donation processing</span>
                <span className="text-cyan-900">Handled by Every.org</span>
              </div>
              <p className="text-xs text-cyan-500 pt-1 border-t border-cyan-100">
                All donations are tax-deductible via Every.org. You&apos;ll receive a tax
                receipt directly from Every.org for every donation.
              </p>
            </CardContent>
          </Card>

          {/* Donation links step */}
          {intents.length === 0 ? (
            <Card className="border-cyan-100 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                  <Sparkles className="h-4 w-4 text-cyan-600" />
                  Set up your monthly donations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-cyan-700">
                  We&apos;ll generate a pre-filled Every.org donation link for
                  each nonprofit in your allocation. You&apos;ll complete payment
                  on Every.org — one recurring donation per nonprofit, billed
                  directly to the charity.
                </p>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer h-12 text-base"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Preparing your donation links…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate donation links
                    </>
                  )}
                </Button>
                {intentsError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">{intentsError}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-cyan-100 mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                    <Sparkles className="h-4 w-4 text-cyan-600" />
                    Start your monthly donations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-cyan-700">
                    Click each button below to set up a monthly recurring donation
                    on Every.org. Each link is pre-filled with the correct amount.
                    Return here when done.
                  </p>

                  <div className="space-y-2">
                    {intents.map((intent) => {
                      const isClicked = clicked.has(intent.recipientSlug);

                      return (
                        <div
                          key={intent.recipientSlug}
                          className="flex items-center justify-between gap-3 rounded-lg border border-cyan-100 bg-white p-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium text-cyan-900">
                                {intent.recipientName}
                              </span>
                              <span
                                className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                  intent.recipientType === "bucket_fund"
                                    ? "bg-orange-50 text-orange-600"
                                    : "bg-cyan-50 text-cyan-600"
                                }`}
                              >
                                {intent.recipientType === "bucket_fund"
                                  ? "Fund"
                                  : "Nonprofit"}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-cyan-600">
                              ${intent.amountDollars.toFixed(2)}/mo ·{" "}
                              {intent.allocationPct}% of giving
                            </p>
                          </div>

                          {intent.supportedForDirectDonation && intent.donationUrl ? (
                            <a
                              href={intent.donationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => markClicked(intent.recipientSlug)}
                              className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                isClicked
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-cyan-600 text-white hover:bg-cyan-700"
                              }`}
                            >
                              {isClicked ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Opened
                                </>
                              ) : (
                                <>
                                  Set up
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </>
                              )}
                            </a>
                          ) : (
                            <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                              <Info className="h-3.5 w-3.5" />
                              Processed internally
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {intents.some((i) => !i.supportedForDirectDonation) && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        Bucket funds are distributed internally by GiveCheck — you&apos;ll
                        be billed monthly via a separate invoice once bucket fund
                        administration is live.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card
                className={`mb-6 border-2 ${
                  allClicked ? "border-green-300 bg-green-50" : "border-cyan-100"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`h-5 w-5 flex-shrink-0 ${
                        allClicked ? "text-green-600" : "text-cyan-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-cyan-900">
                        {allClicked
                          ? "All donation links opened."
                          : "Open each donation link above."}
                      </p>
                      <p className="mt-0.5 text-xs text-cyan-600">
                        Once you&apos;ve completed setup on Every.org for each
                        nonprofit, return to your dashboard. We&apos;ll verify your
                        first giving period in 30 days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link
                href="/dashboard?giving=confirmed"
                className={`flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium transition-colors ${
                  allClicked
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
                {allClicked ? "Done — go to dashboard" : "Back to dashboard"}
              </Link>
              <p className="text-center text-xs text-cyan-400 mt-3">
                Your badge will show &quot;Pending Verification&quot; until your first
                30-day giving period is complete.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
