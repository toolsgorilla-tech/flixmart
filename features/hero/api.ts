import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { HeroContentRow } from "@/types/database";

const DEFAULT_HERO: HeroContentRow = {
  id: 1,
  headline: "Every Premium Subscription.",
  headline_highlight: "One Trusted Marketplace.",
  subtitle:
    "Netflix, Disney+ and live sports IPTV. ChatGPT Plus, Claude Pro and Gemini. Canva, Microsoft 365 and Adobe Creative Cloud. Buy the streaming, AI and productivity subscriptions you actually use — with instant delivery and real human support.",
  primary_button_label: "Explore Marketplace",
  primary_button_url: "/products",
  secondary_button_label: "Watch Demo",
  secondary_button_url: "#marketplace-showcase",
  badge_text: "World's Premium Digital Marketplace",
  category_chips: [
    { icon: "Trophy", label: "Live Sports" },
    { icon: "Film", label: "Movies & Series" },
    { icon: "Sparkles", label: "AI Tools" },
    { icon: "Zap", label: "Productivity" }
  ],
  trust_badges: [
    { icon: "Star", label: "50,000+ Happy Customers", accent: "text-amber-400" },
    { icon: "Zap", label: "Instant Delivery", accent: "text-emerald-400" },
    { icon: "ShieldCheck", label: "Secure Payments", accent: "text-indigo-300" },
    { icon: "MessageCircle", label: "24/7 WhatsApp Support", accent: "text-emerald-400" }
  ],
  ticker_items: [
    { icon: "Film", label: "Movies" },
    { icon: "Trophy", label: "Live Sports" },
    { icon: "Tv", label: "Streaming" },
    { icon: "Sparkles", label: "AI Tools" },
    { icon: "Palette", label: "Creative Apps" },
    { icon: "Briefcase", label: "Business Software" },
    { icon: "ShieldCheck", label: "VPN" },
    { icon: "Zap", label: "Productivity" }
  ],
  showcase_cards: [],
  background_style: {},
  animations_enabled: true,
  status: "published",
  updated_at: new Date().toISOString()
};

/** Public read. Falls back to the original hardcoded Hero copy if Supabase isn't connected yet. */
export const getPublishedHeroContent = cache(async (): Promise<HeroContentRow> => {
  if (!isSupabaseConfigured()) return DEFAULT_HERO;

  const supabase = await createClient();
  const { data, error } = await supabase.from("hero_content").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_HERO;
  return data as HeroContentRow;
});

export async function getHeroContentAdmin(): Promise<HeroContentRow> {
  if (!isSupabaseConfigured()) return DEFAULT_HERO;

  const supabase = await createClient();
  const { data, error } = await supabase.from("hero_content").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_HERO;
  return data as HeroContentRow;
}

export async function updateHeroContent(patch: Partial<Omit<HeroContentRow, "id">>) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_content").update(patch).eq("id", 1);
  if (error) throw new Error(error.message);
}
