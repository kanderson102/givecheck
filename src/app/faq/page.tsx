import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  HelpCircle,
  Lock,
  Link2,
  Heart,
  Award,
  CreditCard,
  Rocket,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — GiveCheck",
  description:
    "Everything you need to know about GiveCheck — verified giving for startups and solopreneurs. Connect Stripe, donate to nonprofits, earn your badge.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type FaqItem = { q: string; a: string };

type FaqSection = {
  title: string;
  icon: React.ReactNode;
  items: FaqItem[];
};

const iconClass = "h-5 w-5 text-cyan-500 shrink-0";

const sections: FaqSection[] = [
  {
    title: "Getting Started",
    icon: <HelpCircle className={iconClass} />,
    items: [
      {
        q: "What is GiveCheck?",
        a: "GiveCheck is a verified giving platform for startups and solopreneurs. Connect your Stripe, donate to verified nonprofits, and earn a public badge and leaderboard ranking. It\u2019s like Product Hunt or TrustMRR, but for charitable giving \u2014 verified by API, not self-reported.",
      },
      {
        q: "What is MRG (Monthly Recurring Giving)?",
        a: "MRG is a new metric that tracks the percentage of your monthly revenue that goes to verified charitable donations. Think of it as the giving equivalent of MRR (Monthly Recurring Revenue). It\u2019s verified via API, displayed publicly, and competitive.",
      },
      {
        q: "Is GiveCheck free?",
        a: "Free under $1K MRR. Above that, 0.29% of your verified MRR, capped at $29/month. No hidden fees.",
      },
      {
        q: "How do I join?",
        a: "Sign up for the waitlist. Once onboarded, connect your Stripe account, choose nonprofits to donate to, and start climbing the leaderboard.",
      },
      {
        q: "Who is GiveCheck for?",
        a: "Primarily solopreneurs and indie hackers making $1K\u2013$50K+/month who want a systematic, verified way to give back. Also great for small startups and agencies seeking consumer/talent trust signals.",
      },
    ],
  },
  {
    title: "Verification & Privacy",
    icon: <Lock className={iconClass} />,
    items: [
      {
        q: "What data does GiveCheck access?",
        a: "Only aggregate revenue metrics from your Stripe account (total revenue, MRR, charges). We use read-only Stripe Connect access. We never see customer data, payment methods, or personal financial details.",
      },
      {
        q: "How is revenue verified?",
        a: "We pull balance_transactions directly from your Stripe account via read-only API — no manual entry, no self-reporting. Revenue is calculated as gross charges minus refunds (net revenue) over a rolling 30-day window.",
      },
      {
        q: "How often is data updated?",
        a: "Revenue syncs on a rolling 30-day window anchored to your donation date. Your badge and leaderboard position update daily as new transactions come in.",
      },
      {
        q: "What if I just signed up and don't have 30 days of data?",
        a: "No problem — we use whatever transactions exist in your Stripe account from the last 30 days. You can set your giving % and start your first period immediately on Day 1.",
      },
      {
        q: "Is my Stripe data secure?",
        a: "Yes. We use a restricted Stripe API key scoped to Balance \u2192 Read Only. We can only view aggregate revenue data \u2014 we can never make charges, access customer info, or modify your account. Keys are encrypted at rest.",
      },
    ],
  },
  {
    title: "Stripe Connection",
    icon: <Link2 className={iconClass} />,
    items: [
      {
        q: "How do I connect Stripe?",
        a: 'Go to your dashboard and click "Connect Stripe." You\'ll create a restricted API key in your Stripe dashboard (Developers \u2192 API Keys \u2192 Restricted key) with Balance \u2192 Read Only permission, then paste it in. The whole process takes about 2 minutes.',
      },
      {
        q: "What exactly does GiveCheck read from Stripe?",
        a: "Only: balance_transactions (to calculate net revenue = gross charges minus refunds). We do NOT access: customer data, payment methods, payout schedules, or any personal information. The restricted key is scoped to Balance \u2192 Read Only.",
      },
      {
        q: "What if I use multiple payment processors?",
        a: "MVP supports Stripe only. Lemon Squeezy, Gumroad, PayPal, and Shopify support are on the roadmap. If you process revenue through multiple providers, connect your primary one for now.",
      },
      {
        q: "Can I disconnect my Stripe?",
        a: 'Yes, at any time from your dashboard settings or directly from your Stripe account. If disconnected, your badge will display "Unverified" until reconnected.',
      },
    ],
  },
  {
    title: "Donations & Every.org",
    icon: <Heart className={iconClass} />,
    items: [
      {
        q: "How do donations work?",
        a: "All donations route through Every.org, which has 1.2M+ registered 501(c)(3) nonprofits. You choose where to give \u2014 a specific nonprofit, a curated list, or a bucket fund. GiveCheck verifies the donation automatically.",
      },
      {
        q: "Are donations tax-deductible?",
        a: "Yes, 100%. Every.org is a registered 501(c)(3), so you receive an official tax receipt directly from them for every donation. GiveCheck never touches the donation funds.",
      },
      {
        q: "Can I choose any nonprofit?",
        a: "You can search Every.org\u2019s 1.2M+ nonprofit database, use GiveCheck\u2019s curated list, or contribute to a bucket fund. If your preferred nonprofit isn\u2019t on Every.org, you can invite them to join.",
      },
      {
        q: "What are Bucket Funds?",
        a: "Pooled thematic funds (like the HtC Commons Fund, Open Source Fund, or Climate Fund) where your donation is distributed across vetted nonprofits in a specific cause area. Great if you don\u2019t want to research individual charities.",
      },
      {
        q: "Does GiveCheck handle my donation money?",
        a: "No. GiveCheck is a verification platform only. Donations go directly from you to Every.org to the nonprofit. GiveCheck separately charges a small SaaS verification fee via its own Stripe account.",
      },
    ],
  },
  {
    title: "Badges & Leaderboard",
    icon: <Award className={iconClass} />,
    items: [
      {
        q: "What is the GiveCheck badge?",
        a: "A dynamic JavaScript widget you embed on your website that shows your verified giving percentage in real-time. It auto-updates and links to your public GiveCheck profile.",
      },
      {
        q: "How does ranking work?",
        a: "Primary sort is by giving percentage (the great equalizer \u2014 a bootstrapper giving 15% outranks a funded startup at 2%). Ties are broken by absolute dollars given. Rankings update daily based on rolling 30-day net revenue.",
      },
      {
        q: "What is the 10% Club?",
        a: "An exclusive tier for companies donating 10% or more of their gross revenue. The badge gets a distinctive orange treatment and premium leaderboard positioning.",
      },
      {
        q: "What happens if I miss a month?",
        a: 'If your giving verification fails (missed donation, disconnected Stripe, etc.), your badge immediately turns gray and displays "Unverified." Reconnect and resume giving to restore it.',
      },
      {
        q: "Can I use a static screenshot of the badge?",
        a: "No. GiveCheck\u2019s Terms of Service strictly prohibit static badge imagery. The badge must be embedded as a live JS widget to ensure it reflects real-time verification status. Violators receive automated cease & desist notices.",
      },
    ],
  },
  {
    title: "Pricing & Billing",
    icon: <CreditCard className={iconClass} />,
    items: [
      {
        q: "How much does GiveCheck cost?",
        a: "0.29% of your verified monthly MRR, capped at $29/month. Free under $1K MRR. Examples: $5K MRR = $14.50/mo, $10K+ MRR = $29/mo (capped).",
      },
      {
        q: "Is the verification fee separate from my donation?",
        a: "Yes. The GiveCheck platform fee is billed separately from your charitable donation. Your full donation amount goes to the nonprofit.",
      },
      {
        q: "What about companies over $50K MRR?",
        a: "Custom enterprise pricing. Auditing companies at this scale requires resolving multiple payment gateways and complex accounting, so verification requires a customized annual contract.",
      },
      {
        q: "Can I cancel anytime?",
        a: 'Yes. Cancel from your dashboard. Your badge will gray out and display "Unverified" after cancellation.',
      },
    ],
  },
  {
    title: "Future Features",
    icon: <Rocket className={iconClass} />,
    items: [
      {
        q: "Multi-processor support",
        a: "Lemon Squeezy, Gumroad, PayPal, and Shopify integrations are on the roadmap.",
      },
      {
        q: "International currencies",
        a: "Currently US-only charities/tax rules. International support is planned.",
      },
      {
        q: "Public API",
        a: "A developer API for querying verified giving data programmatically.",
      },
      {
        q: "Facilitating company acquisitions",
        a: "A marketplace for listing and acquiring giving-verified startups.",
      },
      {
        q: "Premium analytics",
        a: "Track giving ROI: badge impression traffic, talent acquisition impact.",
      },
      {
        q: "Community voting",
        a: "Vote on which nonprofits get featured in bucket funds.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FaqPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Badge
            variant="secondary"
            className="mb-6 border-cyan-200 bg-cyan-50 text-cyan-700 px-4 py-1.5 text-sm font-medium"
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Knowledge Base
          </Badge>

          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-cyan-950 sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-5 text-lg text-cyan-700/80 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about GiveCheck, verified giving, and
            how to turn your revenue into measurable impact.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-6 space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-5">
                {section.icon}
                <h2 className="font-heading text-xl font-semibold text-cyan-950">
                  {section.title}
                </h2>
              </div>

              {/* Accordion items */}
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl border border-cyan-100 bg-white/60 backdrop-blur-sm transition-all hover:border-cyan-200 hover:shadow-sm open:border-cyan-300 open:bg-white/80 open:shadow-md"
                  >
                    <summary className="flex cursor-pointer select-none items-center justify-between gap-4 px-5 py-4 font-medium text-cyan-950 marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="text-[15px] leading-snug">
                        {item.q}
                      </span>
                      <span className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-500 transition-transform group-open:rotate-45">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transition-transform"
                        >
                          <path
                            d="M6 1v10M1 6h10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-1 text-[15px] leading-relaxed text-cyan-800/80">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-cyan-100 bg-gradient-to-b from-cyan-50/60 to-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-cyan-100 p-3 mb-5">
            <Mail className="h-6 w-6 text-cyan-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-cyan-950">
            Still have questions?
          </h2>
          <p className="mt-3 text-cyan-700/80 leading-relaxed">
            We&apos;d love to hear from you. Reach out and we&apos;ll get back
            to you as soon as possible.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@givecheck.com"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
            >
              <Mail className="h-4 w-4" />
              hello@givecheck.com
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-white px-6 py-3 text-sm font-semibold text-cyan-700 shadow-sm transition-colors hover:bg-cyan-50"
            >
              Contact page
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
