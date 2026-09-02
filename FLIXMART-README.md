# FlixMart — Pakistani PKR Marketplace

This project is based on the supplied Toolsgorilla catalog/admin codebase and has been rebranded for FlixMart.

## Current catalog

The static starter catalog contains:
- IPTV (same four-tier structure from the supplied Toolsgorilla project)
- AI Tools
- Graphics/Video Tools
- AI Videos
- Entertainment
- Academic/Writing Tools
- Business Tools
- VPN

The non-IPTV products currently loaded are the products and PKR prices that were clearly readable in the KingMotions screenshots supplied for this project. Unreadable/uncertain screenshot values were not guessed.

## Currency

Customer-facing pricing and the admin product pricing field are PKR (Rs).

## Supabase

1. Copy `.env.local.example` to `.env.local` if you add one, or create `.env.local` yourself.
2. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run the SQL migrations in `supabase/migrations`.
4. Run `npm run seed:catalog` once to populate categories/products/plans from `lib/data.ts`.
5. After seeding, use **Admin → Products** to edit product names, images, prices, plans, descriptions and status.

## Run locally

```bash
npm install
npm run dev
```

## Important before launch

- Replace the placeholder/default WhatsApp and support email with FlixMart's real Pakistan contact details.
- Replace `https://flixmart.online` in metadata/robots/sitemap with the final domain if different.
- Connect the final Supabase project before relying on Admin data; the public site has a static fallback for development.


## FlixMart payment checkout
Checkout supports Easypaisa, JazzCash and NayaPay. The default payment number is 03044603133 and can be changed from Admin → Settings → Pakistani Payment Methods.
