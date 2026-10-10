'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, Zap, Tag, Sparkles, LayoutGrid } from 'lucide-react';
import { CATEGORIES_LIST } from '@/shared/data/themes-data';

export function HeaderNavbar() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  return (
    <div className="bg-white border-b border-slate-200/80 hidden md:block relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: All Categories Button with Mega Menu */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            onMouseEnter={() => setShowCategoryMenu(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-t-xl transition-all shadow-xs cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tất Cả Danh Mục</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCategoryMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Mega Menu Dropdown */}
          {showCategoryMenu && (
            <div
              onMouseLeave={() => setShowCategoryMenu(false)}
              className="absolute top-full left-0 w-80 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-2xl border border-slate-200/80 border-t-0 py-2.5 z-50 animate-in fade-in duration-150"
            >
              {CATEGORIES_LIST.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.id === 'all' ? '/themes' : `/themes?category=${cat.id}`}
                  onClick={() => setShowCategoryMenu(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition rounded-lg mx-2"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-brand-500/30 group-hover:bg-brand-500" />
                    {cat.name_vi}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Center: Main Navigation Links */}
        <nav className="flex items-center gap-8 text-xs font-bold text-slate-700">
          <Link href="/" className="hover:text-brand-600 transition py-3.5 border-b-2 border-brand-600 text-brand-600">
            Trang Chủ
          </Link>
          <Link href="/themes?category=e-commerce" className="hover:text-brand-600 transition py-3.5 border-b-2 border-transparent">
            Theme Bán Hàng
          </Link>
          <Link href="/themes?category=corporate-agency" className="hover:text-brand-600 transition py-3.5 border-b-2 border-transparent">
            Theme Doanh Nghiệp
          </Link>
          <Link href="/themes?builder=elementor" className="hover:text-brand-600 transition py-3.5 border-b-2 border-transparent">
            Elementor Pro
          </Link>
          <Link href="/themes?sort=featured" className="hover:text-brand-600 transition py-3.5 border-b-2 border-transparent">
            Theme Chuẩn SEO
          </Link>
          <Link href="/preview/woodmart-multipurpose" className="hover:text-brand-600 transition py-3.5 border-b-2 border-transparent flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Demo</span>
          </Link>
        </nav>

        {/* Right: VIP Pass / Deal Promotion */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <Link
            href="/themes?deals=weekly"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20 transition text-[11px]"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deal Giảm 35% Tuần Này</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
