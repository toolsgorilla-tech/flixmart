import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { SITE } from "@/lib/data";
import type { SiteSettingsRow } from "@/types/database";

const DEFAULT_SETTINGS: SiteSettingsRow = {
  id: 1,
  business_name: SITE.name,
  tagline: SITE.tagline,
  logo_url: null,
  favicon_url: null,
  whatsapp: SITE.whatsapp,
  phone: null,
  email: SITE.email,
  address: null,
  social_links: {},
  theme: { paymentAccount: SITE.paymentAccount },
  google_analytics_id: null,
  meta_pixel_id: null,
  default_currency: SITE.currency,
  seo_defaults: {},
  updated_at: new Date().toISOString()
};

/**
 * Public read (also used by the admin dashboard). Falls back to
 * lib/data.ts's SITE constant. Cached per-request since Footer alone
 * calls this on every single page render.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettingsRow> => {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;

  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_SETTINGS;
  return data as SiteSettingsRow;
});

export async function updateSiteSettings(patch: Partial<Omit<SiteSettingsRow, "id">>) {
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(patch).eq("id", 1);
  if (error) throw new Error(error.message);
}
