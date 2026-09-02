"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { updateSiteSettings } from "@/features/settings/api";
import type { SiteSettingsRow } from "@/types/database";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateSettingsAction(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  await requireRole("admin");

  try {
    const patch: Partial<Omit<SiteSettingsRow, "id">> = {
      business_name: String(formData.get("business_name") ?? ""),
      tagline: String(formData.get("tagline") ?? "") || null,
      logo_url: String(formData.get("logo_url") ?? "") || null,
      favicon_url: String(formData.get("favicon_url") ?? "") || null,
      whatsapp: String(formData.get("whatsapp") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      address: String(formData.get("address") ?? "") || null,
      google_analytics_id: String(formData.get("google_analytics_id") ?? "") || null,
      meta_pixel_id: String(formData.get("meta_pixel_id") ?? "") || null,
      default_currency: String(formData.get("default_currency") ?? "PKR"),
      social_links: {
        facebook: String(formData.get("social_facebook") ?? ""),
        instagram: String(formData.get("social_instagram") ?? ""),
        twitter: String(formData.get("social_twitter") ?? ""),
        youtube: String(formData.get("social_youtube") ?? "")
      },
      theme: {
        paymentAccount: String(formData.get("payment_account") ?? "03044603133")
      }
    };

    await updateSiteSettings(patch);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save settings." };
  }
}
