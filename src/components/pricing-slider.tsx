"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const FEE_RATE = 0.0029;
const FEE_CAP = 29;
const FREE_THRESHOLD = 1000;

/* ── Anchor points ──────────────────────────────────────
   Each anchor is placed at a fixed % of the slider (0-100)
   so the pill labels always line up with the thumb.        */
const anchors = [
  { pos: 0, mrr: 0, label: "$0" },
  { pos: 25, mrr: 1000, label: "$1K" },
  { pos: 50, mrr: 5000, label: "$5K" },
  { pos: 75, mrr: 10000, label: "$10K" },
  { pos: 100, mrr: 50000, label: "$50K+" },
];

/* ── Piecewise-linear mapping: slider position ↔ MRR ── */
function posToMrr(pos: number): number {
  for (let i = 1; i < anchors.length; i++) {
    if (pos <= anchors[i].pos) {
      const prev = anchors[i - 1];
      const curr = anchors[i];
      const t = (pos - prev.pos) / (curr.pos - prev.pos);
      return Math.round(prev.mrr + t * (curr.mrr - prev.mrr));
    }
  }
  return anchors[anchors.length - 1].mrr;
}

function mrrToPos(mrr: number): number {
  for (let i = 1; i < anchors.length; i++) {
    if (mrr <= anchors[i].mrr) {
      const prev = anchors[i - 1];
      const curr = anchors[i];
      const t = (mrr - prev.mrr) / (curr.mrr - prev.mrr);
      return prev.pos + t * (curr.pos - prev.pos);
    }
  }
  return 100;
}

/* ── Fee logic ────────────────────────────────────────── */
function computeFee(mrr: number): number {
  if (mrr < FREE_THRESHOLD) return 0;
  const raw = Math.min(mrr * FEE_RATE, FEE_CAP);
  return Math.round(raw * 100) / 100; // avoid floating-point artifacts
}

function formatFee(fee: number): string {
  if (fee === 0) return "Free";
  if (fee % 1 === 0) return `$${fee}`;
  return `$${fee.toFixed(2)}`;
}

function formatMrr(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return k % 1 === 0 ? `$${k}K` : `$${k.toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

/* Round to nearest nice step for the given range segment */
function snapMrr(mrr: number): number {
  if (mrr <= 1000) return Math.round(mrr / 50) * 50;
  if (mrr <= 5000) return Math.round(mrr / 100) * 100;
  if (mrr <= 10000) return Math.round(mrr / 250) * 250;
  return Math.round(mrr / 1000) * 1000;
}

export function PricingSlider() {
  const [mrr, setMrr] = useState(5000);
  const fee = computeFee(mrr);
  const isFree = mrr < FREE_THRESHOLD;
  const isEnterprise = mrr >= 50000;
  const isCapped = !isEnterprise && fee >= FEE_CAP;
  const pos = mrrToPos(mrr);

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {/* Fee display */}
      <div className="text-center">
        {isEnterprise ? (
          <>
            <span className="font-heading text-4xl font-bold text-cyan-900">
              Custom Pricing
            </span>
            <p className="mt-2 text-sm text-cyan-700">
              Enterprise &mdash; $50K+ MRR
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-baseline gap-1">
              <span className="font-heading text-5xl font-bold text-cyan-900">
                {isFree ? "Free" : formatFee(fee)}
              </span>
              {!isFree && <span className="text-lg text-cyan-600">/mo</span>}
            </div>
            <p className="mt-2 text-sm text-cyan-700">
              at {formatMrr(mrr)}/mo MRR
              {isCapped && (
                <span className="ml-1.5 inline-block rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 align-middle">
                  CAPPED
                </span>
              )}
            </p>
          </>
        )}
      </div>

      {/* Slider + labels */}
      <div className="px-2">
        <Slider
          value={[pos]}
          onValueChange={(val) => {
            const v = Array.isArray(val) ? val[0] : val;
            if (typeof v === "number") {
              setMrr(snapMrr(posToMrr(v)));
            }
          }}
          min={0}
          max={100}
          step={0.5}
          className="cursor-pointer"
        />

        {/* Clickable anchor pills — positioned to match slider % */}
        <div className="relative mt-4 h-8">
          {anchors.map((anchor) => {
            const isActive =
              anchor.mrr === 0
                ? mrr < FREE_THRESHOLD
                : mrr === anchor.mrr;
            const isAtFree = anchor.mrr < FREE_THRESHOLD;

            return (
              <button
                key={anchor.pos}
                type="button"
                onClick={() => setMrr(anchor.mrr)}
                style={{ left: `${anchor.pos}%` }}
                className={cn(
                  "absolute -translate-x-1/2 text-xs font-medium transition-all duration-200 cursor-pointer rounded-full px-2.5 py-1 whitespace-nowrap",
                  // keep first/last from overflowing
                  anchor.pos === 0 && "translate-x-0",
                  anchor.pos === 100 && "-translate-x-full",
                  isActive
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50"
                )}
              >
                {anchor.label}
                {isAtFree && !isActive && (
                  <span className="ml-1 text-[10px] font-semibold text-green-600">
                    FREE
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Free tier callout */}
      {isFree && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-700">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            <span className="font-semibold">Free forever</span> for companies
            under $1K MRR
          </span>
        </div>
      )}

      {/* Enterprise callout */}
      {isEnterprise && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/80 px-4 py-3 text-sm text-purple-700">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span>
            <span className="font-semibold">Enterprise pricing</span> &mdash;
            contact us for custom plans
          </span>
        </div>
      )}

      {/* Breakdown card */}
      {!isEnterprise && (
        <div className="rounded-xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-cyan-700">Monthly Revenue</span>
            <span className="font-semibold text-cyan-900">
              {formatMrr(mrr)}/mo
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-700">
              Platform Fee
              {!isFree && (
                isCapped
                  ? " (capped at $29)"
                  : " (0.29% of MRR)"
              )}
            </span>
            <span
              className={cn(
                "font-semibold",
                isFree ? "text-green-600" : "text-cyan-900"
              )}
            >
              {isFree ? "Free" : `${formatFee(fee)}/mo`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-700">Example Donation (5% MRG)</span>
            <span className="font-semibold text-cyan-900">
              ${(mrr * 0.05).toLocaleString()}/mo
            </span>
          </div>
          <div className="border-t border-cyan-100 pt-3 flex justify-between">
            <span className="font-medium text-cyan-800">Total Cost</span>
            <span className="font-bold text-cyan-900">
              {isFree
                ? "Just your donation"
                : `${formatFee(fee)}/mo + donation`}
            </span>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-cyan-500">
        0.29% platform fee, capped at $29/mo. Free under $1K MRR. Enterprise
        pricing above $50K. 100% of your donation goes through Every.org for
        full tax deductibility.
      </p>
    </div>
  );
}
