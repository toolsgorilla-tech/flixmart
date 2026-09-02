"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createTestimonial, updateTestimonial, deleteTestimonial, type TestimonialInput } from "@/features/testimonials/api";

export interface TestimonialFormState {
  error?: string;
  success?: boolean;
}

export async function saveTestimonialAction(_prev: TestimonialFormState, formData: FormData): Promise<TestimonialFormState> {
  await requireRole("editor");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  if (!name || !quote) return { error: "Name and quote are required." };

  const input: TestimonialInput = {
    name,
    quote,
    location: String(formData.get("location") ?? "") || null,
    country: String(formData.get("country") ?? "") || null,
    product: String(formData.get("product") ?? "") || null,
    rating: Number(formData.get("rating") ?? 5),
    is_published: formData.get("is_published") === "on"
  };

  try {
    if (id) await updateTestimonial(id, input);
    else await createTestimonial(input);
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save testimonial." };
  }
}

export async function deleteTestimonialAction(id: string) {
  await requireRole("editor");
  await deleteTestimonial(id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
