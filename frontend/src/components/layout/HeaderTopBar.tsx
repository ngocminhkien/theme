'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, ShieldCheck, HelpCircle, User, Sparkles, Flame, Gift, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';
import { ThemeSwitcherPill } from '@/components/layout/AmbientBackground';

const TICKER_ANNOUNCEMENTS = [
  '🔥 SIÊU SALE HÔM NAY: Giảm ngay 35% tất cả Theme & Plugin WordPress bản quyền • Nhập mã: THEMESTORE',
  '⚡ KÍCH HOẠT TỰ ĐỘNG: Quét mã VietQR nhận link tải & License Key chính hãng sau 30 giây',
  '🎁 QUÀ TẶNG KHỦNG: Tặng kèm trọn bộ Plugin Pro (Elementor Pro, Rank Math Pro, WP Rocket) cho mọi đơn hàng',
  '🛡️ CAM KẾT BẢN QUYỀN: Tệp sạch 100% không mã độc • Quét sạch VirusTotal • Cập nhật trọn đời',
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

  return (
    <div className="bg-slate-950/95 backdrop-blur-md text-slate-300 border-b border-slate-800/80 text-sm relative z-50 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 h-10 sm:h-11 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Animated Ticker Announcement */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0 max-w-3xl">
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0 shadow-xs animate-pulse">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">HOT DEAL</span>
          </span>

          <div className="relative h-6 flex-1 min-w-0 overflow-hidden">
            <div
              key={currentTickerIndex}
              className="absolute inset-0 flex items-center text-slate-200 text-[11px] sm:text-sm font-medium truncate transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
            >
              <span className="truncate">{TICKER_ANNOUNCEMENTS[currentTickerIndex]}</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Hotline, Theme Switcher, Currency Switcher, Auth & Support */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 text-xs sm:text-sm">
          {/* Live Site Theme Switcher (Aurora / Midnight / Emerald) */}
          <ThemeSwitcherPill />

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Hotline / Zalo Support */}
          <a
            href="tel:0988666888"
            className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition font-semibold"
            title="Hotline & Zalo hỗ trợ kỹ thuật 24/7"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Hotline: <strong className="text-white text-sm">0988.666.888</strong></span>
          </a>

          <div className="h-4 w-px bg-slate-800 hidden lg:block" />

          {/* Currency Switcher (₫ VND / $ USD) */}
          <div className="flex items-center bg-slate-900 rounded-full p-0.5 border border-slate-800">
            <button
              onClick={() => setCurrency('VND')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold transition text-[11px] sm:text-xs cursor-pointer ${
                currency === 'VND'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Đổi sang tiền tệ Việt Nam Đồng (VND)"
            >
              ₫ VND
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold transition text-[11px] sm:text-xs cursor-pointer ${
                currency === 'USD'
                  ? 'bg-indigo-600 text-white shadow-xs'
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

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          {/* Quick links: Đăng nhập / Đăng ký */}
          <Link
            href="/login"
            className="hidden md:flex items-center gap-1.5 text-slate-200 hover:text-amber-400 transition font-bold"
            title="Đăng nhập tài khoản thành viên"
          >
            <User className="w-4 h-4 text-amber-400" />
            <span>Đăng Nhập</span>
          </Link>

          <Link
            href="/register"
            className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-white transition font-medium"
          >
            <span>Đăng Ký</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden lg:block" />

          <Link
            href="/checkout"
            className="hidden xl:flex items-center gap-1.5 text-slate-300 hover:text-white transition font-medium"
            title="Tra cứu tình trạng đơn hàng và License Key"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tra Cứu License</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
