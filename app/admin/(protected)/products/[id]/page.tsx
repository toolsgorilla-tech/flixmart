import { notFound } from "next/navigation";
import { getProductByIdAdmin } from "@/features/products/api";
import { getAllCategories } from "@/features/categories/api";
import { updateProductAction } from "../actions";
import ProductForm from "../ProductForm";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, categories] = await Promise.all([getProductByIdAdmin(id), getAllCategories()]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Edit Product</h1>
        <p className="mt-1 text-sm text-slate-400">{product.name}</p>
      </div>
      <ProductForm categories={categories} product={product} action={boundAction} submitLabel="Save Changes" />
    </div>
  );
}
