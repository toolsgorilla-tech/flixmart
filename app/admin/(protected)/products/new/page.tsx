import { getAllCategories } from "@/features/categories/api";
import { createProductAction } from "../actions";
import ProductForm from "../ProductForm";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">New Product</h1>
        <p className="mt-1 text-sm text-slate-400">Fill in the details below to add it to your catalog.</p>
      </div>
      <ProductForm categories={categories} action={createProductAction} submitLabel="Create Product" />
    </div>
  );
}
