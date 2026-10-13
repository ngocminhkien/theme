'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, LogOut, ArrowLeft, Loader2, Store } from 'lucide-react';
import { getAuthToken, getCurrentUser, clearAuthToken, AuthUser } from '@/features/auth/auth-client';

interface AdminContextType {
  user: AuthUser | null;
  refreshUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  refreshUser: async () => {},
});

export function useAdminContext() {
  return useContext(AdminContext);
}

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'loading' | 'unauthenticated' | 'forbidden' | 'authorized'>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const verifyAuth = async () => {
    const token = getAuthToken();
    if (!token) {
      setStatus('unauthenticated');
      const redirectTarget = pathname || '/admin';
      router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser.role === 'admin') {
        setStatus('authorized');
      } else {
        setStatus('forbidden');
      }
    } catch {
      clearAuthToken();
      setStatus('unauthenticated');
      router.replace('/login?redirect=/admin');
    }
  };

  useEffect(() => {
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white" role="status">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-1">Theme Portal Admin</h2>
        <p className="text-sm text-slate-400">Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white" role="alert">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-1">Yêu cầu đăng nhập</h2>
        <p className="text-sm text-slate-400">Đang chuyển hướng tới trang đăng nhập...</p>
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden" role="alert">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-500/20">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            403 Forbidden
          </span>

          <h1 className="text-2xl font-black tracking-tight mb-2">
            Truy Cập Bị Từ Chối
          </h1>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Khu vực này yêu cầu đặc quyền <strong>Quản trị viên (Admin)</strong>.
            {user && (
              <span className="block mt-2 text-xs text-slate-400">
                Tài khoản hiện tại: <strong className="text-white">{user.email}</strong> (Vai trò: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">{user.role}</code>)
              </span>
            )}
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/my-account"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Cổng Khách Hàng</span>
            </Link>

            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <Store className="w-4 h-4" />
              <span>Về Trang Chủ Cửa Hàng</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                clearAuthToken();
                router.replace('/login?redirect=/admin');
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 font-bold text-xs transition flex items-center justify-center gap-2 border border-rose-800/40 cursor-pointer mt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất & Đăng nhập tài khoản khác</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ user, refreshUser: verifyAuth }}>
      {children}
    </AdminContext.Provider>
  );
}
