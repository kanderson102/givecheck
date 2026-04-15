import { ShieldCheck } from "lucide-react";

interface BadgePreviewProps {
  percentage: number;
  companyName: string;
  is10PctClub?: boolean;
  variant?: "onsite" | "embed";
  categoryLabel?: string;
  categoryRank?: number;
  /** Badge verification status. Defaults to "verified" for backward compatibility (public profiles). */
  status?: "verified" | "pending" | "inactive";
}

export function BadgePreview({
  percentage,
  companyName,
  is10PctClub,
  variant = "onsite",
  categoryLabel,
  categoryRank,
  status = "verified",
}: BadgePreviewProps) {
  const isEmbed = variant === "embed";
  const isVerified = status === "verified";
  const isPending = status === "pending";

  const shieldGradient = isVerified
    ? is10PctClub
      ? "bg-gradient-to-br from-orange-400 to-orange-600"
      : "bg-gradient-to-br from-cyan-400 to-cyan-600"
    : "bg-gradient-to-br from-gray-300 to-gray-400";

  const containerClass = isVerified
    ? "border-cyan-200"
    : isPending
      ? "border-gray-200 opacity-80"
      : "border-gray-300 opacity-60";

  const statusText = isVerified
    ? `Verified by GiveCheck · ${companyName}`
    : isPending
      ? `Pending Verification · ${companyName}`
      : "Set up giving to activate";

  return (
    <div className={`inline-flex items-center gap-3 rounded-xl border bg-white/90 backdrop-blur-sm px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer ${containerClass}`}>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${shieldGradient}`}
      >
        <ShieldCheck className="h-5 w-5 text-white" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-heading text-lg font-bold ${isVerified ? "text-cyan-900" : "text-gray-500"}`}>
            {percentage}% Monthly Recurring Giving
          </span>
          {is10PctClub && isVerified && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
              10% Club
            </span>
          )}
        </div>
        {isEmbed && isVerified && categoryRank && categoryLabel ? (
          <div className="flex flex-col">
            <p className="text-xs font-medium text-cyan-700">
              #{categoryRank} on GiveCheck in {categoryLabel}
            </p>
            <p className="text-xs text-cyan-500">
              Verified &middot; {companyName}
            </p>
          </div>
        ) : (
          <p className={`text-xs ${isVerified ? "text-cyan-600" : "text-gray-400"}`}>
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
}
