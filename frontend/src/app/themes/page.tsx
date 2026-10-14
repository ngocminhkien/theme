import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemesCatalog } from '@/features/themes/components/themes-catalog';
import { ThemeCardSkeleton } from '@/components/ui/Skeleton';

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
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 xl:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ThemeCardSkeleton key={i} />
                ))}
              </div>
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
