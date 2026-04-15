import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — GiveCheck",
  description:
    "Learn how GiveCheck collects, uses, and protects your data. Read our full privacy policy.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-8 w-8 text-cyan-600" />
              <h1 className="font-heading text-3xl font-bold text-cyan-950 sm:text-4xl">
                Privacy Policy
              </h1>
            </div>
            <p className="text-sm text-cyan-500">Last updated: April 2026</p>
          </div>

          <div className="space-y-8 text-cyan-800 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                1. Introduction
              </h2>
              <p>
                GiveCheck LLC (&quot;GiveCheck,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
                website located at givecheck.com (the &quot;Service&quot;). This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information
                when you visit our website or use our platform. By accessing or using
                the Service, you agree to the collection and use of information in
                accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We collect the minimum amount of data necessary to operate the
                GiveCheck verification platform:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-900">Email address:</strong>{" "}
                  Collected when you join our waitlist or create an account.
                </li>
                <li>
                  <strong className="text-cyan-900">Basic account information:</strong>{" "}
                  Name, company name, and profile details provided through Clerk
                  authentication.
                </li>
                <li>
                  <strong className="text-cyan-900">Stripe revenue data (read-only):</strong>{" "}
                  When you connect your Stripe account via Stripe Connect, we access
                  aggregate revenue totals (Monthly Recurring Revenue) through
                  read-only API access. We do <em>not</em> access individual customer
                  data, payment methods, personal financial details, or transaction-level
                  information.
                </li>
                <li>
                  <strong className="text-cyan-900">Donation records:</strong>{" "}
                  We retrieve donation amounts and recipient nonprofit information
                  through the Every.org API to verify your giving percentage.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                3. What We Do NOT Collect
              </h2>
              <p>
                GiveCheck is designed with data minimization in mind. We do{" "}
                <strong className="text-cyan-900">not</strong> access or store:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your customers&apos; personal data or payment information</li>
                <li>Credit card numbers, bank account details, or payment methods</li>
                <li>Individual transaction or invoice details from Stripe</li>
                <li>Personal financial information beyond aggregate revenue totals</li>
                <li>Donation fund routing details (handled entirely by Every.org)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                4. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-900">Monthly Recurring Giving (MRG) verification:</strong>{" "}
                  We cross-reference your Stripe revenue data with Every.org donation
                  records to calculate and verify your giving percentage.
                </li>
                <li>
                  <strong className="text-cyan-900">Leaderboard ranking:</strong>{" "}
                  Verified giving percentages are used to rank companies on our public
                  leaderboard.
                </li>
                <li>
                  <strong className="text-cyan-900">Badge display:</strong>{" "}
                  Your verified giving status powers the dynamic GiveCheck badge widget
                  you embed on your website.
                </li>
                <li>
                  <strong className="text-cyan-900">Account management:</strong>{" "}
                  To communicate with you about your account, provide customer support,
                  and send service-related notifications.
                </li>
                <li>
                  <strong className="text-cyan-900">Waitlist communications:</strong>{" "}
                  If you join our waitlist, we use your email to notify you when access
                  is available.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                5. Cookies and Tracking
              </h2>
              <p>
                We use session cookies provided by Clerk to manage authentication and
                keep you signed in. We may also use analytics tools to understand how
                visitors interact with our website. These cookies are essential for the
                functioning of the Service and are not used for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                6. Third-Party Services
              </h2>
              <p className="mb-3">
                We rely on the following third-party services to operate the platform.
                Each has its own privacy policy governing data use:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-900">Clerk</strong> — Authentication
                  and user management
                </li>
                <li>
                  <strong className="text-cyan-900">Stripe</strong> — Revenue
                  verification via Stripe Connect (read-only OAuth)
                </li>
                <li>
                  <strong className="text-cyan-900">Every.org</strong> — Donation
                  processing and verification (a 501(c)(3) fiscal sponsor)
                </li>
                <li>
                  <strong className="text-cyan-900">Vercel</strong> — Website hosting
                  and edge functions
                </li>
                <li>
                  <strong className="text-cyan-900">Neon</strong> — PostgreSQL database
                  hosting
                </li>
              </ul>
              <p className="mt-3">
                GiveCheck does not sell, rent, or trade your personal information to any
                third party for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                7. Donation Processing
              </h2>
              <p>
                All charitable donations facilitated through GiveCheck are processed by
                Every.org, a registered 501(c)(3) nonprofit organization. GiveCheck
                does not handle, hold, or route donation funds at any point. Tax
                receipts are issued directly by Every.org.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                8. Data Retention
              </h2>
              <p>
                We retain your account information and verification data for as long as
                your account is active or as needed to provide our services. If you
                delete your account, we will remove your personal information from our
                systems within 30 days, except where retention is required by law or
                for legitimate business purposes (such as resolving disputes or
                enforcing our agreements).
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                9. Your Rights and Choices
              </h2>
              <p className="mb-3">
                Depending on your jurisdiction, you may have the following rights
                regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-cyan-900">Access:</strong> Request a copy of
                  the personal data we hold about you.
                </li>
                <li>
                  <strong className="text-cyan-900">Correction:</strong> Request
                  correction of inaccurate or incomplete personal data.
                </li>
                <li>
                  <strong className="text-cyan-900">Deletion:</strong> Request deletion
                  of your personal data, subject to certain exceptions.
                </li>
                <li>
                  <strong className="text-cyan-900">Portability:</strong> Request your
                  data in a structured, machine-readable format.
                </li>
                <li>
                  <strong className="text-cyan-900">Opt-out:</strong> Unsubscribe from
                  non-essential communications at any time.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:privacy@givecheck.com"
                  className="text-cyan-600 underline hover:text-cyan-800"
                >
                  privacy@givecheck.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                10. California Residents (CCPA)
              </h2>
              <p>
                If you are a California resident, you have the right to know what
                personal information we collect, request its deletion, and opt out of
                its sale. GiveCheck does not sell personal information. To make a
                verifiable consumer request, contact us at{" "}
                <a
                  href="mailto:privacy@givecheck.com"
                  className="text-cyan-600 underline hover:text-cyan-800"
                >
                  privacy@givecheck.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                11. European Residents (GDPR)
              </h2>
              <p>
                If you are located in the European Economic Area, we process your
                personal data based on legitimate interest (providing and improving our
                services) and consent (where required). You have the right to lodge a
                complaint with your local data protection authority if you believe your
                rights have been violated.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                12. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security measures
                to protect your personal data, including encryption in transit (TLS)
                and at rest, access controls, and regular security reviews. However, no
                method of transmission over the internet or electronic storage is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                13. Children&apos;s Privacy
              </h2>
              <p>
                The Service is not directed at individuals under the age of 18. We do
                not knowingly collect personal information from children. If we become
                aware that we have collected data from a child, we will take steps to
                delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                14. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you
                of material changes by posting the updated policy on this page with a
                revised &quot;Last updated&quot; date. Your continued use of the Service after
                any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-cyan-950 mb-3">
                15. Contact Us
              </h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please
                contact us at:
              </p>
              <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 text-sm">
                <p className="font-semibold text-cyan-900">GiveCheck LLC</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:privacy@givecheck.com"
                    className="text-cyan-600 underline hover:text-cyan-800"
                  >
                    privacy@givecheck.com
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
