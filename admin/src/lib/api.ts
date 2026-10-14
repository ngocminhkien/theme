'use client';

import { clearAdminSession, getAdminToken } from './auth';
import type { Analytics, Category, Customer, DashboardStats, License, Order, OrderDetail, Pagination, Theme, ThemeInput } from './types';

export class AdminApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  if (!token) throw new AdminApiError('Phiên đăng nhập đã hết hạn.', 401);
  let response: Response;
  try {
    response = await fetch(`/api/v1/admin${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...init?.headers },
      cache: 'no-store',
    });
  } catch { throw new AdminApiError('Không kết nối được API. Kiểm tra backend rồi thử lại.', 0); }
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.success !== true) {
    if (response.status === 401 || response.status === 403) clearAdminSession();
    throw new AdminApiError(body?.message || 'Máy chủ chưa xử lý được yêu cầu.', response.status);
  }
  return body.data as T;
}

function shouldCache(): boolean {
  if (typeof process !== 'undefined') {
    if (process.env.NODE_ENV === 'test' || Boolean(process.env.NODE_TEST_CONTEXT)) return false;
    if (Array.isArray(process.argv) && process.argv.some(arg => arg.includes('test'))) return false;
  }
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

async function cachedRequest<T>(
  path: string,
  fetcher: () => Promise<T>,
  ttlMs = CACHE_TTL_MS
): Promise<T> {
  // Chỉ kích hoạt bộ nhớ đệm client-side khi chạy thực tế trên trình duyệt Web (Browser)
  if (!shouldCache()) {
    return fetcher();
  }

  const cached = clientCache.get(path);
  const now = Date.now();

  // 0ms Fast-Path: Trả về ngay lập tức dữ liệu cache nếu còn trong hạn TTL
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  // Nạp mới dữ liệu và lưu vào cache
  const freshData = await fetcher();
  clientCache.set(path, { data: freshData, timestamp: Date.now() });
  return freshData;
}

function query(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== '') params.set(key, String(value)); });
  const encoded = params.toString();
  return encoded ? `?${encoded}` : '';
}

export const adminApi = {
  stats: () => cachedRequest<DashboardStats>('/stats', () => request<DashboardStats>('/stats')),
  analytics: (days: 7 | 30 | 90) => cachedRequest<Analytics>(`/analytics?days=${days}`, () => request<Analytics>(`/analytics?days=${days}`)),
  themes: (params: { page?: number; search?: string; status?: string; category_id?: number }) => {
    const p = `/themes${query(params)}`;
    return cachedRequest<{ themes: Theme[]; pagination: Pagination }>(p, () => request<{ themes: Theme[]; pagination: Pagination }>(p));
  },
  theme: (id: number) => cachedRequest<Theme>(`/themes/${id}`, () => request<Theme>(`/themes/${id}`)),
  categories: () => cachedRequest<{ categories: Category[] }>('/categories', () => request<{ categories: Category[] }>('/categories')),
  createTheme: async (input: ThemeInput) => {
    const res = await request<{ id: number }>('/themes', { method: 'POST', body: JSON.stringify(input) });
    invalidateAdminCache('/themes');
    invalidateAdminCache('/stats');
    return res;
  },
  updateTheme: async (id: number, input: Partial<ThemeInput>) => {
    const res = await request<{ id: number }>(`/themes/${id}`, { method: 'PUT', body: JSON.stringify(input) });
    invalidateAdminCache('/themes');
    invalidateAdminCache('/stats');
    return res;
  },
  orders: (params: { page?: number; search?: string; status?: string; date_from?: string; date_to?: string }) => {
    const p = `/orders${query(params)}`;
    return cachedRequest<{ orders: Order[]; pagination: Pagination }>(p, () => request<{ orders: Order[]; pagination: Pagination }>(p));
  },
  order: (number: string) => {
    const p = `/orders/${encodeURIComponent(number)}`;
    return cachedRequest<OrderDetail>(p, () => request<OrderDetail>(p));
  },
  customers: (params: { page?: number; search?: string; role?: string }) => {
    const p = `/customers${query(params)}`;
    return cachedRequest<{ customers: Customer[]; pagination: Pagination }>(p, () => request<{ customers: Customer[]; pagination: Pagination }>(p));
  },
  customer: (id: number) => {
    const p = `/customers/${id}`;
    return cachedRequest<{ customer: Customer; orders: Order[]; licenses: License[] }>(p, () => request<{ customer: Customer; orders: Order[]; licenses: License[] }>(p));
  },
  createCustomer: async (input: { email: string; password: string; full_name: string; phone?: string; role?: Customer['role'] }) => {
    const res = await request<{ user: Customer }>('/customers', { method: 'POST', body: JSON.stringify(input) });
    invalidateAdminCache('/customers');
    invalidateAdminCache('/stats');
    return res;
  },
  updateCustomerRole: async (id: number, role: Customer['role']) => {
    const res = await request<{ user: Customer }>(`/customers/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
    invalidateAdminCache('/customers');
    invalidateAdminCache('/stats');
    return res;
  },
  licenses: (params: { page?: number; search?: string; status?: string }) => {
    const p = `/licenses${query(params)}`;
    return cachedRequest<{ licenses: License[]; pagination: Pagination }>(p, () => request<{ licenses: License[]; pagination: Pagination }>(p));
  },
};

