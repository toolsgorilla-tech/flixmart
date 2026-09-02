// Hand-written types mirroring supabase/migrations/0001_init.sql.
// Once you have a live Supabase project you can replace/augment this file
// with `supabase gen types typescript` output — the shapes below match
// that generator's conventions (snake_case columns) so the swap is a
// drop-in.

export type AppRole = "admin" | "editor" | "manager";
export type ContentStatus = "draft" | "published";
export type ProductBadge = "Best Seller" | "New" | "Limited" | "Trending" | "Most Popular";
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPlanRow {
  id: string;
  product_id: string;
  label: string;
  price: number;
  original_price: number | null;
  duration: string;
  price_tbd: boolean;
  is_free: boolean;
  badge: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductFaqEntry {
  question: string;
  answer: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  gallery: string[];
  brand_key: string | null;
  badge: ProductBadge | null;
  rating: number;
  reviews_count: number;
  delivery_time: string | null;
  features: string[];
  included: string[];
  faqs: ProductFaqEntry[];
  specifications: Record<string, unknown>;
  is_featured: boolean;
  is_trending: boolean;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  seo_og_image: string | null;
  seo_canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithPlans extends ProductRow {
  product_plans: ProductPlanRow[];
  categories?: CategoryRow | null;
}

export interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  plan_label: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export type HomepageSectionType =
  | "hero"
  | "categories"
  | "featured_products"
  | "why_choose_us"
  | "testimonials"
  | "faq"
  | "cta_banner"
  | "newsletter"
  | "custom";

export interface HomepageSectionRow {
  id: string;
  type: HomepageSectionType;
  title: string;
  is_enabled: boolean;
  sort_order: number;
  content: Record<string, unknown>;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroChip {
  icon: string;
  label: string;
}

export interface HeroTrustBadge {
  icon: string;
  label: string;
  accent?: string;
}

export interface HeroShowcaseCard {
  key: string;
  name: string;
  category: string;
  featured?: boolean;
  live?: boolean;
}

export interface HeroContentRow {
  id: 1;
  headline: string;
  headline_highlight: string;
  subtitle: string;
  primary_button_label: string;
  primary_button_url: string;
  secondary_button_label: string;
  secondary_button_url: string;
  badge_text: string;
  category_chips: HeroChip[];
  trust_badges: HeroTrustBadge[];
  ticker_items: HeroChip[];
  showcase_cards: HeroShowcaseCard[];
  background_style: Record<string, unknown>;
  animations_enabled: boolean;
  status: ContentStatus;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  rating: number;
  quote: string;
  product: string | null;
  photo_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface FaqCategoryRow {
  id: string;
  name: string;
  sort_order: number;
}

export interface FaqRow {
  id: string;
  category_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string | null;
  content_json: Record<string, unknown> | null;
  featured_image: string | null;
  author_id: string | null;
  status: ContentStatus;
  published_at: string | null;
  scheduled_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaFolderRow {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface MediaItemRow {
  id: string;
  folder_id: string | null;
  file_name: string;
  path: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface SiteSettingsRow {
  id: 1;
  business_name: string;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  social_links: Record<string, string>;
  theme: Record<string, unknown>;
  google_analytics_id: string | null;
  meta_pixel_id: string | null;
  default_currency: string;
  seo_defaults: Record<string, unknown>;
  updated_at: string;
}

// Minimal Supabase `Database` generic so `createClient<Database>()` gets
// table-level typing. Extend per-table `Row`/`Insert`/`Update` as needed;
// Insert/Update default to Partial<Row> here, which is a reasonable
// approximation until real generated types replace this file.
//
// `Relationships` on each table and `Views`/`Functions` on the schema are
// required (not optional) by @supabase/postgrest-js's `GenericSchema` /
// `GenericTable` constraints (see node_modules/@supabase/postgrest-js/src
// /types/common/common.ts: `GenericTable.Row/Insert/Update` must each be
// `Record<string, unknown>`, and `GenericSchema` needs `Tables`, `Views`
// and `Functions`). If `Database["public"]` doesn't structurally satisfy
// `GenericSchema`, supabase-js's `SupabaseClient` generic falls back to
// `Schema = never` (its default-type ternary resolves to `never`, not
// `any`), which is why every Row/Insert/Update — and hence every
// `.insert()`/`.update()` argument — silently became `never` project-wide.
//
// The `Row`/`CategoryRow`/etc. types above are declared with `interface`.
// TypeScript interfaces (unlike object-literal `type` aliases) do NOT
// structurally satisfy an index-signature type like `Record<string,
// unknown>`, even when every property's value type would qualify — so
// `TableDef<Profile>` failed the `GenericTable` check even after adding
// `Relationships`. Remapping each interface through `{ [K in keyof T]:
// T[K] }` below produces a fresh object-literal type with the same
// shape, which *does* satisfy `Record<string, unknown>`, without having
// to convert every domain interface to a `type` alias elsewhere in the
// app.
type AsRecord<T> = { [K in keyof T]: T[K] };

type TableDef<Row> = {
  Row: AsRecord<Row>;
  Insert: Partial<AsRecord<Row>>;
  Update: Partial<AsRecord<Row>>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<Profile>;
      categories: TableDef<CategoryRow>;
      products: TableDef<ProductRow>;
      product_plans: TableDef<ProductPlanRow>;
      customers: TableDef<CustomerRow>;
      orders: TableDef<OrderRow>;
      order_items: TableDef<OrderItemRow>;
      homepage_sections: TableDef<HomepageSectionRow>;
      hero_content: TableDef<HeroContentRow>;
      testimonials: TableDef<TestimonialRow>;
      faq_categories: TableDef<FaqCategoryRow>;
      faqs: TableDef<FaqRow>;
      blog_posts: TableDef<BlogPostRow>;
      media_folders: TableDef<MediaFolderRow>;
      media_items: TableDef<MediaItemRow>;
      site_settings: TableDef<SiteSettingsRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
