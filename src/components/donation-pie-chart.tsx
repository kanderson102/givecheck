"use client";

import { useState } from "react";
import Link from "next/link";
import type { NonprofitDonation } from "@/lib/mock-data";

interface DonationPieChartProps {
  donations: NonprofitDonation[];
  totalCents: number;
  /** Map of label name → href. When provided, names become clickable links. */
  linkMap?: Record<string, string>;
}

export function DonationPieChart({ donations, totalCents, linkMap }: DonationPieChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Build conic gradient segments
  let cumulative = 0;
  const segments = donations.map((d) => {
    const start = cumulative;
    cumulative += d.pct;
    return { ...d, start, end: cumulative };
  });

  const conicGradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.end}%`)
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      {/* Pie */}
      <div className="relative shrink-0">
        <div
          className="h-40 w-40 rounded-full shadow-sm"
          style={{ background: `conic-gradient(${conicGradient})` }}
        />
        {/* Center hole for donut effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-white flex flex-col items-center justify-center">
            {hovered !== null ? (
              <>
                <span className="text-lg font-bold text-cyan-900 font-heading">
                  {donations[hovered].pct}%
                </span>
                <span className="text-[10px] text-cyan-500">
                  ${(donations[hovered].amountCents / 100).toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-cyan-900 font-heading">
                  ${(totalCents / 100).toLocaleString()}
                </span>
                <span className="text-[10px] text-cyan-500">per month</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-1 flex-col gap-2">
        {donations.map((d, i) => {
          const href = linkMap?.[d.nonprofit];
          const nameEl = href ? (
            <Link
              href={href}
              className="text-sm font-medium text-cyan-900 truncate hover:text-cyan-600 transition-colors"
            >
              {d.nonprofit}
            </Link>
          ) : (
            <p className="text-sm font-medium text-cyan-900 truncate">
              {d.nonprofit}
            </p>
          );

          return (
            <div
              key={d.nonprofit}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                href ? "cursor-pointer" : "cursor-default"
              } ${hovered === i ? "bg-cyan-50" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <div className="flex-1 min-w-0">
                {nameEl}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-cyan-900">
                  ${(d.amountCents / 100).toLocaleString()}
                </p>
                <p className="text-[10px] text-cyan-500">{d.pct}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
