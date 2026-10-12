'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Timer, ArrowRight, Zap, CheckCircle2, Sparkles, Gift, Flame, Phone } from 'lucide-react';

export function PromoDealBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-10 px-2 sm:px-4 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-brand-950 to-slate-900 text-white p-8 sm:p-12 xl:p-16 relative overflow-hidden shadow-2xl border border-slate-800">
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            {/* Left Text & Countdown */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-black uppercase tracking-wider mb-4">
                <Flame className="w-4.5 h-4.5 text-rose-400 animate-pulse" />
                <span>SIÊU SALE HÔM NAY • GIẢM ĐẾN 50%</span>
              </div>

              <h2 className="text-2xl sm:text-3xl xl:text-5xl font-black tracking-tight leading-tight mb-4">
                Trọn Bộ Theme WordPress Bản Quyền & Bộ Plugin Siêu Tốc Độ
              </h2>

              <p className="text-slate-300 text-sm sm:text-base xl:text-lg leading-relaxed mb-6 max-w-2xl font-normal">
                Cơ hội duy nhất trong ngày: Sở hữu theme WordPress bản quyền sạch 100%, tích hợp sẵn Elementor Pro, chuẩn Core Web Vitals xanh và quét mã VietQR tự động kích hoạt sau 30 giây.
              </p>

              {/* Countdown Glass Boxes */}
              <div className="flex items-center gap-2.5 sm:gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3.5 text-center min-w-16 sm:min-w-20 border border-white/10 shadow-lg">
                  <span className="block text-2xl sm:text-3xl xl:text-4xl font-black text-amber-400">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-300">Ngày</span>
                </div>
                <span className="text-2xl font-bold text-slate-400">:</span>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3.5 text-center min-w-16 sm:min-w-20 border border-white/10 shadow-lg">
                  <span className="block text-2xl sm:text-3xl xl:text-4xl font-black text-amber-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-300">Giờ</span>
                </div>
                <span className="text-2xl font-bold text-slate-400">:</span>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3.5 text-center min-w-16 sm:min-w-20 border border-white/10 shadow-lg">
                  <span className="block text-2xl sm:text-3xl xl:text-4xl font-black text-amber-400">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-300">Phút</span>
                </div>
                <span className="text-2xl font-bold text-slate-400">:</span>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3.5 text-center min-w-16 sm:min-w-20 border border-white/10 shadow-lg">
                  <span className="block text-2xl sm:text-3xl xl:text-4xl font-black text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-300">Giây</span>
                </div>
              </div>

              {/* Flash Sale Progress Bar */}
              <div className="mb-8 max-w-lg">
                <div className="flex items-center justify-between text-sm sm:text-base font-bold text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <Flame className="w-4.5 h-4.5 fill-rose-400" />
                    <span>Đã bán: 86 / 100 suất ưu đãi</span>
                  </span>
                  <span className="text-amber-400 font-extrabold">Chỉ còn 14 suất</span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/80 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 transition-all duration-500 shadow-sm"
                    style={{ width: '86%' }}
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/themes?deals=weekly"
                  className="px-9 py-4.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-black uppercase tracking-wider shadow-glow transition hover:scale-105 flex items-center gap-2"
                >
                  <span>Săn Deal Ngay - Giảm 50%</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>

                <a
                  href="https://zalo.me/0988666888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold uppercase tracking-wider border border-white/15 transition backdrop-blur-md flex items-center gap-2"
                >
                  <Phone className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Nhận Tư Vấn Zalo</span>
                </a>
              </div>
            </div>

            {/* Right Highlights & Value Propositions */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 space-y-4">
              <h4 className="font-black text-lg sm:text-xl text-white tracking-tight flex items-center gap-2.5">
                <Gift className="w-5.5 h-5.5 text-amber-400" />
                <span>Quà Tặng Kèm Trị Giá 2.500.000₫</span>
              </h4>

              <div className="space-y-4 text-sm sm:text-base text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Tặng Plugin Elementor Pro:</strong> Bản quyền cập nhật tự động trị giá 990.000₫.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Tặng Plugin Rank Math Pro SEO:</strong> Tối ưu bài viết và từ khóa lên TOP Google nhanh chóng.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Tặng Plugin WP Rocket Cache:</strong> Tăng tốc website tải trang dưới 0.8 giây, PageSpeed 99+.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Cài Đặt Demo 1-Click Miễn Phí:</strong> Kỹ thuật viên hỗ trợ cài đặt giao diện chuẩn demo qua UltraViewer.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Bảo Hành Bản Quyền Trọn Đời:</strong> Hoàn tiền 100% nếu phát hiện mã độc hoặc file không hoạt động.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
