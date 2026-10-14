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

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const clientCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 45 * 1000; // 45 seconds TTL (30-60s requirement)

/**
 * Xóa bộ nhớ đệm client-side của Admin Portal
 * @param pattern Đường dẫn hoặc tiền tố cần vô hiệu hóa (nếu bỏ trống sẽ xóa sạch toàn bộ)
 */
export function invalidateAdminCache(pattern?: string): void {
  if (!pattern) {
    clientCache.clear();
    return;
  }
  for (const key of clientCache.keys()) {
    if (key.includes(pattern)) {
      clientCache.delete(key);
    }
  }
}

function shouldCache(): boolean {
  if (typeof process !== 'undefined') {
    if (process.env.NODE_ENV === 'test' || Boolean(process.env.NODE_TEST_CONTEXT)) return false;
    if (Array.isArray(process.argv) && process.argv.some(arg => arg.includes('test'))) return false;
  }
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

async function cachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttlMs = CACHE_TTL_MS
): Promise<T> {
  // Chỉ kích hoạt bộ nhớ đệm client-side khi chạy thực tế trên trình duyệt Web (Browser)
  if (!shouldCache()) {
    return fetcher();
  }

  const cached = clientCache.get(cacheKey);
  const now = Date.now();

  // 0ms Fast-Path: Trả về ngay lập tức dữ liệu cache nếu còn trong hạn TTL
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  // Nạp mới dữ liệu và lưu vào cache
  const freshData = await fetcher();
  clientCache.set(cacheKey, { data: freshData, timestamp: Date.now() });
  return freshData;
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
  return cachedFetch('/stats', () => adminFetch<AdminDashboardStats>('/stats'));
}

export async function getAnalytics(days = 30): Promise<AdminAnalytics> {
  const key = `/analytics?days=${encodeURIComponent(days)}`;
  return cachedFetch(key, () => adminFetch<AdminAnalytics>(key));
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
  const key = `/orders${qs ? `?${qs}` : ''}`;
  return cachedFetch(key, () => adminFetch<{ orders: AdminOrder[]; pagination: Pagination }>(key));
}

export async function getOrderDetail(orderNumber: string): Promise<AdminOrderDetail> {
  const key = `/orders/${encodeURIComponent(orderNumber)}`;
  return cachedFetch(key, () => adminFetch<AdminOrderDetail>(key));
}

export async function updateOrderStatus(
  orderNumber: string,
  data: { payment_status?: string; order_status?: string }
): Promise<{ order_number: string; payment_status?: string; order_status?: string }> {
  const result = await adminFetch<{ order_number: string; payment_status?: string; order_status?: string }>(
    `/orders/${encodeURIComponent(orderNumber)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  invalidateAdminCache('/orders');
  invalidateAdminCache('/stats');
  invalidateAdminCache('/analytics');
  return result;
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
  const key = `/themes${qs ? `?${qs}` : ''}`;
  return cachedFetch(key, () => adminFetch<{ themes: AdminTheme[]; pagination: Pagination }>(key));
}

export async function getThemeDetail(id: number): Promise<AdminTheme> {
  const key = `/themes/${id}`;
  return cachedFetch(key, () => adminFetch<AdminTheme>(key));
}

export async function createTheme(data: AdminThemeInput): Promise<{ id: number }> {
  const result = await adminFetch<{ id: number }>('/themes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  invalidateAdminCache('/themes');
  invalidateAdminCache('/stats');
  return result;
}

export async function updateTheme(
  id: number,
  data: Partial<AdminThemeInput>
): Promise<{ id: number; updated_fields?: string[] }> {
  const result = await adminFetch<{ id: number; updated_fields?: string[] }>(`/themes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  invalidateAdminCache('/themes');
  invalidateAdminCache('/stats');
  return result;
}

export async function getCategories(): Promise<{ categories: AdminCategory[] }> {
  return cachedFetch('/categories', () => adminFetch<{ categories: AdminCategory[] }>('/categories'));
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
  const key = `/licenses${qs ? `?${qs}` : ''}`;
  return cachedFetch(key, () => adminFetch<{ licenses: AdminLicense[]; pagination: Pagination }>(key));
}

export async function getLicenseDetail(licenseKey: string): Promise<AdminLicenseDetail> {
  const key = `/licenses/${encodeURIComponent(licenseKey)}`;
  return cachedFetch(key, () => adminFetch<AdminLicenseDetail>(key));
}

export async function deactivateLicenseDomain(
  licenseKey: string,
  domain: string
): Promise<{ license_key: string; domain: string; is_active: number }> {
  const result = await adminFetch<{ license_key: string; domain: string; is_active: number }>(
    `/licenses/${encodeURIComponent(licenseKey)}/deactivate`,
    {
      method: 'POST',
      body: JSON.stringify({ domain }),
    }
  );
  invalidateAdminCache('/licenses');
  invalidateAdminCache('/stats');
  return result;
}

export async function resetLicenseDomains(
  licenseKey: string
): Promise<{ license_key: string; active_domains_count: number }> {
  const result = await adminFetch<{ license_key: string; active_domains_count: number }>(
    `/licenses/${encodeURIComponent(licenseKey)}/reset`,
    {
      method: 'POST',
    }
  );
  invalidateAdminCache('/licenses');
  invalidateAdminCache('/stats');
  return result;
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
  const key = `/customers${qs ? `?${qs}` : ''}`;
  return cachedFetch(key, () => adminFetch<{ customers: AdminCustomer[]; pagination: Pagination }>(key));
}

export async function createCustomer(
  data: AdminCustomerInput
): Promise<{ user: AdminCustomer }> {
  const result = await adminFetch<{ user: AdminCustomer }>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  invalidateAdminCache('/customers');
  invalidateAdminCache('/stats');
  return result;
}

export async function getCustomerDetail(id: number): Promise<AdminCustomerDetail> {
  const key = `/customers/${id}`;
  return cachedFetch(key, () => adminFetch<AdminCustomerDetail>(key));
}

export async function updateCustomerRole(
  id: number,
  role: 'customer' | 'admin' | 'author'
): Promise<{ user: AdminCustomer }> {
  const result = await adminFetch<{ user: AdminCustomer }>(`/customers/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
  invalidateAdminCache('/customers');
  invalidateAdminCache('/stats');
  return result;
}
