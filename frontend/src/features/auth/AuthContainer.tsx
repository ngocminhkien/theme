'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, register } from '@/features/auth/auth-client';
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react';

interface AuthContainerProps {
  initialMode: 'login' | 'register';
}

export function AuthContainer({ initialMode }: AuthContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  // Single source of truth for mode (checks URL on mount if available)
  const [isRegister, setIsRegister] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.includes('register');
    }
    return initialMode === 'register';
  });

  // Sync mode on browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const isReg = window.location.pathname.includes('register');
      setIsRegister(isReg);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser address bar WITHOUT triggering Next.js router unmount/remount
  const updateAddressBar = (path: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stateObj = { __NA: true, mode: path.includes('register') ? 'register' : 'login' };
      if (typeof History !== 'undefined' && History.prototype && History.prototype.pushState) {
        History.prototype.pushState.call(window.history, stateObj, '', path);
      } else {
        window.history.pushState(stateObj, '', path);
      }
    } catch {
      // safe fallback
    }
  };

  // 1-Click Smooth Transition Handlers (Immediate React state update + non-destructive URL sync)
  const switchToRegister = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsRegister(true);
    setErrorMsg('');
    setSuccessMsg('');
    updateAddressBar('/register');
  };

  const switchToLogin = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsRegister(false);
    setErrorMsg('');
    setSuccessMsg('');
    updateAddressBar('/login');
  };

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Shared States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!regPassword) return { label: '', color: 'bg-slate-200', width: '0%' };
    if (regPassword.length < 6) return { label: 'Yếu', color: 'bg-rose-500', width: '33%' };
    if (regPassword.length < 10) return { label: 'Trung bình', color: 'bg-amber-500', width: '66%' };
    return { label: 'Rất mạnh', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const session = await login(loginEmail, loginPassword);
      setSuccessMsg(
        `Đăng nhập thành công! Xin chào ${session.user.full_name || session.user.email}. Đang chuyển hướng...`
      );
      setTimeout(() => {
        router.push(redirectTarget);
      }, 900);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Đăng nhập không thành công. Vui lòng kiểm tra lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regFullName || !regEmail || !regPassword) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách của Theme Store.');
      return;
    }

    setLoading(true);

    try {
      const session = await register({
        full_name: regFullName,
        email: regEmail,
        password: regPassword,
        phone: regPhone.trim() ? regPhone.trim() : undefined,
      });
      setSuccessMsg(
        `Đăng ký tài khoản thành công! Xin chào ${session.user.full_name || session.user.email}. Đang chuyển hướng...`
      );
      setTimeout(() => {
        router.push('/my-account');
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Đăng ký tài khoản không thành công. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Listen for OAuth redirect errors from backend
  useEffect(() => {
    const error = searchParams.get('error');
    const prov = searchParams.get('provider');
    const msg = searchParams.get('message');
    if (error) {
      if (error === 'GOOGLE_CONFIG_MISSING' || error === 'GITHUB_CONFIG_MISSING') {
        setErrorMsg(
          msg ||
            `Chưa cấu hình Client ID và Secret cho ${prov || 'OAuth'} trong backend/.env. Vui lòng thiết lập để đăng nhập thật.`
        );
      } else if (error === 'oauth_cancelled') {
        setErrorMsg(`Bạn đã hủy yêu cầu đăng nhập bằng ${prov || 'mạng xã hội'}.`);
      } else {
        setErrorMsg(msg || `Đăng nhập qua ${prov || 'OAuth'} thất bại. Vui lòng thử lại.`);
      }
    }
  }, [searchParams]);

  const handleSocialAuth = async (provider: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('themestore_oauth_redirect', redirectTarget || '/');
      }
    } catch {
      // ignore storage errors
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg(`Đang kiểm tra kết nối cổng đăng nhập ${provider}...`);

    const providerPath = provider.toLowerCase();

    // Kiểm tra kết nối Backend API trước để tránh bị Next.js 500 Internal Server Error nếu Backend chưa chạy
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const checkRes = await fetch('/api/v1/auth/providers', {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (!checkRes.ok) {
        throw new Error('Máy chủ Backend phản hồi lỗi HTTP ' + checkRes.status);
      }

      const provJson = await checkRes.json();
      const provInfo = provJson?.data?.[providerPath];

      // Nếu người dùng chưa cấu hình Client ID & Secret trong backend/.env
      if (provInfo && !provInfo.enabled) {
        setLoading(false);
        setSuccessMsg('');
        const envVarName = provider === 'Google' ? 'GOOGLE_CLIENT_ID' : 'GITHUB_CLIENT_ID';
        setErrorMsg(
          `⚠️ Bạn chưa cấu hình ${envVarName} trong file backend/.env. Vui lòng thêm Client ID & Secret từ Google/GitHub Developer Portal để kích hoạt đăng nhập thật!`
        );
        return;
      }

      setSuccessMsg(`Đang chuyển hướng tới trang xác thực ${provider}...`);
      window.location.href = `/api/v1/auth/${providerPath}`;
    } catch (err: any) {
      setLoading(false);
      setSuccessMsg('');
      const isConnectionIssue =
        err?.name === 'AbortError' ||
        err?.message?.includes('fetch') ||
        err?.message?.includes('Failed') ||
        err?.message?.includes('500');

      if (isConnectionIssue) {
        setErrorMsg(
          '⚠️ Máy chủ Backend (port 4000) hiện chưa được bật. Vui lòng mở terminal và chạy: cd backend && npm run dev'
        );
      } else {
        setErrorMsg(err?.message || `Không thể kết nối đến máy chủ xác thực ${provider}.`);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-6 sm:py-10 px-3 sm:px-6 bg-slate-50 font-sans relative overflow-x-hidden overflow-y-auto selection:bg-blue-500 selection:text-white">
      {/* Subtle Ambient Background Elements for Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* ========================================================================= */}
      {/* MAIN DOUBLE SLIDER CARD CONTAINER WITH DIAGONAL SPLIT                     */}
      {/* ========================================================================= */}
      <div
        className={`auth-slider-container relative w-full max-w-5xl min-h-[580px] lg:h-[640px] bg-white rounded-3xl sm:rounded-[32px] shadow-[0_25px_70px_-15px_rgba(15,23,42,0.18),0_12px_32px_-8px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.06)] border border-slate-200/90 my-auto ${
          isRegister ? 'right-panel-active' : ''
        }`}
      >
        {/* Mobile Header Tabs (Dành cho màn hình nhỏ < 1024px) */}
        <div className="lg:hidden p-3 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-all bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs hover:shadow-sm shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-500" />
            <span>Trang Chủ</span>
          </Link>

          <div className="relative p-1 bg-slate-200/80 rounded-2xl flex items-center w-full max-w-xs shadow-inner">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-xs transition-all duration-300 ease-out pointer-events-none ${
                isRegister ? 'left-[calc(50%+2px)]' : 'left-1'
              }`}
            />
            <button
              type="button"
              onClick={switchToLogin}
              className={`relative z-10 flex-1 py-1.5 text-xs font-black rounded-xl transition cursor-pointer text-center ${
                !isRegister ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={switchToRegister}
              className={`relative z-10 flex-1 py-1.5 text-xs font-black rounded-xl transition cursor-pointer text-center ${
                isRegister ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. SIGN IN FORM (NẰM Ở NỬA TRÁI 0% - 50%)                                  */}
        {/* ========================================================================= */}
        <div
          className={`auth-form-container auth-sign-in-container w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-8 xl:p-9 bg-white ${
            !isRegister ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Top Bar inside Form: "Về Trang Chủ" (bên trái) + Brand (bên phải) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            {/* Nút quay về trang chủ (bên trái) */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-all bg-white hover:bg-blue-50/70 border border-slate-200/90 shadow-2xs hover:shadow-xs px-3 py-1.5 rounded-xl group active:scale-95"
              title="Quay về trang chủ Theme Store"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-blue-500" />
              <span>Về Trang Chủ</span>
            </Link>

            {/* Brand Logo (bên phải) */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex items-center">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  THEME<span className="text-amber-500">STORE</span>
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white uppercase shadow-2xs">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Form Content - Đẩy xuống dưới vừa phải (my-auto) để bố cục cân đối hoàn hảo */}
          <div className="my-auto py-2 sm:py-4 w-full">
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Đăng Nhập Tài Khoản
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                Quản lý License Key bản quyền và tải source code sạch 100%.
              </p>
            </div>

            {/* Form Fields FIRST */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in shadow-2xs">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Địa Chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-2xs focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Mật Khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        'Vui lòng liên hệ Hotline/Zalo 0988.666.888 để được cấp lại mật khẩu ngay lập tức.'
                      )
                    }
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-9 pr-9 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-2xs focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4),0_6px_12px_-3px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.5),0_8px_16px_-3px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý đăng nhập...</span>
                  </>
                ) : (
                  <span>Đăng Nhập Vào Hệ Thống</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2.5 my-3.5">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                hoặc tiếp tục với
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Social Logins - CHUYỂN XUỐNG DƯỚI */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                onClick={() => handleSocialAuth('GitHub')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SIGN UP FORM (NẰM Ở NỬA PHẢI 50% - 100%)                                */}
        {/* ========================================================================= */}
        <div
          className={`auth-form-container auth-sign-up-container w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-7 xl:p-8 bg-white ${
            isRegister ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Top Bar inside Form: "Về Trang Chủ" (bên trái) + Brand (bên phải) */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            {/* Nút quay về trang chủ (bên trái) */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-all bg-white hover:bg-blue-50/70 border border-slate-200/90 shadow-2xs hover:shadow-xs px-3 py-1.5 rounded-xl group active:scale-95"
              title="Quay về trang chủ Theme Store"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-blue-500" />
              <span>Về Trang Chủ</span>
            </Link>

            {/* Brand Logo (bên phải) */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex items-center">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  THEME<span className="text-amber-500">STORE</span>
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white uppercase shadow-2xs">
                  PRO
                </span>
              </div>
            </div>
          </div>

          <div className="my-auto py-1 w-full">
            <div className="mb-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Tạo Tài Khoản Mới
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                Đăng ký nhanh chóng để kích hoạt License và tải source code sạch 100%.
              </p>
            </div>

            {/* Form Fields FIRST */}
            <form onSubmit={handleRegisterSubmit} className="space-y-2">
              {errorMsg && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in shadow-2xs">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  Họ và Tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-2xs focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  Địa Chỉ Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-2xs focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  Số Điện Thoại / Zalo (Tùy chọn)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0988xxxxxx (Nhận License qua Zalo)"
                    className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-2xs focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition font-medium"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                    Mật Khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-2xs focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                    Xác Nhận <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Nhập lại"
                      className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-2xs focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength */}
              {regPassword && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-600">{strength.label}</span>
                </div>
              )}

              {/* Terms checkbox */}
              <div>
                <label className="flex items-start gap-1.5 cursor-pointer text-[10px] text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
                  />
                  <span>
                    Tôi đồng ý với{' '}
                    <Link href="/themes" className="text-blue-600 font-bold hover:underline">
                      Điều khoản
                    </Link>{' '}
                    &amp;{' '}
                    <Link href="/themes" className="text-blue-600 font-bold hover:underline">
                      Chính sách
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4),0_6px_12px_-3px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.5),0_8px_16px_-3px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang khởi tạo tài khoản...</span>
                  </>
                ) : (
                  <span>Tạo Tài Khoản Ngay</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                hoặc đăng ký nhanh bằng
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Social Register - CHUYỂN XUỐNG DƯỚI */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                onClick={() => handleSocialAuth('GitHub')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SLIDING OVERLAY CONTAINER WITH DIAGONAL SPLIT                          */}
        {/* ========================================================================= */}
        <div className="hidden lg:block auth-overlay-container">
          <div className="auth-overlay relative overflow-hidden bg-slate-950 text-white">
            {/* Visual Art Background Image with Sapphire Ambient Blurs */}
            <img
              src="/images/auth-banner.jpg"
              alt="Theme Store WordPress Ecosystem"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-[#0C152B]/85 to-slate-950/90 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-500/25 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

            {/* OVERLAY PANEL LEFT (HIỂN THỊ KHI Ở CHẾ ĐỘ ĐĂNG KÝ - BẤM ĐỂ TRƯỢT SANG ĐĂNG NHẬP) */}
            <div className="auth-overlay-panel auth-overlay-left p-8 xl:p-12 relative z-20 flex flex-col justify-between text-center">
              <div className="mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>THÀNH VIÊN THEME STORE</span>
                </div>
              </div>

              <div className="my-auto py-3">
                <h2 className="text-2xl xl:text-3xl font-black tracking-tight leading-tight mb-3 drop-shadow-md">
                  Đã Có Tài Khoản?
                </h2>
                <p className="text-slate-200 text-xs xl:text-sm leading-relaxed max-w-sm mx-auto mb-6 font-medium drop-shadow-sm">
                  Đăng nhập ngay để tiếp tục quản lý License Key bản quyền, tải source code và nhận hỗ trợ kỹ thuật 24/7.
                </p>

                {/* Switch to Login Button (1-Click) */}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="px-8 py-3.5 rounded-2xl border-2 border-white/90 bg-white/15 hover:bg-white text-white hover:text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer backdrop-blur-md flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Đăng Nhập Ngay</span>
                </button>
              </div>
            </div>

            {/* OVERLAY PANEL RIGHT (HIỂN THỊ KHI Ở CHẾ ĐỘ ĐĂNG NHẬP - BẤM ĐỂ TRƯỢT SANG ĐĂNG KÝ) */}
            <div className="auth-overlay-panel auth-overlay-right p-8 xl:p-12 relative z-20 flex flex-col justify-between text-center">
              <div className="mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>THEME STORE VIỆT NAM</span>
                </div>
              </div>

              <div className="my-auto py-3">
                <h2 className="text-2xl xl:text-3xl font-black tracking-tight leading-tight mb-3 drop-shadow-md">
                  Chưa Có Tài Khoản?
                </h2>
                <p className="text-slate-200 text-xs xl:text-sm leading-relaxed max-w-sm mx-auto mb-6 font-medium drop-shadow-sm">
                  Đăng ký ngay để tham gia cộng đồng 15.000+ Developer, sở hữu kho giao diện bản quyền và nhận hỗ trợ 24/7.
                </p>

                {/* Switch to Register Button (1-Click) */}
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="px-8 py-3.5 rounded-2xl border-2 border-amber-400/90 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_12px_32px_rgba(251,191,36,0.3)] hover:shadow-[0_16px_40px_rgba(251,191,36,0.5)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer backdrop-blur-md flex items-center justify-center gap-2 mx-auto"
                >
                  <span>Đăng Ký Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

