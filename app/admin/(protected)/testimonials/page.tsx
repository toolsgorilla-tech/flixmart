import { getAllTestimonialsAdmin } from "@/features/testimonials/api";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import TestimonialManager from "./TestimonialManager";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const configured = isSupabaseConfigured();
  const testimonials = configured ? await getAllTestimonialsAdmin() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Testimonials</h1>
        <p className="mt-1 text-sm text-slate-400">Manage the customer reviews shown on your homepage.</p>
      </div>

      {!configured ? (
        <NotConfiguredNotice title="Connect Supabase to manage testimonials" />
      ) : (
        <TestimonialManager initialTestimonials={testimonials} />
      )}
    </div>
  );
}
