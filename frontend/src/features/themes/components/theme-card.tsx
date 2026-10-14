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
    // Smooth controlled tilt (max 6 degrees)
    const rotX = (y - 0.5) * -6;
    const rotY = (x - 0.5) * 6;
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
      suppressHydrationWarning
      onMouseMove={handleMouseMoveCard}
      onMouseLeave={handleMouseLeaveCard}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
        transition: tilt.active ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className="group cyber-card rounded-3xl border border-indigo-500/25 hover:border-cyan-400/70 overflow-hidden shadow-[0_10px_30px_rgba(7,11,25,0.7)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 flex flex-col justify-between relative will-change-transform"
    >
      {/* Cyber Neon Glare Sheen */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 0.3 : 0,
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(6,182,212,0.2) 0%, rgba(99,102,241,0) 65%)`,
        }}
      />
      {/* Thumbnail area with Badges & Glass Overlay */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
        <img
          src={theme.thumbnail_url}
          alt={theme.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {theme.discount_percent && (
            <span className="bg-rose-600/95 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(225,29,72,0.5)] border border-white/20 tracking-wide uppercase animate-badge-float">
              GIẢM {theme.discount_percent}%
            </span>
          )}
          {theme.badge === 'HOT' && (
            <span className="bg-amber-500/95 backdrop-blur-md text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-white/20 flex items-center gap-1.5 uppercase animate-badge-float">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              BÁN CHẠY
            </span>
          )}
          {theme.badge === 'NEW' && (
            <span className="bg-cyan-500/95 backdrop-blur-md text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-white/20 flex items-center gap-1.5 uppercase animate-badge-float">
              <Sparkles className="w-3 h-3 text-slate-950" />
              MỚI 2026
            </span>
          )}
        </div>

        {/* Top Right: Page Builder Pill */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="bg-slate-950/85 backdrop-blur-md text-cyan-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-cyan-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{theme.page_builders.split(',')[0]}</span>
          </span>
        </div>

        {/* Modern Glass Overlay on Hover with Quick Actions */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-3 z-20">
          <Link
            href={`/preview/${theme.slug}`}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl font-bold text-xs border border-cyan-500/40 shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap shrink-0 leading-normal"
            title="Xem trước Live Demo trực tiếp"
          >
            <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap">Xem Demo</span>
          </Link>

          <button
            type="button"
            onClick={handleQuickBuy}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 hover:scale-105 cursor-pointer whitespace-nowrap shrink-0 leading-normal"
            title="Mua ngay và chuyển thẳng tới trang thanh toán"
          >
            <Zap className="w-4 h-4 fill-white shrink-0" />
            <span className="whitespace-nowrap">Mua Ngay</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category, Rating & Sales */}
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="font-bold text-cyan-300 bg-slate-900/90 border border-cyan-500/30 transition px-2.5 py-1 rounded-md text-[11px]">
              {theme.category_name_vi}
            </span>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-slate-200 font-extrabold">{theme.rating_avg}</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px] flex items-center gap-0.5 font-medium">
                <Download className="w-3 h-3 text-cyan-400" />
                {theme.total_sales}+ đã mua
              </span>
            </div>
          </div>

          {/* Theme Title */}
          <h3 className="font-black text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1.5 tracking-tight">
            <Link href={`/theme/${theme.slug}`}>
              {theme.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4 font-normal">
            {theme.short_desc_vi}
          </p>
        </div>

        {/* Footer Area: Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-lg xs:text-xl sm:text-2xl font-black text-cyan-400 whitespace-nowrap">
                {currentPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-500 line-through font-medium whitespace-nowrap">
                  {originalPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Sạch mã độc 100% • Tự động kích hoạt</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={`/preview/${theme.slug}`}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/50 transition flex items-center justify-center"
              title="Xem trước Live Demo"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={handleAddToCart}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isInCart
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              }`}
              title={isInCart ? 'Đã có trong giỏ hàng' : 'Thêm theme vào giỏ hàng'}
            >
              {isInCart ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
