import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { AppRole, Profile } from "@/types/database";

export interface CurrentUser {
  id: string;
  email: string | null;
  profile: Profile;
}

/**
 * Returns the logged-in admin user + profile, or null if not authenticated
 * (or if Supabase isn't configured yet — there's no backend to check a
 * session against, so treat that the same as "not logged in" rather than
 * throwing). Every protected admin page and server action funnels through
 * this via requireUser()/requireRole(), so this guard is what keeps the
 * whole /admin area from crashing before Supabase is connected.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return null;

  return { id: user.id, email: user.email ?? null, profile: profile as Profile };
}

/** Redirects to /admin/login when there's no session. Use at the top of protected Server Components. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

const ROLE_RANK: Record<AppRole, number> = { editor: 1, manager: 2, admin: 3 };

/** Redirects to the dashboard (with an error flag) if the user's role is below `minRole`. */
export async function requireRole(minRole: AppRole): Promise<CurrentUser> {
  const user = await requireUser();
  if (ROLE_RANK[user.profile.role] < ROLE_RANK[minRole]) {
    redirect("/admin/dashboard?error=forbidden");
  }
  return user;
}
