'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Monitor,
  Tablet,
  Smartphone,
  ShoppingBag,
  ExternalLink,
  X,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';
import { ThemeItem } from '@/shared/types';

interface LivePreviewBarProps {
  theme: ThemeItem;
}

type DeviceView = 'desktop' | 'tablet' | 'mobile';

const DEMO_VARIANTS = [
  { id: 'multipurpose', name: 'Demo 1: Multipurpose Mega Store', url: 'https://woodmart.xtemos.com/' },
  { id: 'corporate', name: 'Demo 2: Corporate & Business Agency', url: 'https://woodmart.xtemos.com/demo-corporate/' },
  { id: 'tech', name: 'Demo 3: Modern Tech & SaaS Landing', url: 'https://woodmart.xtemos.com/demo-landing/' },
  { id: 'fashion', name: 'Demo 4: Minimalist Fashion & Shop', url: 'https://woodmart.xtemos.com/demo-fashion-minimalism/' },
];

export function LivePreviewBar({ theme }: LivePreviewBarProps) {
  const router = useRouter();
  const [device, setDevice] = useState<DeviceView>('desktop');
  const [currentDemoUrl, setCurrentDemoUrl] = useState(theme.live_demo_url || DEMO_VARIANTS[0].url);
  const { currency, addItem } = useCartStore();

  const priceText =
    currency === 'VND'
      ? `${theme.price_vnd.toLocaleString('vi-VN')} đ`
      : `$${theme.price_usd}`;

  const handleBuyNow = () => {
    addItem(theme);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Top Controller Bar (Ultra-sleek Dark Glassmorphism) */}
      <header className="h-16 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 text-white flex items-center justify-between px-4 sm:px-6 z-50 shrink-0 shadow-2xl">
        {/* Left: Back to Marketplace & Theme Info */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition bg-slate-900/90 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quay Lại Sàn</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          {/* Theme Title & Meta */}
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span>{theme.name}</span>
              <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                v{theme.version}
              </span>
            </span>
            <span className="text-[10px] text-slate-400">
              {theme.category_name_vi} • {theme.page_builders}
            </span>
          </div>

          {/* Demo Variant Switcher Dropdown */}
          <div className="relative hidden xl:block">
            <select
              value={currentDemoUrl}
              onChange={(e) => setCurrentDemoUrl(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none cursor-pointer focus:border-brand-500 transition font-medium"
            >
              {DEMO_VARIANTS.map((demo) => (
                <option key={demo.id} value={demo.url} className="bg-slate-950 text-white">
                  {demo.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Minimalist Device Switcher Segmented Pills */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800/90 shadow-inner">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              device === 'desktop'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Giao diện Máy tính (100% full width)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
            <span className="text-[10px] opacity-70 hidden md:inline">(100%)</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              device === 'tablet'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Giao diện Máy tính bảng (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
            <span className="text-[10px] opacity-70 hidden md:inline">(768px)</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              device === 'mobile'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Giao diện Điện thoại (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
            <span className="text-[10px] opacity-70 hidden md:inline">(375px)</span>
          </button>
        </div>

        {/* Right: Buy Theme CTA & External Link */}
        <div className="flex items-center gap-3">
          {/* External Link */}
          <a
            href={currentDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition hidden sm:flex items-center gap-1 text-xs font-semibold"
            title="Mở demo trực tiếp trong tab mới"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden lg:inline">Tab Mới</span>
          </a>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-cyan hover:from-brand-500 hover:to-accent-cyan text-white text-xs font-black uppercase tracking-wider shadow-glow hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mua Ngay: {priceText}</span>
          </button>

          {/* Close preview */}
          <Link
            href="/"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition"
            title="Đóng chế độ Live Preview"
          >
            <X className="w-5 h-5" />
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
          /* Tablet Mockup View: 768px frame with rounded corners & shadow */
          <div className="w-[768px] h-[92vh] max-h-[1024px] bg-slate-950 rounded-3xl p-3 shadow-2xl border-4 border-slate-800 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="h-4 w-full flex items-center justify-center pb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
            <div className="flex-1 w-full rounded-2xl overflow-hidden bg-white">
              <iframe
                src={currentDemoUrl}
                title={`${theme.name} Tablet Live Preview`}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        ) : (
          /* Mobile Mockup View: 375px frame with notch & rounded corners */
          <div className="w-[375px] h-[92vh] max-h-[812px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col animate-in zoom-in-95 duration-200 relative">
            {/* Dynamic Island / Notch Mockup */}
            <div className="h-5 w-full flex items-center justify-center pb-2">
              <span className="w-20 h-3 rounded-full bg-slate-800" />
            </div>
            <div className="flex-1 w-full rounded-[28px] overflow-hidden bg-white">
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
