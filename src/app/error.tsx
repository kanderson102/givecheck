"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry will automatically capture this via its error boundary integration.
    // This console.error is a fallback for local dev visibility.
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center">
      <p className="text-6xl font-bold text-red-400 font-heading">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-white font-heading">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-gray-400">
        We hit an unexpected error. Our team has been notified. You can try
        again or head back home.
      </p>
      <div className="mt-8 flex gap-4">
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
        <p className="mt-6 text-xs text-gray-600">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
