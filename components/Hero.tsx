"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Star,
  Zap,
  ShieldCheck,
  MessageCircle,
  Film,
  Trophy,
  Sparkles,
  Tv,
  Palette,
  Briefcase,
  BadgeCheck
} from "lucide-react";
import { getBrandEmblem, type BrandEmblemConfig } from "@/lib/brandEmblems";
import type { LucideIcon } from "lucide-react";

// ============================================================
// CMS wiring — Hero's headline/subtitle/buttons/chips/ticker are all
// editable from Admin → Hero Editor (features/hero/api.ts). The Hero
// Editor stores chip/ticker icons as string names (e.g. "Trophy"), so
// they're resolved back to a Lucide component here. Everything below
// still has the exact original copy as its default, so Hero renders
// identically when no props are passed (e.g. before Supabase is wired
// up) or for any field the CMS hasn't set.
// ============================================================

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  Film,
  Sparkles,
  Zap,
  Star,
  ShieldCheck,
  MessageCircle,
  Tv,
  Palette,
  Briefcase,
  BadgeCheck,
  ArrowRight,
  PlayCircle
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}

export interface HeroChipInput {
  icon: string;
  label: string;
}

export interface HeroTrustBadgeInput {
  icon: string;
  label: string;
  accent?: string;
}

export interface HeroProps {
  headline?: string;
  headlineHighlight?: string;
  subtitle?: string;
  badgeText?: string;
  primaryButtonLabel?: string;
  primaryButtonUrl?: string;
  secondaryButtonLabel?: string;
  secondaryButtonUrl?: string;
  categoryChips?: HeroChipInput[];
  trustBadges?: HeroTrustBadgeInput[];
  tickerItems?: HeroChipInput[];
}

// ============================================================
// Copy
// ============================================================

const defaultCategoryChips = [
  { icon: Trophy, label: "Live Sports" },
  { icon: Film, label: "Movies & Series" },
  { icon: Sparkles, label: "AI Tools" },
  { icon: Zap, label: "Productivity" }
];

const defaultTrustIndicators = [
  { icon: Star, label: "50,000+ Happy Customers", accent: "text-amber-400" },
  { icon: Zap, label: "Instant Delivery", accent: "text-emerald-400" },
  { icon: ShieldCheck, label: "Secure Payments", accent: "text-red-300" },
  { icon: MessageCircle, label: "24/7 WhatsApp Support", accent: "text-emerald-400" }
];

// Categories shown in the bottom ticker — what the marketplace actually
// sells, not brand names. Reads like a premiere marquee, not a logo bar.
const defaultTickerCategories = [
  { icon: Film, label: "Movies" },
  { icon: Trophy, label: "Live Sports" },
  { icon: Tv, label: "Streaming" },
  { icon: Sparkles, label: "AI Tools" },
  { icon: Palette, label: "Creative Apps" },
  { icon: Briefcase, label: "Business Software" },
  { icon: ShieldCheck, label: "VPN" },
  { icon: Zap, label: "Productivity" }
];

// ============================================================
// Live Marketplace Showcase — the visual centerpiece. Real
// catalog products (via lib/brandEmblems), arranged as premium
// glass cards in overlapping depth layers rather than a flat
// icon grid. `claude` isn't in the shared brand map yet, so it
// gets one local, brand-inspired override here.
// ============================================================

const claudeEmblem: BrandEmblemConfig = {
  content: <Sparkles size={26} />,
  className: "bg-gradient-to-br from-orange-500 to-amber-600 text-white"
};

function showcaseEmblem(key: string): BrandEmblemConfig {
  return key === "claude" ? claudeEmblem : getBrandEmblem(key);
}

type ShowcaseTier = "near" | "mid" | "far";

interface ShowcaseCard {
  key: string;
  name: string;
  category: string;
  top: string;
  left: string;
  rotate: number;
  depth: number;
  delay: number;
  floatDur: number;
  size: "lg" | "md" | "sm";
  z: number;
  tier: ShowcaseTier;
  featured?: boolean;
  live?: boolean;
}

