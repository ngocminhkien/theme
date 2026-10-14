'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { THEMES_DATA } from '@/shared/data/themes-data';
import { ThemeCard } from '@/features/themes/components/theme-card';
import { ThemeCardSkeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/shared/stores/cart.store';

type TabType = 'all' | 'ecommerce' | 'corporate' | 'elementor';

export function FeaturedThemesSection() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const currency = useCartStore((state) => state.currency);

  const handleTabChange = (tabId: TabType) => {
    if (tabId === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 200);
  };

  const filteredThemes = THEMES_DATA.filter((theme) => {
    if (activeTab === 'ecommerce') return theme.category === 'e-commerce';
    if (activeTab === 'corporate') return theme.category === 'corporate-b2b';
    if (activeTab === 'elementor') return theme.page_builders.includes('Elementor');
    return true;
  });

  return (
    <section className="py-8 sm:py-10 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header with Tabs */}
        <div data-reveal="fade-up" className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>BÁN CHẠY NHẤT 2026</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white tracking-tight">
              Top Giao Diện Được Mua & Đánh Giá Cao Nhất
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1.5 max-w-xl font-medium">
              Bộ sưu tập theme WordPress bản quyền bán chạy nhất tại Theme Store, cam kết 100% sạch mã độc, chuẩn SEO và tự động cập nhật trọn đời.
            </p>
          </div>

          {/* Theme Category Horizontal Pill Tabs */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
            {[
              { id: 'all', label: `Tất Cả (${THEMES_DATA.length})` },
              { id: 'ecommerce', label: 'Theme Bán Hàng' },
              { id: 'corporate', label: 'Doanh Nghiệp' },
              { id: 'elementor', label: 'Elementor Pro' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] font-black border border-cyan-400/50'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 shadow-sm'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Columns Grid filling the wide screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 xl:gap-8 min-h-[420px]">
          {isTabLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ThemeCardSkeleton key={i} />
              ))
            : filteredThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} currency={currency} />
              ))}
        </div>

        {/* Bottom CTA Button */}
        <div data-reveal="zoom-in" className="mt-8 sm:mt-12 text-center">
          <Link
            href="/themes"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-9 py-4 sm:py-4.5 bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 hover:from-brand-600 hover:to-indigo-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Khám Phá Toàn Bộ 500+ Themes Bản Quyền Giá Rẻ</span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
