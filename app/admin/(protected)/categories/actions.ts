"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createCategory, updateCategory, deleteCategory, reorderCategories, type CategoryInput } from "@/features/categories/api";

export interface CategoryFormState {
  error?: string;
  success?: boolean;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveCategoryAction(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireRole("manager");

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const input: CategoryInput = {
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    name,
    description: String(formData.get("description") ?? "") || null,
    icon: String(formData.get("icon") ?? "Package"),
    is_active: formData.get("is_active") === "on"
  };

  try {
    if (id) {
      await updateCategory(id, input);
    } else {
      await createCategory(input);
    }
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save category." };
  }
}

export async function deleteCategoryAction(id: string) {
  await requireRole("manager");
  await deleteCategory(id);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function reorderCategoriesAction(order: { id: string; sort_order: number }[]) {
  await requireRole("editor");
  await reorderCategories(order);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
