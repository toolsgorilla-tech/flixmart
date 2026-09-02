-- ============================================================================
-- FlixMart — Milestone 1 schema
-- Digital subscriptions marketplace + CMS/Admin foundation
-- Run against a fresh Supabase (PostgreSQL) project.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
create type app_role as enum ('admin', 'editor', 'manager');
create type content_status as enum ('draft', 'published');
create type product_badge as enum ('Best Seller', 'New', 'Limited', 'Trending', 'Most Popular');
create type order_status as enum ('pending', 'processing', 'completed', 'cancelled', 'refunded');

-- ----------------------------------------------------------------------------
-- PROFILES — extends auth.users with app-specific role data.
-- A row is created automatically by the trigger below whenever a new
-- Supabase Auth user is created (see handle_new_user()).
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role app_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App-level user profile + RBAC role, 1:1 with auth.users.';

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  icon text not null default 'Package',
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories (id) on delete set null,
  tagline text,
  description text,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,          -- string[] of image urls
  brand_key text,
  badge product_badge,
  rating numeric(2,1) not null default 5.0,
  reviews_count integer not null default 0,
  delivery_time text default 'Within 30 minutes',
  features jsonb not null default '[]'::jsonb,          -- string[]
  included jsonb not null default '[]'::jsonb,          -- string[]
  faqs jsonb not null default '[]'::jsonb,               -- {question, answer}[]
  specifications jsonb not null default '{}'::jsonb,     -- free-form key/value
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  status content_status not null default 'draft',
  -- SEO
  seo_title text,
  seo_description text,
  seo_keywords text,
  seo_og_image text,
  seo_canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);
create index products_status_idx on public.products (status);

-- ----------------------------------------------------------------------------
-- PRODUCT PLANS (pricing tiers per product)
-- ----------------------------------------------------------------------------
create table public.product_plans (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  duration text not null default '1 month',
  price_tbd boolean not null default false,
  is_free boolean not null default false,
  badge text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_plans_product_id_idx on public.product_plans (product_id);

-- ----------------------------------------------------------------------------
-- CUSTOMERS
-- ----------------------------------------------------------------------------
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null unique,
  phone text,
  whatsapp text,
  country text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ORDERS + ORDER ITEMS
-- ----------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_id uuid references public.customers (id) on delete set null,
  status order_status not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  currency text not null default 'PKR',
  payment_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  plan_label text not null,
  unit_price numeric(10,2) not null default 0,
  quantity integer not null default 1,
  line_total numeric(10,2) not null default 0
);

create index orders_customer_id_idx on public.orders (customer_id);
create index order_items_order_id_idx on public.order_items (order_id);

-- ----------------------------------------------------------------------------
-- HOMEPAGE BUILDER — ordered, toggleable sections + a JSON content blob
-- interpreted per section `type` by the renderer. Draft/publish via
-- `status` + `published_at`; the live site always reads `status = published`.
-- ----------------------------------------------------------------------------
create table public.homepage_sections (
  id uuid primary key default uuid_generate_v4(),
  type text not null,                -- e.g. 'hero','categories','featured_products','testimonials','faq','cta','newsletter'
  title text not null,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  status content_status not null default 'published',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index homepage_sections_sort_order_idx on public.homepage_sections (sort_order);

-- ----------------------------------------------------------------------------
-- HERO CONTENT — singleton row (id fixed to 1 via check) holding every
-- editable field of the Hero section described in the brief.
-- ----------------------------------------------------------------------------
create table public.hero_content (
  id integer primary key default 1,
  headline text not null default 'Every Premium Subscription.',
  headline_highlight text not null default 'One Trusted Marketplace.',
  subtitle text not null default '',
  primary_button_label text not null default 'Explore Marketplace',
  primary_button_url text not null default '/products',
  secondary_button_label text not null default 'Watch Demo',
  secondary_button_url text not null default '#marketplace-showcase',
  badge_text text not null default E'World\'s Premium Digital Marketplace',
  category_chips jsonb not null default '[]'::jsonb,     -- {icon,label}[]
  trust_badges jsonb not null default '[]'::jsonb,        -- {icon,label,accent}[]
  ticker_items jsonb not null default '[]'::jsonb,        -- {icon,label}[]
  showcase_cards jsonb not null default '[]'::jsonb,      -- floating marketplace cards config
  background_style jsonb not null default '{}'::jsonb,    -- colors/gradients toggles
  animations_enabled boolean not null default true,
  status content_status not null default 'published',
  updated_at timestamptz not null default now(),
  constraint hero_content_singleton check (id = 1)
);

-- ----------------------------------------------------------------------------
-- TESTIMONIALS
-- ----------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text,
  country text,
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null,
  product text,
  photo_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- FAQ (site-wide, with categories + sorting)
-- ----------------------------------------------------------------------------
create table public.faq_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sort_order integer not null default 0
);

