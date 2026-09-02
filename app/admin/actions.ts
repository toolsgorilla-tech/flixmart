"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export interface LoginState {
  error?: string;
}

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase isn't connected yet — add your project credentials to .env.local first (see SETUP.md)." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const next = String(formData.get("next") ?? "/admin/dashboard");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect(next || "/admin/dashboard");
}

export async function logoutAction() {
  // Only reachable from inside the authenticated admin shell, which
  // requires Supabase to already be configured (see lib/auth.ts) — but
  // guard anyway rather than assume that invariant holds forever.
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
