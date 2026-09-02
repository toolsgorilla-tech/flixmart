import Link from "next/link";
import { getAllHomepageSections } from "@/features/homepage/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import SectionBuilder from "./SectionBuilder";

export const metadata = { title: "Homepage Builder" };

export default async function HomepageBuilderPage() {
  const configured = isSupabaseConfigured();
  const sections = configured ? await getAllHomepageSections() : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Homepage Builder</h1>
          <p className="mt-1 text-sm text-slate-400">
            Enable, disable, reorder and duplicate the sections that make up your homepage.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
        >
          Live Preview ↗
        </Link>
      </div>

      {!configured ? (
        <NotConfiguredNotice title="Connect Supabase to use the Homepage Builder">
          Section order and enable/disable state are stored in the <code>homepage_sections</code> table. Until
          Supabase is connected, the homepage renders its original default section order.
        </NotConfiguredNotice>
      ) : (
        <SectionBuilder initialSections={sections} />
      )}
    </div>
  );
}
