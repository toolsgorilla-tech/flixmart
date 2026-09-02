"use client";
import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle, WalletCards } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/utils";

export default function CheckoutForm({ productName, planLabel, amount, whatsapp, paymentAccount }: { productName: string; planLabel: string; amount: number; whatsapp: string; paymentAccount: string }) {
 const [method, setMethod] = useState<string>(PAYMENT_METHODS[0].id);
  const [copied, setCopied] = useState(false);
  const selected = useMemo(() => PAYMENT_METHODS.find((m) => m.id === method) ?? PAYMENT_METHODS[0], [method]);
  const copy = async () => { await navigator.clipboard?.writeText(paymentAccount); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const message = `Hi FlixMart! I have paid for ${productName} (${planLabel}) - Rs ${amount.toLocaleString("en-PK")} via ${selected.name}. Please confirm my order.`;
  const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  return <div className="rounded-2xl border border-white/[0.08] bg-[#111827] p-6">
    <div className="flex items-center gap-2"><WalletCards size={18} className="text-red-400"/><h2 className="font-display text-lg font-bold">Payment method</h2></div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      {PAYMENT_METHODS.map((m) => <button key={m.id} type="button" onClick={() => setMethod(m.id)} className={`rounded-xl border px-3 py-3 text-left text-sm font-bold transition ${method===m.id ? "border-red-500 bg-red-500/10 text-white" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"}`}>{m.name}<span className="mt-1 block text-[11px] font-medium text-slate-500">Pakistan</span></button>)}
    </div>
    <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
      <p className="text-xs font-semibold text-blue-200">Send Rs {amount.toLocaleString("en-PK")} to {selected.name}</p>
      <div className="mt-2 flex items-center justify-between gap-3"><p className="font-mono text-xl font-extrabold tracking-wide text-white">{paymentAccount}</p><button onClick={copy} type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "Copied" : "Copy"}</button></div>
      <p className="mt-2 text-xs text-slate-400">{selected.description}. After payment, keep your transaction ID/receipt ready.</p>
    </div>
    <a href={link} target="_blank" rel="noopener noreferrer" className="mt-5 btn-whatsapp w-full"><MessageCircle size={18}/> I’ve Paid — Confirm on WhatsApp</a>
    <p className="mt-3 text-center text-[11px] text-slate-500">You’ll send the product, plan, amount and payment method automatically.</p>
  </div>;
}
