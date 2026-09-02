import { getAllProductsAdmin } from "@/features/products/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import { LinkButton } from "@/components/admin/ui/Button";
import { Plus } from "lucide-react";
import ProductTable from "./ProductTable";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  const configured = isSupabaseConfigured();
  const products = configured ? await getAllProductsAdmin() : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-slate-400">Create, edit and manage every subscription in your catalog.</p>
        </div>
        <LinkButton href="/admin/products/new" size="sm">
          <Plus size={15} /> New Product
        </LinkButton>
      </div>

      {!configured ? (
        <NotConfiguredNotice title="Connect Supabase to manage products" />
      ) : (
        <ProductTable initialProducts={products} />
      )}
    </div>
  );
}
