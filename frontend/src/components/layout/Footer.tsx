'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutTemplate, Mail, Phone, MapPin, Send, ShieldCheck, RefreshCw, Headphones, Sparkles, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Top Banner Ribbon: Modern SaaS Gradient Strip */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-900 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-5 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>Ưu Đãi Thành Viên Mới</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">
                Nhận Mã Giảm Giá 20% & Bộ Plugin Bản Quyền
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-1">
                Đăng ký nhận bản tin phát hành theme mới, cập nhật Core Web Vitals và khuyến mãi độc quyền.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Cảm ơn bạn đã đăng ký nhận bản tin công nghệ của THEMESTORE!');
            }}
            className="flex w-full lg:w-auto max-w-md bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl"
          >
            <input
              type="email"
              required
              placeholder="Nhập địa chỉ email của bạn..."
              className="px-4 py-2.5 text-xs md:text-sm text-white outline-none flex-1 bg-transparent placeholder:text-white/60 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-brand-700 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Đăng Ký</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center text-white shadow-glow">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tight leading-none">
                  THEME<span className="text-brand-400">STORE</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                  Digital Theme Marketplace
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Sàn thương mại điện tử giao diện website & template bản quyền số 1. Tối ưu tốc độ Google PageSpeed 99+, chuẩn SEO và tự động cấp License Key 24/7.
            </p>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Tòa nhà TechCenter, Nam Từ Liêm, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Hotline: 1900 6868 (8:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@themestore.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Danh Mục Theme Phổ Biến
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/themes?category=e-commerce" className="hover:text-brand-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Thương Mại Điện Tử & Bán Hàng
                </Link>
              </li>
              <li>
                <Link href="/themes?category=corporate-b2b" className="hover:text-brand-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Doanh Nghiệp & Dịch Vụ
                </Link>
              </li>
              <li>
                <Link href="/themes?category=portfolio-agency" className="hover:text-brand-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Portfolio & Sáng Tạo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Hỗ Trợ & Bản Quyền
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/themes" className="hover:text-brand-400 transition">
                  Hướng Dẫn Cài Đặt Theme 1-Click
                </Link>
              </li>
              <li>
                <Link href="/themes" className="hover:text-brand-400 transition">
                  Chính Sách Hoàn Tiền Trong 7 Ngày
                </Link>
              </li>
              <li>
                <Link href="/themes" className="hover:text-brand-400 transition">
                  Quy Định Cấp Phép Bản Quyền (License)
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-brand-400 transition">
                  Tra Cứu Đơn Hàng & Kích Hoạt Key
                </Link>
              </li>
              <li>
                <Link href="/themes" className="hover:text-brand-400 transition">
                  Tài Liệu API Dành Cho Developers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Commitments & Trust */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Cam Kết Tiêu Chuẩn
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-white">100% Code Sạch & Bản Quyền</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Không mã độc, bảo mật chuẩn doanh nghiệp.</p>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-white">Cập Nhật Trọn Đời</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Nhận bản vá bảo mật và tính năng mới nhất.</p>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <Headphones className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-white">Hỗ Trợ Kỹ Thuật 24/7</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Senior WordPress Developer đồng hành xử lý.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="border-t border-slate-900 py-6 px-4 text-xs text-slate-400 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 THEMESTORE Marketplace Platform. Nền tảng giao diện web chuẩn công nghệ cao cấp.</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Bảo chứng thanh toán:</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-blue-400">VietQR 24/7</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-indigo-400">Stripe</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-cyan-400">PayPal</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-rose-400">MasterCard</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-blue-300">VISA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
