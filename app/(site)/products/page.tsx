import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsExplorer from "@/components/ProductsExplorer";
import SectionHeading from "@/components/SectionHeading";
import { getPublishedProducts } from "@/features/products/api";
import { getActiveCategories } from "@/features/categories/api";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse ChatGPT Plus, Canva Pro, Netflix, Claude AI, Figma, IPTV, VPNs, Spotify, Prezi and more premium subscriptions with instant digital delivery.",
  alternates: { canonical: "/products" }
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getActiveCategories()]);

  return (
    <div className="section py-14 sm:py-20">
      <SectionHeading
        eyebrow="Complete Marketplace Catalog"
        title="Premium Subscriptions & AI Tools"
        description="AI tools, design software, streaming platforms, IPTV packages, VPN privacy & developer toolkits — all with instant delivery in PKR."
      />
      <div className="mt-10">
        <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading subscription catalog…</div>}>
          <ProductsExplorer products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
