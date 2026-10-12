'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Layers, ArrowUpRight } from 'lucide-react';

const CATEGORY_ITEMS = [
  {
    id: 'e-commerce',
    title: 'Thương Mại Điện Tử & Bán Lẻ',
    desc: 'WooCommerce shop, siêu thị điện máy & sàn đa người bán',
    count: '4 Theme',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Cửa Hàng Bán Lẻ', 'Siêu Thị Mega Store', 'Sàn Đa Người Bán', 'Thanh Toán VietQR'],
    tagColor: 'bg-brand-50 text-brand-600 border-brand-200',
  },
  {
    id: 'corporate-b2b',
    title: 'Doanh Nghiệp & Dịch Vụ',
    desc: 'Tập đoàn, công ty tư vấn tài chính & agency sáng tạo',
    count: '5 Theme',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Hồ Sơ Năng Lực B2B', 'Tư Vấn Tài Chính', 'Agency Marketing', 'Hồ Sơ Dự Án'],
    tagColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    id: 'portfolio-agency',
    title: 'Portfolio & Sáng Tạo',
    desc: 'Theme dựng portfolio, giới thiệu dịch vụ và website sáng tạo',
    count: '1 Theme',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    subcategories: ['Portfolio Cá Nhân', 'Agency Sáng Tạo', 'Visual Builder'],
    tagColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
];

export function PopularCategories() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Ngành Nghề Chuyên Biệt</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Danh Mục Giao Diện Website Phổ Biến
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Khám phá các mẫu giao diện được lập trình tối ưu theo từng quy chuẩn ngành kinh doanh.
            </p>
          </div>
          <Link
            href="/themes"
            className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition group self-start sm:self-auto"
          >
            <span>Xem Tất Cả Danh Mục</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Catalog-backed category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_ITEMS.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                  
                  {/* Top Badge: Theme Count */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black shadow-sm">
                      {cat.count}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-black text-base text-white tracking-tight leading-snug drop-shadow-sm">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="p-5">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {cat.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {cat.subcategories.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-5 pt-0">
                <Link
                  href={`/themes?category=${cat.id}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-brand-600 text-slate-700 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 group-hover:bg-brand-600 group-hover:text-white"
                >
                  <span>Khám phá ngành này</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
