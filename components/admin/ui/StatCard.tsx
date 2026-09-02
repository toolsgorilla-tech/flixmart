import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-red-300",
  hint
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <span className={cn("rounded-lg bg-white/[0.06] p-2", accent)}>
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
