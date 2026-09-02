import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import { getPublishedFaqs } from "@/features/faq/api";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ordering, digital delivery, payment methods and support at FlixMart."
};

const orderingFaqs = [
  { question: "How do I place an order?", answer: "Select your product and plan, then click 'Buy Now' or 'Order on WhatsApp' to connect directly with our support team." },
  { question: "Can I order multiple subscriptions at once?", answer: "Yes, tell us on WhatsApp which subscriptions you would like and our team will process them together." },
  { question: "Are prices in PKR?", answer: "Yes, all prices listed across FlixMart are in PKR." },
  { question: "Do you offer refunds or warranty replacements?", answer: "Yes, every order includes warranty coverage. Replacements or credits are provided if an activation issue occurs." }
];

export default async function FAQPage() {
  const faqs = await getPublishedFaqs();

  return (
    <div className="section py-16 sm:py-20">
      <SectionHeading
        eyebrow="Support Center"
        title="Frequently Asked Questions"
        description="Everything you need to know about our digital subscriptions, delivery speed, and support."
      />

      <div className="mx-auto mt-14 max-w-3xl space-y-10">
        <div>
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">Ordering & Delivery</h2>
          <FAQAccordion items={orderingFaqs} />
        </div>
        <div>
          <h2 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">General & Service Questions</h2>
          <FAQAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
        </div>
      </div>

      <div className="mt-12">
        <CTABanner />
      </div>
    </div>
  );
}
