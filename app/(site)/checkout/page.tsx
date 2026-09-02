import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getPublishedProductBySlug } from "@/features/products/api";
import { SITE } from "@/lib/data";
import { getSiteSettings } from "@/features/settings/api";
import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Checkout", description: "Secure FlixMart checkout and local payment instructions." };

export default async function CheckoutPage({ searchParams }: { searchParams: { product?: string; plan?: string } }) {
  if (!searchParams.product || !searchParams.plan) return notFound();
  const product = await getPublishedProductBySlug(searchParams.product);
  if (!product) return notFound();
  const plan = product.plans.find((p) => p.label === searchParams.plan);
  if (!plan || plan.isFree || plan.priceTBD) return notFound();
  const settings = await getSiteSettings();
  const paymentAccount = (settings.theme?.paymentAccount as string) || SITE.paymentAccount;

  return (
    <div className="section py-10 sm:py-16">
      <Link href={`/products/${product.slug}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"><ArrowLeft size={16}/> Back to product</Link>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="eyebrow">Secure Checkout</span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">Complete your order</h1>
          <p className="mt-2 text-slate-400">Choose a Pakistani payment method, send the exact amount, then confirm your payment on WhatsApp.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111827] p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order summary</p>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div><h2 className="font-display text-xl font-bold text-white">{product.name}</h2><p className="mt-1 text-sm text-slate-400">{plan.label}</p></div>
              <p className="font-mono text-xl font-extrabold text-white">Rs {plan.price.toLocaleString("en-PK")}</p>
            </div>
            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-300"><ShieldCheck size={17}/> Payment confirmation protected</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">Never share your OTP, PIN or password. FlixMart only needs your payment reference/receipt for confirmation.</p>
            </div>
          </div>
          <CheckoutForm productName={product.name} planLabel={plan.label} amount={plan.price} whatsapp={settings.whatsapp || SITE.whatsapp} paymentAccount={paymentAccount} />
        </div>
      </div>
    </div>
  );
}
