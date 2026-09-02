"use client";

import { useState } from "react";
import { MessageCircle, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Plan } from "@/lib/types";
import { checkoutLink, formatPlanPrice, productWhatsappLink } from "@/lib/utils";

export default function PlanSelector({ productName, productSlug, plans }: { productName: string; productSlug?: string; plans: Plan[] }) {
  const [selected, setSelected] = useState(0);
  const [ordered, setOrdered] = useState(false);
  const plan = plans[selected] || plans[0];
  const showBuyNow = !plan.isFree && !plan.priceTBD;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Choose your plan</p>
      
      <div className="mt-4 flex flex-col gap-2.5">
        {plans.map((p, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={p.label}
              onClick={() => {
                setSelected(i);
                setOrdered(false);
              }}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
                isSelected
                  ? "border-red-600 bg-red-50/70 shadow-sm dark:border-red-500 dark:bg-red-950/40"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {p.label}
                  {p.badge && (
                    <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white align-middle">
                      {p.badge}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.duration} access</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-slate-900 dark:text-white">{formatPlanPrice(p)}</p>
                {p.originalPrice && !p.isFree && !p.priceTBD && (
                  <p className="font-mono text-xs text-slate-400 line-through">Rs {p.originalPrice.toLocaleString("en-PK")}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {showBuyNow && (
          <button
            onClick={() => { if (productSlug) window.location.href = checkoutLink(productSlug, plan.label); else setOrdered(true); }}
            className="btn-primary w-full shadow-sm"
          >
            <ShoppingCart size={17} /> Buy Now — {formatPlanPrice(plan)}
          </button>
        )}
        <a
          href={productWhatsappLink(productName, plan.label)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full shadow-sm"
        >
          <MessageCircle size={17} /> {plan.isFree ? "Claim Free Trial on WhatsApp" : "Order on WhatsApp"}
        </a>
      </div>

      {ordered && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" /> Great choice! Click "Order on WhatsApp" above to connect directly with our support team.
        </p>
      )}

      <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
        Instant Activation · Direct WhatsApp Support · Guarantee Covered
      </p>
    </div>
  );
}
