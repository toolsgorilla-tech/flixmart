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
import { saveFaqAction, deleteFaqAction, type FaqFormState } from "./actions";
import type { FaqRow } from "@/types/database";

const initialState: FaqFormState = {};

function FaqFormPanel({ faq, onClose }: { faq: FaqRow | null; onClose: () => void }) {
  const [state, formAction] = useFormState(saveFaqAction, initialState);
  const [isPublished, setIsPublished] = useState(faq?.is_published ?? true);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="border-red-500/20">
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-white">{faq ? "Edit FAQ" : "New FAQ"}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={16} />
          </button>
        </div>
        {state.error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">{state.error}</p>}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={faq?.id ?? ""} />
          <FieldGroup>
            <Label htmlFor="question">Question</Label>
            <Input id="question" name="question" defaultValue={faq?.question} required />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" name="answer" defaultValue={faq?.answer} rows={3} required />
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

export default function FaqManager({ initialFaqs }: { initialFaqs: FaqRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialFaqs);
  const [editing, setEditing] = useState<FaqRow | null | "new">(null);

  useEffect(() => {
    setItems(initialFaqs);
  }, [initialFaqs]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await deleteFaqAction(id);
    setItems((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus size={15} /> New FAQ
        </Button>
      </div>

      {editing && (
        <FaqFormPanel
          faq={editing === "new" ? null : editing}
          onClose={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      <div className="space-y-2.5">
        {items.map((f) => (
          <Card key={f.id}>
            <CardBody className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{f.question}</p>
                  <Badge tone={f.is_published ? "success" : "neutral"}>{f.is_published ? "Live" : "Hidden"}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-400">{f.answer}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(f)} aria-label={`Edit "${f.question}"`}>
                  <Pencil size={13} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(f.id)} aria-label={`Delete "${f.question}"`}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
          No FAQs yet.
        </p>
      )}
    </div>
  );
}
