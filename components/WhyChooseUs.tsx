import { Zap, ShieldCheck, Headset, BadgePercent, Globe2, Lock } from "lucide-react";
import SectionHeading from "./SectionHeading";

const points = [
  { icon: Zap, title: "Instant Delivery", desc: "Most orders are delivered within 15 to 30 minutes with fast setup assistance." },
  { icon: ShieldCheck, title: "Genuine & Warrantied", desc: "Every subscription is legitimately sourced and backed by our replacement coverage." },
  { icon: Headset, title: "Direct WhatsApp Support", desc: "Connect with real support reps on WhatsApp anytime — quick, responsive assistance." },
  { icon: BadgePercent, title: "Unbeatable PKR Pricing", desc: "Save up to 60% compared to buying standard subscriptions directly." },
  { icon: Globe2, title: "Worldwide Access", desc: "Digital products delivered online to customers across all regions." },
  { icon: Lock, title: "Secure Order Fulfillment", desc: "Trusted checkout steps with encrypted communication and verified orders." }
];

export default function WhyChooseUs() {
  return (
    <section className="section py-16 sm:py-24">
      <SectionHeading
        eyebrow="Why FlixMart"
        title="Trusted Service, Outstanding Value"
        description="We combine genuine product licenses, instant digital delivery, and fast WhatsApp support."
      />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p) => (
          <div
            key={p.title}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <p.icon size={20} />
            </div>
            <h3 className="mt-5 font-display text-base font-bold text-slate-900 dark:text-white">
              {p.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
