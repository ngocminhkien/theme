'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Gift,
  ArrowLeft,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-slate-200', width: '0%' };
    if (password.length < 6) return { label: 'Yếu', color: 'bg-rose-500', width: '33%' };
    if (password.length < 10) return { label: 'Trung bình', color: 'bg-amber-500', width: '66%' };
    return { label: 'Rất mạnh', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName || !email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách của Theme Store.');
      return;
    }

    setLoading(true);

    // Simulate registration delay for smooth UX
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Đăng ký tài khoản thành công! Tặng bạn mã giảm giá 20%: THEMESTORE20. Đang chuyển về trang đăng nhập...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 1200);
  };

  const handleSocialRegister = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`Đăng ký qua ${provider} thành công! Đang chuyển hướng...`);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] font-sans">
      {/* 1. Left Side: Brand Perks & Community Proof (Split Screen 50%) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white p-12 xl:p-16 flex-col justify-between overflow-hidden">
        {/* Glow Effects & Patterns */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-all duration-300">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-white group-hover:text-amber-400 transition">
                  THEME<span className="text-amber-400">STORE</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-white uppercase shadow-xs">
                  OFFICIAL
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-300">
                Thương mại điện tử Theme & Plugin WordPress bản quyền chính hãng
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Content: Membership Perks */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-black uppercase tracking-wider mb-6">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>QUÀ TẶNG THÀNH VIÊN MỚI 2.500.000₫</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] mb-6">
            Gia Nhập Cộng Đồng{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              15.000+ Developer & Doanh Nghiệp
            </span>
          </h2>

          <p className="text-slate-300 text-base xl:text-lg leading-relaxed mb-8">
            Đăng ký tài khoản miễn phí ngay hôm nay để nhận trọn bộ quà tặng đặc quyền và tận hưởng dịch vụ kích hoạt bản quyền tự động 24/7.
          </p>

          {/* 4 Membership Perks */}
          <div className="space-y-4 text-sm xl:text-base text-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block">Tặng voucher giảm 20% đơn đầu tiên:</strong>
                <span className="text-slate-300">Nhập mã ưu đãi <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-amber-300">THEMESTORE20</code> áp dụng cho mọi theme và plugin.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block">Tặng trọn bộ 3 Plugin Pro bản quyền:</strong>
                <span className="text-slate-300">Elementor Pro, Rank Math Pro SEO và WP Rocket tăng tốc trị giá 2.500.000₫.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block">Quản lý & tra cứu License Key trọn đời:</strong>
                <span className="text-slate-300">Lưu trữ source ZIP an toàn, tải cập nhật phiên bản mới 1-Click bất kỳ lúc nào.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block">Hỗ trợ kỹ thuật 1-on-1 ưu tiên:</strong>
                <span className="text-slate-300">Kỹ thuật viên WordPress cài đặt demo qua UltraViewer & hỗ trợ Zalo 24/7.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-brand-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                B
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                C
              </div>
              <div className="w-9 h-9 rounded-full bg-rose-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                D
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white">15.200+ Nhà phát triển</div>
              <div className="text-xs text-slate-400">Đã đăng ký và tin dùng</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-amber-400 font-black text-base">★★★★★ 4.9/5</div>
            <div className="text-xs text-slate-400">Đánh giá uy tín</div>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Register Form (Split Screen 50%) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 xl:p-18 relative">
        {/* Top Controls: Back link */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 transition bg-slate-100 hover:bg-brand-50 px-4 py-2.5 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>

          <Link
            href="/login"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>

        {/* Main Register Box */}
        <div className="max-w-md w-full mx-auto my-auto py-2">
          <div className="text-center sm:text-left mb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tạo Tài Khoản Mới
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-medium">
              Đăng ký tài khoản Theme Store chỉ trong 30 giây để nhận ưu đãi.
            </p>
          </div>

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleSocialRegister('Google')}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition shadow-2xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              onClick={() => handleSocialRegister('GitHub')}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition shadow-2xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Hoặc đăng ký bằng Email
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Họ và Tên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Địa Chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Số Điện Thoại / Zalo (Tùy chọn)
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0988xxxxxx (Để nhận License qua Zalo)"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Mật Khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium"
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

              {/* Password strength meter */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Xác Nhận Mật Khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium"
                />
              </div>
            </div>

            {/* Agree Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-brand-600 border-slate-300 focus:ring-brand-500 mt-0.5 cursor-pointer"
                />
                <span className="leading-relaxed">
                  Tôi đồng ý với <Link href="/themes" className="text-brand-600 font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link href="/themes" className="text-brand-600 font-bold hover:underline">Chính sách bảo mật</Link> của Theme Store.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider transition shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang khởi tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Tạo Tài Khoản Ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-6 text-center text-sm text-slate-600 font-medium">
            <span>Đã có tài khoản Theme Store? </span>
            <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-5 border-t border-slate-200/80 flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
            <span>Bảo mật dữ liệu chuẩn SSL 256-bit</span>
          </div>
          <span>•</span>
          <span>Theme Store © 2026</span>
        </div>
      </div>
    </div>
  );
}
