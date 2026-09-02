import { SITE } from "./data";

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number) {
  return `Rs ${amount.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
}

/**
 * Like formatPrice, but aware of a Plan's isFree/priceTBD flags (used by
 * plans such as IPTV's free trial and not-yet-priced long-term tiers).
 * Falls back to formatPrice for a plain number.
 */
export function formatPlanPrice(plan: { price: number; isFree?: boolean; priceTBD?: boolean }) {
  if (plan.isFree) return "FREE";
  if (plan.priceTBD) return "Contact for pricing";
  return formatPrice(plan.price);
}

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE.whatsapp}?text=${encoded}`;
}

export function productWhatsappLink(productName: string, plan?: string) {
  const message = plan
    ? `Hi FlixMart! I'd like to order ${productName} (${plan}).`
    : `Hi FlixMart! I'd like to order ${productName}.`;
  return whatsappLink(message);
}


export const PAYMENT_METHODS = [
  { id: "easypaisa", name: "Easypaisa", description: "Send payment to our Easypaisa number", number: SITE.paymentAccount },
  { id: "jazzcash", name: "JazzCash", description: "Send payment to our JazzCash number", number: SITE.paymentAccount },
  { id: "nayapay", name: "NayaPay", description: "Send payment to our NayaPay number", number: SITE.paymentAccount }
] as const;

export function checkoutLink(productSlug: string, planLabel: string) {
  return `/checkout?product=${encodeURIComponent(productSlug)}&plan=${encodeURIComponent(planLabel)}`;
}
