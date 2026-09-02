import Link from "next/link";
import { Home, Search } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="section flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Image src="/flixmart-logo.png" alt="FlixMart" width={112} height={56} className="h-14 w-auto object-contain" />
      <h1 className="mt-6 font-display text-4xl font-semibold text-ink sm:text-5xl">404</h1>
      <p className="mt-3 max-w-md text-muted">
        This page went off-grid. The product or page you're looking for doesn't exist or may have moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          <Home size={17} /> Back home
        </Link>
        <Link href="/products" className="btn-ghost">
          <Search size={17} /> Browse products
        </Link>
      </div>
    </div>
  );
}
