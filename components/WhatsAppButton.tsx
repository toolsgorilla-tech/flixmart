"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi FlixMart! I have a question about your products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform duration-300 hover:scale-110"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
      <span className="absolute inset-0 -z-10 animate-pulseSoft rounded-full bg-[#25D366]/50" />
    </a>
  );
}
