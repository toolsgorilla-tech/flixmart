export type CategorySlug =
  | "iptv"
  | "ai-tools"
  | "graphics-video-tools"
  | "ai-videos"
  | "entertainment"
  | "academic-writing-tools"
  | "business-tools"
  | "vpn";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
}

export interface Plan {
  label: string;
  /** Price in PKR. Ignored for display when priceTBD is true. */
  price: number;
  originalPrice?: number;
  duration: string;
  /** True when the price hasn't been finalized yet (e.g. IPTV long-term plans). Renders as "Contact for pricing" instead of a number. */
  priceTBD?: boolean;
  /** True for a $0 promotional plan such as a free trial. */
  isFree?: boolean;
  /** Optional short badge shown next to the plan, e.g. "24-Hour Trial". */
  badge?: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  tagline: string;
  description: string;
  image: string;
  brandKey?: string;
  badge?: "Best Seller" | "New" | "Limited" | "Trending" | "Most Popular";
  rating: number;
  reviews: number;
  deliveryTime: string;
  plans: Plan[];
  features: string[];
  included: string[];
  faqs: { question: string; answer: string }[];
  // IPTV specific metadata fields (optional)
  isIPTV?: boolean;
  iptvTier?: "Starter" | "Standard" | "Premium" | "Ultimate";
  quality?: string;
  contentRegions?: string[];
  epgSupported?: boolean;
  devicesSupported?: string[];
  channelCountText?: string;
  movieCountText?: string;
  seriesCountText?: string;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  quote: string;
  product: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
