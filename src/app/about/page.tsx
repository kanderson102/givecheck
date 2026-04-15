import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  ShieldCheck,
  Link as LinkIcon,
  DollarSign,
  Eye,
  Trophy,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About — GiveCheck",
  description:
    "Learn about GiveCheck's mission to make Monthly Recurring Giving the next status symbol in tech.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-200/40 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <ShieldCheck className="h-10 w-10 text-cyan-600" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-cyan-950 sm:text-5xl">
              About GiveCheck
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cyan-700 sm:text-xl">
              We believe generosity should be verified, public, and competitive.
              GiveCheck exists to make Monthly Recurring Giving the next status
              symbol in tech.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="mt-20 sm:mt-28">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-heading text-2xl font-bold text-cyan-950 sm:text-3xl">
              The Problem
            </h2>
            <div className="mt-6 space-y-4 text-cyan-800 leading-relaxed">
              <p>
                Founders want to give back. The intention is there. But there is
                no systematic, verified way for startups and solopreneurs to prove
                they are donating a meaningful percentage of revenue to charity.
              </p>
              <p>
                The existing options were built for a different era and a different
                scale:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-900">1% for the Planet</strong>{" "}
                  requires annual dues and is largely self-reported. There is no
                  real-time verification.
                </li>
                <li>
                  <strong className="text-cyan-900">Pledge 1%</strong> is a pledge
                  — not a proof. Companies sign up, but nobody checks if they
                  follow through.
                </li>
                <li>
                  <strong className="text-cyan-900">B Corp Certification</strong>{" "}
                  is expensive, time-consuming, and designed for large
                  organizations with dedicated compliance teams.
                </li>
              </ul>
              <p>
                None of these options work for a bootstrapped founder doing $5K/mo
                who wants to donate 10% and prove it. The bar is either too high,
                too expensive, or entirely based on the honor system.
              </p>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="mt-20 sm:mt-28">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-heading text-2xl font-bold text-cyan-950 sm:text-3xl">
              The Solution
            </h2>
            <div className="mt-6 space-y-4 text-cyan-800 leading-relaxed">
              <p>
                GiveCheck connects directly to the systems that matter: your Stripe
                account for revenue and Every.org for donations. No self-reporting.
                No PDFs. No honor system. Everything is verified through API, every
                month, automatically.
              </p>
              <p>
                The result is a public giving leaderboard where companies are ranked
                by the percentage of revenue they donate — not the dollar amount.
                A bootstrapper giving 15% of $3K/mo outranks a funded startup giving
                2% of $500K/mo. It is the great equalizer.
              </p>
              <p>
                Verified companies earn a dynamic badge widget they embed on their
                website. The badge updates in real-time. If you stop giving, the
                badge grays out. No faking it.
              </p>
              <p className="font-medium text-cyan-900">
                The status game shifts from who earns the most to who gives the
                most.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-20 sm:mt-28">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-heading text-2xl font-bold text-cyan-950 text-center sm:text-3xl">
              How It Works
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: LinkIcon,
                  title: "Connect",
                  desc: "Link your Stripe account via read-only OAuth. We only access aggregate revenue totals.",
                  step: "01",
                },
                {
                  icon: DollarSign,
                  title: "Donate",
                  desc: "Choose from 1.2M+ nonprofits on Every.org. Set up recurring donations that fit your budget.",
                  step: "02",
                },
                {
                  icon: Eye,
                  title: "Verify",
                  desc: "GiveCheck cross-references your revenue and donations automatically each month.",
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

        {/* CTA */}
        <section className="mt-20 sm:mt-28">
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <div className="rounded-2xl border border-cyan-200 bg-gradient-to-b from-cyan-50/80 to-white p-10 sm:p-14">
              <ShieldCheck className="mx-auto h-10 w-10 text-cyan-600 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-cyan-950 sm:text-3xl">
                Ready to make giving your edge?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-cyan-700">
                Join the founders who are turning generosity into a verified,
                public commitment. Free under $1K MRR.
              </p>
              <div className="mt-8">
                <Link
                  href="/#waitlist"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
                >
                  Join the Waitlist
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
