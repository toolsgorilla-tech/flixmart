import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { products as staticProducts } from "@/lib/data";
import { mapProductRow } from "./mappers";
import type { Product } from "@/lib/types";
import type { ProductRow, ProductWithPlans, ContentStatus, ProductBadge } from "@/types/database";

const PRODUCT_SELECT = "*, product_plans(*), categories(*)";

/**
 * Public read — published products only. Falls back to the static catalog
 * if Supabase isn't connected yet. Cached per-request: the products list
 * page and the homepage's featured section can both call this in the same
 * request tree without double-querying.
 */
export const getPublishedProducts = cache(async (): Promise<Product[]> => {
  if (!isSupabaseConfigured()) return staticProducts;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return staticProducts;
  return (data as unknown as ProductWithPlans[]).map((row) => mapProductRow(row));
});

export const getPublishedProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!isSupabaseConfigured()) return staticProducts.find((p) => p.slug === slug) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return staticProducts.find((p) => p.slug === slug) ?? null;
  return mapProductRow(data as unknown as ProductWithPlans);
});

/**
 * Public read — a handful of published products in the same category,
 * excluding the current one. Used by the "You Might Also Like" section on
 * the product detail page. Deliberately scoped with `.limit()` at the
 * database level rather than fetching the whole catalog and slicing in
 * memory, which is what a naive `getPublishedProducts()` + filter would do.
 */
export async function getRelatedProducts(categorySlug: string, excludeSlug: string, limit = 4): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticProducts.filter((p) => p.category === categorySlug && p.slug !== excludeSlug).slice(0, limit);
  }

  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
  if (!category) return [];

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("category_id", (category as { id: string }).id)
    .neq("slug", excludeSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as unknown as ProductWithPlans[]).map((row) => mapProductRow(row));
}

// ---------------------------------------------------------------------------
// Admin CRUD
// ---------------------------------------------------------------------------

export async function getAllProductsAdmin(): Promise<ProductWithPlans[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ProductWithPlans[];
}

export async function getProductByIdAdmin(id: string): Promise<ProductWithPlans | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).single();
  if (error) return null;
  return data as unknown as ProductWithPlans;
}

export interface ProductPlanInput {
  label: string;
  price: number;
  original_price?: number | null;
  duration: string;
  price_tbd?: boolean;
  is_free?: boolean;
  badge?: string | null;
  sort_order?: number;
}

export interface ProductInput {
  slug: string;
  name: string;
  category_id: string | null;
  tagline?: string | null;
  description?: string | null;
  image_url?: string | null;
  gallery?: string[];
  brand_key?: string | null;
  badge?: ProductBadge | null;
  delivery_time?: string | null;
  features?: string[];
  included?: string[];
  faqs?: { question: string; answer: string }[];
  specifications?: Record<string, unknown>;
  is_featured?: boolean;
  is_trending?: boolean;
  status?: ContentStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  seo_og_image?: string | null;
  seo_canonical_url?: string | null;
  plans: ProductPlanInput[];
}

export async function createProduct(input: ProductInput) {
  const supabase = await createClient();
  const { plans, ...productFields } = input;

  const { data: product, error } = await supabase.from("products").insert(productFields).select().single();
  if (error) throw new Error(error.message);

  if (plans.length > 0) {
    const { error: plansError } = await supabase
      .from("product_plans")
      .insert(plans.map((p, i) => ({ ...p, product_id: (product as ProductRow).id, sort_order: p.sort_order ?? i })));
    if (plansError) throw new Error(plansError.message);
  }

  return product as ProductRow;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const supabase = await createClient();
  const { plans, ...productFields } = input;

  if (Object.keys(productFields).length > 0) {
    const { error } = await supabase.from("products").update(productFields).eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (plans) {
    // Simplest consistent strategy for a CMS form: replace all plans on save.
    const { error: delError } = await supabase.from("product_plans").delete().eq("product_id", id);
    if (delError) throw new Error(delError.message);

    if (plans.length > 0) {
      const { error: insError } = await supabase
        .from("product_plans")
        .insert(plans.map((p, i) => ({ ...p, product_id: id, sort_order: p.sort_order ?? i })));
      if (insError) throw new Error(insError.message);
    }
  }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function duplicateProduct(id: string) {
  const original = await getProductByIdAdmin(id);
  if (!original) throw new Error("Product not found");

  const { id: _id, created_at, updated_at, product_plans, categories, ...rest } = original;
  const copy = await createProduct({
    ...rest,
    slug: `${rest.slug}-copy-${Date.now().toString(36)}`,
    name: `${rest.name} (Copy)`,
    status: "draft",
    plans: product_plans.map((p) => ({
      label: p.label,
      price: Number(p.price),
      original_price: p.original_price != null ? Number(p.original_price) : null,
      duration: p.duration,
      price_tbd: p.price_tbd,
      is_free: p.is_free,
      badge: p.badge,
      sort_order: p.sort_order
    }))
  });
  return copy;
}

export async function bulkUpdateProducts(ids: string[], patch: Partial<ProductInput>) {
  const supabase = await createClient();
  const { plans, ...productFields } = patch;
  if (Object.keys(productFields).length === 0) return;
  const { error } = await supabase.from("products").update(productFields).in("id", ids);
  if (error) throw new Error(error.message);
}
