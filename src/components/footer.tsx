import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-cyan-100 bg-cyan-950 text-cyan-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
              <span className="font-heading text-lg font-bold text-white">
                GiveCheck
              </span>
            </div>
            <p className="text-sm text-cyan-300 leading-relaxed">
              Verified giving for startups and solopreneurs. Make generosity
              your competitive advantage.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-cyan-300">
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors cursor-pointer">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition-colors cursor-pointer">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors cursor-pointer">
                  Badge Widget
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-cyan-300">
              <li>
                <Link href="#" className="hover:text-white transition-colors cursor-pointer">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-cyan-300">
              <li>
                <Link href="#" className="hover:text-white transition-colors cursor-pointer">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors cursor-pointer">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-cyan-800 pt-6 text-center text-sm text-cyan-400">
          &copy; {new Date().getFullYear()} GiveCheck. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
