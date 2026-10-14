'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/features/auth/auth-client';
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Loader2,
  Check,
  Flame,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/my-account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const session = await login(email, password);
      setSuccessMsg(`Đăng nhập thành công! Xin chào ${session.user.full_name || session.user.email}. Đang chuyển hướng...`);
      setTimeout(() => {
        const dest = (session.user.role === 'admin' && (!searchParams.get('redirect') || redirectTarget === '/my-account'))
          ? '/admin'
          : redirectTarget;
        router.push(dest);
      }, 800);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };


  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`Đăng nhập qua ${provider} thành công! Đang chuyển hướng...`);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] font-sans">
      {/* 1. Left Side: Brand Showcase & Value Proposition (Split Screen 50%) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 text-white p-12 xl:p-16 flex-col justify-between overflow-hidden">
        {/* Glow Effects & Patterns */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-all duration-300">
              <Layers className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl sm:text-3xl tracking-tight text-white group-hover:text-amber-400 transition">
                  THEME<span className="text-amber-400">STORE</span>
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-black bg-rose-500 text-white uppercase shadow-xs">
                  CHÍNH HÃNG
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-300 mt-0.5">
                Thế giới Theme & Plugin WordPress bản quyền giá rẻ
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Content: Hero Messaging & Highlights */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ĐẶC QUYỀN THÀNH VIÊN VIP</span>
          </div>

          <h2 className="text-3xl xl:text-5xl font-black tracking-tight leading-[1.15] mb-6">
            Quản Lý Bản Quyền Theme & Plugin{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              Chính Hãng Tự Động
            </span>
          </h2>

          <p className="text-slate-300 text-base xl:text-lg leading-relaxed mb-8">
            Đăng nhập để tra cứu License Key bản quyền, tải source code sạch 100% không mã độc và kích hoạt tự động qua VietQR sau 30 giây.
          </p>

          {/* 3 Core Value Bullet Points */}
          <div className="space-y-4 text-sm xl:text-base text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <span>Kích hoạt tự động VietQR 24/7 không cần chờ duyệt</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <span>Tải bản cập nhật mới nhất trọn đời & bảo hành hoàn tiền 100%</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <span>Hỗ trợ kỹ thuật cài đặt demo 1-Click qua UltraViewer / Zalo</span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Quote */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <p className="text-sm xl:text-base text-slate-300 italic mb-3.5">
            &ldquo;Theme Store giúp Agency của tôi tiết kiệm hơn 85% chi phí mua theme bản quyền. Kích hoạt siêu nhanh và support cực kỳ nhiệt tình!&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white font-black text-sm">
              HN
            </div>
            <div>
              <div className="text-sm font-bold text-white">Anh Hoàng Nam</div>
              <div className="text-xs text-slate-400">CEO NamTech Agency (Đã mua 45+ theme)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Auth Form (Split Screen 50%) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 xl:p-20 relative">
        {/* Top Controls: Back link */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition bg-slate-100 hover:bg-brand-50 px-3.5 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>

          <Link
            href="/register"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>

        {/* Main Login Box */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          <div className="text-center sm:text-left mb-8">
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight">
              Đăng Nhập Tài Khoản
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">
              Chào mừng bạn quay trở lại với <strong>Theme Store</strong>! Vui lòng nhập thông tin để tiếp tục.
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold transition shadow-2xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={loading}
              className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold transition shadow-2xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hoặc đăng nhập bằng Email
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Quick Demo Credentials */}
          <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tài khoản thử nghiệm nhanh:</span>
              </span>
              <span className="text-[11px] font-normal text-indigo-600">Bấm để tự điền</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@woodmart.vn');
                  setPassword('Admin@123456');
                  setErrorMsg('');
                }}
                className="flex flex-col text-left p-2.5 rounded-xl bg-white border border-indigo-200/80 hover:border-indigo-500 hover:shadow-xs transition text-xs cursor-pointer group"
              >
                <span className="font-bold text-indigo-700 flex items-center gap-1 group-hover:text-indigo-800">
                  👑 Quản trị (Admin)
                </span>
                <span className="text-[11px] text-slate-700 font-mono truncate">admin@woodmart.vn</span>
                <span className="text-[10px] text-slate-400">Pass: Admin@123456</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('customer@thememarket.local');
                  setPassword('Customer@2026');
                  setErrorMsg('');
                }}
                className="flex flex-col text-left p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs transition text-xs cursor-pointer group"
              >
                <span className="font-bold text-slate-800 flex items-center gap-1 group-hover:text-brand-600">
                  👤 Khách Hàng
                </span>
                <span className="text-[11px] text-slate-700 font-mono truncate">customer@themem...</span>
                <span className="text-[10px] text-slate-400">Pass: Customer@2026</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4.5">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                Địa Chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Mật Khẩu
                </label>
                <Link
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Vui lòng liên hệ Hotline/Zalo 0988.666.888 để được cấp lại mật khẩu ngay lập tức.');
                  }}
                  className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3.5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider transition shadow-glow flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập Vào Hệ Thống</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-8 text-center text-sm text-slate-500 font-medium">
            <span>Chưa có tài khoản Theme Store? </span>
            <Link href="/register" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
              Đăng ký tài khoản miễn phí
            </Link>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
            <span>Mã hóa SSL 256-bit an toàn</span>
          </div>
          <span>•</span>
          <span>Theme Store © 2026</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

