"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Trash2, Pencil, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { deleteProductAction, duplicateProductAction, bulkUpdateAction } from "./actions";
import type { ProductWithPlans } from "@/types/database";

export default function ProductTable({ initialProducts }: { initialProducts: ProductWithPlans[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this product permanently?")) return;
    startTransition(async () => {
      await deleteProductAction(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    });
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      await duplicateProductAction(id);
      router.refresh();
    });
  }

  function handleBulk(patch: Parameters<typeof bulkUpdateAction>[1]) {
    if (selected.size === 0) return;
    startTransition(async () => {
      await bulkUpdateAction([...selected], patch);
      setSelected(new Set());
      router.refresh();
    });
  }

  const lowestPrice = (p: ProductWithPlans) =>
    p.product_plans.length ? Math.min(...p.product_plans.map((pl) => Number(pl.price))) : null;

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-2.5">
          <span className="text-xs font-semibold text-red-200">{selected.size} selected</span>
          <Button size="sm" variant="secondary" disabled={isPending} onClick={() => handleBulk({ status: "published" })}>
            Publish
          </Button>
          <Button size="sm" variant="secondary" disabled={isPending} onClick={() => handleBulk({ status: "draft" })}>
            Unpublish
          </Button>
          <Button size="sm" variant="secondary" disabled={isPending} onClick={() => handleBulk({ is_featured: true })}>
            Mark Featured
          </Button>
          <Button size="sm" variant="secondary" disabled={isPending} onClick={() => handleBulk({ is_trending: true })}>
            Mark Trending
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all products"
                  checked={selected.size === products.length && products.length > 0}
                  onChange={(e) =>
                    setSelected(e.target.checked ? new Set(products.map((p) => p.id)) : new Set())
                  }
                />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/[0.04] last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${p.name}`}
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">/{p.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={p.status === "published" ? "success" : "warning"}>{p.status}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-300">{(() => { const price = lowestPrice(p); return price != null ? `Rs ${price.toLocaleString("en-PK")}` : "—"; })()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {p.is_featured && (
                      <Badge tone="info">
                        <Star size={10} /> Featured
                      </Badge>
                    )}
                    {p.is_trending && (
                      <Badge tone="warning">
                        <TrendingUp size={10} /> Trending
                      </Badge>
                    )}
                    {p.badge && <Badge tone="neutral">{p.badge}</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      title="Edit"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      onClick={() => handleDuplicate(p.id)}
                      title="Duplicate"
                      aria-label={`Duplicate ${p.name}`}
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => handleDelete(p.id)}
                      title="Delete"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
          No products yet — create your first one.
        </p>
      )}
    </div>
  );
}
