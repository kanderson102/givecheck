import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BadgePreview } from "@/components/badge-preview";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, ArrowLeft, User, Globe, ExternalLink } from "lucide-react";
import { leaderboardData, categories, founders, companyToFounder, nonprofitNameToSlug } from "@/lib/mock-data";
import { FollowButton } from "@/components/follow-button";
import { DonationPieChart } from "@/components/donation-pie-chart";

export function generateStaticParams() {
  return leaderboardData.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = leaderboardData.find((e) => e.slug === slug);
  if (!company) {
    return { title: "Company Not Found — GiveCheck" };
  }
  return {
    title: `${company.company} — GiveCheck`,
    description: `${company.company} gives ${company.givingPct}% of monthly revenue to nonprofits, verified by GiveCheck.`,
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = leaderboardData.find((e) => e.slug === slug);

  if (!company) {
    notFound();
  }

  const categoryInfo = categories.find((c) => c.slug === company.category);
  const founderSlug = companyToFounder[company.slug];
  const founder = founderSlug ? founders.find((f) => f.slug === founderSlug) : null;

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
                    company.is10PctClub
                      ? "bg-orange-100 text-orange-700"
                      : "bg-cyan-50 text-cyan-700"
                  }`}
                >
                  {company.avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <h1 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
                    {company.company}
                  </h1>
                  {categoryInfo && (
                    <Link
                      href={`/categories/${categoryInfo.slug}`}
                      className="shrink-0 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-medium text-cyan-600 hover:bg-cyan-100 transition-colors cursor-pointer"
                    >
                      {categoryInfo.label}
                    </Link>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="border-cyan-200 bg-cyan-50 text-cyan-700 px-3 py-1"
                  >
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                    Verified by GiveCheck
                  </Badge>
                  <FollowButton targetSlug={company.slug} targetType="company" />
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {(company.description || company.website) && (
            <div className="mt-6 rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-500 mb-3">
                About
              </h2>
              {company.description && (
                <p className="text-cyan-800 leading-relaxed">
                  {company.description}
                </p>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  {company.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {/* Founder */}
          {founder && (
            <div className="mt-6 rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-500 mb-4">
                Founded by
              </h2>
              <Link
                href={`/profile/${founder.slug}`}
                className="flex items-center gap-4 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-heading font-bold text-lg group-hover:bg-cyan-100 transition-colors">
                  {founder.avatarFallback}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-cyan-900 group-hover:text-cyan-600 transition-colors">
                    {founder.name}
                  </p>
                  <p className="text-sm text-cyan-500">{founder.title} · {founder.companySlugs.length} {founder.companySlugs.length === 1 ? "company" : "companies"}</p>
                </div>
                <User className="h-5 w-5 text-cyan-400 group-hover:text-cyan-600 transition-colors" />
              </Link>
            </div>
          )}

          {/* Stats cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                MRG %
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                {company.givingPct}%
              </p>
              <p className="mt-1 text-xs text-cyan-500">
                Monthly Recurring Giving
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Given/mo
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                ${(company.amountCents / 100).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-cyan-500">Verified amount</p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Overall Rank
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-cyan-900">
                #{company.rank}
              </p>
              <p className="mt-1 text-xs text-cyan-500">On the leaderboard</p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                Status
              </p>
              <div className="mt-2 flex justify-center">
                {company.is10PctClub ? (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-sm px-3 py-1">
                    10% Club
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="border-cyan-200 bg-cyan-50 text-cyan-600 text-sm px-3 py-1"
                  >
                    Verified
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-cyan-500">
                {company.is10PctClub
                  ? "Elite giving tier"
                  : "Active verification"}
              </p>
            </div>
          </div>

          {/* Donation Breakdown */}
          {company.nonprofitDonations && company.nonprofitDonations.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
                Where the Money Goes
              </h2>
              <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8">
                <DonationPieChart
                  donations={company.nonprofitDonations}
                  totalCents={company.amountCents}
                  linkMap={Object.fromEntries(
                    company.nonprofitDonations!.map((d) => [
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

          {/* Badge Preview */}
          <div className="mt-12">
            <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
              Embeddable Badge
            </h2>
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 flex justify-center">
              <BadgePreview
                percentage={company.givingPct}
                companyName={company.company}
                is10PctClub={company.is10PctClub}
                variant="embed"
                categoryLabel={categoryInfo?.label}
                categoryRank={company.categoryRank}
              />
            </div>
          </div>

          {/* Giving History */}
          <div className="mt-12">
            <h2 className="font-heading text-xl font-bold text-cyan-950 mb-4">
              Giving History
            </h2>
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-8 text-center">
              <p className="text-cyan-500">
                Giving history will appear here once verified.
              </p>
            </div>
          </div>

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
