"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { Card, CardBody } from "@/components/admin/ui/Card";
import { Input, Textarea, Select, Label, FieldGroup } from "@/components/admin/ui/Field";
import { Switch } from "@/components/admin/ui/Switch";
import { Button } from "@/components/admin/ui/Button";
import { SubmitButton } from "@/components/admin/ui/SubmitButton";
import { Badge } from "@/components/admin/ui/Badge";
import { saveTestimonialAction, deleteTestimonialAction, type TestimonialFormState } from "./actions";
import type { TestimonialRow } from "@/types/database";

const initialState: TestimonialFormState = {};

function TestimonialFormPanel({ testimonial, onClose }: { testimonial: TestimonialRow | null; onClose: () => void }) {
  const [state, formAction] = useFormState(saveTestimonialAction, initialState);
  const [isPublished, setIsPublished] = useState(testimonial?.is_published ?? true);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="border-red-500/20">
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-white">{testimonial ? "Edit Testimonial" : "New Testimonial"}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={16} />
          </button>
        </div>
        {state.error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">{state.error}</p>}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={testimonial?.id ?? ""} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={testimonial?.name} required />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={testimonial?.location ?? ""} placeholder="e.g. Lagos, Nigeria" />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="product">Product mentioned</Label>
              <Input id="product" name="product" defaultValue={testimonial?.product ?? ""} />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="rating">Rating</Label>
              <Select id="rating" name="rating" defaultValue={String(testimonial?.rating ?? 5)}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </Select>
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" name="quote" defaultValue={testimonial?.quote} rows={3} required />
          </FieldGroup>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
            <span className="text-sm font-semibold text-white">Published</span>
            <Switch checked={isPublished} onChange={setIsPublished} />
            <input type="hidden" name="is_published" value={isPublished ? "on" : "off"} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton>Save</SubmitButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default function TestimonialManager({ initialTestimonials }: { initialTestimonials: TestimonialRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialTestimonials);
  const [editing, setEditing] = useState<TestimonialRow | null | "new">(null);

  useEffect(() => {
    setItems(initialTestimonials);
  }, [initialTestimonials]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonialAction(id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus size={15} /> New Testimonial
        </Button>
      </div>

      {editing && (
        <TestimonialFormPanel
          testimonial={editing === "new" ? null : editing}
          onClose={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Card key={t.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.location}</p>
                </div>
                <Badge tone={t.is_published ? "success" : "neutral"}>{t.is_published ? "Live" : "Hidden"}</Badge>
              </div>
              <div className="mt-1.5 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-2 line-clamp-3 text-xs text-slate-400">"{t.quote}"</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(t)}>
                  <Pencil size={13} /> Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)} aria-label={`Delete testimonial from ${t.name}`}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
          No testimonials yet.
        </p>
      )}
    </div>
  );
}
