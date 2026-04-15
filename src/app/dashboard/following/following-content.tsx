"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Building2, User, ArrowLeft } from "lucide-react";
import { useFollows, FollowButton } from "@/components/follow-button";
import { leaderboardData, founders } from "@/lib/mock-data";

export function FollowingContent() {
  const follows = useFollows();

  const followedCompanies = follows
    .filter((f) => f.type === "company")
    .map((f) => leaderboardData.find((e) => e.slug === f.slug))
    .filter(Boolean) as typeof leaderboardData;

  const followedPeople = follows
    .filter((f) => f.type === "person")
    .map((f) => founders.find((p) => p.slug === f.slug))
    .filter(Boolean) as typeof founders;

  const isEmpty = followedCompanies.length === 0 && followedPeople.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-cyan-950">
            Following
          </h1>
          <p className="mt-1 text-cyan-600">
            Companies and people you follow
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-12 text-center">
          <Heart className="h-12 w-12 text-cyan-200 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-cyan-900 mb-2">
            Not following anyone yet
          </h2>
          <p className="text-cyan-500 max-w-md mx-auto">
            Follow companies and individuals from the leaderboard or their
            profiles to keep track of their giving progress.
          </p>
          <Link
            href="/leaderboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 transition-colors cursor-pointer"
          >
            Browse Leaderboard
          </Link>
        </div>
      ) : (
        <>
          {/* Followed Companies */}
          {followedCompanies.length > 0 && (
            <div className="mb-10">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-cyan-950 mb-4">
                <Building2 className="h-5 w-5 text-cyan-600" />
                Companies ({followedCompanies.length})
              </h2>
              <div className="space-y-3">
                {followedCompanies.map((co) => (
                  <div
                    key={co.slug}
                    className="flex items-center gap-4 rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-5"
                  >
                    <Link href={`/company/${co.slug}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 border border-cyan-200">
                        <AvatarFallback
                          className={`font-heading font-bold text-sm ${
                            co.is10PctClub
                              ? "bg-orange-100 text-orange-700"
                              : "bg-cyan-50 text-cyan-700"
                          }`}
                        >
                          {co.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-cyan-900 hover:text-cyan-600 transition-colors">
                          {co.company}
                        </p>
                        <p className="text-sm text-cyan-500">
                          {co.givingPct}% MRG · ${(co.amountCents / 100).toLocaleString()}/mo
                        </p>
                      </div>
                    </Link>
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      {co.is10PctClub && (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                          10% Club
                        </Badge>
                      )}
                      <FollowButton targetSlug={co.slug} targetType="company" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Followed People */}
          {followedPeople.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-cyan-950 mb-4">
                <User className="h-5 w-5 text-cyan-600" />
                People ({followedPeople.length})
              </h2>
              <div className="space-y-3">
                {followedPeople.map((person) => (
                  <div
                    key={person.slug}
                    className="flex items-center gap-4 rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-5"
                  >
                    <Link href={`/profile/${person.slug}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 border border-cyan-200">
                        <AvatarFallback className="bg-cyan-50 text-cyan-700 font-heading font-bold text-sm">
                          {person.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-cyan-900 hover:text-cyan-600 transition-colors">
                          {person.name}
                        </p>
                        <p className="text-sm text-cyan-500">
                          {person.title} · {person.companySlugs.length} {person.companySlugs.length === 1 ? "company" : "companies"} · {person.totalGivingPct}% avg MRG
                        </p>
                      </div>
                    </Link>
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <FollowButton targetSlug={person.slug} targetType="person" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
