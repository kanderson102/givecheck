import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ShieldCheck,
  ArrowLeft,
  Globe,
  ExternalLink,
  Heart,
  Users,
  Target,
} from "lucide-react";
import { nonprofitDetails, leaderboardData } from "@/lib/mock-data";
import { FollowButton } from "@/components/follow-button";
import { DonationPieChart } from "@/components/donation-pie-chart";

export function generateStaticParams() {
  return nonprofitDetails.map((np) => ({ slug: np.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const np = nonprofitDetails.find((n) => n.slug === slug);
  if (!np) {
    return { title: "Nonprofit Not Found — GiveCheck" };
  }
  return {
    title: `${np.name} — GiveCheck`,
    description: `${np.name} — ${np.impactAreas.join(", ")}. See which GiveCheck companies donate to ${np.name}.`,
  };
}

export default async function NonprofitProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const np = nonprofitDetails.find((n) => n.slug === slug);

  if (!np) {
    notFound();
  }

  const currentYear = 2026;
  const yearsActive = currentYear - np.founded;

  // Find all companies that donate to this nonprofit
  const donatingCompanies = leaderboardData
    .filter(
      (company) =>
        company.nonprofitDonations &&
        company.nonprofitDonations.some((d) => d.nonprofit === np.name)
    )
    .map((company) => {
      const donation = company.nonprofitDonations!.find(
        (d) => d.nonprofit === np.name
      )!;
      return { ...company, donationToThis: donation };
    })
    .sort((a, b) => b.donationToThis.amountCents - a.donationToThis.amountCents);

  const totalFromGiveCheck = donatingCompanies.reduce(
    (sum, c) => sum + c.donationToThis.amountCents,
    0
  );

  // Build pie chart data from donating companies
  const chartColors = [
    "#f97316",
    "#06b6d4",
    "#8b5cf6",
    "#22c55e",
    "#ec4899",
    "#eab308",
    "#14b8a6",
    "#f43f5e",
    "#6366f1",
    "#84cc16",
  ];

  const companyDonations = donatingCompanies.map((c, i) => ({
    nonprofit: c.company,
    amountCents: c.donationToThis.amountCents,
    pct: Math.round(
      (c.donationToThis.amountCents / totalFromGiveCheck) * 100
    ),
    color: chartColors[i % chartColors.length],
  }));

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Back link */}
          <Link
            href="/nonprofits"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Nonprofits
          </Link>

          {/* Hero */}
          <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-8 sm:p-10">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
              <Avatar className="h-20 w-20 border-2 border-cyan-200">
                <AvatarFallback className="bg-cyan-50 text-cyan-700 font-heading text-2xl font-bold">
                  {np.avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
                  {np.name}
                </h1>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  {np.impactAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="border-cyan-200 bg-cyan-50 text-cyan-600 px-3 py-1"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="border-cyan-200 bg-cyan-50 text-cyan-700 px-3 py-1"
                  >
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                    501(c)(3) Verified
                  </Badge>
                  <FollowButton targetSlug={np.slug} targetType="company" />
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mt-6 rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-500 mb-3">
              About
            </h2>
            <p className="text-cyan-800 leading-relaxed">{np.description}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                href={np.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors"
              >
                <Globe className="h-4 w-4" />
                {np.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={np.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
              >
                <Heart className="h-3.5 w-3.5" />
                Donate via Every.org
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Founders */}
          <div className="mt-6 rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-500 mb-4">
              {np.founders.length === 1 ? "Founder" : "Founders"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {np.founders.map((founder) => (
                <div
                  key={founder}
                  className="flex items-center gap-3 rounded-lg border border-cyan-100 bg-cyan-50/50 px-4 py-2.5"
                >
                  <Users className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium text-cyan-800">
                    {founder}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Founded
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                {np.founded}
              </p>
              <p className="mt-1 text-xs text-cyan-500">
                {yearsActive} years active
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                From GiveCheck
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                ${(totalFromGiveCheck / 100).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-cyan-500">per month</p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Companies
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                {donatingCompanies.length}
              </p>
              <p className="mt-1 text-xs text-cyan-500">
                donate via GiveCheck
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Total Raised
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                {np.totalRaised ?? "N/A"}
              </p>
              <p className="mt-1 text-xs text-cyan-500">lifetime</p>
            </div>
          </div>

          {/* GiveCheck Donations Breakdown (pie chart) */}
          {companyDonations.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
                GiveCheck Donations Breakdown
              </h2>
              <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8">
                <DonationPieChart
                  donations={companyDonations}
                  totalCents={totalFromGiveCheck}
                  linkMap={Object.fromEntries(
                    donatingCompanies.map((c) => [c.company, `/company/${c.slug}`])
                  )}
                />
              </div>
            </div>
          )}

          {/* Companies that donate - leaderboard table */}
          {donatingCompanies.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
                Companies Donating to {np.name}
              </h2>
              <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm overflow-hidden">
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-100 bg-cyan-50/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-cyan-500">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-cyan-500">
                          Company
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-cyan-500">
                          MRG %
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-cyan-500">
                          Given/mo
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-cyan-500">
                          To {np.name}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-cyan-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {donatingCompanies.map((company) => (
                        <tr
                          key={company.slug}
                          className="border-b border-cyan-50 transition-colors hover:bg-cyan-50/50"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-cyan-600">
                            #{company.rank}
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/company/${company.slug}`}
                              className="flex items-center gap-3 group"
                            >
                              <Avatar className="h-8 w-8 border border-cyan-200">
                                <AvatarFallback
                                  className={`text-xs font-bold ${
                                    company.is10PctClub
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-cyan-50 text-cyan-700"
                                  }`}
                                >
                                  {company.avatarFallback}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-cyan-900 group-hover:text-cyan-600 transition-colors">
                                {company.company}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-cyan-900">
                            {company.givingPct}%
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-cyan-700">
                            $
                            {(company.amountCents / 100).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-cyan-700">
                            $
                            {(
                              company.donationToThis.amountCents / 100
                            ).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {company.is10PctClub ? (
                              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-xs">
                                10% Club
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="border-cyan-200 bg-cyan-50 text-cyan-600 text-xs"
                              >
                                Verified
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-cyan-100">
                  {donatingCompanies.map((company) => (
                    <Link
                      key={company.slug}
                      href={`/company/${company.slug}`}
                      className="flex items-center gap-3 p-4 transition-colors hover:bg-cyan-50/50"
                    >
                      <span className="text-sm font-medium text-cyan-500 w-8">
                        #{company.rank}
                      </span>
                      <Avatar className="h-8 w-8 border border-cyan-200">
                        <AvatarFallback
                          className={`text-xs font-bold ${
                            company.is10PctClub
                              ? "bg-orange-100 text-orange-700"
                              : "bg-cyan-50 text-cyan-700"
                          }`}
                        >
                          {company.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-cyan-900 truncate">
                          {company.company}
                        </p>
                        <p className="text-xs text-cyan-500">
                          {company.givingPct}% MRG · $
                          {(
                            company.donationToThis.amountCents / 100
                          ).toLocaleString()}{" "}
                          to {np.name}
                        </p>
                      </div>
                      {company.is10PctClub ? (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-xs shrink-0">
                          10% Club
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="border-cyan-200 bg-cyan-50 text-cyan-600 text-xs shrink-0"
                        >
                          Verified
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Impact Areas */}
          <div className="mt-12">
            <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
              Impact Areas
            </h2>
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6">
              <div className="flex flex-wrap gap-3">
                {np.impactAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50/50 px-4 py-3"
                  >
                    <Target className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm font-medium text-cyan-800">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back link bottom */}
          <div className="mt-10">
            <Link
              href="/nonprofits"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Nonprofits
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
