'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, ShoppingBag, Star, Sparkles, Check, Zap, ArrowUpRight } from 'lucide-react';
import { ThemeItem, Currency } from '@/shared/types';
import { useCartStore } from '@/shared/stores/cart.store';

interface ThemeCardProps {
  theme: ThemeItem;
  currency?: Currency;
}

export function ThemeCard({ theme, currency = 'VND' }: ThemeCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const isInCart = items.some((i) => i.theme.id === theme.id);

  // Formatting price
  const currentPrice =
    currency === 'VND'
      ? `${theme.price_vnd.toLocaleString('vi-VN')} đ`
      : `$${theme.price_usd}`;

  const originalPrice =
    theme.original_price_vnd && theme.original_price_usd
      ? currency === 'VND'
        ? `${theme.original_price_vnd.toLocaleString('vi-VN')} đ`
        : `$${theme.original_price_usd}`
      : null;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(theme);
    router.push('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(theme);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative">
      {/* Thumbnail area with Badges & Glass Overlay */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={theme.thumbnail_url}
          alt={theme.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges (Modern Glassmorphic Badges) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {theme.discount_percent && (
            <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm border border-white/20">
              GIẢM {theme.discount_percent}%
            </span>
          )}
          {theme.badge === 'HOT' && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm border border-white/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              HOT
            </span>
          )}
          {theme.badge === 'NEW' && (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm border border-white/20">
              MỚI 2026
            </span>
          )}
        </div>

        {/* Top Right: Page Builder Pill */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-white/10">
            {theme.page_builders.split(',')[0]}
          </span>
        </div>

        {/* Modern Glass Overlay on Hover with Quick Actions */}
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-4 z-20">
          <Link
            href={`/preview/${theme.slug}`}
            className="px-4 py-2.5 bg-white hover:bg-brand-600 text-slate-900 hover:text-white rounded-xl font-bold text-xs shadow-lg transition-all duration-200 flex items-center gap-1.5 hover:scale-105"
            title="Xem trước Live Demo trực tiếp"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </Link>

          <button
            onClick={handleQuickBuy}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-xs shadow-glow transition-all duration-200 flex items-center gap-1.5 hover:scale-105 cursor-pointer"
            title="Mua ngay và thanh toán"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mua Ngay</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
              {theme.category_name_vi}
            </span>
            <div className="flex items-center gap-1 text-slate-500 font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{theme.rating_avg}</span>
              <span className="text-slate-400">({theme.total_sales})</span>
            </div>
          </div>

          {/* Theme Title */}
          <h3 className="font-bold text-sm text-slate-900 hover:text-brand-600 transition line-clamp-1 mb-1.5">
            <Link href={`/theme/${theme.slug}`}>
              {theme.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {theme.short_desc_vi}
          </p>
        </div>

        {/* Footer Area: Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-brand-600">
                {currentPrice}
              </span>
              {originalPrice && (
                <span className="text-[11px] text-slate-400 line-through font-medium">
                  {originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Bản quyền trọn đời</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl transition duration-200 cursor-pointer ${
                isInCart
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-slate-100 hover:bg-brand-600 text-slate-700 hover:text-white'
              }`}
              title={isInCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
            >
              {isInCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
            <Link
              href={`/theme/${theme.slug}`}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Xem thông tin chi tiết"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
