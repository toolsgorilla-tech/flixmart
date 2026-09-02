import Link from "next/link";
import { getHeroContentAdmin } from "@/features/hero/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import HeroForm from "./HeroForm";

export const metadata = { title: "Hero Editor" };

export default async function HeroEditorPage() {
  const configured = isSupabaseConfigured();
  const hero = await getHeroContentAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Hero Editor</h1>
          <p className="mt-1 text-sm text-slate-400">Edit the headline, subtitle, buttons and marketplace copy shown at the top of your homepage.</p>
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

      {!configured && (
        <NotConfiguredNotice title="Supabase not connected">
          You can still edit the form below, but changes won&apos;t persist until Supabase is configured. The
          public Hero currently renders the original hardcoded copy.
        </NotConfiguredNotice>
      )}

      <HeroForm hero={hero} />
    </div>
  );
}
