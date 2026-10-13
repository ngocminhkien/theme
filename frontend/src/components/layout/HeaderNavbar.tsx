'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, ChevronDown, Flame, Sparkles, Zap, Wrench } from 'lucide-react';
import { CATEGORIES_LIST } from '@/shared/data/themes-data';

export function HeaderNavbar() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  return (
    <div className="bg-white border-b border-slate-200 hidden md:block relative z-30 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
        {/* Left: All Categories Button with Mega Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            onMouseEnter={() => setShowCategoryMenu(true)}
            className="flex items-center gap-2 px-4 lg:px-6 py-3.5 lg:py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs lg:text-sm uppercase tracking-wider rounded-t-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <LayoutGrid className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
            <span>TẤT CẢ DANH MỤC</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showCategoryMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Mega Menu Dropdown */}
          {showCategoryMenu && (
            <div
              onMouseLeave={() => setShowCategoryMenu(false)}
              className="absolute top-full left-0 w-72 sm:w-84 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-2xl border border-slate-200 border-t-0 py-3 z-50 animate-in fade-in duration-150 divide-y divide-slate-100"
            >
              {CATEGORIES_LIST.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.id === 'all' ? '/themes' : `/themes?category=${cat.id}`}
                  onClick={() => setShowCategoryMenu(false)}
                  className="flex items-center justify-between px-4.5 py-3 text-sm font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50/60 transition rounded-lg mx-2"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500/40" />
                    <span>{cat.name_vi}</span>
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-bold">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Center: Main Navigation Links */}
        <nav className="flex items-center gap-4 lg:gap-6 xl:gap-9 text-xs lg:text-sm font-bold text-slate-700 overflow-x-auto no-scrollbar whitespace-nowrap min-w-0 flex-1 justify-start lg:justify-center">
          <Link
            href="/"
            className="hover:text-brand-600 transition py-3.5 lg:py-4 border-b-2 border-brand-600 text-brand-600 shrink-0"
          >
            Trang Chủ
          </Link>
          <Link
            href="/themes?category=e-commerce"
            className="hover:text-brand-600 transition py-3.5 lg:py-4 border-b-2 border-transparent shrink-0"
          >
            Theme Bán Hàng
          </Link>
          <Link
            href="/themes?category=corporate-b2b"
            className="hover:text-brand-600 transition py-3.5 lg:py-4 border-b-2 border-transparent shrink-0"
          >
            Theme Doanh Nghiệp
          </Link>
          <Link
            href="/themes?builder=elementor"
            className="hover:text-brand-600 transition py-3.5 lg:py-4 border-b-2 border-transparent shrink-0"
          >
            Elementor Pro
          </Link>
          <Link
            href="/themes?category=real-estate"
            className="hover:text-brand-600 transition py-3.5 lg:py-4 border-b-2 border-transparent shrink-0"
          >
            Bất Động Sản
          </Link>
          <Link
            href="/themes?sort=featured"
            className="hover:text-brand-600 transition py-3.5 lg:py-4 border-b-2 border-transparent shrink-0"
          >
            Theme Chuẩn SEO
          </Link>
          <Link
            href="/preview/woodmart"
            className="hover:text-brand-600 transition py-3.5 lg:py-4 border-b-2 border-transparent flex items-center gap-2 text-emerald-600 shrink-0"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Demo</span>
          </Link>
        </nav>

        {/* Right: VIP Pass / Flash Deal */}
        <div className="hidden xl:flex items-center gap-2 text-sm font-bold shrink-0">
          <Link
            href="/themes?deals=weekly"
            className="flex items-center gap-2 px-4.5 py-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition text-xs font-black shadow-2xs whitespace-nowrap"
          >
            <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
            <span>Deal Giảm 35% Tuần Này</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