create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.faq_categories (id) on delete set null,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- BLOG
-- ----------------------------------------------------------------------------
create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_html text,               -- Tiptap-serialized HTML
  content_json jsonb,               -- Tiptap-serialized JSON (source of truth for re-editing)
  featured_image text,
  author_id uuid references public.profiles (id) on delete set null,
  status content_status not null default 'draft',
  published_at timestamptz,
  scheduled_at timestamptz,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_idx on public.blog_posts (status);

-- ----------------------------------------------------------------------------
-- MEDIA LIBRARY — metadata for files stored in the `media` Supabase Storage
-- bucket. `path` is the storage object path (bucket-relative).
-- ----------------------------------------------------------------------------
create table public.media_folders (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  parent_id uuid references public.media_folders (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.media_items (
  id uuid primary key default uuid_generate_v4(),
  folder_id uuid references public.media_folders (id) on delete set null,
  file_name text not null,
  path text not null unique,          -- storage path within the `media` bucket
  url text not null,                  -- public URL
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index media_items_folder_id_idx on public.media_items (folder_id);

-- ----------------------------------------------------------------------------
-- SETTINGS — singleton key/value-ish row for business/site settings.
-- ----------------------------------------------------------------------------
create table public.site_settings (
  id integer primary key default 1,
  business_name text not null default 'FlixMart',
  tagline text,
  logo_url text,
  favicon_url text,
  whatsapp text,
  phone text,
  email text,
  address text,
  social_links jsonb not null default '{}'::jsonb,    -- {facebook,instagram,twitter,...}
  theme jsonb not null default '{}'::jsonb,             -- {primaryColor, font, buttonStyle, cardStyle, ...}
  google_analytics_id text,
  meta_pixel_id text,
  default_currency text not null default 'PKR',
  seo_defaults jsonb not null default '{}'::jsonb,      -- {title, description, ogImage, robots}
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- ----------------------------------------------------------------------------
-- ANALYTICS — lightweight event log, aggregated by the dashboard.
-- ----------------------------------------------------------------------------
create table public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,          -- 'page_view' | 'product_view' | 'order_created' | ...
  path text,
  product_id uuid references public.products (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_type_idx on public.analytics_events (event_type);
create index analytics_events_created_at_idx on public.analytics_events (created_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.homepage_sections for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.hero_content for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.blog_posts for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

-- Auto-create a profile row (default role: editor) whenever a new auth user
-- signs up. Promote the first-ever user to admin so there's always at least
-- one admin account after setup.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  existing_count integer;
begin
  select count(*) into existing_count from public.profiles;
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    case when existing_count = 0 then 'admin'::app_role else 'editor'::app_role end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public (anon) can read published/active content. Only authenticated users
-- with a profile row can read/write admin data; role-specific writes are
-- refined further (e.g. only admin can manage users).
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_plans enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.hero_content enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq_categories enable row level security;
alter table public.faqs enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media_folders enable row level security;
alter table public.media_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.analytics_events enable row level security;

-- Helper: is the current user an authenticated admin/editor/manager?
create or replace function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid()
  );
$$ language sql stable security definer set search_path = public;

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- Profiles: users can read their own row; admins can read/manage all.
create policy "profiles_self_select" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_write" on public.profiles for insert with check (public.is_admin());
create policy "profiles_admin_update" on public.profiles for update using (public.is_admin());
create policy "profiles_admin_delete" on public.profiles for delete using (public.is_admin());

-- Public-readable content tables: anon can read published rows; staff can read/write everything.
create policy "categories_public_read" on public.categories for select using (is_active = true or public.is_staff());
create policy "categories_staff_write" on public.categories for insert with check (public.is_staff());
create policy "categories_staff_update" on public.categories for update using (public.is_staff());
create policy "categories_staff_delete" on public.categories for delete using (public.is_staff());

create policy "products_public_read" on public.products for select using (status = 'published' or public.is_staff());
create policy "products_staff_write" on public.products for insert with check (public.is_staff());
create policy "products_staff_update" on public.products for update using (public.is_staff());
create policy "products_staff_delete" on public.products for delete using (public.is_staff());

create policy "product_plans_public_read" on public.product_plans for select using (true);
create policy "product_plans_staff_write" on public.product_plans for insert with check (public.is_staff());
create policy "product_plans_staff_update" on public.product_plans for update using (public.is_staff());
create policy "product_plans_staff_delete" on public.product_plans for delete using (public.is_staff());

create policy "homepage_sections_public_read" on public.homepage_sections for select using (status = 'published' or public.is_staff());
create policy "homepage_sections_staff_write" on public.homepage_sections for insert with check (public.is_staff());
create policy "homepage_sections_staff_update" on public.homepage_sections for update using (public.is_staff());
create policy "homepage_sections_staff_delete" on public.homepage_sections for delete using (public.is_staff());

create policy "hero_content_public_read" on public.hero_content for select using (true);
create policy "hero_content_staff_update" on public.hero_content for update using (public.is_staff());
create policy "hero_content_staff_insert" on public.hero_content for insert with check (public.is_staff());

create policy "testimonials_public_read" on public.testimonials for select using (is_published = true or public.is_staff());
create policy "testimonials_staff_write" on public.testimonials for insert with check (public.is_staff());
create policy "testimonials_staff_update" on public.testimonials for update using (public.is_staff());
create policy "testimonials_staff_delete" on public.testimonials for delete using (public.is_staff());

create policy "faq_categories_public_read" on public.faq_categories for select using (true);
create policy "faq_categories_staff_write" on public.faq_categories for insert with check (public.is_staff());
create policy "faq_categories_staff_update" on public.faq_categories for update using (public.is_staff());
create policy "faq_categories_staff_delete" on public.faq_categories for delete using (public.is_staff());

create policy "faqs_public_read" on public.faqs for select using (is_published = true or public.is_staff());
create policy "faqs_staff_write" on public.faqs for insert with check (public.is_staff());
create policy "faqs_staff_update" on public.faqs for update using (public.is_staff());
create policy "faqs_staff_delete" on public.faqs for delete using (public.is_staff());

create policy "blog_posts_public_read" on public.blog_posts for select using (status = 'published' or public.is_staff());
create policy "blog_posts_staff_write" on public.blog_posts for insert with check (public.is_staff());
create policy "blog_posts_staff_update" on public.blog_posts for update using (public.is_staff());
create policy "blog_posts_staff_delete" on public.blog_posts for delete using (public.is_staff());

create policy "site_settings_public_read" on public.site_settings for select using (true);
create policy "site_settings_staff_update" on public.site_settings for update using (public.is_staff());
create policy "site_settings_staff_insert" on public.site_settings for insert with check (public.is_staff());

-- Staff-only tables (no public storefront use yet).
create policy "customers_staff_all_select" on public.customers for select using (public.is_staff());
create policy "customers_staff_all_write" on public.customers for insert with check (public.is_staff());
create policy "customers_staff_all_update" on public.customers for update using (public.is_staff());
create policy "customers_staff_all_delete" on public.customers for delete using (public.is_staff());

create policy "orders_staff_all_select" on public.orders for select using (public.is_staff());
create policy "orders_staff_all_write" on public.orders for insert with check (public.is_staff());
create policy "orders_staff_all_update" on public.orders for update using (public.is_staff());
create policy "orders_staff_all_delete" on public.orders for delete using (public.is_staff());

create policy "order_items_staff_all_select" on public.order_items for select using (public.is_staff());
create policy "order_items_staff_all_write" on public.order_items for insert with check (public.is_staff());
create policy "order_items_staff_all_update" on public.order_items for update using (public.is_staff());
create policy "order_items_staff_all_delete" on public.order_items for delete using (public.is_staff());

create policy "media_folders_staff_all_select" on public.media_folders for select using (public.is_staff());
create policy "media_folders_staff_all_write" on public.media_folders for insert with check (public.is_staff());
create policy "media_folders_staff_all_update" on public.media_folders for update using (public.is_staff());
create policy "media_folders_staff_all_delete" on public.media_folders for delete using (public.is_staff());

create policy "media_items_staff_all_select" on public.media_items for select using (public.is_staff());
create policy "media_items_staff_all_write" on public.media_items for insert with check (public.is_staff());
create policy "media_items_staff_all_update" on public.media_items for update using (public.is_staff());
create policy "media_items_staff_all_delete" on public.media_items for delete using (public.is_staff());

create policy "analytics_events_staff_select" on public.analytics_events for select using (public.is_staff());
create policy "analytics_events_public_insert" on public.analytics_events for insert with check (true);
