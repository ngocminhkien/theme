'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Search, Flame, Layers, CheckCircle2, Star, TrendingUp } from 'lucide-react';
import { THEMES_DATA } from '@/shared/data/themes-data';

export function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = '/themes';
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedCat !== 'all') params.append('category', selectedCat);
    if (params.toString()) url += `?${params.toString()}`;
    router.push(url);
  };

  return (
    <section className="relative pt-6 pb-12 px-4 overflow-hidden">
      {/* Background Decorative Grid & Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-brand-500/20 via-accent-cyan/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Hero Container */}
        <div className="text-center max-w-4xl mx-auto pt-6 pb-10">
          {/* Badge: New Version Notification */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-700 text-xs font-bold mb-6 hover:bg-brand-500/15 transition shadow-xs cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Catalog Theme Bản Quyền • {THEMES_DATA.length} mẫu đang phát hành</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-6">
            Kho Giao Diện Website & Template{' '}
            <span className="text-gradient-brand">Bản Quyền Chuẩn SEO</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Nền tảng phân phối Theme WordPress, WooCommerce & Landing Page tốc độ siêu nhanh, tương thích Elementor & Gutenberg, kích hoạt bản quyền tự động 24/7.
          </p>

          {/* Centered Large Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto bg-white/95 backdrop-blur-xl p-2 rounded-2xl sm:rounded-full border border-slate-200/90 shadow-2xl flex flex-col sm:flex-row items-center gap-2 mb-6 focus-within:ring-4 focus-within:ring-brand-500/15 focus-within:border-brand-500 transition-all duration-300"
          >
            {/* Quick Category Selector */}
            <div className="w-full sm:w-auto sm:border-r border-slate-200 sm:pr-3 pl-3 py-1">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full sm:w-auto bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Mọi ngành nghề</option>
                <option value="e-commerce">Bán Hàng & Shop</option>
                <option value="corporate-b2b">Doanh Nghiệp</option>
                <option value="portfolio-agency">Portfolio & Sáng Tạo</option>
              </select>
            </div>

            {/* Input */}
            <div className="flex-1 w-full flex items-center px-3 py-1">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm giao diện theo từ khóa, ngành nghề, builder..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none font-medium"
              />
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl sm:rounded-full shadow-glow flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span>Tìm Kiếm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Tags / Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-8">
            <span className="text-slate-400">Từ khóa phổ biến:</span>
            {[
              { label: 'Theme Bán Hàng', query: 'e-commerce' },
              { label: 'Doanh Nghiệp', query: 'corporate-b2b' },
              { label: 'Elementor Pro', builder: 'elementor' },
              { label: 'Tối Ưu Tốc Độ', sort: 'featured' },
              { label: 'Portfolio & Sáng Tạo', query: 'portfolio-agency' },
            ].map((chip, idx) => (
              <Link
                key={idx}
                href={
                  chip.query
                    ? `/themes?category=${chip.query}`
                    : chip.builder
                    ? `/themes?builder=${chip.builder}`
                    : `/themes?sort=${chip.sort}`
                }
                className="px-3 py-1 rounded-full bg-white/80 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 border border-slate-200 transition shadow-2xs"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/themes"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Khám Phá {THEMES_DATA.length} Theme</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/themes?sort=featured"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Xem Theme Nổi Bật</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid (Two Highlight Banners Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Banner 1: Multipurpose & High Performance */}
          <div className="group rounded-3xl bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/40 text-brand-300 text-xs font-black uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5 text-brand-400" />
                <span>Multipurpose & High Performance</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                Theme Đa Năng / Siêu Tốc Độ
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                Tối ưu Core Web Vitals xanh tuyệt đối, tải trang dưới 0.8 giây, tương thích hoàn hảo Elementor Pro và cấp License chính hãng.
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 mb-8">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PageSpeed 99/100</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Bản quyền trọn đời</span>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <Link
                href="/themes?builder=elementor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider transition shadow-md hover:scale-105"
              >
                <span>Xem Theme Siêu Tốc Độ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Banner 2: Creative collection */}
          <div className="group rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-brand-950 p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan text-xs font-black uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Bộ Sưu Tập Sáng Tạo</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                Theme Cho Portfolio & Agency
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                Khám phá các theme trực quan cho portfolio và website sáng tạo trong catalog đang phát hành.
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 mb-8">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan" />
                  <span>Catalog có chọn lọc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan" />
                  <span>Giá Regular minh bạch</span>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <Link
                href="/themes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-cyan text-white text-xs font-bold uppercase tracking-wider transition shadow-glow hover:scale-105"
              >
                <span>Khám Phá Theme</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Stats Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">{THEMES_DATA.length} Themes</div>
              <div className="text-[11px] text-slate-500 font-medium">Bản quyền chính hãng</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">12,500+</div>
              <div className="text-[11px] text-slate-500 font-medium">Khách hàng tin cậy</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">99/100</div>
              <div className="text-[11px] text-slate-500 font-medium">Điểm PageSpeed xanh</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">4.9 / 5.0</div>
              <div className="text-[11px] text-slate-500 font-medium">Đánh giá 5 sao uy tín</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
