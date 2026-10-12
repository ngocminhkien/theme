export type AdminUser = {
  id: number;
  email: string;
  full_name: string;
  role: 'customer' | 'author' | 'admin';
  status?: 'active' | 'inactive' | 'banned';
};

export type Pagination = { page: number; limit: number; total: number; total_pages: number };

export type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  total_amount: number;
  currency: 'VND' | 'USD';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  created_at: string;
};

export type OrderDetail = Order & {
  items: Array<{ id: number; theme_name: string; theme_slug: string; license_type: string; unit_price: number }>;
  licenses: Array<{ id: number; license_key: string; license_type: string; status: string; theme_name: string }>;
  payments: Array<{ id: number; transaction_id: string; gateway: string; amount: number; currency: string; status: string; created_at: string }>;
};

export type DashboardStats = {
  revenue: { vnd: number; usd: number };
  orders: { total: number; paid: number; pending: number; failed: number };
  themes_count: number;
  customers_count: number;
  active_licenses_count: number;
  recent_orders: Order[];
};

export type Analytics = {
  period_days: 7 | 30 | 90;
  series: Array<{ date: string; revenue_vnd: number; revenue_usd: number; orders: number }>;
  top_themes: Array<{ id: number; name: string; slug: string; purchases: number; revenue_vnd: number; revenue_usd: number }>;
};

export type Category = { id: number; name_vi: string; name_en: string; slug: string; is_active: number | boolean; sort_order: number };

export type Theme = {
  id: number;
  category_id: number | null;
  category_name?: string | null;
  author_name?: string | null;
  name: string;
  slug: string;
  thumbnail_url?: string | null;
  price_vnd: number;
  price_usd: number;
  current_version: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: number | boolean;
  total_sales: number;
  rating_avg: number;
  rating_count: number;
  short_desc_vi?: string | null;
  live_demo_url?: string | null;
  created_at: string;
};

export type ThemeInput = {
  name: string;
  slug: string;
  category_id?: number | null;
  price_vnd: number;
  price_usd: number;
  status: Theme['status'];
  short_desc_vi: string;
  live_demo_url: string;
  thumbnail_url: string;
};

export type Customer = {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  status: 'active' | 'inactive' | 'banned';
  country_code?: string | null;
  created_at: string;
  orders_count: number;
  total_spent_vnd: number;
  total_spent_usd: number;
};

export type License = {
  id: number;
  license_key: string;
  license_type: string;
  status: 'active' | 'expired' | 'revoked';
  max_domains: number;
  active_domains_count: number;
  theme_name?: string | null;
  theme_slug?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  order_number?: string | null;
  created_at: string;
  expires_at?: string | null;
};
