/**
 * The repo must run (npm run dev / build) even before a Supabase project
 * is connected — e.g. a fresh clone with no .env yet. Public-facing data
 * fetchers check this first and fall back to the original lib/data.ts
 * content so the site never breaks; admin pages surface a clear "connect
 * Supabase" notice instead of throwing.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
