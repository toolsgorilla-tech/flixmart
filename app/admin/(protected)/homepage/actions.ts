"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import {
  toggleSectionEnabled,
  reorderSections,
  duplicateSection,
  deleteSection,
  publishSection,
  saveSectionDraft
} from "@/features/homepage/api";

export async function toggleSectionAction(id: string, enabled: boolean) {
  await requireRole("editor");
  await toggleSectionEnabled(id, enabled);
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function reorderSectionsAction(order: { id: string; sort_order: number }[]) {
  await requireRole("editor");
  await reorderSections(order);
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function duplicateSectionAction(id: string) {
  await requireRole("editor");
  await duplicateSection(id);
  revalidatePath("/admin/homepage");
}

export async function deleteSectionAction(id: string) {
  await requireRole("manager");
  await deleteSection(id);
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function publishSectionAction(id: string) {
  await requireRole("editor");
  await publishSection(id);
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function saveSectionDraftAction(id: string, content: Record<string, unknown>) {
  await requireRole("editor");
  await saveSectionDraft(id, content);
  revalidatePath("/admin/homepage");
}
