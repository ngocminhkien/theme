'use client';

import React from 'react';
import { ShieldCheck, Zap, Code2, Gift, Headphones } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: '100% Bản Quyền Sạch',
    desc: 'Không virus, quét VirusTotal, chuẩn Core Web Vitals',
    color: 'text-brand-600 bg-brand-50 border-brand-200',
  },
  {
    icon: Zap,
    title: 'Kích Hoạt VietQR 30 Giây',
    desc: 'Quét mã nhận link tải & License Key tự động 24/7',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    icon: Code2,
    title: 'Tối Ưu SEO & Tốc Độ 99+',
    desc: 'Tải trang dưới 0.8s, đạt chuẩn Google PageSpeed xanh',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    icon: Gift,
    title: 'Tặng Kèm Bộ Plugin Pro',
    desc: 'Elementor Pro, Rank Math SEO, WP Rocket miễn phí',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  {
    icon: Headphones,
    title: 'Cài Đặt Demo 1-Click 24/7',
    desc: 'Hỗ trợ UltraViewer, AnyDesk & Zalo trọn đời',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
];

export function MarqueeFeatures() {
  return (
    <div className="py-4 px-2 sm:px-4 mb-4 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                data-reveal="fade-up"
                style={{ transitionDelay: `${idx * 70}ms` }}
                className="cyber-card rounded-2xl p-5 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 group cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition duration-300 ${feat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-white group-hover:text-cyan-300 transition leading-snug">
                    {feat.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
