import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

export default function CTABanner() {
  return (
    <section className="section pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-r from-red-600 via-red-700 to-purple-700 px-8 py-14 text-center text-white shadow-xl sm:px-14">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to Upgrade Your Subscriptions for Less?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-red-100 sm:text-base">
          Browse our full product catalog or connect directly with our support team on WhatsApp for fast activation.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-slate-900 shadow-sm transition-transform hover:scale-105">
            Explore All Products <ArrowRight size={16} />
          </Link>
          <a
            href={whatsappLink("Hi FlixMart! I'd like to place an order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp shadow-sm"
          >
            <MessageCircle size={17} /> Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
