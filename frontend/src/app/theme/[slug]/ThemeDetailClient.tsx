'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Eye,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { THEMES_DATA } from '@/shared/data/themes-data';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/shared/stores/cart.store';
import { ThemeCard } from '@/features/themes/components/theme-card';

interface ThemeDetailClientProps {
  slug: string;
}

export default function ThemeDetailClient({ slug }: ThemeDetailClientProps) {
  const theme = THEMES_DATA.find((t) => t.slug === slug);

  if (!theme) {
    notFound();
  }

  const { currency, addItem } = useCartStore();
  const selectedLicense = 'regular' as const;
  const [selectedImage, setSelectedImage] = useState(theme.thumbnail_url);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'changelog' | 'reviews'>('desc');

  // Only Regular has an agreed price in the current product data.
  const price = currency === 'VND' ? theme.price_vnd : theme.price_usd;

  const formattedPrice =
    currency === 'VND' ? `${price.toLocaleString('vi-VN')} đ` : `$${price}`;

  const relatedThemes = THEMES_DATA.filter((t) => t.id !== theme.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* Top Product Hero: Left Gallery + Right Purchase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Gallery Mockups */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-16/10 rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm relative">
              <img
                src={selectedImage}
                alt={theme.name}
                className="w-full h-full object-cover"
              />
              {theme.badge && (
                <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md">
                  {theme.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Preview Row */}
            {theme.gallery_urls && theme.gallery_urls.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedImage(theme.thumbnail_url)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                    selectedImage === theme.thumbnail_url ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={theme.thumbnail_url} alt="Thumb" className="w-full h-full object-cover" />
                </button>
                {theme.gallery_urls.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      selectedImage === img ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Purchase Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-md border border-brand-200/60">
                  {theme.category_name_vi}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-semibold">Phiên bản: {theme.version}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug mb-3.5">
                {theme.name}
              </h1>

              {/* Rating & Sales */}
              <div className="flex items-center gap-4 text-sm mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold">{theme.rating_avg}</span>
                  <span className="text-slate-500 font-normal">({theme.rating_count} đánh giá)</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-slate-500">
                  Đã bán: <strong className="text-slate-900 font-bold">{theme.total_sales} lượt</strong>
                </span>
              </div>

              {/* License Option Selector */}
              <div className="mb-6">
                <label className="block text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Chọn Loại Giấy Phép Bản Quyền (License):
                </label>
                <div className="space-y-3">
                  <div className="flex items-start justify-between p-4 rounded-2xl border border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Regular License</span>
                      <span className="text-xs text-slate-500">Dành cho 1 website đơn lẻ, kích hoạt tự động.</span>
                    </div>
                    <span className="font-black text-sm text-brand-600">Chuẩn</span>
                  </div>

                  <button type="button" disabled className="w-full text-left flex items-start justify-between gap-3 p-4 rounded-2xl border border-slate-200 opacity-60 cursor-not-allowed">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Agency License</span>
                      <span className="text-xs text-slate-500">Dành cho tối đa 5 website khách hàng.</span>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0 font-medium">Tạm chưa mở bán</span>
                  </button>

                  <button type="button" disabled className="w-full text-left flex items-start justify-between gap-3 p-4 rounded-2xl border border-slate-200 opacity-60 cursor-not-allowed">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Unlimited Lifetime Pass</span>
                      <span className="text-xs text-slate-500">Không giới hạn số lượng web + update trọn đời.</span>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0 font-medium">Tạm chưa mở bán</span>
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80 mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Giá thanh toán:</span>
                <span className="text-3xl font-black text-brand-600">{formattedPrice}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3.5">
              <Link
                href={`/preview/${theme.slug}`}
                className="w-full py-4 bg-white border-2 border-brand-600 hover:bg-brand-50 text-brand-600 font-extrabold text-sm uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <Eye className="w-4.5 h-4.5" />
                <span>Xem Live Demo Trực Tiếp</span>
              </Link>

              <button
                onClick={() => addItem(theme, selectedLicense)}
                className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-glow cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Thêm Vào Giỏ Hàng (Mua Ngay)</span>
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Bảo hành 100%
                </span>
                <span>•</span>
                <span>Cập nhật miễn phí</span>
                <span>•</span>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Overview, Specs, Changelog, Reviews */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-sm mb-10 sm:mb-12">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap pb-3 border-b border-slate-100 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`shrink-0 text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-2 border-b-2 transition cursor-pointer ${
                activeTab === 'desc'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Mô Tả & Tính Năng Nổi Bật
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`shrink-0 text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-2 border-b-2 transition cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Thông Số Kỹ Thuật
            </button>
            <button
              onClick={() => setActiveTab('changelog')}
              className={`shrink-0 text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-2 border-b-2 transition cursor-pointer ${
                activeTab === 'changelog'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Lịch Sử Cập Nhật
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`shrink-0 text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-2 border-b-2 transition cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Đánh Giá Của Khách Hàng ({theme.rating_count})
            </button>
          </div>

          {/* Tab 1: Description */}
          {activeTab === 'desc' && (
            <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
              <p>{theme.full_desc_vi}</p>
              <h4 className="font-extrabold text-base text-slate-900 mt-4">
                Điểm Nổi Bật Không Thể Bỏ Qua:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {theme.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block mb-1">Tương thích WordPress:</span>
                  <strong className="text-slate-900 text-sm">{theme.compat_wordpress}</strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block mb-1">Tương thích WooCommerce:</span>
                  <strong className="text-slate-900 text-sm">{theme.compat_woocommerce}</strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block mb-1">Phiên bản PHP tối ưu:</span>
                  <strong className="text-slate-900 text-sm">{theme.compat_php}</strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block mb-1">Hỗ trợ Page Builders:</span>
                  <strong className="text-slate-900 text-sm">{theme.page_builders}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Changelog */}
          {activeTab === 'changelog' && (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-sm text-slate-900">Phiên bản {theme.version} (Mới nhất)</strong>
                  <span className="text-brand-600 font-semibold">{theme.last_update}</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5">
                  <li>Tối ưu hóa Core Web Vitals chuẩn Google PageSpeed 95+.</li>
                  <li>Tương thích toàn diện với WooCommerce 9.x và WordPress 6.5+.</li>
                  <li>Cải thiện bộ lọc Ajax Filter mượt mà trên thiết bị di động.</li>
                  <li>Cập nhật hệ thống giỏ hàng trượt offcanvas và tối ưu giao diện responsive cho di động.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  NV
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-xs text-slate-900">Nguyễn Văn An (Senior Frontend Developer)</strong>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Theme cực kỳ mượt và chuẩn mã nguồn sạch. Tối ưu tốc độ tải trang Core Web Vitals xanh tuyệt đối, bộ lọc Ajax lọc sản phẩm siêu nhanh và rất dễ tùy biến qua Elementor!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Themes Section */}
        <div>
          <h3 className="text-xl font-black text-slate-900 mb-6">
            Theme Cùng Lĩnh Vực Được Đề Xuất
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {relatedThemes.map((rTheme) => (
              <ThemeCard key={rTheme.id} theme={rTheme} currency={currency} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
