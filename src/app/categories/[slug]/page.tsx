import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, ShieldCheck, ArrowLeft } from "lucide-react";
import {
  categories,
  leaderboardData,
  type CompanyCategory,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found — GiveCheck" };
  return {
    title: `${cat.label} — GiveCheck Leaderboard`,
    description: `Top verified giving companies in ${cat.label}. ${cat.description}`,
  };
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
  return null;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const filtered = leaderboardData
    .filter((e) => e.category === (cat.slug as CompanyCategory))
    .sort((a, b) => b.givingPct - a.givingPct || b.amountCents - a.amountCents);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/categories"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>

          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-cyan-200 bg-cyan-50 text-cyan-700 px-3 py-1"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              {cat.label}
            </Badge>
            <h1 className="font-heading text-4xl font-bold text-cyan-950 sm:text-5xl">
              {cat.label} Leaderboard
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-cyan-700">
              {cat.description} Ranked by verified Monthly Recurring Giving
              percentage.
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-12 text-center">
              <p className="text-cyan-600">
                No companies in this category yet. Be the first!
              </p>
              <Link
                href="/#waitlist"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
              >
                Join the Waitlist →
              </Link>
            </div>
          ) : (
            <>
              {/* Podium for top 3 if enough entries */}
              {filtered.length >= 3 && (
                <div className="mt-16 grid gap-4 sm:grid-cols-3">
                  {[1, 0, 2].map((orderIdx) => {
                    const e = filtered[orderIdx];
                    const isFirst = orderIdx === 0;
                    return (
                      <div
                        key={e.slug}
                        className={`relative flex flex-col items-center rounded-2xl border p-6 text-center backdrop-blur-sm transition-shadow duration-200 hover:shadow-lg ${
                          isFirst
                            ? "border-orange-200 bg-gradient-to-b from-orange-50 to-white sm:-mt-4 sm:pb-8"
                            : "border-cyan-200 bg-white/80"
                        }`}
                      >
                        <div className="mb-3">
                          {getRankIcon(orderIdx === 0 ? 1 : orderIdx === 1 ? 2 : 3)}
                        </div>
                        <Avatar className="h-14 w-14 border-2 border-cyan-200">
                          <AvatarFallback
                            className={`font-heading text-lg font-bold ${
                              isFirst
                                ? "bg-orange-100 text-orange-700"
                                : "bg-cyan-50 text-cyan-700"
                            }`}
                          >
                            {e.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="mt-3 font-heading text-lg font-bold text-cyan-900">
                          {e.company}
                        </h3>
                        <div className="mt-1 font-heading text-3xl font-bold text-cyan-600">
                          {e.givingPct}%
                        </div>
                        <p className="text-sm text-cyan-500">
                          Monthly Recurring Giving
                        </p>
                        <p className="mt-1 text-sm font-medium text-cyan-700">
                          ${(e.amountCents / 100).toLocaleString()}/mo
                        </p>
                        {e.is10PctClub && (
                          <Badge className="mt-3 bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                            10% Club
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full table */}
              <div className="mt-12 overflow-hidden rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="grid grid-cols-[3rem_1fr_5rem_6rem] gap-x-4 border-b border-cyan-100 bg-cyan-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-cyan-600 sm:grid-cols-[3rem_1fr_7rem_7rem_7rem]">
                  <span>#</span>
                  <span>Company</span>
                  <span className="text-right">MRG %</span>
                  <span className="hidden text-right sm:block">Given/mo</span>
                  <span className="text-right">Status</span>
                </div>

                {filtered.map((entry, idx) => (
                  <div
                    key={entry.slug}
                    className="grid grid-cols-[3rem_1fr_5rem_6rem] items-center gap-x-4 border-b border-cyan-50 px-6 py-4 transition-colors duration-150 hover:bg-cyan-50/40 sm:grid-cols-[3rem_1fr_7rem_7rem_7rem]"
                  >
                    <div className="flex items-center gap-1">
                      {getRankIcon(idx + 1) ?? (
                        <span className="font-heading text-lg font-bold text-cyan-300">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 truncate">
                      <Avatar className="h-8 w-8 shrink-0 border border-cyan-100">
                        <AvatarFallback className="bg-cyan-50 text-cyan-700 text-xs font-bold">
                          {entry.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate font-medium text-cyan-900">
                        {entry.company}
                      </span>
                    </div>
                    <span className="text-right font-heading text-lg font-bold text-cyan-900">
                      {entry.givingPct}%
                    </span>
                    <span className="hidden text-right text-sm text-cyan-600 sm:block">
                      ${(entry.amountCents / 100).toLocaleString()}/mo
                    </span>
                    <div className="flex justify-end">
                      {entry.is10PctClub ? (
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
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="mt-8 text-center text-sm text-cyan-500">
            Rankings update on the 1st of each month after automated
            verification.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
