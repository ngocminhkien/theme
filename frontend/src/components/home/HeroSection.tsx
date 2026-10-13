'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Search,
  Layers,
  CheckCircle2,
  Star,
  PhoneCall,
} from 'lucide-react';
import { Interactive3DBackground } from './Interactive3DBackground';

export function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [mousePos, setMousePos] = useState({ x: 500, y: 300 });

  // 3D tilt states for the two highlight banners
  const [b1Tilt, setB1Tilt] = useState({ x: 0, y: 0, active: false });
  const [b2Tilt, setB2Tilt] = useState({ x: 0, y: 0, active: false });

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/themes';
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedCat !== 'all') params.append('category', selectedCat);
    if (params.toString()) url += `?${params.toString()}`;
    router.push(url);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleB1Move = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setB1Tilt({ x: x * 6, y: -y * 6, active: true });
  };
  const handleB1Leave = () => setB1Tilt({ x: 0, y: 0, active: false });

  const handleB2Move = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setB2Tilt({ x: x * 6, y: -y * 6, active: true });
  };
  const handleB2Leave = () => setB2Tilt({ x: 0, y: 0, active: false });

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 overflow-hidden w-full"
    >
      {/* 1. Interactive 3D Canvas Background with Floating Geometry & Constellations */}
      <Interactive3DBackground />

      {/* 2. Interactive Cursor Radial Spotlight */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-500/12 via-indigo-500/8 to-amber-500/6 blur-3xl transition-transform duration-150 ease-out -translate-x-1/2 -translate-y-1/2 -z-5"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Main Hero Container */}
        <div className="text-center max-w-5xl mx-auto pt-2 sm:pt-4 pb-6 sm:pb-10">
          {/* Badge: Slogan & Trust Signal (Removed #1 VN) */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xs max-w-full animate-float-slow">
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span className="truncate sm:whitespace-normal uppercase">
              THẾ GIỚI THEME & PLUGIN WORDPRESS BẢN QUYỀN CHÍNH HÃNG
            </span>
          </div>

          {/* Main Headline with Animated Shimmer Gradient */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] sm:leading-[1.12] mb-4 sm:mb-6">
            Kho Giao Diện Website & Plugin WordPress{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent animate-shimmer-text">
              Bản Quyền Giá Rẻ Chuẩn SEO
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl 2xl:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal">
            Hơn <strong>500+ Theme WordPress, WooCommerce & Landing Page</strong> chuẩn SEO, tối ưu Google PageSpeed 99+, sạch 100% không mã độc, cập nhật trọn đời và kích hoạt bản quyền tự động 24/7 sau 30 giây qua VietQR.
          </p>

          {/* Centered Large Search Bar (Fluid max-w-3xl) */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-3xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full border-2 border-slate-200 shadow-2xl flex flex-col sm:flex-row items-center gap-2 mb-5 sm:mb-6 focus-within:ring-4 focus-within:ring-brand-500/15 focus-within:border-brand-500 transition-all duration-300"
          >
            {/* Quick Category Selector */}
            <div className="w-full sm:w-auto sm:border-r border-slate-200 border-b sm:border-b-0 pb-2 sm:pb-0 sm:pr-4 px-3 sm:pl-4 py-1.5">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                aria-label="Chọn nhóm ngành giao diện"
                className="w-full sm:w-auto bg-transparent text-xs sm:text-sm font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Mọi ngành nghề</option>
                <option value="e-commerce">Bán Hàng & Shop</option>
                <option value="corporate-b2b">Doanh Nghiệp & B2B</option>
                <option value="tech-education">Công Nghệ & SaaS</option>
                <option value="real-estate">Bất Động Sản</option>
                <option value="news-blog">Tin Tức & Blog</option>
              </select>
            </div>

            {/* Input */}
            <div className="flex-1 w-full flex items-center px-3 py-1.5 min-w-0">
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theme theo từ khóa, ngành nghề, builder (WoodMart, Flatsome, Bán hàng...)"
                className="w-full bg-transparent text-xs sm:text-base text-slate-800 placeholder:text-slate-400 outline-none font-semibold min-w-0"
              />
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-amber-500 hover:from-brand-500 hover:to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl sm:rounded-full shadow-glow flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <span>Tìm Kiếm</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </form>

          {/* Quick Filter Tags / Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-sm font-semibold text-slate-500 mb-7 sm:mb-10 max-w-4xl mx-auto">
            <span className="text-slate-400 font-bold text-xs sm:text-sm shrink-0 mr-1">
              Từ khóa hot:
            </span>
            {[
              { label: 'Theme Bán Hàng', query: 'e-commerce' },
              { label: 'Flatsome Shop', search: 'Flatsome' },
              { label: 'WoodMart Siêu Tốc', search: 'WoodMart' },
              { label: 'Doanh Nghiệp B2B', query: 'corporate-b2b' },
              { label: 'Elementor Pro', builder: 'elementor' },
              { label: 'Bất Động Sản', query: 'real-estate' },
            ].map((chip, idx) => (
              <Link
                key={idx}
                href={
                  chip.search
                    ? `/themes?search=${encodeURIComponent(chip.search)}`
                    : chip.query
                    ? `/themes?category=${chip.query}`
                    : `/themes?builder=${chip.builder}`
                }
                className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4.5 sm:py-2 rounded-full bg-white hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300 border border-slate-200/90 text-slate-700 shadow-2xs hover:shadow-sm text-xs sm:text-sm font-bold transition-all duration-200 leading-normal whitespace-nowrap"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/themes"
              className="w-full xs:w-auto justify-center px-6 sm:px-9 py-3.5 sm:py-4.5 rounded-2xl bg-slate-900 hover:bg-brand-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2.5"
            >
              <span>Khám Phá 500+ Themes</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>

            <Link
              href="/themes?deals=weekly"
              className="w-full xs:w-auto justify-center px-6 sm:px-9 py-3.5 sm:py-4.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950" />
              <span>Gói VIP All-Access</span>
            </Link>

            <a
              href="https://zalo.me/0988666888"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full xs:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm uppercase tracking-wider border border-slate-200 shadow-sm transition-all duration-200 flex items-center gap-2.5"
            >
              <PhoneCall className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600" />
              <span>Tư Vấn Zalo 24/7</span>
            </a>
          </div>
        </div>

        {/* Feature Cards Grid (Two Highlight Banners Side by Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mt-2 sm:mt-4">
          {/* Banner 1: Multipurpose & High Performance */}
          <div
            data-reveal="fade-left"
            onMouseMove={handleB1Move}
            onMouseLeave={handleB1Leave}
            style={{
              transform: b1Tilt.active
                ? `perspective(1000px) rotateX(${b1Tilt.y}deg) rotateY(${b1Tilt.x}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
              transition: b1Tilt.active ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d',
            }}
            className="group rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-10 xl:p-12 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30 flex flex-col justify-between will-change-transform"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-brand-500/30 border border-brand-400/40 text-brand-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-4">
                <Zap className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Theme Bán Hàng Siêu Tốc Độ</span>
              </div>

              <h3 className="text-xl sm:text-3xl xl:text-4xl font-black tracking-tight mb-3">
                WooCommerce Chuẩn Core Web Vitals
              </h3>

              <p className="text-slate-300 text-sm sm:text-base xl:text-lg leading-relaxed mb-5 sm:mb-6 max-w-xl">
                Tối ưu Core Web Vitals xanh tuyệt đối, tải trang dưới 0.8 giây, tích hợp sẵn bộ lọc Ajax, cổng thanh toán VietQR quét mã tự động và tương thích Elementor Pro.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-300 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400 shrink-0" />
                  <span>PageSpeed 99/100 Xanh</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400 shrink-0" />
                  <span>Kích hoạt tự động VietQR</span>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <Link
                href="/themes?category=e-commerce"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider transition shadow-md sm:hover:scale-105"
              >
                <span>Xem Theme Bán Hàng Ngay</span>
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </Link>
            </div>
          </div>

          {/* Banner 2: VIP All-Access Pass */}
          <div
            data-reveal="fade-right"
            onMouseMove={handleB2Move}
            onMouseLeave={handleB2Leave}
            style={{
              transform: b2Tilt.active
                ? `perspective(1000px) rotateX(${b2Tilt.y}deg) rotateY(${b2Tilt.x}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
              transition: b2Tilt.active ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d',
            }}
            className="group rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-6 sm:p-10 xl:p-12 text-white relative overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col justify-between will-change-transform"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Gói Thành Viên VIP / All-Access Pass</span>
              </div>

              <h3 className="text-xl sm:text-3xl xl:text-4xl font-black tracking-tight mb-3">
                Tải Không Giới Hạn 500+ Theme & Plugin
              </h3>

              <p className="text-slate-300 text-sm sm:text-base xl:text-lg leading-relaxed mb-5 sm:mb-6 max-w-xl">
                Giải pháp trọn gói siêu tiết kiệm cho Agency & Freelancer. Tự do tải toàn bộ theme bản quyền, nhận update tự động trọn đời và hỗ trợ kỹ thuật cài đặt ưu tiên 24/7.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-300 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0" />
                  <span>500+ Theme & Plugin Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0" />
                  <span>Tiết kiệm 85% ngân sách</span>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <Link
                href="/themes?deals=weekly"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider transition shadow-glow sm:hover:scale-105"
              >
                <span>Đăng Ký Gói VIP Pass</span>
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Stats Bar */}
        <div
          data-reveal="zoom-in"
          className="mt-6 sm:mt-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-5 sm:p-8 rounded-3xl wm-glass-panel"
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-3xl xl:text-4xl font-black text-slate-900 truncate">500+ Themes</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">Bản quyền 100% sạch</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-3xl xl:text-4xl font-black text-slate-900 truncate">15.000+</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">Khách hàng tin cậy</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-3xl xl:text-4xl font-black text-slate-900 truncate">99/100</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">PageSpeed xanh mướt</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-3xl xl:text-4xl font-black text-slate-900 truncate">4.9 / 5.0</div>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold">Đánh giá 5 sao uy tín</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