const showcaseCards: ShowcaseCard[] = [
  { key: "netflix", name: "Netflix Premium", category: "Movies & Series", top: "30%", left: "18%", rotate: -3, depth: 14, delay: 0.55, floatDur: 7.5, size: "lg", z: 30, tier: "near", featured: true },
  { key: "chatgpt", name: "ChatGPT Plus", category: "AI Tools", top: "2%", left: "52%", rotate: 7, depth: 22, delay: 0.75, floatDur: 6.5, size: "md", z: 22, tier: "near" },
  { key: "claude", name: "Claude Pro", category: "AI Tools", top: "44%", left: "62%", rotate: -6, depth: 20, delay: 1.05, floatDur: 7, size: "md", z: 26, tier: "near" },
  { key: "disney-plus", name: "Disney+", category: "Movies & Series", top: "2%", left: "2%", rotate: -9, depth: 26, delay: 1.3, floatDur: 8, size: "sm", z: 15, tier: "mid" },
  { key: "canva", name: "Canva Pro", category: "Creative Suite", top: "70%", left: "4%", rotate: 6, depth: 18, delay: 0.9, floatDur: 6.2, size: "sm", z: 16, tier: "mid" },
  { key: "iptv-premium", name: "Live Sports IPTV", category: "Live TV & Sports", top: "14%", left: "82%", rotate: 5, depth: 24, delay: 1.15, floatDur: 6.8, size: "sm", z: 18, tier: "mid", live: true },
  { key: "prezi", name: "Prezi", category: "Business Tools", top: "78%", left: "56%", rotate: -5, depth: 12, delay: 1.5, floatDur: 7.2, size: "sm", z: 10, tier: "far" },
  { key: "nordvpn", name: "NordVPN", category: "Privacy & VPN", top: "56%", left: "84%", rotate: 4, depth: 16, delay: 1.65, floatDur: 6.4, size: "sm", z: 12, tier: "far" }
];

const sizeClasses: Record<ShowcaseCard["size"], string> = {
  lg: "w-[190px] sm:w-[204px]",
  md: "w-[164px]",
  sm: "w-[150px]"
};

const tierVisibility: Record<ShowcaseTier, string> = {
  near: "md:block",
  mid: "lg:block",
  far: "hidden xl:block"
};

// Structured in two layers on purpose: the OUTER element owns absolute
// positioning + the entrance reveal + the CSS floating/rotate animation;
// the INNER element is what the mouse-parallax rAF loop (below) writes
// a raw `transform` to every frame. Two elements means the CSS animation
// and the JS-driven parallax never fight over the same `transform`
// property — each layer keeps its own.
function ShowcaseProductCard({ card }: { card: ShowcaseCard }) {
  const emblem = showcaseEmblem(card.key);
  const isAi = card.category === "AI Tools";

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute hidden ${sizeClasses[card.size]} ${tierVisibility[card.tier]} showcase-float`}
      style={
        {
          top: card.top,
          left: card.left,
          zIndex: card.z,
          "--rot": `${card.rotate}deg`,
          "--float-dur": `${card.floatDur}s`
        } as React.CSSProperties
      }
    >
      <div
        className="parallax-el tilt-el showcase-card [transform-style:preserve-3d]"
        style={{ "--depth": card.depth } as React.CSSProperties}
      >
        <div className="card-sheen" />
        <div className="card-reflection" style={{ "--reflect-delay": `${card.delay * 1.6}s` } as React.CSSProperties} />
        {isAi && <div className="holo-edge absolute inset-x-3 top-0 h-[2px] rounded-full" />}

        <div className={`relative flex flex-col gap-2.5 ${card.featured ? "p-4" : "p-3"}`}>
          <div className="flex items-start justify-between gap-2">
            <div
              className={`flex shrink-0 items-center justify-center rounded-xl text-[9px] ${emblem.className} ${
                card.featured ? "h-11 w-11" : "h-9 w-9"
              }`}
            >
              {emblem.content}
            </div>
            {card.live && (
              <span className="mt-0.5 flex items-center gap-1 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400">
                <span className="live-dot" /> Live
              </span>
            )}
          </div>

          <div className="min-w-0 text-left">
            <p className={`truncate font-bold text-white ${card.featured ? "text-[13.5px]" : "text-[11.5px]"}`}>{card.name}</p>
            <p className="truncate text-[9.5px] font-medium text-slate-400">{card.category}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-amber-300">
              <BadgeCheck size={9} /> Premium
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-300">
              <Zap size={9} /> Instant
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// A compact, non-absolute version of the same card for the mobile/tablet
// grid — same visual language, no floating/rotation so nothing overflows.
function ShowcaseGridCard({ card }: { card: ShowcaseCard }) {
  const emblem = showcaseEmblem(card.key);
  const isAi = card.category === "AI Tools";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.5, delay: card.delay * 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="showcase-card relative"
    >
      <div className="card-sheen" />
      {isAi && <div className="holo-edge absolute inset-x-3 top-0 h-[2px] rounded-full" />}
      <div className="relative flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[9px] ${emblem.className}`}>{emblem.content}</div>
          {card.live && (
            <span className="mt-0.5 flex items-center gap-1 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400">
              <span className="live-dot" /> Live
            </span>
          )}
        </div>
        <div className="min-w-0 text-left">
          <p className="truncate text-[11.5px] font-bold text-white">{card.name}</p>
          <p className="truncate text-[9.5px] font-medium text-slate-400">{card.category}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-amber-300">
            <BadgeCheck size={9} /> Premium
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-300">
            <Zap size={9} /> Instant
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Magnetic CTA button — unchanged mechanic from the previous
// Hero, reused as-is.
// ============================================================

