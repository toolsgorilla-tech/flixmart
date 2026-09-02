import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Send, Mail, Globe2 } from "lucide-react";
import Image from "next/image";
import { whatsappLink } from "@/lib/utils";
import { getActiveCategories } from "@/features/categories/api";
import { getSiteSettings } from "@/features/settings/api";
import Newsletter from "./Newsletter";

export default async function Footer() {
  const [categories, settings] = await Promise.all([getActiveCategories(), getSiteSettings()]);
  const social = settings.social_links ?? {};

  return (
    <footer className="relative mt-24 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="section py-16">
        {/* Newsletter CTA Banner */}
        <div className="mb-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg sm:p-10 md:flex-row">
          <div>
            <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
              Get exclusive deals & updates
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Subscribe for launch discounts, price drops, and new product alerts.
            </p>
          </div>
          <Newsletter />
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/flixmart-logo.png" alt="FlixMart" width={112} height={56} className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Premium digital subscriptions & AI tools delivered instantly. Trusted by customers worldwide.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: MessageCircle, href: whatsappLink("Hi FlixMart! I have a question."), label: "WhatsApp" },
                { icon: Facebook, href: social.facebook || "#", label: "Facebook" },
                { icon: Instagram, href: social.instagram || "#", label: "Instagram" },
                { icon: Send, href: social.youtube || "#", label: "Telegram" }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="mt-4 space-y-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">Useful Links</h4>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Refund Policy", href: "/refund-policy" }
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                <a
                  href={whatsappLink("Hi FlixMart! I'd like to ask a support question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-400 hover:underline"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <Mail size={16} className="mt-0.5 shrink-0 text-red-400" /> {settings.email}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <Globe2 size={16} className="mt-0.5 shrink-0 text-red-400" /> Serving customers worldwide
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">Instant Digital Delivery · 24/7 WhatsApp Support · Genuine Subscriptions</p>
        </div>
      </div>
    </footer>
  );
}
