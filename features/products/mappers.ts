import type { ProductPlanRow, ProductWithPlans, CategoryRow } from "@/types/database";
import type { Product, Plan, CategorySlug } from "@/lib/types";

/**
 * The existing frontend components (ProductCard, ProductsExplorer, the
 * [slug] page, etc.) all consume `lib/types.ts`'s `Product` shape. Rather
 * than rewrite every component's prop contract for Milestone 1, DB rows
 * are mapped into that exact shape here — the frontend stays untouched,
 * only its data source changes. IPTV-specific fields live in the generic
 * `specifications` JSON column and are read back out by key below.
 */
export function mapPlanRow(row: ProductPlanRow): Plan {
  return {
    label: row.label,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    duration: row.duration,
    priceTBD: row.price_tbd,
    isFree: row.is_free,
    badge: row.badge ?? undefined
  };
}

export function mapProductRow(row: ProductWithPlans, category?: CategoryRow | null): Product {
  const spec = row.specifications ?? {};
  const resolvedCategory = category ?? row.categories;

  return {
    slug: row.slug,
    name: row.name,
    category: (resolvedCategory?.slug ?? "iptv") as CategorySlug,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    image: row.image_url ?? "",
    brandKey: row.brand_key ?? undefined,
    badge: row.badge ?? undefined,
    rating: Number(row.rating),
    reviews: row.reviews_count,
    deliveryTime: row.delivery_time ?? "Within 30 minutes",
    plans: (row.product_plans ?? []).sort((a, b) => a.sort_order - b.sort_order).map(mapPlanRow),
    features: row.features ?? [],
    included: row.included ?? [],
    faqs: row.faqs ?? [],
    isIPTV: Boolean(spec.isIPTV),
    iptvTier: spec.iptvTier as Product["iptvTier"],
    quality: spec.quality as string | undefined,
    contentRegions: spec.contentRegions as string[] | undefined,
    epgSupported: spec.epgSupported as boolean | undefined,
    devicesSupported: spec.devicesSupported as string[] | undefined,
    channelCountText: spec.channelCountText as string | undefined,
    movieCountText: spec.movieCountText as string | undefined,
    seriesCountText: spec.seriesCountText as string | undefined
  };
}
