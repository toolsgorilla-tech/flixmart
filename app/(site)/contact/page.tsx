import type { Metadata } from "next";
import { MessageCircle, Mail, Globe2, Clock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with FlixMart via WhatsApp, email, or our contact form. We reply fast, every day."
};

export default function ContactPage() {
  return (
    <div className="section py-16 sm:py-20">
      <SectionHeading
        eyebrow="Get in Touch"
        title="We're Here to Help"
        description="Have a question about a product, subscription setup, or an existing order? Reach out anytime."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-4">
          <a
            href={whatsappLink("Hi FlixMart! I have a support question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <MessageCircle size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">WhatsApp Support</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fastest response — click to chat with our team directly</p>
            </div>
          </a>

          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Mail size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Email Support</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{SITE.email}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Clock size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Support Hours</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Available 7 days a week — instant WhatsApp responses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Globe2 size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Global Service</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instant online delivery to customers worldwide</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
