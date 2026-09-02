"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Search, Grid3x3, List, Trash2, Copy, Check } from "lucide-react";
import { Input } from "@/components/admin/ui/Field";
import { Button } from "@/components/admin/ui/Button";
import { uploadMediaAction, deleteMediaAction } from "./actions";
import type { MediaItemRow } from "@/types/database";

export default function MediaGrid({ initialItems }: { initialItems: MediaItemRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((i) => i.file_name.toLowerCase().includes(search.toLowerCase()));

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);

    const result = await uploadMediaAction({}, formData);
    setUploading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this file? Anything referencing it will break.")) return;
    startTransition(async () => {
      await deleteMediaAction(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  function copyUrl(item: MediaItemRow) {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input placeholder="Search media…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-lg p-1.5 ${view === "grid" ? "bg-white/10 text-white" : "text-slate-500"}`}
          >
            <Grid3x3 size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-lg p-1.5 ${view === "list" ? "bg-white/10 text-white" : "text-slate-500"}`}
          >
            <List size={16} />
          </button>
        </div>
        <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload size={14} /> {uploading ? "Uploading…" : "Upload"}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">{error}</p>}

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
              <Image
                src={item.url}
                alt={item.alt_text ?? item.file_name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-[11px] font-semibold text-white">{item.file_name}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyUrl(item)}
                    aria-label={`Copy URL for ${item.file_name}`}
                    className="flex-1 rounded-lg bg-white/10 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
                  >
                    {copiedId === item.id ? <Check size={12} className="mx-auto" /> : <Copy size={12} className="mx-auto" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    aria-label={`Delete ${item.file_name}`}
                    className="flex-1 rounded-lg bg-red-500/20 py-1 text-[11px] font-semibold text-red-200 hover:bg-red-500/30"
                  >
                    <Trash2 size={12} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
              <Image
                src={item.url}
                alt={item.alt_text ?? item.file_name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{item.file_name}</p>
                <p className="text-xs text-slate-500">{item.mime_type}</p>
              </div>
              <button
                onClick={() => copyUrl(item)}
                aria-label={`Copy URL for ${item.file_name}`}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                aria-label={`Delete ${item.file_name}`}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
          No media yet — upload your first file.
        </p>
      )}
    </div>
  );
}
