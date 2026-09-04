import { ReactNode } from "react";
import { Tv, Film, Bot, Sparkles, ShieldCheck, Lock, Code2, Terminal, Video, Hash, Briefcase, Mic2, Palette, PenTool, BarChart3, Globe2, Star } from "lucide-react";

/**
 * Product-specific brand marks used by the storefront cards.
 * These are CSS/text/icon treatments rather than downloaded trademark files,
 * so the project remains self-contained and does not depend on a third-party CDN.
 */
export interface BrandEmblemConfig {
  content: ReactNode;
  className: string;
}

const mark = (text: string, className: string, extra = "") => ({
  content: <span className={`select-none leading-none ${extra}`}>{text}</span>,
  className,
});

const icon = (node: ReactNode, className: string): BrandEmblemConfig => ({ content: node, className });

export const brandEmblems: Record<string, BrandEmblemConfig> = {
  // IPTV
  "iptv-starter": icon(<Tv size={30} />, "bg-gradient-to-br from-emerald-500 to-teal-700 text-white"),
  "iptv-standard": icon(<Tv size={30} />, "bg-gradient-to-br from-sky-500 to-blue-700 text-white"),
  "iptv-premium": icon(<Tv size={30} />, "bg-gradient-to-br from-violet-500 to-fuchsia-700 text-white"),
  "iptv-ultimate": icon(<Tv size={30} />, "bg-gradient-to-br from-amber-400 to-orange-700 text-white"),

  // AI
  "fish-audio": icon(<Mic2 size={29} />, "bg-slate-950 text-cyan-300 border border-cyan-400/20"),
  chatgpt: icon(<Bot size={30} />, "bg-[#10a37f] text-white"),
  grok: mark("𝕏", "bg-black text-white border border-white/15", "text-3xl font-black"),
  "cursor-ai": mark("⌁", "bg-black text-white border border-white/15", "text-3xl font-black"),
  "rezi-ai": mark("Rezi", "bg-blue-950 text-cyan-300 border border-cyan-400/20", "text-base font-black"),
  elevenlabs: mark("11", "bg-black text-white border border-white/15", "text-2xl font-black"),
  "claude-ai": mark("Claude", "bg-[#d97757] text-white", "text-sm font-black"),
  "gamma-ai": mark("γ", "bg-indigo-700 text-white", "text-3xl font-black"),
  notegpt: mark("NoteGPT", "bg-slate-950 text-sky-300 border border-sky-400/20", "text-xs font-black"),
  "genspark-ai": mark("G", "bg-gradient-to-br from-fuchsia-500 to-orange-400 text-white", "text-2xl font-black"),
  base44: mark("44", "bg-slate-900 text-white border border-white/10", "text-2xl font-black"),
  "lovable-dev": mark("♥", "bg-rose-500 text-white", "text-2xl font-black"),

  // Design / creator
  kittl: icon(<PenTool size={28} />, "bg-slate-950 text-white border border-white/10"),
  autodesk: mark("A", "bg-[#c91517] text-white", "text-3xl font-black"),
  blender: mark("B", "bg-[#e87d22] text-white", "text-3xl font-black"),
  submagic: mark("S", "bg-black text-white border border-white/15", "text-3xl font-black"),
  "freepik-magnific": mark("freepik", "bg-[#1273ea] text-white", "text-sm font-black"),
  "envato-elements": mark("e", "bg-[#78b82a] text-white", "text-3xl font-black"),
  storyblocks: mark("SB", "bg-slate-900 text-white border border-white/10", "text-xl font-black"),
  canva: mark("Canva", "bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white", "text-base font-black"),
  "capcut-pro": mark("CC", "bg-black text-white border border-white/15", "text-xl font-black"),
  "adobe-creative-cloud": mark("A", "bg-[#ed1c24] text-white", "text-3xl font-black"),
  "vectorizer-ai": icon(<PenTool size={28} />, "bg-violet-700 text-white"),
  figma: icon(<Palette size={29} />, "bg-slate-950 text-white border border-white/10"),

  // AI video
  "google-ai-ultra-veo3-flow": mark("G", "bg-white text-[#4285f4] border border-white/20", "text-2xl font-black"),
  "magiclight-ai": mark("ML", "bg-gradient-to-br from-violet-500 to-pink-500 text-white", "text-xl font-black"),
  akool: mark("AK", "bg-blue-700 text-white", "text-xl font-black"),
  "d-id": mark("D-ID", "bg-black text-white border border-white/15", "text-sm font-black"),
  vyond: mark("V", "bg-[#4a2bbd] text-white", "text-3xl font-black"),
  animaker: mark("A", "bg-gradient-to-br from-orange-400 to-pink-500 text-white", "text-3xl font-black"),
  runway: mark("Runway", "bg-black text-white border border-white/15", "text-sm font-black"),
  heygen: mark("HeyGen", "bg-slate-950 text-white border border-white/10", "text-sm font-black"),
  viewmax: icon(<Video size={28} />, "bg-indigo-700 text-white"),
  "pictory-ai": mark("P", "bg-violet-700 text-white", "text-3xl font-black"),
  "kling-ai": mark("K", "bg-black text-white border border-white/15", "text-3xl font-black"),
  "leonardo-ai": mark("L", "bg-slate-950 text-white border border-white/10", "text-3xl font-black"),

  // Entertainment
  iqiyi: mark("iQIYI", "bg-[#16a34a] text-white", "text-sm font-black"),
  netflix: mark("N", "bg-black text-[#e50914] border border-white/10", "text-4xl font-black"),
  "prime-video": mark("prime", "bg-[#071b2b] text-[#00a8e1] border border-sky-900", "text-lg font-black"),
  "apple-tv": mark("tv+", "bg-black text-white border border-white/15", "text-lg font-black"),
  "paramount-plus": mark("P+", "bg-[#0064ff] text-white", "text-xl font-black"),
  starzplay: mark("STARZ", "bg-black text-white border border-white/15", "text-xs font-black"),
  "youtube-premium": mark("▶", "bg-[#ff0000] text-white", "text-xl font-black"),
  zee5: mark("ZEE5", "bg-black text-[#f5c542] border border-white/10", "text-sm font-black"),
  spotify: mark("●", "bg-[#1db954] text-black", "text-3xl font-black"),
  "peacock-tv": mark("peacock", "bg-slate-950 text-white border border-white/10", "text-sm font-black"),
  tapmad: mark("tapmad", "bg-[#f59e0b] text-black", "text-sm font-black"),
  crunchyroll: mark("CR", "bg-[#f47521] text-white", "text-xl font-black"),
  disney: mark("D+", "bg-gradient-to-br from-[#0b1440] to-[#1f3fb8] text-white border border-white/10", "text-2xl font-black"),
  hotstar: icon(<Star size={28} fill="currentColor" />, "bg-[#0f1621] text-[#1cd8a6] border border-white/10"),
  "hbo-max": mark("MAX", "bg-gradient-to-br from-[#1a0033] to-[#5b21b6] text-white", "text-sm font-black"),
  chaupal: mark("C", "bg-[#e2531d] text-white", "text-3xl font-black"),

  // Academic / writing
  quetext: mark("Q", "bg-blue-700 text-white", "text-3xl font-black"),
  overleaf: mark("OL", "bg-[#47a141] text-white", "text-xl font-black"),
  grammarly: mark("G", "bg-[#15c39a] text-white", "text-2xl font-black"),
  quillbot: mark("Q", "bg-[#40a83b] text-white", "text-2xl font-black"),
  "perplexity-ai": mark("P", "bg-black text-white border border-white/15", "text-3xl font-black"),
  "scite-ai": mark("scite", "bg-blue-950 text-sky-300", "text-sm font-black"),
  paperpal: mark("P", "bg-violet-700 text-white", "text-3xl font-black"),
  quizlet: mark("Q", "bg-blue-600 text-white", "text-3xl font-black"),
  writesonic: mark("W", "bg-gradient-to-br from-violet-600 to-blue-500 text-white", "text-3xl font-black"),
  slideshare: mark("SS", "bg-[#0088cc] text-white", "text-xl font-black"),
  "jenni-ai": mark("J", "bg-rose-600 text-white", "text-3xl font-black"),
  wordtune: mark("W", "bg-indigo-700 text-white", "text-3xl font-black"),
  prezi: mark("prezi", "bg-[#0b0b0b] text-white border border-white/15", "text-sm font-black"),

  // Business
  "linkedin-premium-business-plan": mark("in", "bg-[#0a66c2] text-white", "text-2xl font-black"),
  "linkedin-premium-career-plan": mark("in", "bg-[#0a66c2] text-white", "text-2xl font-black"),
  "linkedin-premium-sales-navigator": mark("in", "bg-[#0a66c2] text-white", "text-2xl font-black"),
  novoresume: mark("N", "bg-blue-700 text-white", "text-3xl font-black"),
  tradingview: icon(<BarChart3 size={29} />, "bg-[#131722] text-[#26a69a] border border-white/10"),
  loom: mark("loom", "bg-white text-black", "text-sm font-black"),
  "miro-com": mark("M", "bg-[#ffd02f] text-black", "text-3xl font-black"),
  dripify: mark("D", "bg-violet-700 text-white", "text-3xl font-black"),

  // VPN
  nordvpn: icon(<ShieldCheck size={29} />, "bg-[#4687ff] text-white"),
  "surfshark-vpn": icon(<ShieldCheck size={29} />, "bg-[#1ec28b] text-white"),
  "express-vpn": icon(<Lock size={29} />, "bg-[#da291c] text-white"),
  "proton-vpn": icon(<ShieldCheck size={29} />, "bg-[#6d4aff] text-white"),
  "pia-vpn": mark("PIA", "bg-[#2b7de9] text-white", "text-sm font-black"),
  "hma-vpn": icon(<Globe2 size={29} />, "bg-[#00a8e8] text-white"),
};

