"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { updateHeroContent } from "@/features/hero/api";
import type { HeroContentRow } from "@/types/database";

export interface HeroFormState {
  error?: string;
  success?: boolean;
}

function parseChips(raw: string): { icon: string; label: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon, ...rest] = line.split("|").map((s) => s.trim());
      return { icon: icon || "Sparkles", label: rest.join("|") || icon };
    });
}

export async function updateHeroAction(_prev: HeroFormState, formData: FormData): Promise<HeroFormState> {
  await requireRole("editor");

  try {
    const patch: Partial<Omit<HeroContentRow, "id">> = {
      headline: String(formData.get("headline") ?? ""),
      headline_highlight: String(formData.get("headline_highlight") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      badge_text: String(formData.get("badge_text") ?? ""),
      primary_button_label: String(formData.get("primary_button_label") ?? ""),
      primary_button_url: String(formData.get("primary_button_url") ?? ""),
      secondary_button_label: String(formData.get("secondary_button_label") ?? ""),
      secondary_button_url: String(formData.get("secondary_button_url") ?? ""),
      animations_enabled: formData.get("animations_enabled") === "on",
      category_chips: parseChips(String(formData.get("category_chips") ?? "")),
      ticker_items: parseChips(String(formData.get("ticker_items") ?? ""))
    };

    await updateHeroContent(patch);
    revalidatePath("/admin/hero");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save hero content." };
  }
}
