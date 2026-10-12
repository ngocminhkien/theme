'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 w-full">
      {/* Top Banner Ribbon: Gradient Strip */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-slate-900 text-white py-12 px-4 relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-5 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <Sparkles className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider mb-1">
                <span>ƯU ĐÃI THÀNH VIÊN MỚI</span>
              </div>
              <h3 className="text-xl md:text-2xl xl:text-3xl font-black tracking-tight">
                Nhận Mã Giảm Thêm 20% & Bộ Plugin Pro Miễn Phí
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-1">
                Đăng ký email để nhận thông báo phát hành theme mới, cập nhật phiên bản và coupon giảm giá độc quyền.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Cảm ơn bạn đã đăng ký nhận bản tin khuyến mãi của THEME STORE!');
            }}
            className="flex w-full lg:w-auto max-w-md bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl"
          >
            <input
              type="email"
              required
              placeholder="Nhập địa chỉ email của bạn..."
              className="px-4 py-3 text-sm md:text-base text-white outline-none flex-1 bg-transparent placeholder:text-white/60 font-medium"
            />
            <button
              type="submit"
              className="px-7 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Đăng Ký</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-14">
          {/* Column 1: Brand Info */}
          <div>
            <Link href="/" className="flex items-center gap-3.5 mb-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-glow">
                <Layers className="w-6.5 h-6.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight leading-none">
                  THEME<span className="text-amber-400">STORE</span>
                </span>
                <span className="text-xs uppercase font-bold tracking-tight text-slate-400 mt-1">
                  Thế giới Theme & Plugin giá rẻ
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 font-normal">
              Nền tảng thương mại điện tử giao diện website & template WordPress bản quyền số 1 Việt Nam. Tối ưu tốc độ Google PageSpeed 99+, chuẩn SEO và kích hoạt tự động qua VietQR 24/7.
            </p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>Tòa nhà TechTower, Cầu Giấy, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>Hotline / Zalo: <strong className="text-white">0988.666.888</strong> (24/7)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>hotro@themestore.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h4 className="font-bold text-white text-base uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Danh Mục Theme WordPress
            </h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li>
                <Link href="/themes?category=e-commerce" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Theme Bán Hàng & WooCommerce
                </Link>
              </li>
              <li>
                <Link href="/themes?category=corporate-agency" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Doanh Nghiệp, B2B & Agency
                </Link>
              </li>
              <li>
                <Link href="/themes?category=tech-education" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Công Nghệ, SaaS & Khóa Học
                </Link>
              </li>
              <li>
                <Link href="/themes?category=real-estate" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Bất Động Sản & Xây Dựng
                </Link>
              </li>
              <li>
                <Link href="/themes?category=news-blog" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Tin Tức, Báo Chí & Tạp Chí
                </Link>
              </li>
              <li>
                <Link href="/themes?builder=elementor" className="hover:text-amber-400 transition flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Theme Tương Thích Elementor Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support & Policies */}
          <div>
            <h4 className="font-bold text-white text-base uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Chính Sách & Cam Kết
            </h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li>
                <Link href="/themes" className="hover:text-amber-400 transition flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Cam Kết 100% Code Sạch (Quét VirusTotal)
                </Link>
              </li>
              <li>
                <Link href="/themes" className="hover:text-amber-400 transition flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Chính Sách Hoàn Tiền 100% Nếu Lỗi
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-amber-400 transition flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Kích Hoạt Tự Động VietQR Trong 30 Giây
                </Link>
              </li>
              <li>
                <Link href="/themes" className="hover:text-amber-400 transition flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Dịch Vụ Cài Đặt Demo 1-Click Miễn Phí
                </Link>
              </li>
              <li>
                <Link href="/themes" className="hover:text-amber-400 transition flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Cập Nhật Phiên Bản Mới Trọn Đời
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods & Trust Badges */}
          <div>
            <h4 className="font-bold text-white text-base uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Thanh Toán & Bảo Mật
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Hỗ trợ thanh toán tự động qua cổng <strong>VietQR / SePay</strong> không cần chờ xác nhận thủ công, quét mã mở khóa License tức thì.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-center text-xs font-bold text-white">
                VietQR
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-center text-xs font-bold text-white">
                SePAY
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-center text-xs font-bold text-white">
                MBBank
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-center text-xs font-bold text-white">
                Visa / MC
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-center text-xs font-bold text-white">
                MoMo
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-center text-xs font-bold text-white">
                Stripe
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl">
              <Lock className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>Bảo mật chuẩn SSL 256-bit mã hóa</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <p>
            © 2026 <strong>THEMESTORE.VN</strong> - Thế giới Theme & Plugin WordPress bản quyền giá rẻ #1 Việt Nam. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-300 transition font-medium">Đăng Nhập</Link>
            <Link href="/register" className="hover:text-slate-300 transition font-medium">Đăng Ký</Link>
            <Link href="/themes" className="hover:text-slate-400 transition font-medium">Điều Khoản Dịch Vụ</Link>
            <Link href="/themes" className="hover:text-slate-400 transition font-medium">Chính Sách Bảo Mật</Link>
            <Link href="/checkout" className="hover:text-slate-400 transition font-medium">Kiểm Tra License</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
