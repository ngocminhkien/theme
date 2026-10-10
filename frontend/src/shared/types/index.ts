export type Currency = 'VND' | 'USD';
export type Locale = 'vi' | 'en';

export interface ThemeItem {
  id: number;
  name: string;
  slug: string;
  short_desc_vi: string;
  short_desc_en: string;
  price_vnd: number;
  price_usd: number;
  thumbnail_url: string;
  live_demo_url: string;
  page_builders: string;
  rating_avg: number;
  total_sales: number;
}

export interface CartItem {
  theme: ThemeItem;
  license_type: 'regular' | 'agency' | 'lifetime';
  price: number;
  currency: Currency;
  installation_addon?: boolean;
}
