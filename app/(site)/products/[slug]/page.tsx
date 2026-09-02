import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Star, ChevronRight, Tv } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import { getPublishedProductBySlug, getRelatedProducts } from "@/features/products/api";
import { getActiveCategories } from "@/features/categories/api";
import PlanSelector from "@/components/PlanSelector";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedProducts from "@/components/RelatedProducts";
import SectionHeading from "@/components/SectionHeading";
import IPTVComparisonTable from "@/components/IPTVComparisonTable";

// Pre-renders the original static catalog's slugs at build time; any
// product added later through the Admin Dashboard is still served
// correctly, just rendered on-demand on first visit instead of
// pre-built (Next's default `dynamicParams` behavior).
export function generateStaticParams() {
  return staticProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getPublishedProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: `${product.name} | FlixMart`, description: product.tagline, images: [product.image] },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | FlixMart`,
      description: product.tagline,
      images: [product.image]
    }
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getPublishedProductBySlug(params.slug);
  if (!product) return notFound();

  const [categories, relatedProducts] = await Promise.all([
    getActiveCategories(),
    getRelatedProducts(product.category, product.slug)
  ]);

  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="pb-16">
      {/* Breadcrumb Header */}
      <div className="section pt-6 pb-2">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-slate-900 dark:hover:text-white">Products</Link>
          <ChevronRight size={12} />
          <Link href={`/products?category=${product.category}`} className="hover:text-slate-900 dark:hover:text-white">{category?.name}</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-slate-900 dark:text-white">{product.name}</span>
        </nav>
      </div>

      {/* Main Hero & Purchase Column */}
      <section className="section grid grid-cols-1 gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover"
              priority
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          <div className="mt-6">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {product.name}
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{product.tagline}</p>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              {product.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{product.rating}</span> ({product.reviews} reviews)
                </span>
              )}
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Clock size={14} /> {product.deliveryTime}
              </span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PlanSelector productName={product.name} productSlug={product.slug} plans={product.plans} />
        </div>
      </section>

      {/* IPTV Specific Tier Details (Only if IPTV product) */}
      {product.isIPTV && (
        <section className="section py-8">
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 sm:p-8 dark:border-red-950 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Tv size={20} />
              <h2 className="font-display text-lg font-bold">IPTV {product.iptvTier} Package Overview</h2>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">Streaming Quality</p>
                <p className="mt-1 font-bold text-slate-900 dark:text-white">{product.quality || "FHD / 4K"}</p>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">EPG Program Guide</p>
                <p className="mt-1 font-bold text-slate-900 dark:text-white">{product.epgSupported ? "Supported" : "N/A"}</p>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">Free 24h Trial</p>
                <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">Available (FREE)</p>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-medium text-slate-400">Supported Devices</p>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">Smart TV, Firestick, Mobile</p>
              </div>
            </div>

            {product.contentRegions && product.contentRegions.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Configured Content Regions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.contentRegions.map((region) => (
                    <span key={region} className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features & Included */}
      <section className="section grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Product Features</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">What's Included</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {product.included.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
            <Clock size={18} className="text-emerald-500" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Delivery Time</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{product.deliveryTime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* IPTV Full Comparison Section (Shown on IPTV pages) */}
      {product.isIPTV && (
        <section className="section py-10">
          <SectionHeading
            eyebrow="Tier Comparison"
            title="Compare IPTV Packages"
            description="Choose the right IPTV subscription for your entertainment needs."
          />
          <div className="mt-8">
            <IPTVComparisonTable />
          </div>
        </section>
      )}

      {/* Product FAQs */}
      <section className="section py-8">
        <SectionHeading eyebrow="FAQ" title={`Questions about ${product.name}`} center={false} />
        <div className="mt-6 max-w-3xl">
          <FAQAccordion items={product.faqs} />
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} categories={categories} />
    </div>
  );
}
