import Link from "next/link";

// Bare fallback for URLs that don't match any route at all (outside both
// the (site) group and /admin). The normal in-site 404 experience — with
// Navbar/Footer — lives at app/(site)/not-found.tsx and is what visitors
// hit in the vast majority of cases.
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center text-white">
      <h1 className="font-display text-4xl font-semibold">404</h1>
      <p className="max-w-md text-slate-400">This page doesn&apos;t exist or may have moved.</p>
      <Link href="/" className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500">
        Back home
      </Link>
    </div>
  );
}
