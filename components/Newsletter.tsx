"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-sm font-medium text-signal">You're subscribed! Watch your inbox for deals.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="glass w-full rounded-full px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
      />
      <button type="submit" className="btn-primary !px-4 !py-3" aria-label="Subscribe">
        <Send size={16} />
      </button>
    </form>
  );
}
