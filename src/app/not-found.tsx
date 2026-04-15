import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center">
      <p className="text-6xl font-bold text-cyan-400 font-heading">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-white font-heading">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-400"
        >
          Go home
        </Link>
        <Link
          href="/leaderboard"
          className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
        >
          View leaderboard
        </Link>
      </div>
    </div>
  );
}
