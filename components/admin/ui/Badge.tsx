import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-white/10 text-slate-300 border-white/10",
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  danger: "bg-red-500/10 text-red-300 border-red-500/20",
  info: "bg-red-500/10 text-red-300 border-red-500/20"
};

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
