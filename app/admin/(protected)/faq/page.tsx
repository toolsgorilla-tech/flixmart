import { getAllFaqsAdmin } from "@/features/faq/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import FaqManager from "./FaqManager";

export const metadata = { title: "FAQ" };

export default async function FaqAdminPage() {
  const configured = isSupabaseConfigured();
  const faqs = configured ? await getAllFaqsAdmin() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">FAQ</h1>
        <p className="mt-1 text-sm text-slate-400">Manage the questions shown on your FAQ page and homepage preview.</p>
      </div>

      {!configured ? <NotConfiguredNotice title="Connect Supabase to manage FAQs" /> : <FaqManager initialFaqs={faqs} />}
    </div>
  );
}
