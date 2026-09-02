"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createFaq, updateFaq, deleteFaq, type FaqInput } from "@/features/faq/api";

export interface FaqFormState {
  error?: string;
  success?: boolean;
}

export async function saveFaqAction(_prev: FaqFormState, formData: FormData): Promise<FaqFormState> {
  await requireRole("editor");
  const id = String(formData.get("id") ?? "");
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) return { error: "Question and answer are required." };

  const input: FaqInput = { question, answer, is_published: formData.get("is_published") === "on" };

  try {
    if (id) await updateFaq(id, input);
    else await createFaq(input);
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save FAQ." };
  }
}

export async function deleteFaqAction(id: string) {
  await requireRole("editor");
  await deleteFaq(id);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}
