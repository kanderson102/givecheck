"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const tiers = [
  { mrr: 1000, fee: 0, label: "Free" },
  { mrr: 5000, fee: 9, label: "$9/mo" },
  { mrr: 10000, fee: 19, label: "$19/mo" },
  { mrr: 20000, fee: 39, label: "$39/mo" },
  { mrr: 50000, fee: 99, label: "$99/mo" },
];

function formatMrr(value: number) {
  return value >= 1000 ? `$${value / 1000}K` : `$${value}`;
}

export function PricingSlider() {
  const [index, setIndex] = useState(1);
  const tier = tiers[index] ?? tiers[0];

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="text-center">
        <div className="inline-flex items-baseline gap-1">
          <span className="font-heading text-5xl font-bold text-cyan-900">
            {tier.fee === 0 ? "Free" : `$${tier.fee}`}
          </span>
          {tier.fee > 0 && (
            <span className="text-lg text-cyan-600">/mo</span>
          )}
        </div>
        <p className="mt-2 text-sm text-cyan-700">
          at {formatMrr(tier.mrr)}/mo MRR
        </p>
      </div>

      <div className="px-4">
        <Slider
          value={[index]}
          onValueChange={(val) => {
            const v = Array.isArray(val) ? val[0] : val;
            if (typeof v === "number" && v >= 0 && v < tiers.length) {
              setIndex(Math.round(v));
            }
          }}
          min={0}
          max={tiers.length - 1}
          step={1}
          className="cursor-pointer"
        />
        <div className="mt-3 flex justify-between text-xs text-cyan-600">
          {tiers.map((t) => (
            <span key={t.mrr}>{formatMrr(t.mrr)}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-cyan-700">Monthly Revenue</span>
          <span className="font-semibold text-cyan-900">
            {formatMrr(tier.mrr)}/mo
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-cyan-700">Platform Fee (2% of MRR)</span>
          <span className="font-semibold text-cyan-900">
            {tier.fee === 0 ? "Free" : `$${tier.fee}/mo`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-cyan-700">Donation (at 5% MRG)</span>
          <span className="font-semibold text-cyan-900">
            ${(tier.mrr * 0.05).toLocaleString()}/mo
          </span>
        </div>
        <div className="border-t border-cyan-100 pt-3 flex justify-between">
          <span className="text-cyan-700">Processing Fee (1%)</span>
          <span className="font-semibold text-cyan-900">
            ${(tier.mrr * 0.05 * 0.01).toFixed(2)}/mo
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-cyan-500">
        2% verification fee + 1% processing fee on donations. 100% of your
        donation goes through Every.org for full tax deductibility.
      </p>
    </div>
  );
}
