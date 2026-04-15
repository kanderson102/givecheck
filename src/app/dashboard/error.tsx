"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Dashboard-specific error boundary.
 * Catches errors in any dashboard page/nested route and shows
 * a recovery UI without crashing the whole app.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="text-5xl font-bold text-cyan-400 font-heading">Oops</p>
          <h1 className="mt-4 text-xl font-semibold text-white font-heading">
            Something went wrong loading your dashboard
          </h1>
          <p className="mt-2 text-gray-400">
            This is likely a temporary issue. Your data is safe.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={reset}
              className="rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
            >
              Go home
            </a>
          </div>
          {error.digest && (
            <p className="mt-6 text-xs text-gray-600">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
