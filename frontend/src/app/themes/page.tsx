import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemesCatalog } from '@/features/themes/components/themes-catalog';

export const metadata: Metadata = {
  title: 'Kho Theme & Plugin WordPress Bản Quyền Giá Rẻ | THEME STORE (THEMESTORE.VN)',
  description: 'Khám phá hơn 500+ mẫu theme bản quyền cho Elementor, WooCommerce, bán hàng, doanh nghiệp, công nghệ và bất động sản. Bộ lọc đa tiêu chí, tải trang thần tốc.',
};

export default function ThemesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent relative z-10">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 text-center text-xs text-slate-500">
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
