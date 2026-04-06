import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Trophy,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { BadgePreview } from "@/components/badge-preview";
import { RevenueChart } from "@/components/revenue-chart";
import { dashboardStats } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — GiveCheck",
  description: "Manage your verified giving, track your donations, and monitor your leaderboard rank.",
};

export default function DashboardPage() {
  const stats = dashboardStats;

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-cyan-950">
                Dashboard
              </h1>
              <p className="mt-1 text-cyan-600">
                Welcome back, Indie Analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 px-3 py-1">
                <Trophy className="mr-1.5 h-3.5 w-3.5" />
                10% Club Member
              </Badge>
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-cyan-200 text-cyan-700 hover:bg-cyan-50 cursor-pointer"
                )}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Profile
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: DollarSign,
                label: "Current MRR",
                value: `$${stats.currentMrr.toLocaleString()}`,
                sub: "Verified via Stripe",
                accent: false,
              },
              {
                icon: TrendingUp,
                label: "Giving Rate",
                value: `${stats.givingPct}%`,
                sub: "Monthly Recurring Giving",
                accent: true,
              },
              {
                icon: Trophy,
                label: "Leaderboard Rank",
                value: `#${stats.rank}`,
                sub: `of ${stats.totalMembers} members`,
                accent: false,
              },
              {
                icon: Calendar,
                label: "Verified Months",
                value: `${stats.verifiedMonths}`,
                sub: "Consecutive months",
                accent: false,
              },
            ].map((card) => (
              <Card
                key={card.label}
                className={`border transition-shadow duration-200 hover:shadow-md ${
                  card.accent
                    ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
                    : "border-cyan-100 bg-white/80 backdrop-blur-sm"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        card.accent
                          ? "bg-orange-100 text-orange-600"
                          : "bg-cyan-50 text-cyan-600"
                      }`}
                    >
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600">{card.label}</p>
                      <p className="font-heading text-2xl font-bold text-cyan-950">
                        {card.value}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-cyan-500">{card.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Revenue chart placeholder */}
            <Card className="border-cyan-100 bg-white/80 backdrop-blur-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-cyan-900">
                  <BarChart3 className="h-5 w-5 text-cyan-600" />
                  Revenue & Giving History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart data={stats.revenueHistory} />
              </CardContent>
            </Card>

            {/* Badge embed */}
            <Card className="border-cyan-100 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-cyan-900">
                  <ShieldCheck className="h-5 w-5 text-cyan-600" />
                  Your Badge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <BadgePreview
                    percentage={stats.givingPct}
                    companyName="Indie Analytics"
                    is10PctClub
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-cyan-900">
                    Add your badge in 2 steps:
                  </h4>
                  <ol className="space-y-1.5 text-xs text-cyan-700 list-decimal list-inside leading-relaxed">
                    <li>
                      Copy the snippet below and paste it into your website&apos;s
                      HTML where you want the badge to appear (footer, sidebar, or
                      landing page).
                    </li>
                    <li>
                      The badge loads dynamically and updates every month after
                      verification. If your subscription lapses, it grays out
                      automatically.
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg border border-cyan-100 bg-cyan-50/60 p-3">
                  <p className="mb-2 text-xs font-medium text-cyan-700">
                    Embed Code
                  </p>
                  <code className="block break-all text-xs text-cyan-600 leading-relaxed font-mono">
                    {`<div id="givecheck-badge-container" data-slug="indie-analytics"></div>`}
                    <br />
                    {`<script src="https://givecheck.org/api/badge/script.js" async></script>`}
                  </code>
                </div>

                <p className="text-[11px] text-cyan-500 leading-relaxed">
                  Works with any website — HTML, React, WordPress, Webflow, etc.
                  The script is lightweight (&lt;5KB) and loads asynchronously.
                </p>

                <Button className="w-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer">
                  Copy Embed Code
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent donations */}
          <Card className="mt-6 border-cyan-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-lg text-cyan-900">
                <DollarSign className="h-5 w-5 text-cyan-600" />
                Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-cyan-100 hover:bg-transparent">
                    <TableHead className="text-cyan-600">Nonprofit</TableHead>
                    <TableHead className="text-right text-cyan-600">
                      Amount
                    </TableHead>
                    <TableHead className="text-cyan-600">Date</TableHead>
                    <TableHead className="text-right text-cyan-600">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentDonations.map((d) => (
                    <TableRow
                      key={d.id}
                      className="border-cyan-50 hover:bg-cyan-50/40"
                    >
                      <TableCell className="font-medium text-cyan-900">
                        {d.nonprofit}
                      </TableCell>
                      <TableCell className="text-right font-heading font-semibold text-cyan-900">
                        ${(d.amount / 100).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-cyan-600">
                        {new Date(d.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className="border-green-200 bg-green-50 text-green-700"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
