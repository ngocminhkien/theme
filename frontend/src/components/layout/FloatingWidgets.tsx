'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PhoneCall,
  ChevronUp,
  MessageCircle,
  Headphones,
  X,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function FloatingWidgets() {
  const pathname = usePathname();
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Không hiển thị cụm widget nổi trên trang Live Preview hoặc trang Admin để tránh che giao diện
  if (pathname?.startsWith('/preview') || pathname?.startsWith('/admin')) {
    return null;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('THEMESTORE20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Cụm Widget Nổi Cố Định Góc Trái (Fixed Bottom-Left): Hộp Quà, Zalo 2026, Điện Thoại Hotline */}
      <aside
        aria-label="Cụm hỗ trợ và ưu đãi nổi"
        className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-40 flex flex-col items-start gap-2 sm:gap-2.5 select-none pointer-events-auto"
      >
        {/* 1. Nút Hộp Quà Ưu Đãi 3D (Nhỏ gọn, tinh tế) */}
        <div className="relative group flex items-center justify-center">
          {/* Tooltip phụ phía trên */}
          <div className="absolute left-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-semibold py-1 px-2.5 rounded-lg shadow-xl border border-slate-700/80 z-20">
            🎁 Nhận Mã Giảm 20% + Tặng 3 Plugin Pro
          </div>

          <button
            type="button"
            onClick={() => setIsPromoOpen(true)}
            aria-label="Nhận Ưu Đãi Hôm Nay"
            className="relative p-0 border-0 bg-transparent cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-hidden"
          >
            {/* Hiệu ứng hào quang phát sáng vàng ấm xung quanh hộp quà */}
            <span className="absolute -inset-1 rounded-2xl bg-amber-400/25 blur-md opacity-60 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none -z-10" />

            {/* Ảnh Hộp Quà 3D tinh gọn */}
            <div className="relative animate-float-slow drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)] group-hover:drop-shadow-[0_6px_16px_rgba(245,158,11,0.5)] transition-all duration-300">
              <img
                src="/images/promo-giftbox.png"
                alt="Nhận Ưu Đãi Hôm Nay"
                width={52}
                height={58}
                className="w-11 sm:w-12 h-auto object-contain select-none pointer-events-none"
                loading="eager"
              />

              {/* Chấm ping thông báo nhấp nháy góc trên hộp quà */}
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-full animate-ping pointer-events-none" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-300 rounded-full border border-amber-500 pointer-events-none shadow-xs" />
            </div>
          </button>
        </div>

        {/* 2. Nút Chat Zalo (Icon Zalo 2026 chính hãng, nhỏ vừa vặn) */}
        <div className="relative group flex items-center">
          <a
            href="https://zalo.me/0988666888"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat Zalo hỗ trợ kỹ thuật 0988.666.888"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center shadow-md shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/25 group cursor-pointer"
          >
            {/* SVG Official Zalo 2026 Icon */}
            <svg
              className="w-full h-full"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="50" height="50" rx="25" fill="#0068FF" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
                fill="white"
              />
              <path
                d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z"
                fill="#0068FF"
              />
              <path
                d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z"
                fill="#0068FF"
              />
              <path
                d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z"
                fill="#0068FF"
              />
              <path
                d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"
                fill="#0068FF"
              />
              <path
                d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z"
                fill="#0068FF"
              />
            </svg>
          </a>

          {/* Tooltip Zalo hiển thị bên phải khi hover */}
          <span className="hidden sm:inline-block absolute left-full ml-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-semibold py-1 px-2.5 rounded-lg shadow-lg border border-slate-700/80">
            💬 Chat Zalo: <strong className="text-sky-300">0988.666.888</strong> (Tư vấn 24/7)
          </span>
        </div>

        {/* 3. Nút Hotline Điện Thoại (Nhỏ vừa vặn) */}
        <div className="relative group flex items-center">
          <a
            href="tel:0988666888"
            aria-label="Gọi điện trực tiếp hotline 0988.666.888"
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 group cursor-pointer"
          >
            {/* Hiệu ứng sóng radar xung quanh nút Hotline */}
            <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping -z-10" />

            {/* Icon điện thoại rung chuông */}
            <PhoneCall className="w-5 h-5 text-white drop-shadow-xs animate-hotline-ring" />
          </a>

          {/* Tooltip Hotline bên phải */}
          <span className="hidden sm:inline-block absolute left-full ml-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-semibold py-1 px-2.5 rounded-lg shadow-lg border border-slate-700/80">
            📞 Hotline: <strong className="text-emerald-400">0988.666.888</strong> (Gọi ngay)
          </span>
        </div>
      </aside>

      {/* Cụm Tiện Ích Góc Phải (Fixed Bottom-Right): Nút Cuộn Lên Đầu Trang & Box Chat Trực Tuyến */}
      <aside
        aria-label="Cụm hỗ trợ trực tuyến và cuộn trang"
        className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 sm:gap-2.5 select-none pointer-events-auto"
      >
        {/* 1. Nút Cuộn Lên Đầu Trang (Chỉ hiện khi cuộn trang > 300px) */}
        <div
          className={`transition-all duration-300 ${
            showScrollTop
              ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
              : 'opacity-0 translate-y-2 pointer-events-none scale-90 h-0 overflow-hidden m-0'
          }`}
        >
          <div className="relative group flex items-center justify-center">
            {/* Tooltip bên trái */}
            <span className="hidden sm:inline-block absolute right-full mr-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-semibold py-1 px-2.5 rounded-lg shadow-lg border border-slate-700/80">
              ↑ Lên đầu trang
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Cuộn lên đầu trang"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 [html[data-site-theme='midnight']_&]:bg-slate-900/95 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-indigo-600 text-slate-700 [html[data-site-theme='midnight']_&]:text-slate-200 hover:text-white border border-slate-200/90 [html[data-site-theme='midnight']_&]:border-slate-700/90 hover:border-transparent flex items-center justify-center shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer group"
            >
              <ChevronUp className="w-5 h-5 stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* 2. Nút Mở Box Chat Trực Tuyến & Cửa Sổ Live Chat */}
        <div className="relative flex items-center justify-center">
          {/* Cửa Sổ Box Chat Nổi (Interactive Live Chat Window) */}
          {isChatBoxOpen && (
            <div
              role="dialog"
              aria-label="Khung chat hỗ trợ trực tuyến"
              className="absolute bottom-full right-0 mb-3 w-[330px] sm:w-[370px] bg-white [html[data-site-theme='midnight']_&]:bg-slate-900 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.22),0_4px_16px_rgba(0,0,0,0.08)] border border-slate-200/90 [html[data-site-theme='midnight']_&]:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-200 z-50 text-slate-800 [html[data-site-theme='midnight']_&]:text-slate-100"
            >
              {/* Header Box Chat */}
              <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-sm border border-white/30">
                      <Headphones className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-indigo-700 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm leading-tight">Hỗ Trợ Khách Hàng</h4>
                    <p className="text-[11px] text-blue-100/90 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                      <span>Thường trả lời trong 1-3 phút</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChatBoxOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/90 hover:text-white transition cursor-pointer"
                  aria-label="Đóng khung chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Box Chat */}
              <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto no-scrollbar">
                {/* Tin nhắn chào mừng tự động */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-black">
                    TS
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-xs bg-slate-100 [html[data-site-theme='midnight']_&]:bg-slate-800/80 text-xs text-slate-800 [html[data-site-theme='midnight']_&]:text-slate-200 leading-relaxed border border-slate-200/60 [html[data-site-theme='midnight']_&]:border-slate-700/60 shadow-2xs">
                    Xin chào bạn! 👋 Bạn đang quan tâm đến <strong>Theme WordPress</strong>, cần hỗ trợ <strong>cài đặt demo</strong> hay kích hoạt <strong>License Key</strong>? Hãy chọn kênh chat trực tiếp bên dưới nhé!
                  </div>
                </div>

                {/* Các kênh liên hệ trực tiếp 1-click */}
                <div className="space-y-2 pt-1">
                  {/* Zalo Button */}
                  <a
                    href="https://zalo.me/0988666888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/90 [html[data-site-theme='midnight']_&]:bg-blue-950/40 [html[data-site-theme='midnight']_&]:hover:bg-blue-900/50 border border-blue-200/80 [html[data-site-theme='midnight']_&]:border-blue-800/80 text-blue-700 [html[data-site-theme='midnight']_&]:text-blue-300 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-2xs">
                        <svg className="w-full h-full" viewBox="0 0 50 50" fill="none">
                          <rect width="50" height="50" rx="10" fill="#0068FF" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z" fill="white"/>
                          <path d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z" fill="#0068FF"/>
                          <path d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z" fill="#0068FF"/>
                          <path d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z" fill="#0068FF"/>
                          <path d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z" fill="#0068FF"/>
                          <path d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z" fill="#0068FF"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold leading-none">Chat qua Zalo Kỹ Thuật</div>
                        <div className="text-[10px] text-slate-500 [html[data-site-theme='midnight']_&]:text-slate-400 mt-1">Zalo: 0988.666.888 (Tư vấn nhanh)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-x-1" />
                  </a>

                  {/* Messenger Button */}
                  <a
                    href="https://m.me/themestore.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/90 [html[data-site-theme='midnight']_&]:bg-indigo-950/40 [html[data-site-theme='midnight']_&]:hover:bg-indigo-900/50 border border-indigo-200/80 [html[data-site-theme='midnight']_&]:border-indigo-800/80 text-indigo-700 [html[data-site-theme='midnight']_&]:text-indigo-300 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0078FF] via-[#00B2FE] to-[#A824FF] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 28 28">
                          <path d="M14 2C7.373 2 2 7.027 2 13.228c0 3.535 1.745 6.697 4.472 8.73v4.357c0 .644.698 1.047 1.25.719l4.853-2.883c.465.067.939.103 1.425.103 6.627 0 12-5.027 12-11.228C26 7.027 20.627 2 14 2zm1.393 15.132l-3.32-3.541-6.478 3.541 7.126-7.567 3.399 3.541 6.399-3.541-7.126 7.567z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold leading-none">Facebook Messenger</div>
                        <div className="text-[10px] text-slate-500 [html[data-site-theme='midnight']_&]:text-slate-400 mt-1">m.me/themestore.vn (Hỗ trợ 24/7)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600 transition-transform group-hover:translate-x-1" />
                  </a>

                  {/* Hotline Button */}
                  <a
                    href="tel:0988666888"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 [html[data-site-theme='midnight']_&]:bg-emerald-950/40 [html[data-site-theme='midnight']_&]:hover:bg-emerald-900/50 border border-emerald-200/80 [html[data-site-theme='midnight']_&]:border-emerald-800/80 text-emerald-800 [html[data-site-theme='midnight']_&]:text-emerald-300 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <PhoneCall className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold leading-none">Gọi Hotline Trực Tiếp</div>
                        <div className="text-[10px] text-emerald-600 [html[data-site-theme='midnight']_&]:text-emerald-400 font-extrabold mt-1">0988.666.888 (Miễn phí cuộc gọi)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-100 [html[data-site-theme='midnight']_&]:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cam kết hỗ trợ UltraViewer 1-1</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 [html[data-site-theme='midnight']_&]:bg-slate-800 px-1.5 py-0.5 rounded font-mono">24/7</span>
                </div>
              </div>
            </div>
          )}

          {/* Nút Kích Hoạt Mở/Đóng Box Chat (Live Chat Floating Button) */}
          <div className="relative group flex items-center justify-center">
            {/* Tooltip hiển thị bên trái khi hover */}
            {!isChatBoxOpen && (
              <span className="hidden sm:inline-block absolute right-full mr-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 whitespace-nowrap bg-slate-900/95 text-white text-xs font-semibold py-1 px-2.5 rounded-lg shadow-lg border border-slate-700/80">
                💬 Chat hỗ trợ trực tuyến
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
              aria-label={isChatBoxOpen ? 'Đóng box chat hỗ trợ' : 'Mở box chat hỗ trợ trực tuyến'}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 cursor-pointer relative ${
                isChatBoxOpen
                  ? 'bg-slate-800 text-white hover:bg-slate-700 rotate-90 shadow-slate-900/20'
                  : 'bg-gradient-to-tr from-[#0078FF] via-[#00B2FE] to-[#8E2DE2] text-white hover:scale-105 hover:-translate-y-0.5 shadow-blue-500/35 hover:shadow-blue-500/50 border border-white/25'
              }`}
            >
              {/* Chấm xanh trạng thái trực tuyến */}
              {!isChatBoxOpen && (
                <>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white [html[data-site-theme='midnight']_&]:ring-slate-900 animate-ping pointer-events-none" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white [html[data-site-theme='midnight']_&]:ring-slate-900 pointer-events-none shadow-xs" />
                </>
              )}

              {isChatBoxOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <MessageCircle className="w-5 h-5 text-white drop-shadow-xs" />
              )}
            </button>
          </div>
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
