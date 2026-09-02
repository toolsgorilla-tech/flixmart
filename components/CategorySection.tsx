import Link from "next/link";
import { Tv, Film, Bot, Palette, ShieldCheck, Code2, Gamepad2, ArrowRight, LucideIcon, Video, BookOpen, Briefcase } from "lucide-react";
import { categories as staticCategories } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import type { CategoryRow } from "@/types/database";

// Exact unique Lucide icon + accent mapping for each of the 7 categories
const categoryConfig: Record<string, { icon: LucideIcon; color: string; ring: string; glow: string }> = {
  "ai-tools": { icon: Bot, color: "text-red-400", ring: "from-red-500/25 to-red-500/0", glow: "bg-red-500/15" },
  "graphics-video-tools": { icon: Palette, color: "text-amber-400", ring: "from-amber-500/25 to-amber-500/0", glow: "bg-amber-500/15" },
  "ai-videos": { icon: Video, color: "text-fuchsia-400", ring: "from-fuchsia-500/25 to-fuchsia-500/0", glow: "bg-fuchsia-500/15" },
  entertainment: { icon: Film, color: "text-purple-400", ring: "from-purple-500/25 to-purple-500/0", glow: "bg-purple-500/15" },
  "academic-writing-tools": { icon: BookOpen, color: "text-cyan-400", ring: "from-cyan-500/25 to-cyan-500/0", glow: "bg-cyan-500/15" },
  "business-tools": { icon: Briefcase, color: "text-blue-400", ring: "from-blue-500/25 to-blue-500/0", glow: "bg-blue-500/15" },
  vpn: { icon: ShieldCheck, color: "text-emerald-400", ring: "from-emerald-500/25 to-emerald-500/0", glow: "bg-emerald-500/15" },
  iptv: { icon: Tv, color: "text-emerald-400", ring: "from-emerald-500/25 to-emerald-500/0", glow: "bg-emerald-500/15" },
};

export default function CategorySection({ categories }: { categories?: CategoryRow[] }) {
  const list = categories && categories.length > 0 ? categories : staticCategories;

  return (
    <section className="section py-16 sm:py-24">
      <SectionHeading
        eyebrow="Marketplace Categories"
        title="Explore Subscription Categories"
        description="IPTV live channels, 4K streaming, AI tools, creative software, VPN privacy & developer solutions."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((c) => {
          const config = categoryConfig[c.slug] || {
            icon: Bot,
            color: "text-red-400",
            ring: "from-red-500/25 to-red-500/0",
            glow: "bg-red-500/15"
          };
          const Icon = config.icon;
          const isIPTV = c.slug === "iptv";

          return (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#111827] p-6 transition-all duration-300 hover:-translate-y-1 ${
                isIPTV
                  ? "border-emerald-500/40 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_20px_50px_-24px_rgba(16,185,129,0.35)]"
                  : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              {/* Ambient corner glow, unique per category */}
              <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${config.ring} blur-2xl transition-opacity duration-300 opacity-70 group-hover:opacity-100`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.glow} ${config.color}`}>
                    <Icon size={24} />
                  </div>
                  {isIPTV && (
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      #1 Featured
                    </span>
                  )}
                </div>

                <h3 className="mt-5 font-display text-base font-bold text-white">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {c.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center gap-1 text-xs font-semibold text-slate-300 transition-colors group-hover:text-red-400">
                Explore Category <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
