import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import type { Database } from "@/types/database";
import type { AppRole } from "@/types/database";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

// Routes under /admin that require a specific minimum role beyond "editor".
// Managers/editors can reach most of the CMS; user management is admin-only.
const ADMIN_ONLY_PREFIXES = ["/admin/users"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Middleware runs on almost every request (see the matcher in
  // middleware.ts) — including the public site, not just /admin. Without
  // this guard, `createServerClient()` throws the moment
  // NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are unset, which would 500 every
  // single page (not just admin routes) before Supabase is connected.
  // Admin pages already render their own "connect Supabase" notices, so
  // the only extra behavior needed here is: don't gate /admin behind an
  // auth check that can never succeed without a backend to check against.
  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isLoginRoute = pathname === LOGIN_PATH;

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = new URL(LOGIN_PATH, request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (user && isAdminRoute && !isLoginRoute) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

    const role = profile?.role as AppRole | undefined;
    const needsAdmin = ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (needsAdmin && role !== "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard?error=forbidden", request.url));
    }
  }

  return response;
}
