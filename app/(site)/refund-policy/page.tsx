import type { Metadata } from "next";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Understand when and how refunds and warranty replacements are issued for FlixMart digital subscriptions."
};

export default function RefundPolicyPage() {
  return (
    <div className="section max-w-3xl py-16 sm:py-20">
      <span className="eyebrow"><span className="pulse-dot" />Legal</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Refund & Warranty Policy</h1>
      <p className="mt-2 text-xs text-slate-500">Last updated: 2026</p>

      <div className="mt-10 flex flex-col gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          Because FlixMart provides digital subscriptions that are delivered online, refunds and replacements are governed by our warranty policy.
        </p>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Order Cancellations & Refunds</h2>
          <p>
            Orders that have not yet been activated or delivered may be canceled for a full refund. If an issue occurs upon initial delivery (such as an invalid activation key), a fast replacement or full refund is provided.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Warranty Coverage</h2>
          <p>
            Every product includes warranty coverage during which our team provides replacement support or account credentials at no extra charge.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Contact Support</h2>
          <p>
            To request assistance or report an issue, connect with our support team on WhatsApp or email us at {SITE.email}.
          </p>
        </div>
      </div>
    </div>
  );
}
