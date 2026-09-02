import { getAllCategories } from "@/features/categories/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import CategoryManager from "./CategoryManager";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const configured = isSupabaseConfigured();
  const categories = configured ? await getAllCategories() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Categories</h1>
        <p className="mt-1 text-sm text-slate-400">Manage the product categories shown across the marketplace.</p>
      </div>

      {!configured ? (
        <NotConfiguredNotice title="Connect Supabase to manage categories" />
      ) : (
        <CategoryManager initialCategories={categories} />
      )}
    </div>
  );
}
