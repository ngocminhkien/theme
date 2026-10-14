'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutGrid,
  ChevronDown,
  ShoppingBag,
  Building2,
  Palette,
  Home,
  Newspaper,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CATEGORIES_LIST } from '@/shared/data/themes-data';

const NAV_LINKS = [
  { label: 'Trang Chủ', href: '/' },
  { label: 'Theme Bán Hàng', href: '/themes?category=e-commerce' },
  { label: 'Theme Doanh Nghiệp', href: '/themes?category=corporate-b2b' },
  { label: 'Landing Page', href: '/themes?category=landing-page' },
  { label: 'Bất Động Sản', href: '/themes?category=real-estate' },
  { label: 'Theme Chuẩn SEO', href: '/themes?sort=featured' },
];

const MEGA_MENU_CATEGORIES = [
  { id: 'all', name_vi: 'Tất Cả Danh Mục', count: 10 },
  { id: 'e-commerce', name_vi: 'Thương Mại Điện Tử & Bán Lẻ', count: 4 },
  { id: 'corporate-b2b', name_vi: 'Doanh Nghiệp & Dịch Vụ', count: 5 },
  { id: 'landing-page', name_vi: 'Landing Page & Trang Đích', count: 6 },
  { id: 'portfolio-agency', name_vi: 'Portfolio & Sáng Tạo', count: 1 },
];

interface CategoryConfig {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconText: string;
  iconBorder: string;
  iconHoverBg: string;
  iconHoverText: string;
  titleHoverText: string;
  itemHoverBg: string;
  itemHoverBorder: string;
  subtitle: string;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  all: {
    icon: LayoutGrid,
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-700',
    iconBorder: 'border-slate-200',
    iconHoverBg: 'group-hover:bg-slate-900',
    iconHoverText: 'group-hover:text-white',
    titleHoverText: 'group-hover:text-slate-900',
    itemHoverBg: 'hover:bg-slate-50',
    itemHoverBorder: 'hover:border-slate-200',
    subtitle: 'Toàn bộ kho theme & plugin bản quyền',
  },
  'e-commerce': {
    icon: ShoppingBag,
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    iconBorder: 'border-blue-200',
    iconHoverBg: 'group-hover:bg-blue-600',
    iconHoverText: 'group-hover:text-white',
    titleHoverText: 'group-hover:text-blue-600',
    itemHoverBg: 'hover:bg-blue-50/70',
    itemHoverBorder: 'hover:border-blue-200/80',
    subtitle: 'WoodMart, Flatsome, Shop bán hàng',
  },
  'corporate-b2b': {
    icon: Building2,
    iconBg: 'bg-indigo-50',
    iconText: 'text-indigo-600',
    iconBorder: 'border-indigo-200',
    iconHoverBg: 'group-hover:bg-indigo-600',
    iconHoverText: 'group-hover:text-white',
    titleHoverText: 'group-hover:text-indigo-600',
    itemHoverBg: 'hover:bg-indigo-50/70',
    itemHoverBorder: 'hover:border-indigo-200/80',
    subtitle: 'Avada, BeTheme, Doanh nghiệp B2B',
  },
  'landing-page': {
    icon: Layers,
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    iconBorder: 'border-emerald-200',
    iconHoverBg: 'group-hover:bg-emerald-600',
    iconHoverText: 'group-hover:text-white',
    titleHoverText: 'group-hover:text-emerald-600',
    itemHoverBg: 'hover:bg-emerald-50/70',
    itemHoverBorder: 'hover:border-emerald-200/80',
    subtitle: 'Divi, Astra, SaaS, Marketing chuyển đổi cao',
  },
  'portfolio-agency': {
    icon: Palette,
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600',
    iconBorder: 'border-purple-200',
    iconHoverBg: 'group-hover:bg-purple-600',
    iconHoverText: 'group-hover:text-white',
    titleHoverText: 'group-hover:text-purple-600',
    itemHoverBg: 'hover:bg-purple-50/70',
    itemHoverBorder: 'hover:border-purple-200/80',
    subtitle: 'Porto, Astra, Sáng tạo & Dịch vụ',
  },
  'real-estate': {
    icon: Home,
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
    iconBorder: 'border-amber-200',
    iconHoverBg: 'group-hover:bg-amber-600',
    iconHoverText: 'group-hover:text-white',
    titleHoverText: 'group-hover:text-amber-600',
    itemHoverBg: 'hover:bg-amber-50/70',
    itemHoverBorder: 'hover:border-amber-200/80',
    subtitle: 'Nhà đất, Villa, Booking bất động sản',
  },
  'blog-magazine': {
    icon: Newspaper,
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    iconBorder: 'border-emerald-200',
    iconHoverBg: 'group-hover:bg-emerald-600',
    iconHoverText: 'group-hover:text-white',
    titleHoverText: 'group-hover:text-emerald-600',
    itemHoverBg: 'hover:bg-emerald-50/70',
    itemHoverBorder: 'hover:border-emerald-200/80',
    subtitle: 'Tin tức, Báo chí điện tử chuẩn SEO',
  },
};

function HeaderNavbarLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (!pathname.startsWith('/themes')) {
      return false;
    }

    const [, query] = href.split('?');
    if (!query) {
      return pathname === '/themes' && (!searchParams || searchParams.toString() === '');
    }

    const params = new URLSearchParams(query);
    for (const [key, value] of params.entries()) {
      if (searchParams?.get(key) === value) {
        return true;
      }
    }
    return false;
  };

  return (
    <nav className="h-full flex items-center gap-5 lg:gap-8 text-sm lg:text-[15px] font-bold text-slate-900 overflow-x-auto no-scrollbar whitespace-nowrap min-w-0 flex-1 ml-4 lg:ml-6">
      {NAV_LINKS.map((item) => {
        const isActive = isLinkActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`h-full flex items-center transition-colors duration-150 border-b-[3px] px-1 ${
              isActive
                ? 'text-blue-600 font-black border-blue-600'
                : 'text-slate-900 hover:text-blue-600 font-bold border-transparent hover:border-blue-500/40'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/preview/woodmart"
        className={`h-full flex items-center gap-1.5 font-bold transition-colors border-b-[3px] px-1 ${
          pathname.startsWith('/preview')
            ? 'text-emerald-700 font-black border-emerald-600'
            : 'text-emerald-700 hover:text-emerald-800 border-transparent hover:border-emerald-500/40'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live Demo</span>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black tracking-wider uppercase ml-0.5">
          HOT
        </span>
      </Link>
    </nav>
  );
}

function HeaderNavbarLinksFallback() {
  const pathname = usePathname();
  return (
    <nav className="h-full flex items-center gap-5 lg:gap-8 text-sm lg:text-[15px] font-bold text-slate-900 overflow-x-auto no-scrollbar whitespace-nowrap min-w-0 flex-1 ml-4 lg:ml-6">
      {NAV_LINKS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`h-full flex items-center transition-colors duration-150 border-b-[3px] px-1 ${
            item.href === '/' && pathname === '/'
              ? 'text-blue-600 font-black border-blue-600'
              : 'text-slate-900 hover:text-blue-600 font-bold border-transparent hover:border-blue-500/40'
          }`}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/preview/woodmart"
        className="h-full flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold transition-colors border-b-[3px] border-transparent hover:border-emerald-500/40 px-1"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live Demo</span>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black tracking-wider uppercase ml-0.5">
          HOT
        </span>
      </Link>
    </nav>
  );
}

export function HeaderNavbar({ isScrolled = false }: { isScrolled?: boolean }) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  return (
    <div className="border-b border-slate-200/90 [html[data-site-theme='midnight']_&]:border-slate-800/90 hidden md:block relative z-20 w-full select-none h-13 bg-white/95 backdrop-blur-xl [html[data-site-theme='midnight']_&]:bg-slate-950/95 shadow-xs">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between h-full">
        {/* Left: All Categories Button with Flush Mega Menu (WoodMart Style) */}
        <div
          className="relative shrink-0 h-full flex items-center"
          onMouseEnter={() => setShowCategoryMenu(true)}
          onMouseLeave={() => setShowCategoryMenu(false)}
        >
          <button
            type="button"
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="h-full flex items-center gap-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs lg:text-[13px] uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            <LayoutGrid className="w-4.5 h-4.5" />
            <span>TẤT CẢ DANH MỤC</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showCategoryMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Mega Menu Dropdown */}
          {showCategoryMenu && (
            <div
              style={{ transformOrigin: 'top left' }}
              className="absolute top-full left-0 w-[560px] bg-white rounded-b-2xl shadow-2xl border border-slate-200 border-t-2 border-t-blue-600 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 grid grid-cols-1 gap-2"
            >
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider px-2 pb-2.5 border-b border-slate-200 flex items-center justify-between">
                <span>Chủ đề giao diện &amp; Plugin</span>
                <span className="text-blue-600 font-bold tabular-nums">500+ Theme có sẵn</span>
              </div>

              <div className="space-y-1 pt-1">
                {MEGA_MENU_CATEGORIES.map((cat) => {
                  const config = CATEGORY_CONFIGS[cat.id] || CATEGORY_CONFIGS.all;
                  const Icon = config.icon;

                  return (
                    <Link
                      key={cat.id}
                      href={cat.id === 'all' ? '/themes' : `/themes?category=${cat.id}`}
                      onClick={() => setShowCategoryMenu(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border border-transparent transition-all group wm-press-sm ${config.itemHoverBg} ${config.itemHoverBorder}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 shrink-0 shadow-2xs group-hover:scale-105 group-hover:shadow-xs ${config.iconBg} ${config.iconText} ${config.iconBorder} ${config.iconHoverBg} ${config.iconHoverText}`}
                        >
                          <Icon className="w-5 h-5 transition-colors shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`text-[13px] font-black text-slate-900 transition-colors ${config.titleHoverText}`}
                          >
                            {cat.name_vi}
                          </div>
                          <div className="text-xs text-slate-600 font-medium mt-0.5 truncate">
                            {config.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 group-hover:bg-white px-2.5 py-1 rounded-lg tabular-nums border border-slate-200/80 transition-colors shadow-2xs">
                          {cat.count} theme
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* VIP Banner inside mega menu */}
              <div className="mt-2.5 p-3.5 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border border-amber-300/60 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-amber-400/80 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm ring-2 ring-amber-300/40">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                      <span>Gói VIP All-Access</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-2xs">
                        HOT
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium truncate mt-0.5">
                      Tải không giới hạn 500+ theme &amp; plugin bản quyền
                    </div>
                  </div>
                </div>
                <Link
                  href="/themes?deals=weekly"
                  onClick={() => setShowCategoryMenu(false)}
                  className="text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 transition-all hover:gap-2 wm-press-sm"
                >
                  <span>Xem ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Center: Main Navigation Links with accurate Active Underline */}
        <Suspense fallback={<HeaderNavbarLinksFallback />}>
          <HeaderNavbarLinks />
        </Suspense>

        {/* Right: Promotion Deal Link */}
        <div className="hidden xl:flex items-center shrink-0">
          <Link
            href="/themes?deals=weekly"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 transition-all text-xs lg:text-[13px] font-extrabold tracking-tight wm-press-sm shadow-2xs"
          >
            <Tag className="w-3.5 h-3.5 text-rose-600" />
            <span>Ưu Đãi Tuần Này -35%</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeaderNavbar;
