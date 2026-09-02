import { Star, Quote } from "lucide-react";
import { testimonials as staticTestimonials } from "@/lib/data";
import SectionHeading from "./SectionHeading";

interface TestimonialItem {
  name: string;
  location?: string | null;
  rating: number;
  quote: string;
  product?: string | null;
}

export default function Testimonials({ testimonials }: { testimonials?: TestimonialItem[] }) {
  const list = testimonials && testimonials.length > 0 ? testimonials : staticTestimonials;

  return (
    <section className="section py-16 sm:py-24">
      <SectionHeading
        eyebrow="Customer Reviews"
        title="Trusted by Customers Worldwide"
        description="Here is what our international customers say about FlixMart."
      />
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <div
            key={t.name}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <Quote size={24} className="text-red-400 opacity-60" />
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                "{t.quote}"
              </p>
            </div>
            
            <div className="mt-6 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="font-display text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
              <p className="text-[11px] text-slate-400">{t.location} · {t.product}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
