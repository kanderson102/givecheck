import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Layers,
  ArrowRight,
  CircleDollarSign,
  SplitSquareHorizontal,
  MousePointerClick,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bucket Funds — GiveCheck",
  description:
    "Choose a curated fund and let us distribute your donation across vetted nonprofits in that cause. Pooled giving made simple.",
};

const mockFunds = [
  {
    name: "HtC Commons Fund",
    description:
      "Support hackathon prizes and builder grants through Hack the Commons. Directly funds the next generation of creators.",
  },
  {
    name: "Open Source Fund",
    description:
      "Keep open source alive. Donations distributed to maintainers and projects building the tools we all depend on.",
  },
  {
    name: "Climate Fund",
    description:
      "Fight climate change. Pooled donations go to verified environmental organizations making measurable impact.",
  },
  {
    name: "Education Fund",
    description:
      "Expand access to education worldwide. Supports scholarships, free learning platforms, and teacher programs.",
  },
  {
    name: "Health & Wellness Fund",
    description:
      "Support global health initiatives, mental health programs, and medical research.",
  },
];

const steps = [
  {
    icon: MousePointerClick,
    title: "Choose a Fund",
    description:
      "Pick a curated fund aligned with the cause you care about most.",
    step: "01",
  },
  {
    icon: CircleDollarSign,
    title: "Set Your Amount",
    description:
      "Decide how much to contribute monthly. Every dollar is tax-deductible.",
    step: "02",
  },
  {
    icon: SplitSquareHorizontal,
    title: "We Distribute",
    description:
      "Your donation is split across vetted nonprofits in that fund. Full transparency.",
    step: "03",
  },
];

export default function FundsPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
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
              <Layers className="mr-1.5 h-3.5 w-3.5" />
              Curated Giving
            </Badge>

            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-cyan-950 sm:text-5xl">
              Bucket{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                Funds
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cyan-700 sm:text-xl">
              Don&apos;t know where to give? Choose a curated fund and let us
              distribute your donation across vetted nonprofits in that cause.
            </p>
          </div>
        </div>
      </section>

      {/* Fund cards grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockFunds.map((fund) => (
              <div
                key={fund.name}
                className="group flex flex-col rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-6 transition-all duration-200 hover:shadow-lg hover:border-cyan-200"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors duration-200 group-hover:bg-cyan-100">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-cyan-900">
                  {fund.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-cyan-600">
                  {fund.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <Link
                    href="/#waitlist"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700 cursor-pointer"
                  >
                    Contribute
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="flex items-center gap-1 text-xs text-cyan-400">
                    <ShieldCheck className="h-3 w-3" />
                    Powered by Every.org
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Bucket Funds Work */}
      <section className="border-y border-cyan-100 bg-gradient-to-b from-cyan-50/50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
              How Bucket Funds Work
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cyan-700">
              Three steps to impactful, diversified giving.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((item) => (
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
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/50 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
            Ready to give — without the guesswork?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-cyan-700">
            Bucket Funds launch with GiveCheck. Join the waitlist to be first in
            line.
          </p>
          <Link
            href="/#waitlist"
            className="mt-8 inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cyan-700 cursor-pointer"
          >
            Join the Waitlist
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
