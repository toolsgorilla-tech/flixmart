"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Copy, Trash2, Eye, EyeOff, CheckCircle2, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "@/components/admin/ui/Switch";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import type { HomepageSectionRow } from "@/types/database";
import {
  toggleSectionAction,
  reorderSectionsAction,
  duplicateSectionAction,
  deleteSectionAction,
  publishSectionAction
} from "./actions";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  categories: "Category Grid",
  featured_products: "Featured Products",
  why_choose_us: "Why Choose Us",
  testimonials: "Testimonials",
  faq: "FAQ Preview",
  cta_banner: "CTA Banner",
  newsletter: "Newsletter",
  custom: "Custom Section"
};

export default function SectionBuilder({ initialSections }: { initialSections: HomepageSectionRow[] }) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [dragId, setDragId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  function persistOrder(next: HomepageSectionRow[]) {
    setSections(next);
    startTransition(() => {
      reorderSectionsAction(next.map((s, i) => ({ id: s.id, sort_order: i })));
    });
  }

  function moveSection(id: string, direction: -1 | 1) {
    const from = sections.findIndex((s) => s.id === id);
    const to = from + direction;
    if (from === -1 || to < 0 || to >= sections.length) return;

    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = sections.findIndex((s) => s.id === dragId);
    const to = sections.findIndex((s) => s.id === targetId);
    if (from === -1 || to === -1) return;

    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  function handleToggle(id: string, enabled: boolean) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, is_enabled: enabled } : s)));
    startTransition(() => toggleSectionAction(id, enabled));
  }

  function handleDuplicate(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await duplicateSectionAction(id);
      setBusyId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this section? This can't be undone.")) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteSectionAction(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      setBusyId(null);
    });
  }

  function handlePublish(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await publishSectionAction(id);
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status: "published" } : s)));
      setBusyId(null);
    });
  }

  return (
    <div className="space-y-2.5">
      {isPending && (
        <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
          <Loader2 size={13} className="animate-spin" /> Saving order…
        </div>
      )}

      {sections.map((section, index) => (
        <div
          key={section.id}
          draggable
          onDragStart={() => setDragId(section.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(section.id)}
          className={`flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 backdrop-blur-xl transition-opacity ${
            dragId === section.id ? "opacity-50" : "opacity-100"
          } ${!section.is_enabled ? "opacity-60" : ""}`}
        >
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => moveSection(section.id, -1)}
              disabled={index === 0}
              aria-label={`Move ${section.title || section.type} up`}
              className="rounded p-0.5 text-slate-500 hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <span className="cursor-grab text-slate-500 active:cursor-grabbing" aria-hidden="true">
              <GripVertical size={16} />
            </span>
            <button
              type="button"
              onClick={() => moveSection(section.id, 1)}
              disabled={index === sections.length - 1}
              aria-label={`Move ${section.title || section.type} down`}
              className="rounded p-0.5 text-slate-500 hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-white">{section.title || SECTION_LABELS[section.type] || section.type}</p>
              <Badge tone={section.status === "published" ? "success" : "warning"}>{section.status}</Badge>
              {!section.is_enabled && <Badge tone="neutral">Disabled</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Type: {SECTION_LABELS[section.type] ?? section.type}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {section.status !== "published" && (
              <Button size="sm" variant="secondary" disabled={busyId === section.id} onClick={() => handlePublish(section.id)}>
                <CheckCircle2 size={14} /> Publish
              </Button>
            )}
            <Switch checked={section.is_enabled} onChange={(v) => handleToggle(section.id, v)} label="Toggle section" />
            <button
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              onClick={() => handleDuplicate(section.id)}
              disabled={busyId === section.id}
              title="Duplicate"
            >
              <Copy size={15} />
            </button>
            <button
              className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={() => handleDelete(section.id)}
              disabled={busyId === section.id}
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
            {section.is_enabled ? (
              <Eye size={15} className="text-emerald-400" />
            ) : (
              <EyeOff size={15} className="text-slate-600" />
            )}
          </div>
        </div>
      ))}

      {sections.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
          No homepage sections yet. Run the seed migration to populate the default set.
        </p>
      )}
    </div>
  );
}
