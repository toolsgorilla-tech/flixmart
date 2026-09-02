-- ============================================================================
-- Seed data — ports the existing hardcoded lib/data.ts content into the DB
-- so the site renders identically on first boot, before anyone touches the
-- Admin Dashboard.
-- ============================================================================

insert into public.categories (slug, name, description, icon, sort_order) values
  ('iptv', 'IPTV', 'Live TV, sports, movies and international entertainment in one place.', 'Tv', 1),
  ('ai-tools', 'AI Tools', 'Premium AI assistants, research, writing and productivity tools.', 'Bot', 2),
  ('graphics-video-tools', 'Graphics/Video Tools', 'Professional design, graphics, video and creator software.', 'Palette', 3),
  ('ai-videos', 'AI Videos', 'Next-generation AI video creation, editing and generation platforms.', 'Video', 4),
  ('entertainment', 'Entertainment', 'Premium streaming, music and entertainment subscriptions.', 'Film', 5),
  ('academic-writing-tools', 'Academic/Writing Tools', 'Writing, research, study and academic productivity tools.', 'BookOpen', 6),
  ('business-tools', 'Business Tools', 'Business, collaboration, presentations and professional productivity tools.', 'Briefcase', 7),
  ('vpn', 'VPN', 'Privacy and security tools for safer browsing and digital access.', 'ShieldCheck', 8)
on conflict (slug) do nothing;

insert into public.hero_content (
  id, headline, headline_highlight, subtitle, primary_button_label, primary_button_url,
  secondary_button_label, secondary_button_url, badge_text, category_chips, trust_badges, ticker_items
) values (
  1,
  'Every Premium Subscription.',
  'One Trusted Marketplace.',
  'Netflix, Disney+ and live sports IPTV. ChatGPT Plus, Claude Pro and Gemini. Canva, Microsoft 365 and Adobe Creative Cloud. Buy the streaming, AI and productivity subscriptions you actually use — with instant delivery and real human support.',
  'Explore Marketplace', '/products',
  'Watch Demo', '#marketplace-showcase',
  E'World\'s Premium Digital Marketplace',
  '[{"icon":"Trophy","label":"Live Sports"},{"icon":"Film","label":"Movies & Series"},{"icon":"Sparkles","label":"AI Tools"},{"icon":"Zap","label":"Productivity"}]'::jsonb,
  '[{"icon":"Star","label":"50,000+ Happy Customers","accent":"text-amber-400"},{"icon":"Zap","label":"Instant Delivery","accent":"text-emerald-400"},{"icon":"ShieldCheck","label":"Secure Payments","accent":"text-indigo-300"},{"icon":"MessageCircle","label":"24/7 WhatsApp Support","accent":"text-emerald-400"}]'::jsonb,
  '[{"icon":"Film","label":"Movies"},{"icon":"Trophy","label":"Live Sports"},{"icon":"Tv","label":"Streaming"},{"icon":"Sparkles","label":"AI Tools"},{"icon":"Palette","label":"Creative Apps"},{"icon":"Briefcase","label":"Business Software"},{"icon":"ShieldCheck","label":"VPN"},{"icon":"Zap","label":"Productivity"}]'::jsonb
)
on conflict (id) do nothing;

insert into public.homepage_sections (type, title, is_enabled, sort_order, status) values
  ('hero', 'Hero', true, 1, 'published'),
  ('categories', 'Category Grid', true, 2, 'published'),
  ('featured_products', 'Featured Products', true, 3, 'published'),
  ('why_choose_us', 'Why Choose Us', true, 4, 'published'),
  ('testimonials', 'Testimonials', true, 5, 'published'),
  ('faq', 'FAQ Preview', true, 6, 'published'),
  ('cta_banner', 'CTA Banner', true, 7, 'published'),
  ('newsletter', 'Newsletter', true, 8, 'published')
on conflict do nothing;
