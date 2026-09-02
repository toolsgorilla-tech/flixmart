import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Defense in depth alongside the `robots: { index: false }` metadata
      // already set on app/admin/layout.tsx — keeps the admin dashboard
      // out of crawl paths entirely, not just out of the index.
      disallow: ["/admin"]
    },
    sitemap: "https://flixmart.online/sitemap.xml"
  };
}
