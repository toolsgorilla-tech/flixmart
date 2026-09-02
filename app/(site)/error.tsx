"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Errors here are already isolated to the public site's Suspense
    // boundary; logging to the console keeps a trace without needing an
    // external monitoring service wired up yet (add one in a later
    // milestone — e.g. Sentry — and report `error.digest` there).
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="rounded-2xl bg-red-500/10 p-3 text-red-400">
        <AlertTriangle size={24} />
      </span>
      <h1 className="font-display text-xl font-bold text-white">Something went wrong</h1>
      <p className="max-w-sm text-sm text-slate-400">
        We hit an unexpected error loading this page. Please try again, or head back home.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/5">
          Back home
        </Link>
      </div>
    </div>
  );
}
