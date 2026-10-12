'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { THEMES_DATA } from '@/shared/data/themes-data';
import { ThemeCard } from '@/features/themes/components/theme-card';
import { useCartStore } from '@/shared/stores/cart.store';

type TabType = 'all' | 'ecommerce' | 'corporate' | 'elementor';

export function FeaturedThemesSection() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const currency = useCartStore((state) => state.currency);

  const filteredThemes = THEMES_DATA.filter((theme) => {
    if (activeTab === 'ecommerce') return theme.category === 'e-commerce';
    if (activeTab === 'corporate') return theme.category === 'corporate-b2b';
    if (activeTab === 'elementor') return theme.page_builders.includes('Elementor');
    return true;
  });

  return (
    <section className="py-10 px-2 sm:px-4 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header with Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>BÁN CHẠY NHẤT 2026</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-slate-900 tracking-tight">
              Top Giao Diện Được Mua & Đánh Giá Cao Nhất
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-xl font-medium">
              Bộ sưu tập theme WordPress bản quyền bán chạy nhất tại Theme Store, cam kết 100% sạch mã độc, chuẩn SEO và tự động cập nhật trọn đời.
            </p>
          </div>

          {/* Theme Category Horizontal Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              { id: 'all', label: `Tất Cả (${THEMES_DATA.length})` },
              { id: 'ecommerce', label: 'Theme Bán Hàng' },
              { id: 'corporate', label: 'Doanh Nghiệp' },
              { id: 'elementor', label: 'Elementor Pro' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow scale-102 font-black'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Columns Grid filling the wide screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {filteredThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} currency={currency} />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href="/themes"
            className="inline-flex items-center gap-3 px-9 py-4.5 bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 hover:from-brand-600 hover:to-indigo-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Khám Phá Toàn Bộ 500+ Themes Bản Quyền Giá Rẻ</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
