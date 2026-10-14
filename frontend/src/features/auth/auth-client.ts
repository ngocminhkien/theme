'use client';

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  role: 'customer' | 'author' | 'admin';
  status?: 'active' | 'inactive' | 'banned';
}

interface AuthSession {
  user: AuthUser;
  token: string;
}

export const AUTH_TOKEN_KEY = 'themestore-auth-token';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

export function getAuthToken(): string | null {
  try { return storage()?.getItem(AUTH_TOKEN_KEY) || null; } catch { return null; }
}

export function setAuthToken(token: string) {
  try { storage()?.setItem(AUTH_TOKEN_KEY, token); } catch { /* Browser storage may be blocked. */ }
}

export function clearAuthToken() {
  try { storage()?.removeItem(AUTH_TOKEN_KEY); } catch { /* Browser storage may be blocked. */ }
}

async function api<T>(path: string, init?: RequestInit, requireAuth = false): Promise<T> {
  const token = getAuthToken();
  if (requireAuth && !token) throw new Error('Vui lòng đăng nhập để tiếp tục.');
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch('/api/v1' + path, { ...init, headers, cache: 'no-store' });
  } catch {
    throw new Error('Không kết nối được máy chủ. Vui lòng thử lại.');
  }
  const json = await response.json().catch(() => null);
  if (!response.ok || json?.success !== true) {
    throw new Error(typeof json?.message === 'string' ? json.message : 'Máy chủ chưa xử lý được yêu cầu.');
  }
  return json.data as T;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const session = await api<AuthSession>('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  try { storage()?.setItem(AUTH_TOKEN_KEY, session.token); } catch { throw new Error('Trình duyệt không thể lưu phiên đăng nhập.'); }
  return session;
}

export async function register(input: { full_name: string; email: string; password: string; phone?: string }): Promise<AuthSession> {
  const session = await api<AuthSession>('/auth/register', { method: 'POST', body: JSON.stringify(input) });
  try { storage()?.setItem(AUTH_TOKEN_KEY, session.token); } catch { throw new Error('Trình duyệt không thể lưu phiên đăng nhập.'); }
  return session;
}

export async function getCurrentUser(): Promise<AuthUser> {
  return api<AuthUser>('/auth/me', undefined, true);
}

export async function updateProfile(input: { full_name?: string; phone?: string }): Promise<AuthUser> {
  return api<AuthUser>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(input),
  }, true);
}

export async function changePassword(input: { old_password: string; new_password: string }): Promise<{ changed: boolean }> {
  return api<{ changed: boolean }>('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(input),
  }, true);
}

export function logout() {
  clearAuthToken();
}

export async function authenticatedApi<T>(path: string, init?: RequestInit): Promise<T> {
  return api<T>(path, init, true);
}

