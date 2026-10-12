'use client';

import type { AdminUser } from './types';

const TOKEN_KEY = 'themestore-admin-token';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

export function getAdminToken() { return storage()?.getItem(TOKEN_KEY) || null; }
export function clearAdminSession() { try { storage()?.removeItem(TOKEN_KEY); } catch { /* browser storage is unavailable */ } }

async function publicRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/v1${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      cache: 'no-store',
    });
  } catch { throw new Error('Không kết nối được API. Kiểm tra backend rồi thử lại.'); }
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.success !== true) throw new Error(body?.message || 'Yêu cầu không thành công.');
  return body.data as T;
}

export async function loginAdmin(email: string, password: string) {
  const session = await publicRequest<{ user: AdminUser; token: string }>('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  if (session.user.role !== 'admin') {
    clearAdminSession();
    throw new Error('Tài khoản này không có quyền quản trị.');
  }
  try { storage()?.setItem(TOKEN_KEY, session.token); } catch { throw new Error('Không thể lưu phiên đăng nhập trên trình duyệt này.'); }
  return session.user;
}

export async function getAdminProfile(): Promise<AdminUser> {
  const token = getAdminToken();
  if (!token) throw new Error('NO_SESSION');
  const user = await publicRequest<AdminUser>('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  if (user.role !== 'admin') {
    clearAdminSession();
    throw new Error('Tài khoản này không có quyền quản trị.');
  }
  return user;
}
