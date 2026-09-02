"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutTemplate,
  Sparkles,
  Package,
  FolderTree,
  Tags,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Newspaper,
  BarChart3,
  Search,
  Palette,
  Settings,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { AppRole } from "@/types/database";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Homepage Builder", icon: LayoutTemplate },
  { href: "/admin/hero", label: "Hero Editor", icon: Sparkles },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/pricing", label: "Pricing", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/appearance", label: "Appearance", icon: Palette },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users", icon: UserCog, adminOnly: true }
];

export default function Sidebar({ role, onNavigate }: { role: AppRole; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#0A0D14]">
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-5">
        <Image src="/flixmart-logo.png" alt="FlixMart" width={112} height={56} className="h-11 w-auto object-contain" />
        <div><p className="text-[10px] font-semibold uppercase tracking-wider text-red-300">Admin</p></div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          if (item.adminOnly && role !== "admin") return null;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors duration-150",
                active
                  ? "bg-red-600/15 text-red-200 shadow-[inset_0_0_0_1px_rgba(227,6,19,0.25)]"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <Icon size={16} className={active ? "text-red-300" : "text-slate-500"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] px-5 py-4">
        <p className="text-[10px] text-slate-500">FlixMart CMS v1.0 — Milestone 1</p>
      </div>
    </div>
  );
}
