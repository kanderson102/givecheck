import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShieldCheck,
  Heart,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { nonprofitDetails } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Nonprofits — GiveCheck",
  description:
    "Browse over 1.2 million verified 501(c)(3) nonprofits to donate to via Every.org. Find the perfect cause for your company's giving.",
};

const displayedNonprofits = nonprofitDetails;

const categoryFilters = [
  "Environment",
  "Education",
  "Health",
  "Human Services",
  "Arts & Culture",
  "Animal Welfare",
  "International",
  "Community",
  "Religion",
  "Science",
];

export default function NonprofitsPage() {
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
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Powered by Every.org
            </Badge>

            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-cyan-950 sm:text-5xl">
              Find a Nonprofit to{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                Support
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cyan-700 sm:text-xl">
              Browse 1.2M+ verified 501(c)(3) organizations via Every.org.
              Choose where your giving goes.
            </p>
          </div>

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search nonprofits by name or cause..."
                disabled
                className="w-full rounded-xl border border-cyan-200 bg-white/80 backdrop-blur-sm py-3.5 pl-12 pr-4 text-sm text-cyan-900 placeholder:text-cyan-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-cyan-50 px-2 py-0.5 text-xs text-cyan-500">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                disabled
                className="shrink-0 rounded-full border border-cyan-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-cyan-700 transition-colors hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Nonprofit cards grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedNonprofits.map((np) => (
              <div
                key={np.slug}
                className="group rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-6 transition-all duration-200 hover:shadow-lg hover:border-cyan-200"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors duration-200 group-hover:bg-cyan-100">
                  <Heart className="h-6 w-6" />
                </div>
                <Link href={`/nonprofits/${np.slug}`}>
                  <h3 className="font-heading text-lg font-semibold text-cyan-900 hover:text-cyan-600 transition-colors cursor-pointer">
                    {np.name}
                  </h3>
                </Link>
                <p className="mt-1 text-xs text-cyan-500">
                  Est. {np.founded} · {np.impactAreas[0]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-cyan-600 line-clamp-2">
                  {np.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/nonprofits/${np.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-50 cursor-pointer"
                  >
                    View Profile
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={np.donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700 cursor-pointer"
                  >
                    Donate
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Tax-deductible note */}
          <div className="mt-12 rounded-xl border border-cyan-100 bg-cyan-50/50 backdrop-blur-sm p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-cyan-700">
              <ShieldCheck className="h-5 w-5 text-cyan-600" />
              <p className="text-sm font-medium">
                All donations are processed through Every.org and are fully
                tax-deductible.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <h2 className="font-heading text-2xl font-bold text-cyan-950 sm:text-3xl">
              Can&apos;t find your nonprofit?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-cyan-700">
              Every.org has over 1.2M organizations. Full search will be
              available soon. Join the waitlist to get notified.
            </p>
            <Link
              href="/#waitlist"
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cyan-700 cursor-pointer"
            >
              Join the Waitlist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
