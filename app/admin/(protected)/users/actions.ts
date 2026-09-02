"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/types/database";

export interface InviteUserState {
  error?: string;
  success?: boolean;
}

/**
 * Invites a new staff user by email via Supabase Admin API (magic-link
 * style invite — they set their own password on first login) and assigns
 * their role. Requires SUPABASE_SERVICE_ROLE_KEY to be configured.
 */
export async function inviteUserAction(_prev: InviteUserState, formData: FormData): Promise<InviteUserState> {
  await requireRole("admin");

  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "editor") as AppRole;
  if (!email) return { error: "Email is required." };

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
    if (error) throw error;

    if (data?.user?.id) {
      const supabase = await createClient();
      await supabase.from("profiles").update({ role }).eq("id", data.user.id);
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to invite user." };
  }
}

export async function updateUserRoleAction(userId: string, role: AppRole) {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/users");
}
