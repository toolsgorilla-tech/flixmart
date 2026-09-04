import type { Product } from "./types";
import type { ProductWithPlans } from "@/types/database";

/**
 * IPTV products must always render Starter → Standard → Premium → Ultimate,
 * regardless of when each row was created or last edited. Rank is resolved
 * from (in order of preference): an explicit tier field, the brand key, then
 * the product name — never `created_at`.
 */
const IPTV_TIER_RANK: Record<string, number> = {
  starter: 0,
  standard: 1,
  premium: 2,
  ultimate: 3,
};

// Recognized as an IPTV product but no known tier keyword was found in its
// tier/brand key/name — keep it grouped with the other IPTV products rather
// than dropping it out of the group entirely.
const UNKNOWN_TIER_RANK = 99;

interface IptvMeta {
  isIPTV?: boolean;
  iptvTier?: string | null;
  brandKey?: string | null;
  name?: string | null;
  categorySlug?: string | null;
}

function resolveIptvRank(meta: IptvMeta): number | null {
  const tier = (meta.iptvTier ?? "").toLowerCase();
  const brandKey = (meta.brandKey ?? "").toLowerCase();
  const name = (meta.name ?? "").toLowerCase();
  const category = (meta.categorySlug ?? "").toLowerCase();

  const isIptvProduct =
    Boolean(meta.isIPTV) || category === "iptv" || brandKey.includes("iptv") || name.includes("iptv");
  if (!isIptvProduct) return null;

  const haystack = `${tier} ${brandKey} ${name}`;
  for (const [label, rank] of Object.entries(IPTV_TIER_RANK)) {
    if (haystack.includes(label)) return rank;
  }
  return UNKNOWN_TIER_RANK;
}

/**
 * Re-orders only the IPTV entries in `items` into tier order, leaving every
 * non-IPTV item exactly where it already was — both its position in the
 * array and its order relative to other non-IPTV items are untouched. This
 * is done by sorting just the IPTV entries by tier rank and dropping them
 * back into the index slots IPTV products already occupied, so a mixed
 * "all products" listing isn't reshuffled — only which IPTV product sits in
 * an IPTV slot can change.
 */
export function applyIptvOrdering<T>(items: T[], getMeta: (item: T) => IptvMeta): T[] {
  const ranked = items.map((item, idx) => ({ idx, rank: resolveIptvRank(getMeta(item)) }));
  const iptvSlots = ranked.filter((r): r is { idx: number; rank: number } => r.rank !== null);
  if (iptvSlots.length < 2) return items;

  const sortedIptv = [...iptvSlots].sort((a, b) => a.rank - b.rank || a.idx - b.idx);

  const result = [...items];
  iptvSlots.forEach((slot, i) => {
    result[slot.idx] = items[sortedIptv[i].idx];
  });
  return result;
}

/** For the mapped `Product` shape used by the public storefront. */
export function sortProductsForIptvOrder(products: Product[]): Product[] {
  return applyIptvOrdering(products, (p) => ({
    isIPTV: p.isIPTV,
    iptvTier: p.iptvTier,
    brandKey: p.brandKey,
    name: p.name,
    categorySlug: p.category
  }));
}

/** For raw admin rows (`ProductWithPlans`), whose IPTV metadata lives in `specifications`. */
export function sortAdminProductRowsForIptvOrder(rows: ProductWithPlans[]): ProductWithPlans[] {
  return applyIptvOrdering(rows, (row) => {
    const spec = (row.specifications ?? {}) as Record<string, unknown>;
    return {
      isIPTV: Boolean(spec.isIPTV),
      iptvTier: typeof spec.iptvTier === "string" ? spec.iptvTier : null,
      brandKey: row.brand_key,
      name: row.name,
      categorySlug: row.categories?.slug ?? null
    };
  });
}
