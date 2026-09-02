import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MediaItemRow, MediaFolderRow } from "@/types/database";

const BUCKET = "media";

// Folder organization — the `media_folders` table and these two functions
// exist so the schema is ready, but Milestone 1's Media Library UI is a
// flat grid (root folder only). Wire up folder navigation in Milestone 2.
export async function getMediaFolders(): Promise<MediaFolderRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("media_folders").select("*").order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as MediaFolderRow[];
}

export async function createMediaFolder(name: string, parent_id: string | null = null) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("media_folders").insert({ name, parent_id }).select().single();
  if (error) throw new Error(error.message);
  return data as MediaFolderRow;
}

export async function getMediaItems(folderId?: string | null): Promise<MediaItemRow[]> {
  const supabase = await createClient();
  let query = supabase.from("media_items").select("*").order("created_at", { ascending: false });
  query = folderId ? query.eq("folder_id", folderId) : query.is("folder_id", null);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as MediaItemRow[];
}

/**
 * Uploads a file to the `media` Storage bucket and records its metadata.
 * Called from a Server Action / Route Handler that receives a FormData file.
 */
export async function uploadMediaFile(
  file: File,
  opts: { folderId?: string | null; uploadedBy?: string | null; altText?: string | null } = {}
): Promise<MediaItemRow> {
  const supabase = await createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const path = `${opts.folderId ?? "root"}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type
  });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl }
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from("media_items")
    .insert({
      folder_id: opts.folderId ?? null,
      file_name: file.name,
      path,
      url: publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: opts.altText ?? null,
      uploaded_by: opts.uploadedBy ?? null
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as MediaItemRow;
}

export async function replaceMediaFile(id: string, file: File): Promise<MediaItemRow> {
  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase.from("media_items").select("*").eq("id", id).single();
  if (fetchError || !existing) throw new Error(fetchError?.message ?? "Media item not found");

  const row = existing as MediaItemRow;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(row.path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await supabase
    .from("media_items")
    .update({ file_name: file.name, mime_type: file.type, size_bytes: file.size })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as MediaItemRow;
}

export async function deleteMediaItem(id: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("media_items").select("path").eq("id", id).single();
  if (existing) {
    await supabase.storage.from(BUCKET).remove([(existing as { path: string }).path]);
  }
  const { error } = await supabase.from("media_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
