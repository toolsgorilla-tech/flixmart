"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Card, CardBody } from "@/components/admin/ui/Card";
import { Input, Textarea, Label, FieldGroup } from "@/components/admin/ui/Field";
import { Switch } from "@/components/admin/ui/Switch";
import { Button } from "@/components/admin/ui/Button";
import { SubmitButton } from "@/components/admin/ui/SubmitButton";
import { Badge } from "@/components/admin/ui/Badge";
import { saveCategoryAction, deleteCategoryAction, type CategoryFormState } from "./actions";
import type { CategoryRow } from "@/types/database";

const initialState: CategoryFormState = {};

function CategoryFormPanel({ category, onClose }: { category: CategoryRow | null; onClose: () => void }) {
  const [state, formAction] = useFormState(saveCategoryAction, initialState);
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="border-red-500/20">
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-white">{category ? "Edit Category" : "New Category"}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {state.error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">{state.error}</p>}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={category?.id ?? ""} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={category?.name} required />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="slug" hint="auto-generated if empty">Slug</Label>
              <Input id="slug" name="slug" defaultValue={category?.slug} placeholder="e.g. streaming-entertainment" />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={category?.description ?? ""} rows={2} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="icon" hint="lucide-react icon name">Icon</Label>
            <Input id="icon" name="icon" defaultValue={category?.icon ?? "Package"} placeholder="e.g. Tv, Film, Bot" />
          </FieldGroup>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
            <span className="text-sm font-semibold text-white">Active</span>
            <Switch checked={isActive} onChange={setIsActive} />
            <input type="hidden" name="is_active" value={isActive ? "on" : "off"} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton>Save Category</SubmitButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default function CategoryManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<CategoryRow | null | "new">(null);

  // initialCategories is a new array each time the parent Server Component
  // re-fetches (e.g. after router.refresh()) — useState only seeds the
  // *initial* value, so without this the list would go stale after a save.
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products in it will keep their data but lose the category link.")) return;
    await deleteCategoryAction(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus size={15} /> New Category
        </Button>
      </div>

      {editing && (
        <CategoryFormPanel
          category={editing === "new" ? null : editing}
          onClose={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{cat.name}</p>
                  <p className="truncate text-xs text-slate-500">/{cat.slug}</p>
                </div>
                <Badge tone={cat.is_active ? "success" : "neutral"}>{cat.is_active ? "Active" : "Hidden"}</Badge>
              </div>
              {cat.description && <p className="mt-2 line-clamp-2 text-xs text-slate-400">{cat.description}</p>}
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(cat)}>
                  <Pencil size={13} /> Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(cat.id)} aria-label={`Delete ${cat.name}`}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
          No categories yet — create your first one above.
        </p>
      )}
    </div>
  );
}
