'use client';

import React from 'react';
import { Tag, ShieldCheck, Zap, CreditCard, Headphones, Sparkles, Code2 } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: '100% Bản Quyền Chính Hãng',
    desc: 'Code sạch chuẩn Core Web Vitals, bảo mật',
    color: 'text-brand-600 bg-brand-50 border-brand-100',
  },
  {
    icon: Zap,
    title: 'Kích Hoạt Tức Thì 24/7',
    desc: 'Nhận License Key và source ZIP tự động',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    icon: Code2,
    title: 'Chuẩn SEO & Tốc Độ Siêu Nhanh',
    desc: 'Điểm Google PageSpeed 99+ trên di động',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    icon: CreditCard,
    title: 'Thanh Toán VietQR Tiện Lợi',
    desc: 'Quét mã xác nhận tự động chỉ sau 3 giây',
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  },
  {
    icon: Headphones,
    title: 'Hỗ Trợ Kỹ Thuật Chuyên Sâu',
    desc: 'Đội ngũ WordPress Dev hỗ trợ trọn đời',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
];

export function MarqueeFeatures() {
  return (
    <div className="py-4 px-4 mb-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 group"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300 ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-brand-600 transition leading-snug">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
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
