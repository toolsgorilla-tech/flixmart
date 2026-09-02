import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | FlixMart Admin" },
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#070A0F] text-white">{children}</div>;
}
