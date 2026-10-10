export type Currency = 'VND' | 'USD';
export type Locale = 'vi' | 'en';

export interface ThemeItem {
  id: number;
  name: string;
  slug: string;
  category?: string;
  category_name_vi?: string;
  sub_category?: string;
  short_desc_vi: string;
  short_desc_en: string;
  full_desc_vi?: string;
  price_vnd: number;
  price_usd: number;
  original_price_vnd?: number;
  original_price_usd?: number;
  discount_percent?: number;
  badge?: 'HOT' | 'SALE' | 'NEW' | 'FEATURED';
  thumbnail_url: string;
  gallery_urls?: string[];
  live_demo_url: string;
  page_builders: string;
  rating_avg: number;
  rating_count?: number;
  total_sales: number;
  is_featured?: boolean;
  is_weekly_deal?: boolean;
  features?: string[];
  compat_wordpress?: string;
  compat_php?: string;
  compat_woocommerce?: string;
  version?: string;
  last_update?: string;
}

export interface CartItem {
  theme: ThemeItem;
  license_type: 'regular' | 'agency' | 'lifetime';
  price: number;
  currency: Currency;
  installation_addon?: boolean;
}

export interface FilterState {
  search: string;
  category: string;
  builder: string;
  priceRange: string;
  feature: string;
  sortBy: 'featured' | 'newest' | 'bestseller' | 'price-asc' | 'price-desc' | 'rating';
  viewMode: 'grid' | 'list';
}
