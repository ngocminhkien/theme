'use client';

import { getAuthToken } from '@/features/auth/auth-client';

export interface AdminRevenue {
  vnd: number;
  usd: number;
}

export interface AdminOrderStats {
  total: number;
  paid: number;
  pending: number;
  failed: number;
}

export interface AdminRecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  currency: 'VND' | 'USD';
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface AdminDashboardStats {
  revenue: AdminRevenue;
  orders: AdminOrderStats;
  themes_count: number;
  customers_count: number;
  active_licenses_count: number;
  recent_orders: AdminRecentOrder[];
}

export interface AdminAnalyticsSeries {
  date: string;
  revenue_vnd: number;
  revenue_usd: number;
  orders: number;
}

export interface AdminTopTheme {
  id: number;
  name: string;
  slug: string;
  purchases: number;
  revenue_vnd: number;
  revenue_usd: number;
}

export interface AdminAnalytics {
  period_days: number;
  series: AdminAnalyticsSeries[];
  top_themes: AdminTopTheme[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  user_id?: number;
  customer_email: string;
  customer_name: string;
  customer_phone?: string | null;
  total_amount: number;
  currency: 'VND' | 'USD';
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface AdminOrderItem {
  id: number;
  order_id: number;
  theme_id: number;
  theme_name: string;
  theme_slug: string;
  license_type: string;
  unit_price: number;
  subtotal: number;
}

export interface AdminOrderLicense {
  id: number;
  license_key: string;
  license_type: string;
  status: string;
  max_domains: number;
  theme_name: string;
}

export interface AdminOrderPayment {
  id: number;
  transaction_id: string;
  gateway: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface AdminOrderDetail extends AdminOrder {
  items: AdminOrderItem[];
  licenses: AdminOrderLicense[];
  payments: AdminOrderPayment[];
}

export interface AdminTheme {
  id: number;
  category_id?: number | null;
  name: string;
  slug: string;
  thumbnail_url?: string | null;
  price_vnd: number;
  price_usd: number;
  current_version?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured?: number | boolean;
  total_sales?: number;
  rating_avg?: number;
  rating_count?: number;
  created_at?: string;
  category_name?: string | null;
  author_name?: string | null;
  short_desc_vi?: string | null;
  live_demo_url?: string | null;
}

export interface AdminThemeInput {
  name: string;
  slug: string;
  price_vnd: number;
  price_usd: number;
  category_id?: number | null;
  short_desc_vi?: string;
  live_demo_url?: string;
  thumbnail_url?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface AdminCategory {
  id: number;
  name_vi: string;
  name_en?: string;
  slug: string;
  is_active?: number | boolean;
  sort_order?: number;
}

export interface AdminLicense {
  id: number;
  license_key: string;
  license_type: string;
  status: string;
  max_domains: number;
  active_domains_count: number;
  created_at: string;
  expires_at?: string | null;
  theme_name: string;
  theme_slug?: string;
  customer_email: string;
  customer_name: string;
  order_number?: string;
}

export interface AdminLicenseActivation {
  id: number;
  license_id: number;
  domain: string;
  ip_address?: string | null;
  is_active: number | boolean;
  activated_at: string;
}

export interface AdminLicenseDetail extends AdminLicense {
  activations: AdminLicenseActivation[];
}

export interface AdminCustomer {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  role: 'customer' | 'admin' | 'author';
  status?: string;
  country_code?: string;
  created_at: string;
  orders_count: number;
  total_spent_vnd: number;
  total_spent_usd: number;
}

export interface AdminCustomerDetail {
  customer: AdminCustomer;
  orders: AdminOrder[];
  licenses: Array<{
    id: number;
    license_key: string;
    theme_name: string;
    status: string;
  }>;
}

export interface AdminCustomerInput {
  full_name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: 'customer' | 'admin' | 'author';
}

export class AdminApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.code = code;
  }
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  if (!token) {
    throw new AdminApiError('Vui lòng đăng nhập với tài khoản quản trị viên.', 401, 'UNAUTHORIZED');
  }

  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch('/api/v1/admin' + path, {
      ...init,
      headers,
      cache: 'no-store',
    });
  } catch {
    throw new AdminApiError('Không kết nối được máy chủ. Vui lòng thử lại.', 503, 'NETWORK_ERROR');
  }

  const json = await response.json().catch(() => null);
  if (!response.ok || json?.success !== true) {
    const message = typeof json?.message === 'string' ? json.message : 'Yêu cầu không thành công.';
    throw new AdminApiError(message, response.status, json?.error || json?.code);
  }

  return json.data as T;
}

export async function getStats(): Promise<AdminDashboardStats> {
  return adminFetch<AdminDashboardStats>('/stats');
}

export async function getAnalytics(days = 30): Promise<AdminAnalytics> {
  return adminFetch<AdminAnalytics>(`/analytics?days=${encodeURIComponent(days)}`);
}

export async function getOrders(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<{ orders: AdminOrder[]; pagination: Pagination }> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.date_from) query.set('date_from', params.date_from);
  if (params?.date_to) query.set('date_to', params.date_to);

