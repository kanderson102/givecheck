import { ShieldCheck } from "lucide-react";

interface BadgePreviewProps {
  percentage: number;
  companyName: string;
  is10PctClub?: boolean;
}

export function BadgePreview({
  percentage,
  companyName,
  is10PctClub,
}: BadgePreviewProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-cyan-200 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          is10PctClub
            ? "bg-gradient-to-br from-orange-400 to-orange-600"
            : "bg-gradient-to-br from-cyan-400 to-cyan-600"
        }`}
      >
        <ShieldCheck className="h-5 w-5 text-white" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-heading text-lg font-bold text-cyan-900">
            {percentage}% MRG
          </span>
          {is10PctClub && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
              10% Club
            </span>
          )}
        </div>
        <p className="text-xs text-cyan-600">
          Verified by GiveCheck &middot; {companyName}
        </p>
      </div>
    </div>
  );
}
