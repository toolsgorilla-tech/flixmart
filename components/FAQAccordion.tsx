"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FAQItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display font-semibold text-slate-900 dark:text-white"
              aria-expanded={isOpen}
            >
              <span className="text-sm">{item.question}</span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 text-slate-400 transition-transform duration-200", isOpen && "rotate-180 text-red-600 dark:text-red-400")}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-slate-100 px-5 py-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800/80 dark:text-slate-300">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
