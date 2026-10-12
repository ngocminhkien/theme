'use client';

import { clearAdminSession, getAdminToken } from './auth';
import type { Analytics, Category, Customer, DashboardStats, License, Order, OrderDetail, Pagination, Theme, ThemeInput } from './types';

export class AdminApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
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

function query(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== '') params.set(key, String(value)); });
  const encoded = params.toString();
  return encoded ? `?${encoded}` : '';
}

export const adminApi = {
  stats: () => request<DashboardStats>('/stats'),
  analytics: (days: 7 | 30 | 90) => request<Analytics>(`/analytics?days=${days}`),
  themes: (params: { page?: number; search?: string; status?: string; category_id?: number }) => request<{ themes: Theme[]; pagination: Pagination }>(`/themes${query(params)}`),
  theme: (id: number) => request<Theme>(`/themes/${id}`),
  categories: () => request<{ categories: Category[] }>('/categories'),
  createTheme: (input: ThemeInput) => request<{ id: number }>('/themes', { method: 'POST', body: JSON.stringify(input) }),
  updateTheme: (id: number, input: Partial<ThemeInput>) => request<{ id: number }>(`/themes/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  orders: (params: { page?: number; search?: string; status?: string; date_from?: string; date_to?: string }) => request<{ orders: Order[]; pagination: Pagination }>(`/orders${query(params)}`),
  order: (number: string) => request<OrderDetail>(`/orders/${encodeURIComponent(number)}`),
  customers: (params: { page?: number; search?: string }) => request<{ customers: Customer[]; pagination: Pagination }>(`/customers${query(params)}`),
  customer: (id: number) => request<{ customer: Customer; orders: Order[]; licenses: License[] }>(`/customers/${id}`),
  licenses: (params: { page?: number; search?: string; status?: string }) => request<{ licenses: License[]; pagination: Pagination }>(`/licenses${query(params)}`),
};
