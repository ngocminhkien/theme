'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  X,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';
import { ThemeItem } from '@/shared/types';

interface LivePreviewBarProps {
  theme: ThemeItem;
}

type DeviceView = 'desktop' | 'tablet' | 'mobile';

const DEMO_VARIANTS = [
  { id: 'multipurpose', name: 'Demo 1: Bán Hàng Đa Năng (Mega Store)', url: 'https://woodmart.xtemos.com/' },
  { id: 'corporate', name: 'Demo 2: Doanh Nghiệp & Agency (B2B)', url: 'https://woodmart.xtemos.com/demo-corporate/' },
  { id: 'tech', name: 'Demo 3: Công Nghệ & SaaS Landing Page', url: 'https://woodmart.xtemos.com/demo-landing/' },
  { id: 'fashion', name: 'Demo 4: Thời Trang & Mỹ Phẩm Cao Cấp', url: 'https://woodmart.xtemos.com/demo-fashion-minimalism/' },
];

export function LivePreviewBar({ theme }: LivePreviewBarProps) {
  const router = useRouter();
  const [device, setDevice] = useState<DeviceView>('desktop');
  const [currentDemoUrl, setCurrentDemoUrl] = useState(theme.live_demo_url || DEMO_VARIANTS[0].url);
  const { currency, addItem } = useCartStore();

  const priceText =
    currency === 'VND'
      ? `${theme.price_vnd.toLocaleString('vi-VN')} ₫`
      : `$${theme.price_usd}`;

  const handleBuyNow = () => {
    addItem(theme);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Top Controller Bar (Ultra-sleek Dark Glassmorphism) */}
      <header className="min-h-14 sm:h-16 py-1.5 sm:py-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 text-white flex items-center justify-between gap-2 sm:gap-4 px-2.5 sm:px-6 z-50 shrink-0 shadow-2xl">
        {/* Left: Back to Marketplace & Theme Info */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition bg-slate-900 hover:bg-slate-800 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-800 shadow-xs"
            title="Về Theme Store"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Về Theme Store</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden lg:block" />

          {/* Theme Title & Meta */}
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="truncate max-w-xs">{theme.name}</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-0.5 rounded font-black">
                v{theme.version}
              </span>
            </span>
            <span className="text-xs text-slate-400">
              {theme.category_name_vi} • {theme.page_builders}
            </span>
          </div>

          {/* Demo Variant Switcher Dropdown */}
          <div className="relative hidden xl:block">
            <select
              value={currentDemoUrl}
              onChange={(e) => setCurrentDemoUrl(e.target.value)}
              aria-label="Chọn bản demo giao diện"
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none cursor-pointer focus:border-brand-500 transition font-medium"
            >
              {DEMO_VARIANTS.map((demo) => (
                <option key={demo.id} value={demo.url} className="bg-slate-950 text-white">
                  {demo.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Device Switcher Segmented Control */}
        <div className="flex items-center bg-slate-900/90 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-inner shrink-0">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              device === 'desktop'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Giao diện Máy tính (100% full width)"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
            <span className="text-xs opacity-70 hidden xl:inline">(100%)</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              device === 'tablet'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Giao diện Máy tính bảng (768px)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet</span>
            <span className="text-xs opacity-70 hidden xl:inline">(768px)</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              device === 'mobile'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Giao diện Điện thoại (375px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
            <span className="text-xs opacity-70 hidden xl:inline">(375px)</span>
          </button>
        </div>

        {/* Right: Buy Theme CTA & External Link */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* External Link */}
          <a
            href={currentDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition hidden md:flex items-center gap-1.5 text-xs font-semibold"
            title="Mở demo trực tiếp trong tab mới"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden xl:inline">Tab Mới</span>
          </a>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-glow sm:hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
            <span className="hidden xs:inline">MUA NGAY: </span>
            <span>{priceText}</span>
          </button>

          {/* Close preview */}
          <Link
            href="/"
            className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition shrink-0"
            title="Đóng chế độ Live Preview"
          >
            <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </header>

      {/* Main Preview Screen */}
      <main className="flex-1 w-full bg-slate-900 flex items-center justify-center overflow-auto p-0 sm:p-4">
        {device === 'desktop' ? (
          /* Desktop View: Full Width Iframe */
          <div className="w-full h-full bg-white shadow-2xl">
            <iframe
              src={currentDemoUrl}
              title={`${theme.name} Desktop Live Preview`}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : device === 'tablet' ? (
          /* Tablet Mockup View: max-w-[768px] frame with rounded corners & shadow */
          <div className="w-full max-w-[768px] h-full sm:h-[90dvh] max-h-[1024px] bg-slate-950 sm:rounded-3xl p-2 sm:p-3.5 shadow-2xl border-0 sm:border-4 border-slate-800 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="hidden sm:flex h-4 w-full items-center justify-center pb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
            <div className="flex-1 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-white">
              <iframe
                src={currentDemoUrl}
                title={`${theme.name} Tablet Live Preview`}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        ) : (
          /* Mobile Mockup View: max-w-[375px] frame with Dynamic Island */
          <div className="w-full max-w-[375px] h-full sm:h-[90dvh] max-h-[812px] bg-slate-950 rounded-none xs:rounded-[44px] p-0 xs:p-3 shadow-2xl border-0 xs:border-4 border-slate-800 flex flex-col animate-in zoom-in-95 duration-200 relative">
            {/* Dynamic Island / Notch Mockup */}
            <div className="hidden xs:flex h-5 w-full items-center justify-center pb-2">
              <span className="w-24 h-3.5 rounded-full bg-slate-800" />
            </div>
            <div className="flex-1 w-full rounded-none xs:rounded-[32px] overflow-hidden bg-white">
              <iframe
                src={currentDemoUrl}
                title={`${theme.name} Mobile Live Preview`}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
