import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { founders, leaderboardData, nonprofitNameToSlug } from "@/lib/mock-data";
import { FollowButton } from "@/components/follow-button";
import { DonationPieChart } from "@/components/donation-pie-chart";
import type { NonprofitDonation } from "@/lib/mock-data";

export function generateStaticParams() {
  return founders.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const founder = founders.find((f) => f.slug === slug);
  if (!founder) {
    return { title: "Profile Not Found — GiveCheck" };
  }
  return {
    title: `${founder.name} — GiveCheck`,
    description: `${founder.name} gives ${founder.totalGivingPct}% across ${founder.companySlugs.length} companies on GiveCheck.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const founder = founders.find((f) => f.slug === slug);

  if (!founder) {
    notFound();
  }

  const companies = founder.companySlugs
    .map((cs) => leaderboardData.find((e) => e.slug === cs))
    .filter(Boolean) as typeof leaderboardData;

  // Aggregate all nonprofit donations across all companies
  const aggregatedDonationsMap = new Map<string, { amountCents: number; color: string }>();
  let totalDonationCents = 0;
  for (const co of companies) {
    if (co.nonprofitDonations) {
      for (const d of co.nonprofitDonations) {
        const existing = aggregatedDonationsMap.get(d.nonprofit);
        if (existing) {
          existing.amountCents += d.amountCents;
        } else {
          aggregatedDonationsMap.set(d.nonprofit, { amountCents: d.amountCents, color: d.color });
        }
        totalDonationCents += d.amountCents;
      }
    }
  }

  const aggregatedDonations: NonprofitDonation[] = Array.from(aggregatedDonationsMap.entries())
    .sort((a, b) => b[1].amountCents - a[1].amountCents)
    .map(([nonprofit, { amountCents, color }]) => ({
      nonprofit,
      amountCents,
      pct: totalDonationCents > 0 ? Math.round((amountCents / totalDonationCents) * 100) : 0,
      color,
    }));

  const hasAny10PctClub = companies.some((c) => c.is10PctClub);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Back link */}
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leaderboard
          </Link>

          {/* Hero */}
          <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-8 sm:p-10">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
              <Avatar className="h-20 w-20 border-2 border-cyan-200">
                <AvatarFallback
                  className={`font-heading text-2xl font-bold ${
                    hasAny10PctClub
                      ? "bg-orange-100 text-orange-700"
                      : "bg-cyan-50 text-cyan-700"
                  }`}
                >
                  {founder.avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
                  {founder.name}
                </h1>
                <p className="mt-1 text-cyan-600">{founder.title}</p>
                <p className="mt-3 text-cyan-700 leading-relaxed max-w-lg">
                  {founder.bio}
                </p>
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  {hasAny10PctClub && (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 px-3 py-1">
                      10% Club Member
                    </Badge>
                  )}
                  <FollowButton targetSlug={founder.slug} targetType="person" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Avg MRG %
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                {founder.totalGivingPct}%
              </p>
              <p className="mt-1 text-xs text-cyan-500">Across all companies</p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Total Given/mo
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                ${(founder.totalGivingCents / 100).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-cyan-500">Combined monthly</p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Companies
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                {companies.length}
              </p>
              <p className="mt-1 text-xs text-cyan-500">On GiveCheck</p>
            </div>
          </div>

          {/* Companies */}
          <div className="mt-12">
            <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
              Companies
            </h2>
            <div className="space-y-3">
              {companies.map((co) => (
                <Link
                  key={co.slug}
                  href={`/company/${co.slug}`}
                  className="flex items-center gap-4 rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-5 transition-all hover:shadow-md hover:border-cyan-300 group"
                >
                  <Avatar className="h-12 w-12 border border-cyan-200">
                    <AvatarFallback
                      className={`font-heading font-bold ${
                        co.is10PctClub
                          ? "bg-orange-100 text-orange-700"
                          : "bg-cyan-50 text-cyan-700"
                      }`}
                    >
                      {co.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-cyan-900 group-hover:text-cyan-600 transition-colors">
                      {co.company}
                    </p>
                    {co.description && (
                      <p className="text-sm text-cyan-500 truncate mt-0.5">
                        {co.description}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="font-heading text-lg font-bold text-cyan-900">
                        {co.givingPct}%
                      </p>
                      <p className="text-[10px] text-cyan-500">MRG</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cyan-700">
                        ${(co.amountCents / 100).toLocaleString()}/mo
                      </p>
                    </div>
                    {co.is10PctClub ? (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                        10% Club
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="border-cyan-200 bg-cyan-50 text-cyan-600"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Aggregate Donation Breakdown */}
          {aggregatedDonations.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
                Combined Giving Breakdown
              </h2>
              <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8">
                <DonationPieChart
                  donations={aggregatedDonations}
                  totalCents={totalDonationCents}
                  linkMap={Object.fromEntries(
                    aggregatedDonations.map((d) => [
                      d.nonprofit,
                      nonprofitNameToSlug[d.nonprofit]
                        ? `/nonprofits/${nonprofitNameToSlug[d.nonprofit]}`
                        : "",
                    ]).filter(([, href]) => href)
                  )}
                />
              </div>
            </div>
          )}

          {/* Back link bottom */}
          <div className="mt-10">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leaderboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
