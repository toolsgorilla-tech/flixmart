import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
      <div>
        <h2 className="font-display text-sm font-bold text-white">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
