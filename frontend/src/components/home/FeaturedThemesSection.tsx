'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Tuyển Chọn Nổi Bật</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Giao Diện Được Đánh Giá Cao Nhất 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Tuyển tập theme chuẩn Core Web Vitals xanh tuyệt đối, tải trang dưới 0.8s và tự động cấp License Key chính hãng.
            </p>
          </div>

          {/* Theme Category Horizontal Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `Tất Cả (${THEMES_DATA.length})` },
              { id: 'ecommerce', label: 'Theme Bán Hàng' },
              { id: 'corporate', label: 'Doanh Nghiệp' },
              { id: 'elementor', label: 'Elementor Pro' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-glow scale-102'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} currency={currency} />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href="/themes"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Khám Phá Toàn Bộ Catalog Theme</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
