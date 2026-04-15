"use client";

import { useState } from "react";

interface RevenueMonth {
  month: string;
  revenue: number;
  donated: number;
}

/** Smart dollar formatting: $0 | $3 | $500 | $5k | $50k | $1.5M */
function formatDollars(value: number): string {
  if (value === 0) return "$0";
  if (value < 1000) return `$${Math.round(value)}`;
  if (value < 100_000) return `$${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`;
  if (value < 1_000_000) return `$${Math.round(value / 1000)}k`;
  return `$${(value / 1_000_000).toFixed(1)}M`;
}

/** More precise dollar formatting for hover labels */
function formatDollarsDetail(value: number): string {
  if (value === 0) return "$0";
  if (value < 1) return `$${value.toFixed(2)}`;
  if (value < 1000) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (value < 100_000) return `$${(value / 1000).toFixed(2)}k`;
  if (value < 1_000_000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${(value / 1_000_000).toFixed(2)}M`;
}

export function RevenueChart({ data }: { data: RevenueMonth[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxRev = Math.max(...data.map((m) => m.revenue));
  const allZero = maxRev === 0;

  // Generate nice y-axis ticks
  let ticks: number[];
  let yMax: number;

  if (allZero) {
    ticks = [0];
    yMax = 1; // prevents division by zero
  } else {
    const rawStep = maxRev / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = Math.ceil(rawStep / magnitude) * magnitude;
    ticks = [];
    for (let v = 0; v <= maxRev; v += step) {
      ticks.push(v);
    }
    if (ticks[ticks.length - 1] < maxRev) {
      ticks.push(ticks[ticks.length - 1] + step);
    }
    yMax = ticks[ticks.length - 1];
  }

  return (
    <div className="relative">
      {/* Zero-revenue overlay */}
      {allZero && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <p className="text-sm text-cyan-400 bg-white/80 px-4 py-2 rounded-lg">
            No revenue data yet
          </p>
        </div>
      )}

      <div className={allZero ? "opacity-40" : ""}>
        <div className="mt-4 flex h-52">
          {/* Y-axis labels */}
          <div className="flex flex-col-reverse justify-between pr-3 pb-6" style={{ height: "100%" }}>
            {ticks.map((tick) => (
              <span key={tick} className="text-[10px] text-cyan-400 tabular-nums leading-none">
                {formatDollars(tick)}
              </span>
            ))}
          </div>

          {/* Bars */}
          <div className="flex flex-1 items-end gap-3 border-l border-cyan-100">
          {data.map((month, i) => {
            const revHeight = (month.revenue / yMax) * 100;
            const donHeight = (month.donated / yMax) * 100;
            const isActive = hovered === i;

            return (
              <div
                key={month.month}
                className="group flex flex-1 flex-col items-center gap-1 cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Value labels */}
                <div
                  className={`flex w-full justify-between px-0.5 text-[10px] font-semibold transition-opacity duration-150 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-cyan-600">
                    {formatDollarsDetail(month.revenue)}
                  </span>
                  <span className="text-orange-500">
                    {formatDollarsDetail(month.donated)}
                  </span>
                </div>

                <div
                  className="flex w-full items-end gap-1"
                  style={{ height: "160px" }}
                >
                  <div
                    className={`flex-1 rounded-t-md transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-400 shadow-sm"
                        : hovered !== null
                          ? "bg-cyan-100"
                          : "bg-cyan-200"
                    }`}
                    style={{ height: `${revHeight}%` }}
                  />
                  <div
                    className={`flex-1 rounded-t-md transition-all duration-200 ${
                      isActive
                        ? "bg-orange-500 shadow-sm"
                        : hovered !== null
                          ? "bg-orange-200"
                          : "bg-orange-400"
                    }`}
                    style={{ height: `${donHeight}%` }}
                  />
                </div>
                <span
                  className={`text-xs transition-colors duration-150 ${
                    isActive ? "text-cyan-900 font-semibold" : "text-cyan-500"
                  }`}
                >
                  {month.month}
                </span>
              </div>
            );
          })}
          </div>
        </div>

        {/* Tooltip summary for hovered month */}
        <div className="mt-3 h-6 text-center text-xs text-cyan-600">
          {hovered !== null ? (
            <span>
              <span className="font-semibold text-cyan-800">
                {data[hovered].month}
              </span>
              {" — "}
              Revenue:{" "}
              <span className="font-semibold text-cyan-800">
                ${data[hovered].revenue.toLocaleString()}
              </span>
              {" | "}
              Donated:{" "}
              <span className="font-semibold text-orange-600">
                ${data[hovered].donated.toLocaleString()}
              </span>
              {data[hovered].revenue > 0 && (
                <>
                  {" | "}
                  Rate:{" "}
                  <span className="font-semibold text-orange-600">
                    {((data[hovered].donated / data[hovered].revenue) * 100).toFixed(1)}%
                  </span>
                </>
              )}
            </span>
          ) : (
            <span className="text-cyan-400">
              Hover over a month to see details
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-6 text-xs text-cyan-600">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-cyan-200" />
            Revenue
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-orange-400" />
            Donated
          </div>
        </div>
      </div>
    </div>
  );
}
