import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import type { Product } from "@/lib/types";
import type { CategoryRow } from "@/types/database";

// Exact priority order requested for Most Popular section
const prioritySlugs = [
  "iptv-premium",
  "netflix-premium",
  "prime-video",
  "disney-plus",
  "spotify-premium",
  "chatgpt-plus",
  "canva-pro",
  "capcut-pro",
  "nordvpn",
  "microsoft-365",
  "xbox-game-pass",
  "linkedin-premium-career"
];

export default function FeaturedProducts({
  products,
  categories
}: {
  products?: Product[];
  categories?: CategoryRow[];
}) {
  const source = products && products.length > 0 ? products : staticProducts;

  // Sort products based on prioritySlugs
  const featured = [...source]
    .filter((p) => prioritySlugs.includes(p.slug) || p.badge)
    .sort((a, b) => {
      const indexA = prioritySlugs.indexOf(a.slug);
      const indexB = prioritySlugs.indexOf(b.slug);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    })
    .slice(0, 12);

  return (
    <section className="section py-16 sm:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          center={false}
          eyebrow="Most Popular"
          title="Top Digital Subscriptions"
          description="IPTV, 4K streaming, AI productivity & VPN privacy services trusted by thousands of customers."
        />
        <Link href="/products" className="btn-ghost shrink-0 !px-5 !py-2.5 text-xs font-bold shadow-sm">
          View Full Catalog <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.slug} product={p} categories={categories} />
        ))}
      </div>
    </section>
  );
}
