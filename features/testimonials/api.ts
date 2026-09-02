import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { testimonials as staticTestimonials } from "@/lib/data";
import type { TestimonialRow } from "@/types/database";

function fromStatic(): TestimonialRow[] {
  const now = new Date().toISOString();
  return staticTestimonials.map((t, i) => ({
    id: `static-${i}`,
    name: t.name,
    location: t.location,
    country: null,
    rating: t.rating,
    quote: t.quote,
    product: t.product,
    photo_url: null,
    is_published: true,
    sort_order: i,
    created_at: now
  }));
}

export const getPublishedTestimonials = cache(async (): Promise<TestimonialRow[]> => {
  if (!isSupabaseConfigured()) return fromStatic();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fromStatic();
  return data as TestimonialRow[];
});

export async function getAllTestimonialsAdmin(): Promise<TestimonialRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as TestimonialRow[];
}

export interface TestimonialInput {
  name: string;
  location?: string | null;
  country?: string | null;
  rating: number;
  quote: string;
  product?: string | null;
  photo_url?: string | null;
  is_published?: boolean;
  sort_order?: number;
}

export async function createTestimonial(input: TestimonialInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("testimonials").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as TestimonialRow;
}

export async function updateTestimonial(id: string, input: Partial<TestimonialInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
