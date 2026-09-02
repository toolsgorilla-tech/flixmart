"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="rounded-2xl bg-red-500/10 p-3 text-red-400">
        <AlertTriangle size={24} />
      </span>
      <h1 className="font-display text-lg font-bold text-white">This screen hit an error</h1>
      <p className="max-w-sm text-sm text-slate-400">
        {error.message || "Something went wrong loading this part of the dashboard."} Your data hasn't been lost —
        try again below.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500"
        >
          <RotateCw size={14} /> Try again
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/5"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
