/**
 * One-time / repeatable migration script: upserts the existing hardcoded
 * catalog from `lib/data.ts` into Supabase (`categories`, `products`,
 * `product_plans`), so the Admin Dashboard becomes the real source of
 * management for products/categories that currently only exist in the
 * static file.
 *
 * WHY THIS EXISTS
 * ----------------
 * `supabase/migrations/0002_seed.sql` already seeds `categories`,
 * `site_settings`, `hero_content` and `homepage_sections` — but it never
 * seeded `products` (or `product_plans`). Because of that:
 *   - The public site's `getPublishedProducts()` (features/products/api.ts)
 *     silently falls back to the static `lib/data.ts` array whenever the
 *     `products` table comes back empty, so the storefront still looked
 *     complete.
 *   - The Admin → Products page (`app/admin/(protected)/products/page.tsx`)
 *     calls `getAllProductsAdmin()`, which queries Supabase directly with
 *     NO static fallback — so it only ever showed rows that were actually
 *     in the database, i.e. only products created through the admin UI.
 * That mismatch is the entire "admin panel doesn't show my existing
 * products" bug. Running this script (once Supabase is connected) fixes
 * it by actually populating the `products` / `product_plans` tables from
 * the same data the public site has been displaying all along.
 *
 * SAFE TO RE-RUN — BUT READ THIS FIRST
 * -------------------------------------
 * Categories and products are upserted by their unique `slug`, so running
 * this script twice will never create duplicate rows. However, an upsert
 * also means: if you've already edited one of these same products/categories
 * from Admin → Products or Admin → Categories, running this script AGAIN
 * will overwrite those admin edits back to the original static values from
 * lib/data.ts (each product's plans are fully replaced every run, the same
 * "replace all plans on save" strategy `updateProduct()` already uses).
 * In short: run this once to do the initial migration, then manage the
 * catalog from the Admin Dashboard from then on — don't re-run it after
 * you've started editing the migrated products/categories in admin.
 *
 * USAGE
 * -----
 *   npm run seed:catalog
 *
 * Requires, in your environment (.env.local is loaded automatically):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (server-only — never used in browser code;
 *                                 this script runs in Node via `tsx`, not
 *                                 in a Next.js request, and is required
 *                                 here because category/product writes are
 *                                 staff-only under RLS.)
 *
 * This script is NOT imported by the Next.js app anywhere, so the service
 * role key it uses never reaches client-side/browser bundles.
 */
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { categories, products } from "../lib/data";
import type { CategorySlug, Product } from "../lib/types";

// Load .env.local (Next.js convention) if present, falling back to .env.
const envLocal = resolve(process.cwd(), ".env.local");
loadEnv({ path: existsSync(envLocal) ? envLocal : resolve(process.cwd(), ".env") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add both to .env.local (see SETUP.md) before running `npm run seed:catalog`."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// IPTV-specific + misc fields that don't have their own column — mirrors
// exactly what features/products/mappers.ts's mapProductRow() reads back
// out of the `specifications` jsonb column, so round-tripping is lossless.
function buildSpecifications(p: Product): Record<string, unknown> {
  const spec: Record<string, unknown> = {};
  if (p.isIPTV !== undefined) spec.isIPTV = p.isIPTV;
  if (p.iptvTier !== undefined) spec.iptvTier = p.iptvTier;
  if (p.quality !== undefined) spec.quality = p.quality;
  if (p.contentRegions !== undefined) spec.contentRegions = p.contentRegions;
  if (p.epgSupported !== undefined) spec.epgSupported = p.epgSupported;
  if (p.devicesSupported !== undefined) spec.devicesSupported = p.devicesSupported;
  if (p.channelCountText !== undefined) spec.channelCountText = p.channelCountText;
  if (p.movieCountText !== undefined) spec.movieCountText = p.movieCountText;
  if (p.seriesCountText !== undefined) spec.seriesCountText = p.seriesCountText;
  return spec;
}

async function upsertCategories(): Promise<Record<CategorySlug, string>> {
  console.log(`Upserting ${categories.length} categories...`);

  const rows = categories.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    sort_order: i + 1,
    is_active: true
  }));

  const { error } = await supabase.from("categories").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`Category upsert failed: ${error.message}`);

  const { data, error: readError } = await supabase.from("categories").select("id, slug");
  if (readError) throw new Error(`Category read-back failed: ${readError.message}`);

  const map = {} as Record<CategorySlug, string>;
  for (const row of data ?? []) {
    map[row.slug as CategorySlug] = row.id as string;
  }
  return map;
}

async function upsertProducts(categoryIdBySlug: Record<CategorySlug, string>) {
  console.log(`Upserting ${products.length} products...`);

  let productCount = 0;
  let planCount = 0;
  const skipped: string[] = [];

  for (const p of products) {
    const categoryId = categoryIdBySlug[p.category];
    if (!categoryId) {
      skipped.push(`${p.slug} (unknown category "${p.category}")`);
      continue;
    }

    const productFields = {
      slug: p.slug,
      name: p.name,
      category_id: categoryId,
      tagline: p.tagline,
      description: p.description,
      image_url: p.image,
      gallery: [] as string[],
      brand_key: p.brandKey ?? null,
      badge: p.badge ?? null,
      rating: p.rating,
      reviews_count: p.reviews,
      delivery_time: p.deliveryTime,
      features: p.features,
      included: p.included,
      faqs: p.faqs,
      specifications: buildSpecifications(p),
      // Existing frontend components don't read these two flags — default
      // to false so behavior is unchanged; toggle them from Admin → Products
      // afterwards if you want specific items to show as featured/trending.
      is_featured: false,
      is_trending: false,
      status: "published" as const
    };

    const { data: product, error } = await supabase
      .from("products")
      .upsert(productFields, { onConflict: "slug" })
      .select("id")
      .single();

    if (error || !product) {
      skipped.push(`${p.slug} (${error?.message ?? "no row returned"})`);
      continue;
    }

    const productId = product.id as string;

    // Replace all plans for this product — same strategy as
    // features/products/api.ts's updateProduct(), so re-running this
    // script never accumulates duplicate/stale plan rows.
    const { error: delError } = await supabase.from("product_plans").delete().eq("product_id", productId);
    if (delError) {
      skipped.push(`${p.slug} (plan cleanup failed: ${delError.message})`);
      continue;
    }

    if (p.plans.length > 0) {
      const planRows = p.plans.map((plan, i) => ({
        product_id: productId,
        label: plan.label,
        price: plan.price,
        original_price: plan.originalPrice ?? null,
        duration: plan.duration,
        price_tbd: plan.priceTBD ?? false,
        is_free: plan.isFree ?? false,
        badge: plan.badge ?? null,
        sort_order: i
      }));
      const { error: planError } = await supabase.from("product_plans").insert(planRows);
      if (planError) {
        skipped.push(`${p.slug} (plan insert failed: ${planError.message})`);
        continue;
      }
      planCount += planRows.length;
    }

    productCount += 1;
  }

  return { productCount, planCount, skipped };
}

async function main() {
  const categoryIdBySlug = await upsertCategories();
  const { productCount, planCount, skipped } = await upsertProducts(categoryIdBySlug);

  console.log("\nDone.");
  console.log(`  Categories upserted: ${categories.length}`);
  console.log(`  Products upserted:   ${productCount} / ${products.length}`);
  console.log(`  Plans inserted:      ${planCount}`);
  if (skipped.length > 0) {
    console.log(`\n  Skipped ${skipped.length} product(s):`);
    for (const s of skipped) console.log(`    - ${s}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
