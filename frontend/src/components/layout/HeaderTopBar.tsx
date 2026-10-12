'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ShieldCheck, HelpCircle, User, Sparkles } from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';

export function HeaderTopBar() {
  const { currency, setCurrency } = useCartStore();

  return (
    <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs hidden md:block">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
        {/* Left Information */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-brand-400" />
              <span>Catalog Theme 2026</span>
            </span>
            <span className="text-slate-400">Khám phá theme bản quyền đang phát hành</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 hover:text-white transition">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kích hoạt tự động 100% License chính hãng</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-5">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-800 rounded-full p-0.5 border border-slate-700/60">
            <button
              onClick={() => setCurrency('VND')}
              className={`px-2.5 py-0.5 rounded-full font-medium transition text-[11px] ${
                currency === 'VND'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Đổi sang tiền tệ Việt Nam Đồng"
            >
              ₫ VND
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-0.5 rounded-full font-medium transition text-[11px] ${
                currency === 'USD'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to US Dollar"
            >
              $ USD
            </button>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          {/* Quick links */}
          <Link href="/themes" className="flex items-center gap-1.5 text-slate-400 hover:text-brand-300 transition">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Trợ giúp & Tài liệu</span>
          </Link>

          <Link href="/checkout" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition">
            <User className="w-3.5 h-3.5" />
            <span>Tra Cứu License Key</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
