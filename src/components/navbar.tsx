"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/mock-data";

const navLinks = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/categories", label: "Categories", hasDropdown: true },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    setMobileOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();

      if (pathname !== "/") {
        window.location.href = `/${href}`;
        return;
      }

      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(() => setMobileOpen(false), 100);
    },
    [pathname]
  );

  return (
    <>
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
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.href}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-cyan-800 transition-colors duration-200 hover:text-cyan-600 cursor-pointer"
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        categoriesOpen && "rotate-180"
                      )}
                    />
                  </Link>

                  {categoriesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="w-[640px] rounded-xl border border-cyan-200/60 bg-white/95 backdrop-blur-xl shadow-lg p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
                            Browse Categories
                          </span>
                          <Link
                            href="/categories"
                            className="text-xs font-medium text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
                          >
                            View All →
                          </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/categories/${cat.slug}`}
                              className="rounded-lg px-3 py-2 text-sm text-cyan-800 transition-colors hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="text-sm font-medium text-cyan-800 transition-colors duration-200 hover:text-cyan-600 cursor-pointer"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
            {isLoaded && isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-cyan-800 hover:text-cyan-600 hover:bg-cyan-50 cursor-pointer"
                  )}
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 ring-2 ring-cyan-200",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Dashboard"
                      labelIcon={<span className="text-xs">📊</span>}
                      href="/dashboard"
                    />
                    <UserButton.Link
                      label="Settings"
                      labelIcon={<span className="text-xs">⚙️</span>}
                      href="/dashboard/settings"
                    />
                    <UserButton.Action label="manageAccount" />
                  </UserButton.MenuItems>
                </UserButton>
              </>
            ) : (
              <>
                {/* Log In is visible during development but will be hidden from the
                    public nav during the waitlist phase before launch. */}
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-cyan-800 hover:text-cyan-600 hover:bg-cyan-50 cursor-pointer text-sm"
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
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden cursor-pointer inline-flex items-center justify-center rounded-lg p-2 text-cyan-800 hover:bg-cyan-50 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <div className="fixed top-0 right-0 z-50 h-full w-64 overflow-y-auto bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between border-b border-cyan-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-600" />
                <span className="font-heading text-base font-bold text-cyan-900">
                  GiveCheck
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-3 py-4 space-y-0.5">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.href}>
                    <div className="flex items-center">
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-cyan-800 transition-colors hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer"
                      >
                        {link.label}
                      </Link>
                      <button
                        onClick={() =>
                          setMobileCategoriesOpen(!mobileCategoriesOpen)
                        }
                        className="rounded-lg p-2 text-cyan-500 hover:bg-cyan-50 transition-colors cursor-pointer"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            mobileCategoriesOpen && "rotate-180"
                          )}
                        />
                      </button>
                    </div>
                    {mobileCategoriesOpen && (
                      <div className="ml-3 border-l border-cyan-100 pl-3 py-1 space-y-0.5">
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/categories/${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-1.5 text-xs text-cyan-700 transition-colors hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-cyan-800 transition-colors hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            <div className="border-t border-cyan-100 px-4 py-4 space-y-2.5">
              {isLoaded && isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full border-cyan-200 text-cyan-800 cursor-pointer text-sm"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full border-cyan-200 text-cyan-800 cursor-pointer text-sm"
                    )}
                  >
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full border-cyan-200 text-cyan-800 cursor-pointer text-sm"
                    )}
                  >
                    Log In
                  </Link>
                  <a
                    href="#waitlist"
                    onClick={(e) => handleAnchorClick(e, "#waitlist")}
                    className={cn(
                      buttonVariants(),
                      "w-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer text-sm"
                    )}
                  >
                    Join Waitlist
                  </a>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
