import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { Database } from "@/types/database";

const NOT_CONFIGURED_MESSAGE =
  "Supabase isn't connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local (see SETUP.md), then reload.";

/**
 * Supabase client for use inside Server Components, Server Actions and
 * Route Handlers. Must be created fresh per-request (it closes over the
 * request's cookie jar for session handling) — never module-level cache it.
 *
 * Throws a clear, actionable error if Supabase env vars are missing,
 * rather than letting the underlying library throw its own cryptic
 * "supabaseUrl is required" error. This is deliberate, not a bug: every
 * public data fetcher (each feature module's getPublished-/getActive-
 * prefixed functions) already checks isSupabaseConfigured() before ever
 * calling this, so they never hit this throw. Admin-only functions don't
 * — the admin route tree is gated by lib/auth.ts's
 * requireUser()/requireRole(), which already short-circuits to a login
 * redirect when unconfigured, so this throw is a defense-in-depth
 * backstop, not the primary guard. When it does fire, the admin error
 * boundary catches it and shows this message directly instead of a raw
 * crash.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }

  // Next.js 14: cookies() is synchronous. (This function itself stays
  // `async` so every call site can keep using `await createClient()`
  // unchanged if the project ever upgrades to Next 15, where cookies()
  // becomes a Promise.)
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // Called from a Server Component with no request context to
            // write to — safe to ignore because middleware refreshes the
            // session on every request anyway.
          }
        }
      }
    }
  );
}

/**
 * Service-role client for privileged server-only operations (e.g. admin
 * user management). NEVER import this from a Client Component or expose
 * `SUPABASE_SERVICE_ROLE_KEY` to the browser.
 */
export function createAdminClient() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }

  return createSupabaseJsClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
