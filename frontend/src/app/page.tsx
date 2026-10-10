'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeCard } from '../features/themes/components/theme-card';
import { useCartStore } from '../shared/stores/cart.store';
import { ThemeItem } from '../shared/types/index';

// Dữ liệu mẫu demo
const DEMO_THEMES: ThemeItem[] = [
  {
    id: 1,
    name: 'Woodmart - E-Commerce Multipurpose Theme',
    slug: 'woodmart',
    category: 'e-commerce',
    category_name_vi: 'Thương Mại Điện Tử',
    short_desc_vi: 'Giao diện bán hàng cao cấp, tối ưu tốc độ số 1 cho WooCommerce & Elementor.',
    short_desc_en: 'Premium Multipurpose WooCommerce & Elementor Theme.',
    price_vnd: 890000,
    price_usd: 49,
    thumbnail_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600',
    live_demo_url: 'https://woodmart.xtemos.com/',
    page_builders: 'Elementor, WPBakery',
    rating_avg: 4.95,
    total_sales: 1450,
  },
  {
    id: 2,
    name: 'TechnoPro - Điện Máy & Đồ Công Nghệ',
    slug: 'techno-pro',
    category: 'technology',
    category_name_vi: 'Công Nghệ & Điện Máy',
    short_desc_vi: 'Chuyên biệt cho các cửa hàng điện thoại, laptop, linh kiện điện tử.',
    short_desc_en: 'Dedicated theme for digital, electronics & gadgets shops.',
    price_vnd: 790000,
    price_usd: 39,
    thumbnail_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
    live_demo_url: 'https://woodmart.xtemos.com/demo-electronics/',
    page_builders: 'Elementor',
    rating_avg: 4.9,
    total_sales: 620,
  },
  {
    id: 3,
    name: 'BeautySpa - Thẩm Mỹ Viện & Mỹ Phẩm',
    slug: 'beauty-spa',
    category: 'fashion-beauty',
    category_name_vi: 'Thời Trang & Mỹ Phẩm',
    short_desc_vi: 'Tone màu sang trọng, chuẩn SEO dành cho spa, mỹ phẩm hữu cơ và clinic.',
    short_desc_en: 'Luxury theme for beauty salons, organic cosmetics and wellness.',
    price_vnd: 750000,
    price_usd: 39,
    thumbnail_url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600',
    live_demo_url: 'https://woodmart.xtemos.com/demo-cosmetics/',
    page_builders: 'Elementor, Gutenberg',
    rating_avg: 4.88,
    total_sales: 410,
  },
];

export default function HomePage() {
  const { currency, setCurrency, items } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold text-blue-600">
            THEME<span className="text-gray-900">MARKET</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="/" className="text-blue-600">Khám Phá</Link>
            <Link href="/themes?category=e-commerce" className="hover:text-gray-900">Bán Hàng</Link>
            <Link href="/themes?category=corporate-b2b" className="hover:text-gray-900">Doanh Nghiệp</Link>
            <Link href="/themes?category=health-beauty" className="hover:text-gray-900">Spa & Y Tế</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setCurrency('VND')}
              className={`px-2.5 py-1 rounded-md transition ${currency === 'VND' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              ₫ VND
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-md transition ${currency === 'USD' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              $ USD
            </button>
          </div>

          {/* Cart Button */}
          <Link
            href="/checkout"
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            🛒 Giỏ hàng ({items.length})
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Kho Giao Diện Bản Quyền Số 1 Cho Web Developers
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
            Kho Theme WordPress & WooCommerce Đa Ngành Chuẩn SEO
          </h1>
          <p className="text-gray-600 text-base md:text-lg mt-3">
            Tối ưu Core Web Vitals, tương thích 100% thiết bị di động, tự động nhận License Key và update 1-click.
          </p>
        </div>
      </section>

      {/* Featured Themes Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Theme Nổi Bật Được Mua Nhiều Nhất</h2>
          <span className="text-xs text-gray-500">Cập nhật định kỳ 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_THEMES.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} currency={currency} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        © 2026 Theme Marketplace Platform. Bảo mật giao dịch với VietQR và Stripe.
      </footer>
    </div>
  );
}
