import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { HomepageSectionRow, HomepageSectionType } from "@/types/database";

const DEFAULT_SECTIONS: HomepageSectionRow[] = [
  "hero",
  "categories",
  "featured_products",
  "why_choose_us",
  "testimonials",
  "faq",
  "cta_banner",
  "newsletter"
].map((type, i) => ({
  id: type,
  type: type as HomepageSectionType,
  title: type.replace(/_/g, " "),
  is_enabled: true,
  sort_order: i,
  content: {},
  status: "published",
  published_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

/** Public read — enabled + published sections, in order. Used by the homepage renderer. */
export const getPublishedHomepageSections = cache(async (): Promise<HomepageSectionRow[]> => {
  if (!isSupabaseConfigured()) return DEFAULT_SECTIONS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return DEFAULT_SECTIONS;
  return data as HomepageSectionRow[];
});

/** Admin read — every section (enabled or not, draft or published) for the builder UI. */
export async function getAllHomepageSections(): Promise<HomepageSectionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("homepage_sections").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data && data.length > 0 ? data : DEFAULT_SECTIONS) as HomepageSectionRow[];
}

export async function toggleSectionEnabled(id: string, is_enabled: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("homepage_sections").update({ is_enabled }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderSections(order: { id: string; sort_order: number }[]) {
  const supabase = await createClient();
  await Promise.all(order.map(({ id, sort_order }) => supabase.from("homepage_sections").update({ sort_order }).eq("id", id)));
}

// Per-section content editing (e.g. a rich form for each section's JSON
// `content` blob) isn't built yet — Milestone 1's builder only handles
// enable/disable/reorder/duplicate/publish. This is ready for Milestone 2.
export async function updateSectionContent(id: string, content: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("homepage_sections").update({ content }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function duplicateSection(id: string) {
  const supabase = await createClient();
  const { data: original, error } = await supabase.from("homepage_sections").select("*").eq("id", id).single();
  if (error || !original) throw new Error(error?.message ?? "Section not found");

  const row = original as HomepageSectionRow;
  const { data: max } = await supabase
    .from("homepage_sections")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error: insertError } = await supabase.from("homepage_sections").insert({
    type: row.type,
    title: `${row.title} (Copy)`,
    is_enabled: false,
    sort_order: ((max as { sort_order: number } | null)?.sort_order ?? row.sort_order) + 1,
    content: row.content,
    status: "draft"
  });
  if (insertError) throw new Error(insertError.message);
}

export async function deleteSection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("homepage_sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function publishSection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("homepage_sections")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function saveSectionDraft(id: string, content: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("homepage_sections").update({ content, status: "draft" }).eq("id", id);
  if (error) throw new Error(error.message);
}
