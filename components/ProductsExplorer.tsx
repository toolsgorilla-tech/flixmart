"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories as staticCategories, products as staticProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface CategoryOption {
  slug: string;
  name: string;
}

export default function ProductsExplorer({
  products: productsProp,
  categories: categoriesProp
}: {
  products?: Product[];
  categories?: CategoryOption[];
}) {
  const products = productsProp && productsProp.length > 0 ? productsProp : staticProducts;
  const categories = categoriesProp && categoriesProp.length > 0 ? categoriesProp : staticCategories;

  const searchParams = useSearchParams();
  // `categories` can come from the CMS (features/categories/api.ts's
  // getActiveCategories(), arbitrary DB-driven slugs) as well as the
  // static fallback list, so the active-category filter is kept as a
  // plain string rather than the closed `CategorySlug` union used for
  // the hardcoded product catalog in lib/types.ts.
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setActiveCategory(initialCategory);
    setQuery(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesQuery =
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 sm:max-w-xs dark:border-slate-700 dark:bg-slate-800">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            aria-label="Search products"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <SlidersHorizontal size={14} />
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> of {products.length} subscriptions
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm",
            activeCategory === "all"
              ? "bg-red-600 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCategory(c.slug)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm",
              activeCategory === c.slug
                ? "bg-red-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">No products found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search query or selecting a different category filter.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} categories={categories} />
          ))}
        </div>
      )}
    </div>
  );
}
