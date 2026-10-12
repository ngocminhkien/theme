import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemesCatalog } from '@/features/themes/components/themes-catalog';

export const metadata: Metadata = {
  title: 'Kho Theme WordPress & WooCommerce Chuẩn SEO | THEMESTORE Marketplace',
  description: 'Khám phá catalog theme bản quyền cho Elementor, WooCommerce, bán hàng và doanh nghiệp. Bộ lọc đa tiêu chí, tải trang thần tốc.',
};

export default function ThemesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#777777]">
              Đang tải danh sách theme...
            </div>
          }
        >
          <ThemesCatalog />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
