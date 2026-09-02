import { getMediaItems } from "@/features/media/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import MediaGrid from "./MediaGrid";

export const metadata = { title: "Media Library" };

export default async function MediaLibraryPage() {
  const configured = isSupabaseConfigured();
  const items = configured ? await getMediaItems(null) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Media Library</h1>
        <p className="mt-1 text-sm text-slate-400">Upload, search and manage images used across your site.</p>
      </div>

      {!configured ? (
        <NotConfiguredNotice title="Connect Supabase Storage to upload media">
          Files are stored in the public <code>media</code> bucket created by{" "}
          <code>supabase/migrations/0003_storage.sql</code>.
        </NotConfiguredNotice>
      ) : (
        <MediaGrid initialItems={items} />
      )}
    </div>
  );
}
