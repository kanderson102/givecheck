import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — GiveCheck",
  description:
    "The most transparent giving leaderboard for startups and indie hackers. Ranked by verified giving percentage.",
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
