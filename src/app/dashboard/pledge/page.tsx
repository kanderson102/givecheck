"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2, TrendingUp, Info, DollarSign, Percent } from "lucide-react";

type InputMode = "percent" | "dollar";

export default function PledgePage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<InputMode>("percent");
  const [pledgePct, setPledgePct] = useState("");
  const [dollarAmount, setDollarAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPct, setCurrentPct] = useState<number | null>(null);
  const [currentMrr, setCurrentMrr] = useState<number | null>(null);
  const [hasOpenPeriod, setHasOpenPeriod] = useState(false);
  const [periodEndDate, setPeriodEndDate] = useState<string | null>(null);
  const [nextPct, setNextPct] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch current pledge state + MRR
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/onboarding/company");
        const { company } = await res.json();
        if (company) {
          const pct = company.mrgPledgePct ? Number(company.mrgPledgePct) : null;
          setCurrentPct(pct);
          setNextPct(company.nextMrgPledgePct ? Number(company.nextMrgPledgePct) : null);

          if (company.periodAnchor) {
            const anchor = new Date(company.periodAnchor);
            const end = new Date(anchor.getTime() + 30 * 24 * 60 * 60 * 1000);
            if (end > new Date()) {
              setHasOpenPeriod(true);
              setPeriodEndDate(
                end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              );
            }
          }

          // Fetch MRR if Stripe is connected
          if (company.stripeAccountId) {
            try {
              const revRes = await fetch("/api/dashboard/revenue");
              if (revRes.ok) {
                const revData = await revRes.json();
                if (revData.currentMrr !== undefined) {
                  setCurrentMrr(revData.currentMrr);
                }
              }
            } catch {
              // Revenue endpoint may not exist yet — that's fine
            }
          }
        }
      } finally {
        setInitialLoading(false);
      }
    }
    load();
  }, []);

  // Compute effective percentage from either input mode
  const computedPct = (() => {
    if (inputMode === "percent") {
      return parseFloat(pledgePct);
    }
    const dollars = parseFloat(dollarAmount);
    if (!dollars || !currentMrr || currentMrr <= 0) return NaN;
    return Math.round((dollars / currentMrr) * 10000) / 100; // round to 2 decimals
  })();

  const computedDollars = (() => {
    if (inputMode === "dollar") return parseFloat(dollarAmount);
    const pct = parseFloat(pledgePct);
    if (!pct || !currentMrr) return NaN;
    return Math.round(pct / 100 * currentMrr * 100) / 100;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pct = computedPct;
    if (!pct || pct < 0.1 || pct > 100) {
      setMessage({ type: "error", text: "Please enter a percentage between 0.1 and 100." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/dashboard/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pledgePct: pct }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to set pledge.");

      setMessage({
        type: "success",
        text: data.queued
          ? data.message
          : data.message ?? `Pledge set to ${pct}%! Redirecting to allocations…`,
      });

      // Redirect to allocations page to choose where giving goes
      setTimeout(() => router.push("/dashboard/allocations"), 1500);
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  const parsedPct = computedPct;
  const isDecrease = currentPct !== null && !isNaN(parsedPct) && parsedPct < currentPct;
  const isIncrease = currentPct !== null && !isNaN(parsedPct) && parsedPct > currentPct;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-lg px-6">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-cyan-950 flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-cyan-600" />
              {currentPct !== null ? "Update Your Giving %" : "Set Your Giving %"}
            </h1>
            <p className="mt-1 text-cyan-600">
              Your monthly recurring giving rate, verified via Stripe.
            </p>
          </div>

          {initialLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
            </div>
          ) : (
          <Card className="border-cyan-100">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg text-cyan-900">
                Monthly Recurring Giving (MRG)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Current pledge status */}
              {currentPct !== null && (
                <div className="rounded-lg border border-cyan-200 bg-cyan-50/80 p-4 space-y-1">
                  <p className="text-sm font-medium text-cyan-800">
                    Current pledge: <strong>{currentPct}%</strong>
                  </p>
                  {hasOpenPeriod && periodEndDate && (
                    <p className="text-xs text-cyan-600">
                      Active period ends {periodEndDate}
                    </p>
                  )}
                  {nextPct !== null && (
                    <p className="text-xs text-amber-700">
                      Queued change: decreasing to {nextPct}% next period
                    </p>
                  )}
                </div>
              )}

              <div className="rounded-lg border border-cyan-100 bg-cyan-50/60 p-4 space-y-2 text-sm text-cyan-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-cyan-500" />
                  <div className="space-y-1.5">
                    <p>
                      <strong>How it works:</strong> Your giving % is applied to your last 30 days
                      of net revenue (charges minus refunds). Set it once and it auto-renews every 30 days.
                    </p>
                    <p>
                      <strong>Your period starts</strong> on the day you make your first donation.
                      You can start immediately — we&apos;ll use whatever Stripe revenue exists from the last 30 days.
                    </p>
                    <p>
                      <strong>Changing it:</strong> Increases take effect immediately (without resetting your period). Decreases are queued for the next period (donations are non-refundable).
                    </p>
                  </div>
                </div>
              </div>

              {/* Input mode toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInputMode("percent")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                    inputMode === "percent"
                      ? "bg-cyan-600 text-white"
                      : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
                  }`}
                >
                  <Percent className="h-4 w-4" />
                  Set by %
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMrr && currentMrr > 0) {
                      setInputMode("dollar");
                    }
                  }}
                  disabled={!currentMrr || currentMrr <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                    inputMode === "dollar"
                      ? "bg-cyan-600 text-white"
                      : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <DollarSign className="h-4 w-4" />
                  Set by $
                </button>
              </div>
              {(!currentMrr || currentMrr <= 0) && (
                <p className="text-xs text-cyan-400">
                  Dollar-based pledges require revenue data from Stripe.
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {inputMode === "percent" ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                      {currentPct !== null ? "New giving percentage" : "Giving percentage"}
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        placeholder={currentPct !== null ? `Currently ${currentPct}%` : "e.g. 5"}
                        value={pledgePct}
                        onChange={(e) => setPledgePct(e.target.value)}
                        className="pr-10 border-cyan-200 text-cyan-900"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-cyan-500">
                        %
                      </span>
                    </div>
                    {/* Show dollar equivalent */}
                    {!isNaN(computedDollars) && computedDollars > 0 && currentMrr !== null && (
                      <p className="mt-1.5 text-xs text-cyan-500">
                        Based on your ${currentMrr.toLocaleString()} net revenue, that&apos;s{" "}
                        <strong className="text-cyan-700">${computedDollars.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo</strong> in giving.
                      </p>
                    )}
                    {pledgePct && isNaN(computedDollars) && (
                      <p className="mt-1.5 text-xs text-cyan-500">
                        Example: if your last 30-day net revenue is $10,000, you&apos;d donate{" "}
                        <strong className="text-cyan-700">
                          ${(parseFloat(pledgePct) / 100 * 10000).toLocaleString()}
                        </strong>{" "}
                        per period.
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                      Monthly giving amount
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 500"
                        value={dollarAmount}
                        onChange={(e) => setDollarAmount(e.target.value)}
                        className="pl-7 border-cyan-200 text-cyan-900"
                        required
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-cyan-500">
                        $
                      </span>
                    </div>
                    {!isNaN(computedPct) && computedPct > 0 && currentMrr !== null && (
                      <p className="mt-1.5 text-xs text-cyan-500">
                        That&apos;s <strong className="text-cyan-700">{computedPct}%</strong> of your ${currentMrr.toLocaleString()} net revenue.
                      </p>
                    )}
                    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs text-amber-700">
                        <strong>Note:</strong> If your next month&apos;s net revenue is lower, we&apos;ll reduce the donation proportionally to match.
                      </p>
                    </div>
                  </div>
                )}

                {/* Increase/decrease hints */}
                {!isNaN(parsedPct) && parsedPct > 0 && (
                  <>
                    {isDecrease && hasOpenPeriod && (
                      <p className="text-xs text-amber-600">
                        This is a decrease — it will be queued for your next period.
                      </p>
                    )}
                    {isIncrease && hasOpenPeriod && (
                      <p className="text-xs text-green-600">
                        This is an increase — it takes effect immediately without resetting your period.
                      </p>
                    )}
                  </>
                )}

                {message && (
                  <div className={`flex items-center gap-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {message.type === "success"
                      ? <CheckCircle2 className="h-4 w-4" />
                      : <AlertCircle className="h-4 w-4" />}
                    {message.text}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || isNaN(computedPct) || computedPct <= 0}
                  className="w-full bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
                >
                  {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Setting pledge…</>
                    : currentPct !== null ? "Update Pledge" : "Confirm Pledge"}
                </Button>
              </form>
            </CardContent>
          </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
