import { Package, FolderTree, ShoppingCart, Users, DollarSign, Clock } from "lucide-react";
import { getDashboardStats } from "@/features/dashboard/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Card, CardHeader, CardBody } from "@/components/admin/ui/Card";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import { LinkButton } from "@/components/admin/ui/Button";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const stats = configured
    ? await getDashboardStats()
    : { totalProducts: 0, publishedProducts: 0, totalCategories: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0, pendingOrders: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Welcome back — here's how your marketplace is doing.</p>
      </div>

      {!configured && (
        <NotConfiguredNotice title="Supabase isn't connected yet">
          Add <code className="rounded bg-black/30 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> and{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5">.env.local</code>, run the migrations in{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5">supabase/migrations</code>, then reload. Until then the
          public site renders from the original static content and this dashboard can't read live data.
        </NotConfiguredNotice>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={stats.totalProducts} icon={Package} hint={`${stats.publishedProducts} published`} />
        <StatCard label="Categories" value={stats.totalCategories} icon={FolderTree} accent="text-purple-300" />
        <StatCard label="Orders" value={stats.totalOrders} icon={ShoppingCart} accent="text-emerald-300" hint={`${stats.pendingOrders} pending`} />
        <StatCard label="Customers" value={stats.totalCustomers} icon={Users} accent="text-sky-300" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatCard label="Total Revenue" value={`Rs ${stats.totalRevenue.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`} icon={DollarSign} accent="text-amber-300" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={Clock} accent="text-red-300" />
      </div>

      <Card>
        <CardHeader title="Quick actions" description="Jump straight into the most common management tasks." />
        <CardBody className="flex flex-wrap gap-3">
          <LinkButton href="/admin/products/new" variant="primary" size="sm">
            + New Product
          </LinkButton>
          <LinkButton href="/admin/homepage" variant="secondary" size="sm">
            Homepage Builder
          </LinkButton>
          <LinkButton href="/admin/hero" variant="secondary" size="sm">
            Edit Hero
          </LinkButton>
          <LinkButton href="/admin/media" variant="secondary" size="sm">
            Media Library
          </LinkButton>
          <LinkButton href="/admin/settings" variant="secondary" size="sm">
            Settings
          </LinkButton>
        </CardBody>
      </Card>
    </div>
  );
}
