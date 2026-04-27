import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BadgePreview } from "@/components/badge-preview";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Code2,
  ShieldOff,
  Trophy,
  ArrowRight,
  Copy,
} from "lucide-react";

export const metadata = {
  title: "Badge Widget — GiveCheck",
  description:
    "Embed the GiveCheck verified-giving badge on your website. Show visitors your Monthly Recurring Giving commitment with a live, API-verified widget.",
};

export default function BadgePage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Hero */}
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-cyan-200 bg-cyan-50 text-cyan-700 px-3 py-1"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Embeddable Widget
            </Badge>
            <h1 className="font-heading text-4xl font-bold text-cyan-950 sm:text-5xl">
              The GiveCheck Badge
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-cyan-700">
              Embed a live, verified-giving badge on your website. Show
              customers, investors, and the world exactly how much of your
              Monthly Recurring Giving goes to nonprofits — backed by
              API-verified data.
            </p>
          </div>

          {/* Badge Previews */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {/* Onsite variant */}
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <h3 className="font-heading text-lg font-bold text-cyan-900 mb-2">
                Onsite Badge
              </h3>
              <p className="text-sm text-cyan-600 mb-6">
                A compact badge for your marketing site or footer.
              </p>
              <div className="flex justify-center">
                <BadgePreview
                  percentage={12}
                  companyName="Your Company"
                  is10PctClub
                />
              </div>
            </div>

            {/* Embed variant */}
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 text-center">
              <h3 className="font-heading text-lg font-bold text-cyan-900 mb-2">
                Embed Badge
              </h3>
              <p className="text-sm text-cyan-600 mb-6">
                A richer badge with category ranking and verification details.
              </p>
              <div className="flex justify-center">
                <BadgePreview
                  percentage={12}
                  companyName="Your Company"
                  is10PctClub
                  variant="embed"
                  categoryLabel="SaaS"
                  categoryRank={3}
                />
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-20">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="h-5 w-5 text-cyan-600" />
              <h2 className="font-heading text-2xl font-bold text-cyan-950">
                How It Works
              </h2>
            </div>
            <p className="text-cyan-700 mb-6">
              Add two lines of HTML to your site and the badge renders
              automatically. It pulls your latest verified data from the
              GiveCheck API — no build step, no framework dependency.
            </p>
            <div className="relative rounded-xl border border-cyan-200 bg-cyan-950 p-6 overflow-x-auto">
              <div className="absolute top-3 right-3">
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-700 bg-cyan-900 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-800 cursor-pointer">
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
              <pre className="text-sm text-cyan-200 font-mono leading-relaxed">
                <code>{`<div id="givecheck-badge" data-slug="your-company"></div>
<script src="https://givecheck.com/api/badge/script.js" async></script>`}</code>
              </pre>
            </div>
            <p className="mt-4 text-sm text-cyan-500">
              Replace <code className="rounded bg-cyan-50 px-1.5 py-0.5 text-cyan-700 text-xs font-mono">your-company</code> with
              your GiveCheck slug. The script loads asynchronously and won&apos;t
              block page rendering.
            </p>
          </div>

          {/* Badge Enforcement */}
          <div className="mt-20">
            <div className="flex items-center gap-2 mb-6">
              <ShieldOff className="h-5 w-5 text-cyan-600" />
              <h2 className="font-heading text-2xl font-bold text-cyan-950">
                Badge Enforcement
              </h2>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6">
              <p className="text-cyan-700 leading-relaxed">
                The GiveCheck badge is a living proof of your commitment. If your
                subscription lapses or your verified giving drops below the
                threshold, the badge automatically grays out and displays an
                &ldquo;Unverified&rdquo; state. This ensures every badge on the
                web represents an active, honest commitment — not a stale
                screenshot. Re-activate your subscription and your badge goes
                green again within minutes.
              </p>
              <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-300">
                  <ShieldCheck className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Badge grayed out — subscription inactive
                  </p>
                  <p className="text-xs text-slate-400">
                    This is how your badge looks when verification lapses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The 10% Club */}
          <div className="mt-20">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-5 w-5 text-orange-500" />
              <h2 className="font-heading text-2xl font-bold text-cyan-950">
                The 10% Club
              </h2>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white backdrop-blur-sm p-6">
              <p className="text-cyan-700 leading-relaxed">
                Companies that give 10% or more of Monthly Recurring Giving
                earn the exclusive 10% Club badge — a gold-accented shield that
                signals elite-level generosity. It&apos;s the highest tier of
                verified giving on GiveCheck and stands out on leaderboards,
                public profiles, and embedded badges alike. Reach 10% and your
                badge automatically upgrades.
              </p>
              <div className="mt-6 flex justify-center">
                <BadgePreview
                  percentage={12}
                  companyName="10% Club Member"
                  is10PctClub
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white backdrop-blur-sm p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-cyan-950 sm:text-3xl">
              Ready to wear your giving on your sleeve?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-cyan-700">
              Join the waitlist and be among the first to embed a verified
              GiveCheck badge on your site.
            </p>
            <div className="mt-6">
              <Link
                href="/#waitlist"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cyan-700 cursor-pointer"
              >
                Join the Waitlist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
