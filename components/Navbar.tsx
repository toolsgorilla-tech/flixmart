"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { categories as staticCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CategoryRow } from "@/types/database";

const links = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export default function Navbar({ categories: categoriesProp }: { categories?: CategoryRow[] }) {
  const categories = categoriesProp && categoriesProp.length > 0 ? categoriesProp : staticCategories;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setCatOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.08] bg-[#070A0F]/90 backdrop-blur-md shadow-[0_8px_30px_-16px_rgba(0,0,0,0.8)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="section flex h-20 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/flixmart-logo.png" alt="FlixMart" width={112} height={56} className="h-12 w-auto object-contain" priority />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white",
                pathname === l.href && "font-semibold text-red-400"
              )}
            >
              {l.label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">
              Categories <ChevronDown size={14} className={cn("transition-transform duration-200", catOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full grid w-72 -translate-x-1/2 grid-cols-1 gap-1 rounded-2xl border border-white/[0.08] bg-[#111827] p-2 shadow-2xl shadow-black/50"
                >
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
                    >
                      <span className="font-semibold text-slate-100">{c.name}</span>
                      <span className="block text-xs text-slate-400">{c.description}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Search & Controls */}
        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={onSearch} className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-4 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-36 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              aria-label="Search products"
            />
          </form>
          <Link href="/products" className="btn-primary !px-5 !py-2.5 text-sm">
            Browse Products
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/5 text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l border-white/[0.08] bg-[#0B0F17] p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/flixmart-logo.png" alt="FlixMart" width={112} height={56} className="h-12 w-auto object-contain" />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={onSearch} className="mt-6 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5">
                <Search size={16} className="text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </form>

              <div className="mt-6 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-xl px-3 py-3 text-base font-medium text-white hover:bg-white/5"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <p className="mt-6 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">Categories</p>
              <div className="mt-2 flex flex-col gap-1">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    className="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              <Link href="/products" className="btn-primary mt-6 w-full">
                Browse Products
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
