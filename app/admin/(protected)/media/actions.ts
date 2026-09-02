"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { uploadMediaFile, deleteMediaItem, replaceMediaFile } from "@/features/media/api";

export interface MediaUploadState {
  error?: string;
}

export async function uploadMediaAction(_prev: MediaUploadState, formData: FormData): Promise<MediaUploadState> {
  const user = await requireRole("editor");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Choose a file to upload." };

  try {
    await uploadMediaFile(file, { uploadedBy: user.id });
    revalidatePath("/admin/media");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}

export async function deleteMediaAction(id: string) {
  await requireRole("editor");
  await deleteMediaItem(id);
  revalidatePath("/admin/media");
}

export async function replaceMediaAction(id: string, formData: FormData) {
  await requireRole("editor");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Choose a file to upload.");
  await replaceMediaFile(id, file);
  revalidatePath("/admin/media");
}
