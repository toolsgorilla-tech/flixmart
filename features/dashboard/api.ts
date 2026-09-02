import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [products, publishedProducts, categories, orderCount, revenueResult, customers, pendingOrders] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    // PostgREST aggregate — sums `total` in the database rather than
    // fetching every order row to add up in JS, which wouldn't scale as
    // order volume grows.
    supabase.from("orders").select("sum:total.sum()").single(),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending")
  ]);

  const totalRevenue = Number((revenueResult.data as { sum: number | null } | null)?.sum ?? 0);

  return {
    totalProducts: products.count ?? 0,
    publishedProducts: publishedProducts.count ?? 0,
    totalCategories: categories.count ?? 0,
    totalOrders: orderCount.count ?? 0,
    totalCustomers: customers.count ?? 0,
    totalRevenue,
    pendingOrders: pendingOrders.count ?? 0
  };
}
