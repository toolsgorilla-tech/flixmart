"use client";

import { useEffect } from "react";

// global-error.tsx replaces the ENTIRE root layout when it fires (React
// tree, including <html>/<body>, has crashed), so it must render its own
// html/body rather than relying on app/layout.tsx. This only triggers if
// an error escapes both app/(site)/error.tsx and app/admin/(protected)/error.tsx
// — i.e. a bug in the root layout itself.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#070A0F] text-center text-white">
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-slate-400">
          The application hit an unexpected error. Please try reloading the page.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
