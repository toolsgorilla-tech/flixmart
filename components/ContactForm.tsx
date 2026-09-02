"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CheckCircle2 size={36} className="text-emerald-500" />
        <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Message Received!</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Our support team will get back to you shortly. For immediate assistance, feel free to chat with us on WhatsApp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
          <input
            required
            type="text"
            placeholder="Your name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
          <input
            required
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Subject</label>
        <input
          required
          type="text"
          placeholder="How can we help?"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Message</label>
        <textarea
          required
          rows={5}
          placeholder="Tell us about your request..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <button type="submit" className="btn-primary mt-2 w-full sm:w-fit">
        Send Message <Send size={15} />
      </button>
    </form>
  );
}
