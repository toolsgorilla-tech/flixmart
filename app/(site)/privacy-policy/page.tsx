import type { Metadata } from "next";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read FlixMart's privacy policy to understand how we collect, use, and protect your information."
};

export default function PrivacyPolicyPage() {
  return (
    <div className="section max-w-3xl py-16 sm:py-20">
      <span className="eyebrow"><span className="pulse-dot" />Legal</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-xs text-slate-500">Last updated: 2026</p>

      <div className="mt-10 flex flex-col gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          FlixMart ("we", "us", "our") respects your privacy. This policy explains what information we collect
          when you use our website and services, and how we store and protect it.
        </p>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Information We Collect</h2>
          <p>
            We collect information you provide directly, such as your name, email address, and order details when you place an order or contact our support team.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">How We Use Information</h2>
          <p>
            We use your information strictly to fulfill orders, deliver digital credentials, provide customer support, and communicate essential updates regarding your subscription.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Data Protection</h2>
          <p>
            We take appropriate technical security measures to protect your information against unauthorized access, loss, or disclosure. We do not sell your personal data.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold text-slate-900 dark:text-white">Contact Us</h2>
          <p>
            For privacy inquiries, contact our team at {SITE.email} or via WhatsApp through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
