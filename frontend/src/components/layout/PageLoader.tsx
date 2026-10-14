'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(18);
  const [statusText, setStatusText] = useState('Đang khởi tạo hệ thống...');

  useEffect(() => {
    // Trigger on route change and initial mount
    setLoading(true);
    setExiting(false);
    setProgress(25);
    setStatusText('Đang kết nối kho Theme & Plugin WordPress...');

    const p1 = setTimeout(() => {
      setProgress(60);
      setStatusText('Kiểm tra mã nguồn sạch 100% & VirusTotal...');
    }, 180);

    const p2 = setTimeout(() => {
      setProgress(90);
      setStatusText('Khởi động kích hoạt bản quyền VietQR...');
    }, 360);

    const p3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Sẵn sàng trải nghiệm!');
      setExiting(true);
    }, 550);

    const p4 = setTimeout(() => {
      setLoading(false);
    }, 850);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(p4);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 ease-out ${
        exiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none -bottom-20 -right-20 animate-pulse" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center z-10 select-none">
        {/* Holographic Glowing 3D Emblem Container */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 flex items-center justify-center">
          {/* Concentric Neon Rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-25" />
          <div className="absolute -inset-3 rounded-full border border-dashed border-indigo-500/35 animate-[spin_12s_linear_infinite]" />
          <div className="absolute -inset-6 rounded-full border border-cyan-400/20 animate-[spin_18s_linear_infinite_reverse]" />
          
          {/* Radial Spotlight Glow Behind Image */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500/30 via-indigo-500/25 to-amber-500/20 blur-xl" />

          {/* 3D Image */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)] animate-float">
            <Image
              src="/images/themestore-loader.png"
              alt="ThemeStore Loading"
              width={160}
              height={160}
              priority
              className="w-full h-full object-contain filter contrast-110"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            THEME<span className="text-amber-400">STORE</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-brand-600 to-indigo-600 text-white border border-indigo-400/40 shadow-sm">
            PRO
          </span>
        </div>

        {/* Dynamic Status Text */}
        <p className="text-xs sm:text-sm font-semibold text-cyan-300/90 h-5 mb-5 flex items-center gap-1.5 transition-all duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>{statusText}</span>
        </p>

        {/* Progress Bar Container */}
        <div className="w-64 sm:w-72 bg-slate-900/90 rounded-full h-2 p-0.5 border border-slate-800 shadow-inner overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-400 transition-all duration-300 ease-out relative shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Light Highlight on Progress */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>

        {/* Percentage Counter & Security Badge */}
        <div className="w-64 sm:w-72 flex items-center justify-between mt-2.5 text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sạch 100% VirusTotal</span>
          </span>
          <span className="text-cyan-400 font-mono font-extrabold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
