import type { Metadata } from "next";
import { ShieldCheck, Zap, Users, Globe2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about FlixMart — a trusted international digital subscription marketplace for AI tools, streaming, productivity and more."
};

const stats = [
  { label: "Subscriptions & tools", value: "25+" },
  { label: "Customer satisfaction", value: "4.9/5" },
  { label: "Digital delivery", value: "Minutes" },
  { label: "Live customer help", value: "WhatsApp" }
];

const values = [
  { icon: ShieldCheck, title: "Trust & Quality", desc: "Every subscription is sourced legitimately and covered by our replacement warranty." },
  { icon: Zap, title: "Instant Digital Delivery", desc: "Optimized delivery pipeline ensures most subscriptions are ready in minutes." },
  { icon: Users, title: "Dedicated Support", desc: "Our support reps respond on WhatsApp with fast assistance." },
  { icon: Globe2, title: "International Marketplace", desc: "Built for global customers with clear PKR pricing and reliable service." }
];

export default function AboutPage() {
  return (
    <div className="section py-16 sm:py-20">
      <SectionHeading
        eyebrow="About FlixMart"
        title="Your Trusted Marketplace for Premium Digital Tools"
        description="FlixMart makes premium software, AI tools, streaming subscriptions, VPNs, and IPTV accessible — backed by authenticity and fast customer support."
      />

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="font-display text-2xl font-extrabold text-red-600 sm:text-3xl dark:text-red-400">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Our Mission</h2>
          <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            FlixMart was created to provide a seamless, reliable digital subscription experience. Premium AI software and entertainment services are essential tools for professionals, students, and creators worldwide.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            We provide convenient order processing, clear PKR pricing, and direct WhatsApp customer support.
          </p>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
            FlixMart is an independent digital subscription marketplace and is not officially affiliated with or an authorized reseller of the third-party brand names listed on this site unless explicitly stated.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Why Customers Choose Us</h3>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            We prioritize long-term customer relationships over one-off sales. Every order comes with clear setup instructions and warranty coverage.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading eyebrow="Our Principles" title="What We Stand For" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                <v.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-sm font-bold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <CTABanner />
      </div>
    </div>
  );
}
