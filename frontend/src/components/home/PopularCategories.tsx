'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShoppingBag,
  Building2,
  Home,
  Laptop,
  Newspaper,
  Layers,
} from 'lucide-react';

const CATEGORY_ITEMS = [
  {
    id: 'e-commerce',
    title: 'Bán Hàng & WooCommerce',
    desc: 'WooCommerce shop, siêu thị điện máy, thời trang & sàn đa người bán',
    count: '64 Theme',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    icon: ShoppingBag,
    subcategories: ['Siêu Thị Mega Store', 'Thời Trang', 'Điện Máy', 'VietQR'],
    badge: 'Phổ biến nhất',
  },
  {
    id: 'corporate-b2b',
    title: 'Doanh Nghiệp & Agency',
    desc: 'Tập đoàn, công ty tư vấn tài chính, luật & agency marketing',
    count: '52 Theme',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80',
    icon: Building2,
    subcategories: ['Hồ Sơ B2B', 'Tài Chính', 'Agency Sáng Tạo', 'Case Study'],
    badge: 'Chuẩn SEO',
  },
  {
    id: 'real-estate',
    title: 'Bất Động Sản & Nhà Đất',
    desc: 'Sàn môi giới nhà đất, dự án căn hộ, biệt thự & nhà thầu',
    count: '32 Theme',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80',
    icon: Home,
    subcategories: ['Chung Cư', 'Nhà Đất', 'Kiến Trúc', 'Sơ Đồ Tầng'],
    badge: 'Hot 2026',
  },
  {
    id: 'tech-education',
    title: 'Công Nghệ & Khóa Học',
    desc: 'SaaS landing page, phần mềm ứng dụng & cổng học trực tuyến LMS',
    count: '38 Theme',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80',
    icon: Laptop,
    subcategories: ['Landing Phần Mềm', 'Bảng Giá SaaS', 'Khóa Học LMS', 'App Di Động'],
    badge: 'Chuyển đổi cao',
  },
  {
    id: 'news-blog',
    title: 'Tin Tức, Báo Chí & Blog',
    desc: 'Trang tin tức đa chuyên mục, blog công nghệ, review & tạp chí',
    count: '28 Theme',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=500&q=80',
    icon: Newspaper,
    subcategories: ['Tạp Chí Hiện Đại', 'Blog Cá Nhân', 'Tin Tức Đa Cột', 'Google Ads'],
    badge: 'Tải nhanh',
  },
  {
    id: 'multipurpose-creative',
    title: 'Landing Page & Quảng Cáo',
    desc: 'Template chạy quảng cáo Facebook/TikTok Ads tỉ lệ chốt đơn cao',
    count: '45 Theme',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&q=80',
    icon: Layers,
    subcategories: ['1 Trang Landing', 'Flash Sale', 'Quảng Cáo', 'Elementor'],
    badge: 'Siêu tốc 0.6s',
  },
];

export function PopularCategories() {
  return (
    <section className="py-8 sm:py-10 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                DANH MỤC NGÀNH NGHỀ
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-slate-900 tracking-tight">
              Danh Mục Giao Diện Website Nổi Bật Nhất
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-xl font-medium">
              Tuyển tập hơn 500+ mẫu theme được tối ưu chuyên sâu theo từng đặc thù ngành nghề kinh doanh tại Việt Nam.
            </p>
          </div>
          <Link
            href="/themes"
            className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-black text-brand-600 hover:text-brand-700 transition group w-full sm:w-auto bg-brand-50 px-4.5 py-2.5 rounded-xl border border-brand-200"
          >
            <span>Xem Tất Cả 500+ Theme</span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* 6 Category Cards Grid: 1 col on mobile, 2 on sm, 3 on lg, 6 on 2xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORY_ITEMS.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                data-reveal="fade-up"
                style={{ transitionDelay: `${idx * 75}ms` }}
                className="wm-surface-card rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Banner with Overlay */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md text-brand-600 flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase shadow-xs animate-badge-float">
                        {cat.badge}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-black shadow-sm border border-white/20">
                        {cat.count}
                      </span>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-black text-lg text-white tracking-tight leading-snug drop-shadow-sm group-hover:text-amber-400 transition line-clamp-1">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body description & subcategories */}
                  <div className="p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3.5 font-normal">
                      {cat.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {cat.subcategories.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          href={`/themes?category=${cat.id}&search=${encodeURIComponent(sub)}`}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 text-[11px] sm:text-xs font-semibold transition-colors truncate max-w-full"
                          title={`Tìm kiếm theme ${sub}`}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1">
                  <Link
                    href={`/themes?category=${cat.id}`}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-100 hover:bg-brand-600 text-slate-800 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 group-hover:bg-slate-900 group-hover:text-white"
                  >
                    <span>Khám Phá Theme</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
