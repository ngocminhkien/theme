'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { setAuthToken, getCurrentUser, AuthUser } from '@/features/auth/auth-client';
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, User } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [provider, setProvider] = useState<string>('OAuth');

  useEffect(() => {
    const token = searchParams.get('token');
    const prov = searchParams.get('provider') || 'OAuth';
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    setProvider(prov === 'google' ? 'Google' : prov === 'github' ? 'GitHub' : prov);

    if (error) {
      setStatus('error');
      setErrorMessage(
        message ||
          (error === 'GOOGLE_CONFIG_MISSING'
            ? 'Chưa cấu hình GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET trong backend/.env.'
            : error === 'GITHUB_CONFIG_MISSING'
            ? 'Chưa cấu hình GITHUB_CLIENT_ID và GITHUB_CLIENT_SECRET trong backend/.env.'
            : error === 'oauth_cancelled'
            ? 'Bạn đã hủy yêu cầu đăng nhập qua ' + prov + '.'
            : 'Đăng nhập OAuth thất bại. Vui lòng thử lại.')
      );
      return;
    }

    if (!token) {
      setStatus('error');
      setErrorMessage('Không nhận được mã xác thực (token) từ máy chủ.');
      return;
    }

    // Save token
    try {
      setAuthToken(token);
      // Optional cookie for server-side / edge proxy compatibility
      document.cookie = `themestore-auth-token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      setStatus('error');
      setErrorMessage('Trình duyệt không thể lưu phiên đăng nhập. Vui lòng cho phép lưu trữ cục bộ.');
      return;
    }

    // Verify session by fetching user profile
    getCurrentUser()
      .then((userData) => {
        setUser(userData);
        setStatus('success');
        setTimeout(() => {
          const redirectTarget = localStorage.getItem('themestore_oauth_redirect') || '/';
          localStorage.removeItem('themestore_oauth_redirect');
          window.location.href = redirectTarget;
        }, 1200);
      })
      .catch((err) => {
        // Even if getCurrentUser has a glitch, token is saved so proceed
        setStatus('success');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.12),0_1px_3px_rgba(0,0,0,0.05)] border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Status: Loading */}
        {status === 'loading' && (
          <div className="space-y-6">
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shadow-inner">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Đang xử lý đăng nhập</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Đang xác thực thông tin tài khoản qua <span className="font-semibold text-slate-800">{provider}</span>. Vui lòng đợi trong giây lát...
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full w-2/3 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Status: Success */}
        {status === 'success' && (
          <div className="space-y-6">
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-in zoom-in duration-300" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-3 border border-emerald-200/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Đăng nhập {provider} thành công
              </span>
              <h1 className="text-xl font-bold text-slate-900 mb-1">
                {user?.full_name ? `Xin chào, ${user.full_name}!` : 'Chào mừng bạn quay lại!'}
              </h1>
              <p className="text-sm text-slate-500">
                Phiên đăng nhập đã được thiết lập. Đang chuyển hướng bạn đến bảng điều khiển...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Đang tải dữ liệu tài khoản...</span>
            </div>
          </div>
        )}

        {/* Status: Error */}
        {status === 'error' && (
          <div className="space-y-6">
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-10 h-10 text-rose-600" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100/70 text-rose-800 mb-3 border border-rose-200/50">
                Xác thực không thành công
              </span>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Đăng nhập thất bại</h1>
              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-700 leading-relaxed text-left">
                {errorMessage}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/login"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Thử đăng nhập lại</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
