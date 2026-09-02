import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQAccordion from "@/components/FAQAccordion";
import SectionHeading from "@/components/SectionHeading";
import CTABanner from "@/components/CTABanner";
import { getPublishedHeroContent } from "@/features/hero/api";
import { getPublishedHomepageSections } from "@/features/homepage/api";
import { getActiveCategories } from "@/features/categories/api";
import { getPublishedProducts } from "@/features/products/api";
import { getPublishedTestimonials } from "@/features/testimonials/api";
import { getPublishedFaqs } from "@/features/faq/api";
import type { HomepageSectionType } from "@/types/database";

export default async function HomePage() {
  // All of these gracefully fall back to the original static content in
  // lib/data.ts when Supabase isn't connected yet — see each feature's
  // api.ts for details.
  const [hero, sections, categories, products, testimonials, faqs] = await Promise.all([
    getPublishedHeroContent(),
    getPublishedHomepageSections(),
    getActiveCategories(),
    getPublishedProducts(),
    getPublishedTestimonials(),
    getPublishedFaqs()
  ]);

  const enabled = new Set<HomepageSectionType>(sections.map((s) => s.type));
  const isOn = (type: HomepageSectionType) => enabled.size === 0 || enabled.has(type);

  return (
    <>
      {isOn("hero") && (
        <Hero
          headline={hero.headline}
          headlineHighlight={hero.headline_highlight}
          subtitle={hero.subtitle}
          badgeText={hero.badge_text}
          primaryButtonLabel={hero.primary_button_label}
          primaryButtonUrl={hero.primary_button_url}
          secondaryButtonLabel={hero.secondary_button_label}
          secondaryButtonUrl={hero.secondary_button_url}
          categoryChips={hero.category_chips}
          trustBadges={hero.trust_badges}
          tickerItems={hero.ticker_items}
        />
      )}
      {isOn("categories") && <CategorySection categories={categories} />}
      {isOn("featured_products") && <FeaturedProducts products={products} categories={categories} />}
      {isOn("why_choose_us") && <WhyChooseUs />}
      {isOn("testimonials") && <Testimonials testimonials={testimonials} />}
      {isOn("faq") && (
        <section className="section py-20 sm:py-28">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" description="Everything you need to know before you order." />
          <div className="mx-auto mt-12 max-w-2xl">
            <FAQAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}
      {isOn("cta_banner") && <CTABanner />}
    </>
  );
}
