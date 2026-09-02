/** @type {import('next').NextConfig} */

// Derive the Supabase Storage hostname from the project URL so uploaded
// media (product images, logos, etc.) can be optimized by next/image.
// Falls back gracefully if the env var isn't set yet (e.g. first install,
// before .env.local is configured) — image optimization for Supabase URLs
// just won't be available until it is.
function supabaseImagePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    return { protocol: "https", hostname };
  } catch {
    return null;
  }
}

const supabasePattern = supabaseImagePattern();

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Deliberately NOT a "**" wildcard — that would let next/image proxy
    // (and thereby fetch, on the server) an arbitrary URL supplied by any
    // Editor/Manager pasting an image link into the CMS, which is an easy
    // SSRF-style footgun. Only known, intentional sources are allowed:
    // the original static catalog's Unsplash images, and this project's
    // own Supabase Storage bucket.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabasePattern ? [supabasePattern] : [])
    ]
  }
};

export default nextConfig;
