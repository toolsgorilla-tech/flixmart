import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import { getActiveCategories } from "@/features/categories/api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Fetched once here (React's `cache()` in getActiveCategories() dedupes
  // this against the same call already made by page-level components in
  // this request, e.g. Footer/the homepage) so Navbar's category dropdown
  // reflects Admin → Categories instead of the static lib/data.ts list.
  const categories = await getActiveCategories();

  return (
    <>
      <Navbar categories={categories} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}
