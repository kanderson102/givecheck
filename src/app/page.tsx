import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PricingSlider } from "@/components/pricing-slider";
import { WaitlistForm } from "@/components/waitlist-form";
import { BadgePreview } from "@/components/badge-preview";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  BarChart3,
  Zap,
  Trophy,
  ArrowRight,
  Link as LinkIcon,
  DollarSign,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { leaderboardData } from "@/lib/mock-data";

export default function Home() {
  const topFive = leaderboardData.slice(0, 5);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 border-cyan-200 bg-cyan-50 text-cyan-700 px-4 py-1.5 text-sm font-medium"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              API-Verified Giving for Founders
            </Badge>

            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-cyan-950 sm:text-5xl lg:text-6xl">
              Make generosity your{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                competitive advantage
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cyan-700 sm:text-xl">
              Connect your Stripe. Donate to verified nonprofits. Earn a public
              badge and climb the giving leaderboard. The status game shifts from
              who earns the most to who gives the most.
            </p>

            <div className="mx-auto mt-10 max-w-md" id="waitlist">
              <WaitlistForm />
              <p className="mt-3 text-xs text-cyan-500">
                Join 200+ founders on the waitlist. Free under $1K MRR.
              </p>
            </div>
          </div>

          {/* Badge showcase */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <BadgePreview
              percentage={15}
              companyName="Pixel Forge"
              is10PctClub
            />
            <BadgePreview
              percentage={10}
              companyName="Shipfast Labs"
              is10PctClub
            />
            <BadgePreview percentage={5} companyName="Nomad Tools" />
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-cyan-100 bg-white/60 backdrop-blur-sm py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
          {[
            { value: "$1.2M+", label: "Verified Giving" },
            { value: "87", label: "Active Members" },
            { value: "100%", label: "API-Verified" },
            { value: "1.2M", label: "Nonprofits Available" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl font-bold text-cyan-900">
                {stat.value}
              </div>
              <div className="text-sm text-cyan-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cyan-700">
              Four steps from signup to a verified badge on your website.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: LinkIcon,
                title: "Connect",
                desc: "Link your Stripe account via read-only OAuth. We only access revenue totals.",
                step: "01",
              },
              {
                icon: DollarSign,
                title: "Donate",
                desc: "Choose from 1.2M nonprofits on Every.org or use curated bucket funds.",
                step: "02",
              },
              {
                icon: Eye,
                title: "Verify",
                desc: "GiveCheck cross-references revenue and donations automatically each month.",
                step: "03",
              },
              {
                icon: Trophy,
                title: "Display",
                desc: "Earn your badge, climb the leaderboard, and show the world you give back.",
                step: "04",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-6 transition-all duration-200 hover:shadow-lg hover:border-cyan-200"
              >
                <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 font-heading text-sm font-bold text-white">
                  {item.step}
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors duration-200 group-hover:bg-cyan-100">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-cyan-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cyan-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-cyan-100 bg-gradient-to-b from-cyan-50/50 to-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
              Why Founders Love GiveCheck
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified, Not Honor System",
                desc: "Revenue and donations are verified via API. No self-reporting, no gaming.",
              },
              {
                icon: BarChart3,
                title: "Public Leaderboard",
                desc: "Compete on giving percentage. A bootstrapper at 15% outranks a funded startup at 2%.",
              },
              {
                icon: Zap,
                title: "Dynamic Badge Widget",
                desc: "Embed a JS badge on your site that updates in real-time. Grays out if you lapse.",
              },
              {
                icon: Trophy,
                title: "The 10% Club",
                desc: "Join the exclusive tier for companies donating 10%+ of gross revenue.",
              },
              {
                icon: CheckCircle2,
                title: "Full Tax Deductibility",
                desc: "Donations route directly through Every.org. You get the 501(c)(3) receipt.",
              },
              {
                icon: DollarSign,
                title: "Scales With You",
                desc: "Free under $1K MRR. Fees scale proportionally with your revenue growth.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-6 transition-all duration-200 hover:shadow-lg hover:border-cyan-200"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-cyan-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cyan-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
              The Giving Leaderboard
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cyan-700">
              Ranked by verified giving percentage. The great equalizer.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="grid grid-cols-[3rem_1fr_5rem_6rem] gap-x-4 border-b border-cyan-100 bg-cyan-50/60 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-cyan-600 sm:grid-cols-[3rem_1fr_6rem_7rem_7rem]">
              <span>#</span>
              <span>Company</span>
              <span className="text-right">MRG %</span>
              <span className="hidden text-right sm:block">Given/mo</span>
              <span className="text-right">Status</span>
            </div>
            {topFive.map((entry) => (
              <div
                key={entry.rank}
                className="grid grid-cols-[3rem_1fr_5rem_6rem] items-center gap-x-4 border-b border-cyan-50 px-6 py-4 transition-colors duration-150 hover:bg-cyan-50/40 sm:grid-cols-[3rem_1fr_6rem_7rem_7rem]"
              >
                <span
                  className={`font-heading text-lg font-bold ${
                    entry.rank <= 3 ? "text-orange-500" : "text-cyan-400"
                  }`}
                >
                  {entry.rank}
                </span>
                <span className="truncate font-medium text-cyan-900">
                  {entry.company}
                </span>
                <span className="text-right font-heading font-bold text-cyan-900">
                  {entry.givingPct}%
                </span>
                <span className="hidden text-right text-sm text-cyan-600 sm:block">
                  ${(entry.amountCents / 100).toLocaleString()}
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

          <div className="mt-6 text-center">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-800 cursor-pointer"
            >
              View Full Leaderboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-y border-cyan-100 bg-gradient-to-b from-cyan-50/50 to-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cyan-700">
              2% of your verified MRR. Free under $1K/mo. Capped at $99/mo.
            </p>
          </div>

          <div className="mt-12">
            <PricingSlider />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/50 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
            Ready to give back — publicly, verifiably?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-cyan-700">
            Join the founders making generosity a habit. Your first month is
            free.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
