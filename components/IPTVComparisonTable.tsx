import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { productWhatsappLink } from "@/lib/utils";

const comparisonData = [
  {
    feature: "Ideal For",
    starter: "Casual Viewers",
    standard: "Families & Everyday TV",
    premium: "Sports & Movie Enthusiasts",
    ultimate: "Power Viewers & VIP Support"
  },
  {
    feature: "Live TV Channels",
    starter: "Essential Channels",
    standard: "Broad Channel Selection",
    premium: "Extensive Global Channels",
    ultimate: "Maximum Channel Variety"
  },
  {
    feature: "Movies & Series (VOD)",
    starter: "Popular Catalog",
    standard: "Expanded VOD Library",
    premium: "Comprehensive Movie Archive",
    ultimate: "Complete VOD Vault"
  },
  {
    feature: "Sports Coverage",
    starter: "Standard Sports",
    standard: "HD / FHD Sports",
    premium: "Full FHD / 4K Sports",
    ultimate: "FHD / 4K + Event Priority"
  },
  {
    feature: "International Regions",
    starter: "UK / USA / EU / Intl",
    standard: "UK / USA / EU / ME / Intl",
    premium: "UK / USA / EU / ME / Asia",
    ultimate: "Global Multi-Region"
  },
  {
    feature: "Streaming Quality",
    starter: "HD / FHD",
    standard: "FHD / 4K",
    premium: "FHD / 4K Ultra",
    ultimate: "FHD / 4K / UHD"
  },
  {
    feature: "EPG Program Guide",
    starter: "Supported",
    standard: "Supported",
    premium: "Interactive EPG",
    ultimate: "Full Interactive EPG"
  },
  {
    feature: "Supported Devices",
    starter: "Smart TV, Firestick, Mobile",
    standard: "Smart TV, Firestick, Boxes",
    premium: "All Devices & TiviMate",
    ultimate: "All Devices + VIP Apps"
  },
  {
    feature: "24-Hour Free Trial",
    starter: "FREE",
    standard: "FREE",
    premium: "FREE",
    ultimate: "FREE"
  },
  {
    feature: "Customer Support",
    starter: "Standard Support",
    standard: "Standard Support",
    premium: "Fast WhatsApp Support",
    ultimate: "Priority VIP Assistance"
  }
];

const tiers = [
  { slug: "iptv-starter", name: "STARTER", price: "Rs 2,250/mo", highlight: false },
  { slug: "iptv-standard", name: "STANDARD", price: "Rs 2,800/mo", highlight: false },
  { slug: "iptv-premium", name: "PREMIUM", price: "Rs 3,650/mo", highlight: true, badge: "MOST POPULAR" },
  { slug: "iptv-ultimate", name: "ULTIMATE", price: "Rs 4,500/mo", highlight: false }
];

export default function IPTVComparisonTable() {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <th className="p-4 font-bold text-slate-900 dark:text-white w-1/4">Features</th>
              {tiers.map((t) => (
                <th
                  key={t.slug}
                  className={`p-4 text-center ${
                    t.highlight
                      ? "bg-red-50/80 dark:bg-red-950/40 border-x border-red-200 dark:border-red-800"
                      : ""
                  }`}
                >
                  {t.badge && (
                    <span className="mb-1 inline-block rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {t.badge}
                    </span>
                  )}
                  <div className="font-display text-base font-bold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="font-mono text-xs font-semibold text-red-600 dark:text-red-400">{t.price}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {comparisonData.map((row, idx) => (
              <tr
                key={row.feature}
                className={idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-950/50"}
              >
                <td className="p-4 font-semibold text-slate-900 dark:text-slate-200">{row.feature}</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{row.starter}</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{row.standard}</td>
                <td className="p-4 text-center font-medium text-slate-900 bg-red-50/40 dark:bg-red-950/20 border-x border-red-200 dark:border-red-800 dark:text-white">
                  {row.premium}
                </td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{row.ultimate}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <td className="p-4 font-bold text-slate-900 dark:text-white">Get Started</td>
              {tiers.map((t) => (
                <td
                  key={t.slug}
                  className={`p-4 text-center ${
                    t.highlight
                      ? "bg-red-50/80 dark:bg-red-950/40 border-x border-red-200 dark:border-red-800"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/products/${t.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600 dark:bg-slate-800 dark:hover:bg-red-600"
                    >
                      View Plans
                    </Link>
                    <a
                      href={productWhatsappLink(`IPTV ${t.name}`, "24-Hour Free Trial")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#20bd5a]"
                    >
                      <MessageCircle size={12} /> Free Trial
                    </a>
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
