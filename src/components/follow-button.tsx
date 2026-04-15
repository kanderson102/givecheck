"use client";

import dynamic from "next/dynamic";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  targetSlug: string;
  targetType: "company" | "person" | "nonprofit";
  className?: string;
}

function FollowButtonFallback({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-cyan-600 text-white",
        className
      )}
    >
      <Heart className="h-4 w-4" />
      Follow
    </span>
  );
}

export const FollowButton = dynamic(
  () => import("@/components/follow-button-inner"),
  {
    ssr: false,
    loading: () => <FollowButtonFallback />,
  }
) as React.ComponentType<FollowButtonProps>;

export { useFollows, refreshFollows } from "@/components/follow-button-inner";