function MagneticButton({ children, href, className }: { children: React.ReactNode; href: string; className: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-8, Math.min(8, relX * 0.25)));
    y.set(Math.max(-8, Math.min(8, relY * 0.25)));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group ${className}`}
    >
      {children}
    </motion.a>
  );
}

export default function Hero({
  headline = "Every Premium Subscription.",
  headlineHighlight = "One Trusted Marketplace.",
  subtitle = "Netflix, Disney+ and live sports IPTV. ChatGPT Plus, Claude Pro and Gemini. Canva, Figma and Adobe Creative Cloud. Buy the streaming, AI and productivity subscriptions you actually use — with instant delivery and real human support.",
  badgeText = "World's Premium Digital Marketplace",
  primaryButtonLabel = "Explore Marketplace",
  primaryButtonUrl = "/products",
  secondaryButtonLabel = "Watch Demo",
  secondaryButtonUrl = "#marketplace-showcase",
  categoryChips: categoryChipsInput,
  trustBadges: trustBadgesInput,
  tickerItems: tickerItemsInput
}: HeroProps = {}) {
  const categoryChips =
    categoryChipsInput && categoryChipsInput.length > 0
      ? categoryChipsInput.map((c) => ({ icon: resolveIcon(c.icon), label: c.label }))
      : defaultCategoryChips;

  const trustIndicators =
    trustBadgesInput && trustBadgesInput.length > 0
      ? trustBadgesInput.map((t) => ({ icon: resolveIcon(t.icon), label: t.label, accent: t.accent ?? "text-red-300" }))
      : defaultTrustIndicators;

  const tickerCategories =
    tickerItemsInput && tickerItemsInput.length > 0
      ? tickerItemsInput.map((t) => ({ icon: resolveIcon(t.icon), label: t.label }))
      : defaultTickerCategories;

  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Cursor glow + spotlight + card parallax/tilt: one listener, one rAF
  // loop, writing directly to element styles rather than React state so
  // pointer movement never triggers a re-render. Skipped on touch
  // devices and under prefers-reduced-motion.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !isFinePointer) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    function onMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      const rect = section!.getBoundingClientRect();

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${(curX * 0.5 + 0.5) * rect.width}px, ${(curY * 0.5 + 0.5) * rect.height}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${(curX * 0.5 + 0.5) * rect.width}px, ${(curY * 0.5 + 0.5) * rect.height}px, 0)`;
      }

      section!.querySelectorAll<HTMLElement>(".parallax-el").forEach((el) => {
        const depth = Number(el.style.getPropertyValue("--depth")) || 15;
        const tilt = el.classList.contains("tilt-el") ? `rotateX(${curY * -3}deg) rotateY(${curX * 3}deg)` : "";
        el.style.transform = `translate3d(${curX * depth}px, ${curY * depth}px, 0) ${tilt}`;
      });

      frame = requestAnimationFrame(tick);
    }

    section.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#070A0F] text-white pb-14 pt-10 sm:pb-24 sm:pt-20 md:pb-28 md:pt-24 lg:pb-32 lg:pt-28"
    >
      {/* ============================================================
          Cinematic backdrop — deep black base, aurora, dual mesh
          gradients, glass orbs, light rays, fog, film grain, light
          sweep, particles and a spotlight — all pure CSS/SVG, no
          stock photography, no images.
          ============================================================ */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#070A0F]" />

        <div className="light-rays" />
        <div className="mesh-gradient" />
        <div className="mesh-gradient-alt" />

        <div className="absolute -left-1/4 -top-1/4 h-[70%] w-[70%] animate-drift-slow rounded-full bg-aurora-1 blur-3xl" />
        <div className="absolute -right-1/4 top-0 h-[65%] w-[65%] animate-drift rounded-full bg-aurora-2 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[55%] w-[55%] animate-drift-slow rounded-full bg-aurora-3 blur-3xl" />

        <div className="glass-orb h-24 w-24 left-[4%] top-[46%] sm:h-32 sm:w-32 lg:h-40 lg:w-40" style={{ animationDelay: "0.4s" }} />
        <div className="glass-orb hidden h-24 w-24 right-[8%] top-[10%] sm:block" style={{ animationDelay: "2.1s" }} />
        <div className="glass-orb hidden h-16 w-16 right-[20%] bottom-[8%] md:block" style={{ animationDelay: "1.2s" }} />

        <div className="abstract-ring hidden h-[420px] w-[420px] -right-24 top-1/3 lg:block" />

        <div className="ambient-glow left-1/2 top-[38%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 lg:left-[30%]" />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 30% 30%, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 30%, black 0%, transparent 75%)"
          }}
        />

        {/* Fog — a very low, soft gradient pool along the base of the
            Hero, the "cinematic haze" the ground of a premiere stage
            would have. */}
        <div className="fog-layer" />

        {/* Particles — a fixed, tiny dot field drifting almost
            imperceptibly slowly. Pure CSS, no canvas/JS, no per-frame
            cost. */}
        <div className="particles" />

        <div className="light-sweep" />
        <div className="grain" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-transparent to-[#070A0F]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/60 via-transparent to-[#070A0F]/20" />
      </div>

      <div ref={glowRef} className="cursor-glow -z-10" />
      <div ref={spotlightRef} className="mouse-spotlight -z-10" />

      <div className="section relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8 xl:gap-14">
        {/* ============================================================
            Left — content
            ============================================================ */}
        <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="content-scrim pointer-events-none -z-10" />

          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-200 backdrop-blur-md"
          >
            <span className="pulse-dot" />
            {badgeText}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-xl font-display text-[2.5rem] font-bold leading-[1.06] tracking-[-0.02em] text-white [text-shadow:0_2px_50px_rgba(227,6,19,0.3)] sm:text-6xl lg:max-w-none lg:text-[3.4rem] xl:text-7xl"
          >
            {headline}
            <br />
            <span className="text-gradient">{headlineHighlight}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-slate-300/90 [text-shadow:0_1px_16px_rgba(7,10,15,0.8)] sm:text-lg"
          >
            {subtitle}
          </motion.p>

          {/* Category chips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start"
          >
            {categoryChips.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md"
              >
                <Icon size={13} className="text-red-300" /> {label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row"
          >
            <MagneticButton
              href={primaryButtonUrl}
              className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_-12px_rgba(227,6,19,0.7)] transition-[background-color,box-shadow] duration-200 hover:bg-red-500 hover:shadow-glow-lg sm:w-auto"
            >
              {primaryButtonLabel} <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              href={secondaryButtonUrl}
              className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-[background-color,box-shadow] duration-200 hover:bg-white/10 hover:shadow-glow sm:w-auto"
            >
              <PlayCircle size={17} className="transition-transform duration-300 group-hover:scale-110" /> {secondaryButtonLabel}
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent lg:ml-0"
          />

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.64 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold text-slate-300 lg:justify-start"
          >
            {trustIndicators.map(({ icon: Icon, label, accent }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon size={15} className={accent} /> {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ============================================================
            Right — Live Marketplace Showcase (desktop/tablet)
            ============================================================ */}
        <div id="marketplace-showcase" className="relative hidden md:block">
          <div className="stage-glow" />
          <div className="relative mx-auto h-[480px] w-full max-w-[560px] lg:h-[560px]">
            {showcaseCards.map((card) => (
              <ShowcaseProductCard key={card.key} card={card} />
            ))}
          </div>
        </div>

        {/* Mobile fallback — same cards, stacked as a clean 2-col grid,
            no absolute positioning so nothing can overflow. */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {showcaseCards.slice(0, 6).map((card) => (
            <ShowcaseGridCard key={card.key} card={card} />
          ))}
        </div>
      </div>

      {/* Marquee ticker — marketplace categories, not brand names, so it
          reads like a "now available" premiere strip. */}
      <div className="group relative mt-14 overflow-hidden border-y border-white/[0.08] bg-black/30 py-3.5 backdrop-blur-md">
        <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#070A0F] to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#070A0F] to-transparent" />
        <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
          {[...tickerCategories, ...tickerCategories].map(({ icon: Icon, label }, i) => (
            <span key={i} className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-slate-400">
              <Icon size={13} className="text-red-300/80" /> {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
