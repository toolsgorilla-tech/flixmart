import { getSiteSettings } from "@/features/settings/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const configured = isSupabaseConfigured();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Business information, contact details and integrations.</p>
      </div>

      {!configured && <NotConfiguredNotice title="Supabase not connected — changes won't be saved yet." />}

      <SettingsForm settings={settings} />
    </div>
  );
}
