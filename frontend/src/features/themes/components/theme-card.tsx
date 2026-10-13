'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  ShoppingBag,
  Star,
  Sparkles,
  Check,
  Zap,
  ArrowUpRight,
  Flame,
  ShieldCheck,
  Download,
} from 'lucide-react';
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
      ? `${theme.price_vnd.toLocaleString('vi-VN')} ₫`
      : `$${theme.price_usd}`;

  const originalPrice =
    theme.original_price_vnd && theme.original_price_usd
      ? currency === 'VND'
        ? `${theme.original_price_vnd.toLocaleString('vi-VN')} ₫`
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

  const [tilt, setTilt] = React.useState({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Rotate max 7 degrees on each axis
    const rotX = (y - 0.5) * -12;
    const rotY = (x - 0.5) * 12;
    setTilt({
      x: rotY,
      y: rotX,
      glareX: x * 100,
      glareY: y * 100,
      active: true,
    });
  };

  const handleMouseLeaveCard = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  };

  return (
    <div
      data-reveal="fade-up"
      onMouseMove={handleMouseMoveCard}
      onMouseLeave={handleMouseLeaveCard}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
        transition: tilt.active ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className="group wm-surface-card rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-brand-500/15 hover:border-brand-400/80 transition-all duration-300 flex flex-col justify-between relative will-change-transform"
    >
      {/* Dynamic Cursor Light Glare Sheen */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 0.35 : 0,
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
        }}
      />
      {/* Thumbnail area with Badges & Glass Overlay */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={theme.thumbnail_url}
          alt={theme.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {theme.discount_percent && (
            <span className="bg-rose-600/95 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm border border-white/20 tracking-wide uppercase animate-badge-float">
              GIẢM {theme.discount_percent}%
            </span>
          )}
          {theme.badge === 'HOT' && (
            <span className="bg-amber-500/95 backdrop-blur-md text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm border border-white/20 flex items-center gap-1.5 uppercase animate-badge-float">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              BÁN CHẠY
            </span>
          )}
          {theme.badge === 'NEW' && (
            <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm border border-white/20 flex items-center gap-1.5 uppercase animate-badge-float">
              <Sparkles className="w-3 h-3" />
              MỚI 2026
            </span>
          )}
        </div>

        {/* Top Right: Page Builder Pill */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{theme.page_builders.split(',')[0]}</span>
          </span>
        </div>

        {/* Modern Glass Overlay on Hover with Quick Actions */}
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-3 z-20">
          <Link
            href={`/preview/${theme.slug}`}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-white hover:bg-slate-900 text-slate-900 hover:text-white rounded-xl font-bold text-xs shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap shrink-0 leading-normal"
            title="Xem trước Live Demo trực tiếp"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Xem Demo</span>
          </Link>

          <button
            type="button"
            onClick={handleQuickBuy}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-black text-xs shadow-glow transition-all duration-200 hover:scale-105 cursor-pointer whitespace-nowrap shrink-0 leading-normal"
            title="Mua ngay và chuyển thẳng tới trang thanh toán"
          >
            <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
            <span className="whitespace-nowrap">Mua Ngay</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category, Rating & Sales */}
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="font-bold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 transition px-2.5 py-1 rounded-md text-[11px]">
              {theme.category_name_vi}
            </span>
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-slate-800 font-extrabold">{theme.rating_avg}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-[11px] flex items-center gap-0.5 font-medium">
                <Download className="w-3 h-3 text-slate-400" />
                {theme.total_sales}+ đã mua
              </span>
            </div>
          </div>

          {/* Theme Title */}
          <h3 className="font-black text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1.5 tracking-tight">
            <Link href={`/theme/${theme.slug}`}>
              {theme.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 font-normal">
            {theme.short_desc_vi}
          </p>
        </div>

        {/* Footer Area: Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-lg xs:text-xl sm:text-2xl font-black text-rose-600 whitespace-nowrap">
                {currentPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through font-medium whitespace-nowrap">
                  {originalPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Sạch mã độc 100% • Tự động kích hoạt</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={`/preview/${theme.slug}`}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center"
              title="Xem trước Live Demo"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={handleAddToCart}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isInCart
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-300 shadow-xs'
                  : 'bg-slate-900 hover:bg-brand-600 text-white shadow-xs hover:shadow-md'
              }`}
              title={isInCart ? 'Đã có trong giỏ hàng' : 'Thêm theme vào giỏ hàng'}
            >
              {isInCart ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