  const qs = query.toString();
  return adminFetch<{ orders: AdminOrder[]; pagination: Pagination }>(`/orders${qs ? `?${qs}` : ''}`);
}

export async function getOrderDetail(orderNumber: string): Promise<AdminOrderDetail> {
  return adminFetch<AdminOrderDetail>(`/orders/${encodeURIComponent(orderNumber)}`);
}

export async function updateOrderStatus(
  orderNumber: string,
  data: { payment_status?: string; order_status?: string }
): Promise<{ order_number: string; payment_status?: string; order_status?: string }> {
  return adminFetch<{ order_number: string; payment_status?: string; order_status?: string }>(
    `/orders/${encodeURIComponent(orderNumber)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
}

export async function getThemes(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category_id?: number;
}): Promise<{ themes: AdminTheme[]; pagination: Pagination }> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.category_id) query.set('category_id', String(params.category_id));

  const qs = query.toString();
  return adminFetch<{ themes: AdminTheme[]; pagination: Pagination }>(`/themes${qs ? `?${qs}` : ''}`);
}

export async function getThemeDetail(id: number): Promise<AdminTheme> {
  return adminFetch<AdminTheme>(`/themes/${id}`);
}

export async function createTheme(data: AdminThemeInput): Promise<{ id: number }> {
  return adminFetch<{ id: number }>('/themes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTheme(
  id: number,
  data: Partial<AdminThemeInput>
): Promise<{ id: number; updated_fields?: string[] }> {
  return adminFetch<{ id: number; updated_fields?: string[] }>(`/themes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getCategories(): Promise<{ categories: AdminCategory[] }> {
  return adminFetch<{ categories: AdminCategory[] }>('/categories');
}

export async function getLicenses(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{ licenses: AdminLicense[]; pagination: Pagination }> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);

  const qs = query.toString();
  return adminFetch<{ licenses: AdminLicense[]; pagination: Pagination }>(`/licenses${qs ? `?${qs}` : ''}`);
}

export async function getLicenseDetail(licenseKey: string): Promise<AdminLicenseDetail> {
  return adminFetch<AdminLicenseDetail>(`/licenses/${encodeURIComponent(licenseKey)}`);
}

export async function deactivateLicenseDomain(
  licenseKey: string,
  domain: string
): Promise<{ license_key: string; domain: string; is_active: number }> {
  return adminFetch<{ license_key: string; domain: string; is_active: number }>(
    `/licenses/${encodeURIComponent(licenseKey)}/deactivate`,
    {
      method: 'POST',
      body: JSON.stringify({ domain }),
    }
  );
}

export async function resetLicenseDomains(
  licenseKey: string
): Promise<{ license_key: string; active_domains_count: number }> {
  return adminFetch<{ license_key: string; active_domains_count: number }>(
    `/licenses/${encodeURIComponent(licenseKey)}/reset`,
    {
      method: 'POST',
    }
  );
}

export async function getCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<{ customers: AdminCustomer[]; pagination: Pagination }> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.role) query.set('role', params.role);

  const qs = query.toString();
  return adminFetch<{ customers: AdminCustomer[]; pagination: Pagination }>(`/customers${qs ? `?${qs}` : ''}`);
}

export async function createCustomer(
  data: AdminCustomerInput
): Promise<{ user: AdminCustomer }> {
  return adminFetch<{ user: AdminCustomer }>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCustomerDetail(id: number): Promise<AdminCustomerDetail> {
  return adminFetch<AdminCustomerDetail>(`/customers/${id}`);
}

export async function updateCustomerRole(
  id: number,
  role: 'customer' | 'admin' | 'author'
): Promise<{ user: AdminCustomer }> {
  return adminFetch<{ user: AdminCustomer }>(`/customers/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}
