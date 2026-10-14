'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, ShieldCheck, Sparkles, Zap, Gift, Tag } from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';
import { ThemeSwitcherPill } from '@/components/layout/AmbientBackground';

const TICKER_ANNOUNCEMENTS = [
  {
    icon: Tag,
    badge: 'SIÊU SALE',
    text: 'Giảm ngay 35% toàn bộ Theme & Plugin WordPress bản quyền • Mã ưu đãi: THEMESTORE',
  },
  {
    icon: Zap,
    badge: 'TỰ ĐỘNG',
    text: 'Kích hoạt tức thì: Quét VietQR nhận file tải & License Key chính hãng sau 30 giây',
  },
  {
    icon: Gift,
    badge: 'QUÀ TẶNG',
    text: 'Tặng combo Plugin Pro (Elementor Pro, Rank Math Pro, WP Rocket) cho mọi đơn hàng',
  },
  {
    icon: ShieldCheck,
    badge: 'CAM KẾT',
    text: 'Tệp sạch 100% không mã độc • Quét an toàn VirusTotal • Cập nhật phiên bản trọn đời',
  },
];

export function HeaderTopBar() {
  const { currency, setCurrency } = useCartStore();
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 1) % TICKER_ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const activeTicker = TICKER_ANNOUNCEMENTS[currentTickerIndex];
  const TickerIcon = activeTicker.icon;

  return (
    <div className="bg-[#070b14] text-slate-300 border-b border-slate-800/80 text-xs relative z-50 w-full select-none">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-9 sm:h-10 flex items-center justify-between gap-4">
        {/* Left: Ticker Announcement with Refined Micro-Pill & Smooth Fade */}
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0 flex-1 max-w-[34%] lg:max-w-[38%]">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-extrabold tracking-wider uppercase shrink-0">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{activeTicker.badge}</span>
          </span>

          <div className="relative h-5 flex-1 min-w-0 overflow-hidden">
            <div
              key={currentTickerIndex}
              className="absolute inset-0 flex items-center gap-1.5 text-slate-200 text-xs font-medium truncate transition-opacity duration-300 animate-in fade-in"
            >
              <TickerIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{activeTicker.text}</span>
            </div>
          </div>
        </div>

        {/* Center: Theme Switcher (Chỉnh màu trang ra chính giữa) */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-10">
          <ThemeSwitcherPill compact />
        </div>

        {/* Right: Hotline, License, Currency & Login/Register (Đăng ký về phía bên phải ngoài cùng) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs font-medium ml-auto">
          {/* Hotline */}
          <a
            href="tel:0988666888"
            className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            title="Hotline & Zalo hỗ trợ kỹ thuật 24/7"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <span className="text-slate-400 hidden xl:inline">Hotline: </span>
              <strong className="text-white font-mono font-bold tracking-tight">0988.666.888</strong>
            </span>
          </a>

          <div className="h-3.5 w-px bg-slate-800 hidden md:block" />

          {/* License Lookup */}
          <Link
            href="/checkout"
            className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            title="Tra cứu tình trạng đơn hàng và License Key"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tra cứu License</span>
          </Link>

          <div className="h-3.5 w-px bg-slate-800 hidden lg:block" />

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-md p-0.5 border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setCurrency('VND')}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer wm-press-sm transition-all ${
                currency === 'VND'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Đổi sang Việt Nam Đồng (VND)"
            >
              ₫ VND
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer wm-press-sm transition-all ${
                currency === 'USD'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Đổi sang Đô la Mỹ (USD)"
            >
              $ USD
            </button>
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Admin Console Quick Link */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950 hover:bg-indigo-900 text-indigo-200 hover:text-white border border-indigo-700/50 transition text-xs font-bold shadow-xs"
            title="Bảng Quản Trị Hệ Thống (Admin Console)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeaderTopBar;