export const iptvFallback: BrandEmblemConfig = {
  content: <Tv size={30} />,
  className: "bg-gradient-to-br from-emerald-500 to-teal-700 text-white",
};

export const defaultFallback: BrandEmblemConfig = {
  content: <Film size={27} />,
  className: "bg-slate-800 text-white border border-white/10",
};

// IPTV tiers, cheapest/base first. Used to resolve a tier-specific emblem
// (e.g. "iptv-premium") even when a product's brand_key doesn't exactly
// match one of the keys above — falling back to the product name instead.
const IPTV_TIERS = ["starter", "standard", "premium", "ultimate"];

// Safety-net keyword → brand key mapping for a handful of entertainment
// products whose brand_key may not always be set exactly right in the CMS.
// Only used when there is no direct brandEmblems[key] match.
const ENTERTAINMENT_NAME_HINTS: [string, string][] = [
  ["hotstar", "hotstar"],
  ["disney", "disney"],
  ["hbo", "hbo-max"],
  ["chaupal", "chaupal"],
];

/**
 * @param brandKey Product's `brand_key` from the database, if set.
 * @param productName Product name — used as a fallback signal when
 *   `brandKey` is missing or doesn't exactly match a known key (e.g. an
 *   IPTV product whose brand_key wasn't set to an exact tier key).
 */
export function getBrandEmblem(brandKey?: string, productName?: string): BrandEmblemConfig {
  const normalizedKey = brandKey?.trim().toLowerCase();
  if (normalizedKey && brandEmblems[normalizedKey]) return brandEmblems[normalizedKey];

  const nameLower = (productName ?? "").toLowerCase();
  const looksLikeIptv = Boolean(normalizedKey?.includes("iptv")) || nameLower.includes("iptv");

  if (looksLikeIptv) {
    const tier = IPTV_TIERS.find((t) => normalizedKey?.includes(t) || nameLower.includes(t));
    if (tier && brandEmblems[`iptv-${tier}`]) return brandEmblems[`iptv-${tier}`];
    return iptvFallback;
  }

  const hint = ENTERTAINMENT_NAME_HINTS.find(([keyword]) => nameLower.includes(keyword));
  if (hint && brandEmblems[hint[1]]) return brandEmblems[hint[1]];

  if (!normalizedKey) return defaultFallback;
  const initials = normalizedKey.split("-").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
  return mark(initials || "FM", "bg-slate-800 text-white border border-white/10", "text-lg font-black");
}
