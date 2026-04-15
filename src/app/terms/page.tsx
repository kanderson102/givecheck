import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — GiveCheck",
  description:
    "Read the terms and conditions governing use of the GiveCheck platform, badge widget, and verification services.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-8 w-8 text-cyan-600" />
              <h1 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
                Terms of Service
              </h1>
            </div>
            <p className="text-sm text-cyan-500">Last updated: April 2026</p>
          </div>

          <div className="space-y-8 text-cyan-800 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the GiveCheck platform operated by GiveCheck LLC
                (&quot;GiveCheck,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) at givecheck.com, you agree to
                be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to
                these Terms, do not use the Service. We reserve the right to modify
                these Terms at any time, and your continued use of the Service
                constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                2. Description of Service
              </h2>
              <p>
                GiveCheck is a SaaS verification platform for charitable giving. We
                provide API-verified confirmation that companies are donating a
                percentage of their revenue to registered nonprofits. The Service
                includes revenue verification via Stripe Connect, donation verification
                via Every.org, a public giving leaderboard, and an embeddable badge
                widget for verified companies.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                3. Account Registration
              </h2>
              <p>
                To use the Service, you must create an account through our
                authentication provider (Clerk). You are responsible for maintaining
                the confidentiality of your account credentials and for all activities
                that occur under your account. You agree to provide accurate, current,
                and complete information during registration and to update such
                information as necessary.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                4. Badge Widget Usage
              </h2>
              <p className="mb-3">
                The GiveCheck badge is a dynamic JavaScript widget that reflects your
                real-time verification status. By using the badge, you agree to the
                following:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-900">Dynamic display only:</strong>{" "}
                  The badge must be embedded as the provided JavaScript widget. It must
                  not be displayed as a static image, screenshot, or any other
                  non-dynamic format.
                </li>
                <li>
                  <strong className="text-cyan-900">
                    Static screenshots are strictly prohibited:
                  </strong>{" "}
                  Use of screenshots, image captures, or any static reproduction of
                  the GiveCheck badge is a violation of these Terms. The badge is
                  designed to update in real-time to reflect your current verification
                  status, and static reproductions may misrepresent that status.
                </li>
                <li>
                  <strong className="text-cyan-900">Automated enforcement:</strong>{" "}
                  Violators who display static badge screenshots will receive automated
                  cease and desist notices. Continued violations may result in
                  immediate account termination and removal from the leaderboard.
                </li>
                <li>
                  <strong className="text-cyan-900">No modification:</strong>{" "}
                  You may not alter, resize disproportionately, obscure, or modify the
                  badge widget in any way that misrepresents your verification status.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                5. Verification Process
              </h2>
              <p>
                GiveCheck verifies giving exclusively through automated API
                integrations with Stripe (for revenue data) and Every.org (for donation
                data). There are no manual overrides, self-reported figures, or
                exceptions to the verification process. Your giving percentage is
                calculated as verified monthly donations divided by verified Monthly
                Recurring Revenue (MRR), expressed as a percentage.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                6. The 10% Club
              </h2>
              <p>
                Companies that maintain a verified giving percentage of 10% or more of
                gross revenue qualify for &quot;The 10% Club,&quot; an exclusive tier with
                enhanced badge designation and leaderboard recognition. Membership in
                The 10% Club is contingent on continuous verification. If your giving
                percentage falls below 10%, your 10% Club status is automatically
                revoked.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                7. Lapsing and Unverified Status
              </h2>
              <p>
                If GiveCheck is unable to verify your giving for any reason — including
                disconnected Stripe access, lapsed donations, or failed API
                verification — your badge will immediately display an
                &quot;Unverified&quot; status. While in unverified status, your company will not
                appear on the active leaderboard. Verification is restored
                automatically once the underlying issue is resolved and API
                verification succeeds.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                8. Pricing and Payment
              </h2>
              <p className="mb-3">
                GiveCheck pricing is based on your verified Monthly Recurring Revenue
                (MRR):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-900">Free tier:</strong> Companies with
                  MRR under $1,000 use GiveCheck at no cost.
                </li>
                <li>
                  <strong className="text-cyan-900">Standard rate:</strong> 0.29% of
                  your verified MRR per month.
                </li>
                <li>
                  <strong className="text-cyan-900">Monthly cap:</strong> Fees are
                  capped at $29 per month, regardless of MRR.
                </li>
              </ul>
              <p className="mt-3">
                Pricing is subject to change with 30 days&apos; written notice. You
                authorize GiveCheck to charge your payment method on file for
                applicable fees.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                9. Donations and Every.org
              </h2>
              <p>
                All charitable donations facilitated through GiveCheck are routed
                through and processed by Every.org, a registered 501(c)(3) nonprofit
                organization. GiveCheck does not handle, hold, process, or have custody
                of donation funds at any point. Tax-deductible receipts are issued
                directly by Every.org. GiveCheck is not responsible for the tax
                treatment of your donations; consult your tax advisor for guidance.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                10. Intellectual Property
              </h2>
              <p>
                The GiveCheck name, logo, badge design, and all related trademarks,
                service marks, and trade dress are the property of GiveCheck LLC. You
                may not use our marks outside of the authorized badge widget without
                prior written consent. All content, software, and technology powering
                the Service is owned by or licensed to GiveCheck LLC.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                11. Prohibited Conduct
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Misrepresent your verification status or giving percentage
                </li>
                <li>
                  Manipulate revenue or donation data to inflate your leaderboard
                  position
                </li>
                <li>
                  Use static screenshots or reproductions of the GiveCheck badge
                </li>
                <li>
                  Interfere with or disrupt the Service or its underlying
                  infrastructure
                </li>
                <li>
                  Reverse-engineer, decompile, or attempt to extract source code from
                  the Service
                </li>
                <li>
                  Use the Service for any unlawful purpose
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                12. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
                OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, AND NON-INFRINGEMENT. GIVECHECK DOES NOT WARRANT THAT THE
                SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. VERIFICATION
                RESULTS ARE BASED ON DATA PROVIDED BY THIRD-PARTY APIS AND MAY BE
                SUBJECT TO DELAYS OR INACCURACIES BEYOND OUR CONTROL.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                13. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, GIVECHECK LLC AND ITS
                OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL,
                ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE. OUR TOTAL
                LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO GIVECHECK IN THE
                TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                14. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless GiveCheck LLC and its
                officers, directors, employees, and agents from any claims, damages,
                losses, liabilities, and expenses (including reasonable attorneys&apos;
                fees) arising out of or related to your use of the Service, your
                violation of these Terms, or your violation of any rights of a third
                party.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                15. Termination
              </h2>
              <p>
                We may suspend or terminate your access to the Service at any time, for
                any reason, including violation of these Terms. Upon termination, your
                badge will immediately display &quot;Unverified&quot; status and your company
                will be removed from the leaderboard. You may terminate your account at
                any time by contacting us. Sections that by their nature should survive
                termination will survive, including intellectual property, disclaimers,
                limitations of liability, and indemnification.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                16. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the
                laws of the United States. Any disputes arising from these Terms or the
                Service shall be resolved in the federal or state courts of the United
                States, and you consent to the personal jurisdiction of such courts.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                17. Severability
              </h2>
              <p>
                If any provision of these Terms is held to be invalid or unenforceable,
                the remaining provisions shall continue in full force and effect. The
                invalid or unenforceable provision shall be modified to the minimum
                extent necessary to make it valid and enforceable.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                18. Contact Us
              </h2>
              <p>
                If you have questions about these Terms of Service, please contact us
                at:
              </p>
              <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 text-sm">
                <p className="font-semibold text-cyan-900">GiveCheck LLC</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:legal@givecheck.com"
                    className="text-cyan-600 underline hover:text-cyan-800"
                  >
                    legal@givecheck.com
                  </a>
                </p>
                <p>Website: givecheck.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
