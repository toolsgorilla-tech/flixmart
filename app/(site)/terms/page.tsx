import type { Metadata } from "next";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Review FlixMart's terms and conditions for using our website and purchasing digital subscriptions."
};

export default function TermsPage() {
  return (
    <div className="section max-w-3xl py-16 sm:py-20">
      <span className="eyebrow"><span className="pulse-dot" />Legal</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Terms & Conditions</h1>
      <p className="mt-2 text-xs text-slate-500">Last updated: 2026</p>

      <div className="mt-10 flex flex-col gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          These Terms & Conditions govern your use of the FlixMart website and the purchase of digital subscriptions and licenses through our platform.
        </p>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Independent Marketplace</h2>
          <p>
            FlixMart is an independent digital subscription marketplace. We are not officially affiliated with or an authorized reseller of third-party brand names listed on this site unless explicitly stated otherwise.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Products & Delivery</h2>
          <p>
            We connect customers with digital subscriptions and software tools. Digital delivery times listed are target estimates. Orders are processed promptly upon payment confirmation.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Pricing & PKR Currency</h2>
          <p>
            All prices listed across our catalog are in PKR (Rs). Payment must be confirmed before order activation.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Contact</h2>
          <p>Questions regarding these terms can be submitted to {SITE.email}.</p>
        </div>
      </div>
    </div>
  );
}
