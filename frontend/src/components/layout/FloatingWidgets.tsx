'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gift,
  PhoneCall,
  X,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export function FloatingWidgets() {
  const pathname = usePathname();
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Không hiển thị cụm widget nổi trên trang Live Preview để tránh che thanh điều khiển demo iframe
  if (pathname?.startsWith('/preview')) {
    return null;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('THEMESTORE20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Cụm Widget Nổi Cố Định Góc Phải (Fixed Bottom-Right) */}
      <aside
        aria-label="Cụm hỗ trợ và ưu đãi nổi"
        className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 select-none pointer-events-auto"
      >
        {/* 1. Nút Hộp Quà Ưu Đãi (Top Widget) */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => setIsPromoOpen(true)}
            aria-label="Nhận Ưu Đãi Hôm Nay"
            className="inline-flex items-center gap-2 sm:gap-2.5 pl-2.5 pr-3.5 sm:pl-3.5 sm:pr-4.5 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-red-500/35 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer group whitespace-nowrap"
          >
            {/* Icon hộp quà rung nhẹ + chấm thông báo nhấp nháy */}
            <span className="relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 text-white shrink-0 animate-gift">
              <Gift className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-300 drop-shadow-xs" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-300 rounded-full border border-red-600" />
            </span>

            <span className="drop-shadow-xs font-black uppercase text-[10px] sm:text-xs tracking-wider whitespace-nowrap">
              <span className="xs:hidden">Ưu Đãi</span>
              <span className="hidden xs:inline">Nhận Ưu Đãi Hôm Nay</span>
            </span>

            <Flame className="w-4 h-4 text-amber-300 animate-pulse shrink-0 hidden sm:block" />
          </button>

          {/* Tooltip phụ phía trên */}
          <div className="absolute right-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-slate-700/80">
            🎁 Tặng Voucher Giảm 20% + Bộ 3 Plugin Pro
          </div>
        </div>

        {/* 2. Nút Messenger (Middle Widget) */}
        <div className="relative group flex items-center">
          {/* Tooltip hiển thị bên trái khi hover */}
          <span className="hidden sm:inline-block absolute right-full mr-3.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-slate-700/80">
            💬 Chat Messenger 24/7
          </span>

          <a
            href="https://m.me/themestore.vn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn tin qua Facebook Messenger"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0078FF] via-[#00B2FE] to-[#A824FF] text-white flex items-center justify-center shadow-lg shadow-blue-500/35 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20 group cursor-pointer"
          >
            {/* SVG Official Messenger Chat Bubble Icon */}
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 fill-white drop-shadow-xs"
              viewBox="0 0 28 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 2C7.373 2 2 7.027 2 13.228c0 3.535 1.745 6.697 4.472 8.73v4.357c0 .644.698 1.047 1.25.719l4.853-2.883c.465.067.939.103 1.425.103 6.627 0 12-5.027 12-11.228C26 7.027 20.627 2 14 2zm1.393 15.132l-3.32-3.541-6.478 3.541 7.126-7.567 3.399 3.541 6.399-3.541-7.126 7.567z" />
            </svg>
          </a>
        </div>

        {/* 3. Nút Hotline Điện Thoại (Thay thế hoàn toàn Zalo, Bottom Widget) */}
        <div className="relative group flex items-center">
          {/* Tooltip Hotline bên trái */}
          <span className="hidden sm:inline-block absolute right-full mr-3.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-slate-700/80">
            📞 Hotline: <strong className="text-emerald-400">0988.666.888</strong> (Gọi ngay)
          </span>

          <a
            href="tel:0988666888"
            aria-label="Gọi điện trực tiếp hotline 0988.666.888"
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20 group cursor-pointer"
          >
            {/* Hiệu ứng sóng radar xung quanh nút Hotline */}
            <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping -z-10" />
            <span className="absolute -inset-1.5 rounded-full border-2 border-emerald-400/30 animate-pulse -z-10" />

            {/* Icon điện thoại rung chuông */}
            <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-xs animate-hotline-ring" />
          </a>
        </div>
      </aside>

      {/* POPUP MODAL: Nhận Ưu Đãi Hôm Nay */}
      {isPromoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsPromoOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-400/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ánh sáng glow nền */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Nút đóng modal */}
            <button
              type="button"
              onClick={() => setIsPromoOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="Đóng popup ưu đãi"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Modal */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>CHƯƠNG TRÌNH KHUYẾN MÃI ĐẶC QUYỀN</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Nhận Ưu Đãi Hôm Nay
              </h3>
              <p className="text-sm text-slate-300 mt-1.5">
                Áp dụng cho toàn bộ Theme WordPress & WooCommerce tại Theme Store
              </p>
            </div>

            {/* Voucher Code Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 mb-6 text-center">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                MÃ GIẢM GIÁ 20% ĐƠN ĐẦU TIÊN
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-950/70 border border-dashed border-amber-400/60 rounded-xl px-4 py-3">
                <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-amber-400 select-all">
                  THEMESTORE20
                </span>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-950" />
                      <span>Sao Chép</span>
                    </>
                  )}
                </button>
              </div>

              {copied && (
                <div className="text-xs text-emerald-400 font-bold mt-2 animate-in fade-in">
                  ✓ Đã sao chép mã ưu đãi vào clipboard! Nhập mã tại bước thanh toán.
                </div>
              )}
            </div>

            {/* Quà Tặng Đính Kèm */}
            <div className="space-y-3 mb-6 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  ✓
                </span>
                <span>
                  Giảm trực tiếp <strong>20% giá trị giỏ hàng</strong> không giới hạn số lượng theme.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  ✓
                </span>
                <span>
                  Tặng trọn bộ <strong>3 Plugin Pro (Elementor Pro, Rank Math Pro, WP Rocket)</strong> trị giá 2.500.000₫.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  ✓
                </span>
                <span>
                  Hỗ trợ kỹ thuật viên cài đặt demo 1-on-1 qua UltraViewer và cấp License Key tự động 24/7.
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/themes"
                onClick={() => setIsPromoOpen(false)}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-glow flex items-center justify-center gap-2"
              >
                <span>Khám Phá Kho Theme Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsPromoOpen(false)}
                className="py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-bold text-sm transition text-center cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cam kết code chuẩn sạch 100%, bản quyền trọn đời, hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
