import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flixmart.online"),
  title: {
    default: "FlixMart — Premium Digital Subscriptions & AI Tools",
    template: "%s | FlixMart"
  },
  description:
    "Buy ChatGPT Plus, Canva Pro, Netflix, Claude AI, Figma, IPTV, VPN and more premium subscriptions at competitive prices. Instant delivery, worldwide.",
  keywords: [
    "FlixMart",
    "buy ChatGPT Plus subscription",
    "Canva Pro discount",
    "Netflix subscription online",
    "Claude AI subscription",
    "premium digital subscriptions",
    "AI tools marketplace",
    "IPTV subscription"
  ],
  openGraph: {
    title: "FlixMart — Premium Digital Subscriptions & AI Tools",
    description:
      "Your trusted marketplace for premium AI tools, software and streaming subscriptions. Instant delivery, genuine licenses, 24/7 support.",
    url: "https://flixmart.online",
    siteName: "FlixMart",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FlixMart — Premium Digital Subscriptions & AI Tools",
    description: "Buy premium AI tools, software & streaming subscriptions with instant delivery."
  },
  icons: {
    icon: "/favicon.svg"
  }
};

// Root layout is intentionally chrome-less: the public marketing site and
// the admin dashboard need completely different shells (Navbar/Footer vs.
// Sidebar/Topbar), so each lives in its own nested layout —
// app/(site)/layout.tsx and app/admin/layout.tsx respectively.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased bg-[#070A0F] text-white`}>
        {children}
      </body>
    </html>
  );
}
