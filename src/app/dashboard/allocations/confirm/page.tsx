"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Info,
  Loader2,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

interface AllocationRow {
  recipientName: string;
  recipientSlug: string;
  recipientType: string;
  allocationPct: number;
}

export default function ConfirmPage() {
  const router = useRouter();
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [pledgePct, setPledgePct] = useState<number | null>(null);
  const [currentMrr, setCurrentMrr] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

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
              if (revData.currentMrr !== undefined) {
                setCurrentMrr(revData.currentMrr);
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
    pledgePct !== null && currentMrr !== null ? (pledgePct / 100) * currentMrr : null;

  // Fee calculation: 0.29% of MRR, capped at $29/mo, free under $1K MRR
  const verificationFeeDollars = (() => {
    if (currentMrr === null) return null;
    if (currentMrr < 1000) return 0;
    return Math.min(currentMrr * 0.0029, 29);
  })();

  async function handleConfirm() {
    setConfirming(true);
    // In the future this creates the actual subscription.
    // For now we just redirect to dashboard with a flag.
    setTimeout(() => {
      router.push("/dashboard?giving=confirmed");
    }, 1000);
  }

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
                Review your giving allocation before going live.
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
                <span className="font-semibold text-cyan-900">{pledgePct ?? "—"}% of net revenue</span>
              </div>
              {totalGivingDollars !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-600">Estimated monthly giving</span>
                  <span className="font-semibold text-cyan-900">
                    ${totalGivingDollars.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {/* Allocation breakdown */}
              <div className="border-t border-cyan-100 pt-3 space-y-2">
                {allocations.map((a) => (
                  <div key={a.recipientSlug} className="flex justify-between text-sm">
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
                      <span className="font-medium text-cyan-900">{a.allocationPct}%</span>
                      {totalGivingDollars !== null && (
                        <span className="text-xs text-cyan-500 ml-2">
                          (${((a.allocationPct / 100) * totalGivingDollars).toLocaleString(undefined, { maximumFractionDigits: 2 })})
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
                      (${totalGivingDollars.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo)
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
                All donations are tax-deductible via Every.org. You&apos;ll receive tax receipts for each donation.
              </p>
            </CardContent>
          </Card>

          {/* Payment Method (UI only) */}
          <Card className="border-cyan-100 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-cyan-900">
                <CreditCard className="h-4 w-4 text-cyan-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-cyan-200 p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-cyan-700 mb-1">
                      Card number
                    </label>
                    <Input
                      placeholder="4242 4242 4242 4242"
                      disabled
                      className="border-cyan-200 bg-cyan-50/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-cyan-700 mb-1">
                        Expiry
                      </label>
                      <Input
                        placeholder="MM / YY"
                        disabled
                        className="border-cyan-200 bg-cyan-50/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-cyan-700 mb-1">
                        CVC
                      </label>
                      <Input
                        placeholder="123"
                        disabled
                        className="border-cyan-200 bg-cyan-50/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-cyan-500">
                Monthly donations will be processed through Every.org on the 1st of each month.
              </p>

              {/* Coming soon banner */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  <strong>Payment processing is coming soon.</strong> Your allocation preferences are
                  saved — we&apos;ll notify you when donations go live.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Confirm button */}
          <Button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer h-12 text-base"
          >
            {confirming ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Confirming…</>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Confirm & Start Giving
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          <p className="text-center text-xs text-cyan-400 mt-3">
            Your badge will show &quot;Pending Verification&quot; until your first 30-day giving period is complete.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
