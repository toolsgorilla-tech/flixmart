# FlixMart — Setup (FlixMart Catalog)

This repo is the FlixMart storefront, now with a Supabase-backed
CMS and Admin Dashboard layered on top. The public site keeps working with
its static FlixMart catalog even before you connect Supabase — everything
below is what turns on the live, database-backed version.

## 1. Install

```bash
npm install
```

## 2. Create a Supabase project

Create a project at https://supabase.com/dashboard, then from
**Settings → API** copy:

- Project URL
- `anon` public key
- `service_role` key (keep this secret — server-only)

Copy `.env.example` to `.env.local` and fill in the three values.

> **Note:** `next.config.mjs` derives the allowed image domain for
> `next/image` from `NEXT_PUBLIC_SUPABASE_URL` at build/start time — after
> adding or changing `.env.local`, restart `npm run dev` (a browser
> reload alone won't pick it up).

## 3. Run the migrations

Using the Supabase CLI (`npm i -g supabase` or `npx supabase`):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This runs, in order:

- `supabase/migrations/0001_init.sql` — every table, enum, trigger and RLS policy
- `supabase/migrations/0002_seed.sql` — seeds categories, hero copy, homepage sections and site settings so the site renders identically to the original static version
- `supabase/migrations/0003_storage.sql` — creates the public `media` Storage bucket used by the Media Library

(No CLI handy? Paste each file's contents into the Supabase Dashboard's SQL Editor, in order, instead.)

## 4. Migrate the existing product catalog

The migrations above create the schema and seed categories/site content —
but **not** products. The original 45 products (IPTV tiers, Netflix, Prime
Video, ChatGPT Plus, etc.) still live in `lib/data.ts` until you run:

```bash
npm run seed:catalog
```

This upserts every product from `lib/data.ts` (and its pricing plans) into
the `products` / `product_plans` tables, by `slug`, using
`SUPABASE_SERVICE_ROLE_KEY` from `.env.local`. It's what makes those
products show up under **Admin → Products** instead of only products
created through the admin UI — see `scripts/seed-catalog.ts` for details.
Run it once, right after step 3; don't re-run it after you've started
editing the migrated products from the Admin Dashboard, since it will
overwrite those edits back to the original static values.

## 5. Create your first admin account

1. In the Supabase Dashboard, go to **Authentication → Users → Add user** and create yourself an account (email + password).
2. A `handle_new_user` trigger automatically creates a matching row in `profiles` — **the very first user ever created is auto-promoted to the `admin` role**, everyone after that defaults to `editor`.
3. Go to `/admin/login` on your running site and sign in.

## 6. Run it

```bash
npm run dev
```

Visit `/` for the public site and `/admin/login` for the dashboard.

## What's live in FlixMart Catalog

- **Homepage Builder** (`/admin/homepage`) — enable/disable, drag-reorder, duplicate, delete, publish sections
- **Hero Editor** (`/admin/hero`) — headline, subtitle, buttons, badge, category chips, ticker
- **Products** (`/admin/products`) — full CRUD, multiple pricing plans, featured/trending flags, badges, SEO fields, bulk actions, duplicate
- **Categories** (`/admin/categories`) — CRUD with icon + sort order
- **Media Library** (`/admin/media`) — upload/replace/delete via Supabase Storage, grid/list views, search
- **Testimonials** & **FAQ** — full CRUD
- **Settings** (`/admin/settings`) — business info, contact, social links, GA/Meta Pixel IDs
- **Users** (`/admin/users`, admin-only) — invite staff, change roles (admin/editor/manager)
- Role-based access control end-to-end (middleware + page guards + RLS)

## Known limitations / what's next

- **Orders, Customers, Blog, Analytics, SEO (global), Appearance, Pricing** — the database tables and RLS policies already exist for all of these; their admin screens are stubbed ("coming in the next milestone") since FlixMart Catalog scope was the foundation + homepage/hero/products/categories/media/settings.
- **Hero's floating "marketplace showcase" cards** (the animated overlapping product cards) are still positioned in code, not yet drag-editable from the CMS — only the headline/copy/buttons/chips are wired up.
- **WhatsApp number** is still read from `lib/data.ts`'s `SITE` constant in a few places rather than `Settings → WhatsApp` — `Footer`/`Settings` are wired, but propagating it through every `whatsappLink()` call site is deferred to avoid a wide, risky refactor in this pass.
- **Blog CMS with Tiptap** isn't built yet — the `blog_posts` table is ready; the rich-text editor UI is next.
- This was built without the ability to run `npm install` / `npm run build` in the environment that wrote it (no network access) — run both locally before deploying, and let me know what the build turns up so I can fix it directly.
