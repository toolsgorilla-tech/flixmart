"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, ExternalLink, X } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import { logoutAction } from "@/app/admin/actions";
import type { AppRole } from "@/types/database";

export default function Topbar({ fullName, role }: { fullName: string; role: AppRole }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0A0D14]/80 px-4 backdrop-blur-xl sm:px-6">
        <button
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden text-sm text-slate-400 lg:block">
          Signed in as <span className="font-semibold text-white">{fullName}</span>
          <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-300">
            {role}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={14} /> View site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-white/[0.06]">
            <button
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
