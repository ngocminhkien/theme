'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export function PromoDealBanner() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-slate-950 via-brand-950 to-slate-900 text-white p-8 md:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left catalog call-to-action */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-rose/20 text-rose-300 border border-accent-rose/30 text-xs font-black uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5 text-accent-rose" />
              <span>Catalog Theme Đang Phát Hành</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4">
              Khám Phá Theme WordPress & WooCommerce Bản Quyền
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-xl">
              Xem catalog hiện có, chọn theme phù hợp và kiểm tra giá Regular trực tiếp trước khi tạo đơn hàng.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/themes?sort=featured"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-accent-cyan hover:from-brand-600 hover:to-accent-cyan text-white text-xs font-black uppercase tracking-wider shadow-glow transition hover:scale-105 flex items-center gap-2"
              >
                <span>Khám Phá Theme</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/themes"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 transition backdrop-blur-md"
              >
                Xem Danh Sách Theme
              </Link>
            </div>
          </div>

          {/* Right Highlights & Value Propositions */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 space-y-4">
            <h4 className="font-black text-base text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Đặc Quyền Khi Mua Theme</span>
            </h4>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cấp License Key tự động và xác thực kích hoạt 1-click.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Nhận trọn bộ 100+ bản demo có sẵn nhập liệu nhanh.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Tương thích PHP 8.2+, WordPress 6.x & WooCommerce mới nhất.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Được hỗ trợ kỹ thuật cài đặt từ Senior WordPress Developer.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Cam kết hoàn tiền trong 7 ngày</span>
              <span className="text-white font-bold">100% An Toàn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
