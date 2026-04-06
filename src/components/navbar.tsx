"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      setOpen(false);

      // If not on homepage, navigate there first
      if (pathname !== "/") {
        window.location.href = `/${href}`;
        return;
      }

      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [pathname]
  );

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl rounded-2xl border border-cyan-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <ShieldCheck className="h-7 w-7 text-cyan-600" />
          <span className="font-heading text-xl font-bold text-cyan-900">
            GiveCheck
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="text-sm font-medium text-cyan-800 transition-colors duration-200 hover:text-cyan-600 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-cyan-800 hover:text-cyan-600 hover:bg-cyan-50 cursor-pointer"
            )}
          >
            Log In
          </Link>
          <a
            href="#waitlist"
            onClick={(e) => handleAnchorClick(e, "#waitlist")}
            className={cn(
              buttonVariants(),
              "bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer"
            )}
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden cursor-pointer inline-flex items-center justify-center rounded-lg p-2 text-cyan-800 hover:bg-cyan-50 transition-colors">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-64 sm:w-72 p-0"
            showCloseButton={false}
          >
            <div className="flex h-full flex-col">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between border-b border-cyan-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-cyan-600" />
                  <span className="font-heading text-lg font-bold text-cyan-900">
                    GiveCheck
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile nav links */}
              <div className="flex flex-1 flex-col px-5 py-6">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="block rounded-lg px-3 py-2.5 text-base font-medium text-cyan-800 transition-colors hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="mt-auto space-y-3 pt-6 border-t border-cyan-100">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full border-cyan-200 text-cyan-800 cursor-pointer"
                    )}
                  >
                    Log In
                  </Link>
                  <a
                    href="#waitlist"
                    onClick={(e) => handleAnchorClick(e, "#waitlist")}
                    className={cn(
                      buttonVariants(),
                      "w-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer"
                    )}
                  >
                    Join Waitlist
                  </a>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
