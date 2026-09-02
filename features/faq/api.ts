import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { homeFaqs } from "@/lib/data";
import type { FaqRow, FaqCategoryRow } from "@/types/database";

function staticFaqs(): FaqRow[] {
  const now = new Date().toISOString();
  return homeFaqs.map((f, i) => ({
    id: `static-${i}`,
    category_id: null,
    question: f.question,
    answer: f.answer,
    sort_order: i,
    is_published: true,
    created_at: now
  }));
}

/** Public read — published FAQs, in order. Falls back to the static homeFaqs list. Cached per-request. */
export const getPublishedFaqs = cache(async (): Promise<FaqRow[]> => {
  if (!isSupabaseConfigured()) return staticFaqs();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return staticFaqs();
  return data as FaqRow[];
});

// FAQ categorization — the `faq_categories` table and these two functions
// exist so the schema is ready, but no admin UI groups FAQs by category
// yet (Milestone 1's FAQ admin is a flat list). Wire up in Milestone 2.
export async function getFaqCategories(): Promise<FaqCategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faq_categories").select("*").order("sort_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as FaqCategoryRow[];
}

export async function getAllFaqsAdmin(): Promise<FaqRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as FaqRow[];
}

export interface FaqInput {
  category_id?: string | null;
  question: string;
  answer: string;
  sort_order?: number;
  is_published?: boolean;
}

export async function createFaq(input: FaqInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as FaqRow;
}

export async function updateFaq(id: string, input: Partial<FaqInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createFaqCategory(name: string, sort_order = 0) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faq_categories").insert({ name, sort_order }).select().single();
  if (error) throw new Error(error.message);
  return data as FaqCategoryRow;
}
