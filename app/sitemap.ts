import { MetadataRoute } from "next";
import { getPublishedProducts } from "@/features/products/api";

// Dynamic route (reads from the database via getPublishedProducts, which
// falls back to the static catalog when Supabase isn't configured) —
// products created through the Admin Dashboard are indexed automatically
// without a code change or redeploy.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://flixmart.online";
  const staticRoutes = ["", "/products", "/about", "/contact", "/faq", "/privacy-policy", "/terms", "/refund-policy"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7
    })
  );

  const products = await getPublishedProducts();
  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [...staticRoutes, ...productRoutes];
}
