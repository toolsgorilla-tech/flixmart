import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Star, Zap, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import { categories as staticCategories } from "@/lib/data";
import { formatPlanPrice, productWhatsappLink } from "@/lib/utils";
import { getBrandEmblem } from "@/lib/brandEmblems";

// Minimal shape needed to look up a category's display name — satisfied by
// both the static `lib/data.ts` categories and the DB-backed `CategoryRow`.
interface CategoryLookup {
  slug: string;
  name: string;
}

/**
 * `categories` is optional and falls back to the static list so this
 * component keeps working wherever it's used without a caller passing
 * anything in. Callers that already have the CMS/DB categories in scope
 * (ProductsExplorer, FeaturedProducts, RelatedProducts) should pass them
 * through so an admin-renamed category shows correctly here instead of
 * silently reading the original hardcoded name.
 */
export default function ProductCard({ product, categories }: { product: Product; categories?: CategoryLookup[] }) {
  const firstPlan = product.plans[0] || { price: 0, label: "1 Month" };
  const emblem = getBrandEmblem(product.brandKey);
  const category = (categories && categories.length > 0 ? categories : staticCategories).find(
    (c) => c.slug === product.category
  );

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827] p-3 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_20px_50px_-24px_rgba(227,6,19,0.35)]">
      {/* Premium Logo Container Area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#151B26] via-[#111827] to-[#0B0F17]"
      >
        {/* Cover Background Image with Overlay */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover opacity-10 filter blur-[3px] transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F]/70 via-transparent to-transparent" />

        {/* Centered Premium Brand Emblem Focal Point */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 ${emblem.className}`}
          >
            {emblem.content}
          </div>
        </div>

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Delivery Time Badge */}
        <span className="absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-md border border-white/10">
          <Zap size={11} className="text-amber-400" /> {product.deliveryTime}
        </span>
      </Link>

      {/* Card Content Area */}
      <div className="flex flex-1 flex-col justify-between p-3 pt-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link href={`/products/${product.slug}`} className="min-w-0">
              <h3 className="truncate font-display text-base font-bold text-white transition-colors group-hover:text-red-400">
                {product.name}
              </h3>
            </Link>
            {category && (
              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {category.name}
              </span>
            )}
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {product.tagline}
          </p>

          {product.isIPTV && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-400/20">
                {product.iptvTier} Plan
              </span>
              {product.quality && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300 ring-1 ring-white/10">
                  {product.quality}
                </span>
              )}
            </div>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mt-2.5 flex items-center gap-1 text-xs text-slate-400">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-200">{product.rating}</span>
              <span>({product.reviews} reviews)</span>
            </div>
          )}
        </div>

        {/* Pricing Area */}
        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Starting From
          </p>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="font-mono text-base font-extrabold text-white">
              {formatPlanPrice(firstPlan)}
            </span>
            {!firstPlan.isFree && !firstPlan.priceTBD && (
              <span className="text-xs text-slate-400">
                /{firstPlan.label}
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-3 flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-red-600"
            >
              View Plans <ChevronRight size={13} />
            </Link>
            <a
              href={productWhatsappLink(product.name, firstPlan.label)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#20bd5a]"
            >
              <MessageCircle size={17} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
