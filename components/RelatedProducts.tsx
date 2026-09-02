import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import type { CategoryRow } from "@/types/database";

/**
 * Renders a pre-filtered list of related products. Filtering by category
 * happens at the data layer (features/products/api.ts's getRelatedProducts,
 * a scoped DB query) rather than here, so this component doesn't need to
 * re-derive "related" from the full catalog.
 */
export default function RelatedProducts({
  products,
  categories
}: {
  products: Product[];
  categories?: CategoryRow[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="section py-12">
      <SectionHeading eyebrow="Recommendations" title="You Might Also Like" center={false} />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} categories={categories} />
        ))}
      </div>
    </section>
  );
}
