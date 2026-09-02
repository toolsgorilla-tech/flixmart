"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Supabase client for use inside Client Components ("use client" files).
 * Reads the public URL/anon key from env — safe to expose to the browser.
 *
 * Not yet used anywhere: every mutation in Milestone 1 goes through Server
 * Actions (app/admin/**\/actions.ts) instead, which is generally preferable
 * for a CMS since it keeps writes server-authoritative. This is here for
 * future client-side needs — e.g. Supabase Realtime subscriptions for a
 * live-updating dashboard — not dead code left by accident.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
