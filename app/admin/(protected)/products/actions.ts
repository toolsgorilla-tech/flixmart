"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  bulkUpdateProducts,
  type ProductInput
} from "@/features/products/api";
import type { ContentStatus, ProductBadge } from "@/types/database";

export interface ProductFormState {
  error?: string;
}

const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/, "Slug can only contain lowercase letters, numbers and hyphens.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft")
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseFaqs(raw: string): { question: string; answer: string }[] {
  return raw
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [q, ...a] = block.split("\n");
      return { question: (q ?? "").replace(/^Q:\s*/, "").trim(), answer: a.join(" ").replace(/^A:\s*/, "").trim() };
    })
    .filter((f) => f.question && f.answer);
}

// The form has no dedicated UI for IPTV-specific metadata (isIPTV, iptvTier,
// quality, contentRegions, etc.) — it round-trips through a hidden JSON
// field (see ProductForm.tsx) so editing a product doesn't wipe those out.
// Falls back to `{}` for genuinely new products or if the field is missing.
function parseSpecifications(raw: string): Record<string, unknown> {
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function buildInputFromForm(formData: FormData): { input?: ProductInput; error?: string } {
  const coreParsed = productSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    status: String(formData.get("status") ?? "draft")
  });

  if (!coreParsed.success) {
    return { error: coreParsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const name = coreParsed.data.name;
  const planLabels = formData.getAll("plan_label") as string[];
  const planPrices = formData.getAll("plan_price") as string[];
  const planDurations = formData.getAll("plan_duration") as string[];
  const planOriginal = formData.getAll("plan_original_price") as string[];
  const planFree = formData.getAll("plan_is_free") as string[];
  const planTbd = formData.getAll("plan_price_tbd") as string[];
  const planBadge = formData.getAll("plan_badge") as string[];

  const plans = planLabels
    .map((label, i) => ({
      label,
      price: Number(planPrices[i] ?? 0) || 0,
      original_price: planOriginal[i] ? Number(planOriginal[i]) : null,
      duration: planDurations[i] || "1 month",
      is_free: planFree[i] === "true",
      price_tbd: planTbd[i] === "true",
      badge: planBadge[i] || null,
      sort_order: i
    }))
    .filter((p) => p.label.trim().length > 0);

  const badge = String(formData.get("badge") ?? "");
  const categoryId = String(formData.get("category_id") ?? "");

  const input: ProductInput = {
    slug: coreParsed.data.slug || slugify(name),
    name,
    category_id: categoryId || null,
    tagline: String(formData.get("tagline") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
    image_url: String(formData.get("image_url") ?? "") || null,
    brand_key: String(formData.get("brand_key") ?? "") || null,
    badge: (badge || null) as ProductBadge | null,
    delivery_time: String(formData.get("delivery_time") ?? "Within 30 minutes"),
    features: parseLines(String(formData.get("features") ?? "")),
    included: parseLines(String(formData.get("included") ?? "")),
    faqs: parseFaqs(String(formData.get("faqs") ?? "")),
    specifications: parseSpecifications(String(formData.get("specifications") ?? "")),
    is_featured: formData.get("is_featured") === "on",
    is_trending: formData.get("is_trending") === "on",
    status: coreParsed.data.status as ContentStatus,
    seo_title: String(formData.get("seo_title") ?? "") || null,
    seo_description: String(formData.get("seo_description") ?? "") || null,
    seo_keywords: String(formData.get("seo_keywords") ?? "") || null,
    plans
  };

  return { input };
}

export async function createProductAction(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireRole("editor");

  let newProductId: string;
  try {
    const { input, error } = buildInputFromForm(formData);
    if (error || !input) return { error: error ?? "Invalid input." };
    const product = await createProduct(input);
    newProductId = product.id;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect(`/admin/products/${newProductId}`);
}

export async function updateProductAction(id: string, _prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireRole("editor");
  try {
    const { input, error } = buildInputFromForm(formData);
    if (error || !input) return { error: error ?? "Invalid input." };
    await updateProduct(id, input);
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/products");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update product." };
  }
}

export async function deleteProductAction(id: string) {
  await requireRole("manager");
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function duplicateProductAction(id: string) {
  await requireRole("editor");
  await duplicateProduct(id);
  revalidatePath("/admin/products");
}

export async function bulkUpdateAction(ids: string[], patch: { status?: ContentStatus; is_featured?: boolean; is_trending?: boolean }) {
  await requireRole("editor");
  await bulkUpdateProducts(ids, patch);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
