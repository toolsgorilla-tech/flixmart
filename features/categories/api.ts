import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { categories as staticCategories } from "@/lib/data";
import type { CategoryRow } from "@/types/database";

export type { CategoryRow };

function fromStatic(): CategoryRow[] {
  const now = new Date().toISOString();
  return staticCategories.map((c, i) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    image_url: null,
    sort_order: i,
    is_active: true,
    created_at: now,
    updated_at: now
  }));
}

/**
 * Public read — active categories only, sorted. Falls back to the original
 * static list if Supabase isn't connected yet.
 *
 * Wrapped in React's `cache()` so multiple components in the same request
 * (e.g. the homepage AND the Footer, which renders on every page) share
 * one DB round trip instead of each querying independently.
 */
export const getActiveCategories = cache(async (): Promise<CategoryRow[]> => {
  if (!isSupabaseConfigured()) return fromStatic();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fromStatic();
  return data as CategoryRow[];
});

/** Admin read — every category regardless of status. */
export async function getAllCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) return fromStatic();

  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as CategoryRow[];
}

export interface CategoryInput {
  slug: string;
  name: string;
  description?: string | null;
  icon: string;
  image_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export async function createCategory(input: CategoryInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as CategoryRow;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").update(input).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as CategoryRow;
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderCategories(order: { id: string; sort_order: number }[]) {
  const supabase = await createClient();
  await Promise.all(order.map(({ id, sort_order }) => supabase.from("categories").update({ sort_order }).eq("id", id)));
}
