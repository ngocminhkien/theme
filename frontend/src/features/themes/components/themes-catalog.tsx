'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Grid,
  List,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Eye,
  ShoppingBag,
  Sparkles,
  X,
  Layers,
  ShieldCheck,
  Building2,
  Palette,
  LayoutGrid,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { THEMES_DATA, BUILDERS_LIST, PRICE_RANGES } from '@/shared/data/themes-data';
import { ThemeCard } from './theme-card';
import { ThemeCardSkeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/shared/stores/cart.store';
import Link from 'next/link';

export const STORE_CATEGORIES = [
  { id: 'all', name_vi: 'Tất Cả Danh Mục', count: 10, icon: LayoutGrid },
  { id: 'e-commerce', name_vi: 'Thương Mại Điện Tử & Bán Lẻ', count: 4, icon: ShoppingBag },
  { id: 'corporate-b2b', name_vi: 'Doanh Nghiệp & Dịch Vụ', count: 5, icon: Building2 },
  { id: 'landing-page', name_vi: 'Landing Page & Trang Đích', count: 6, icon: Layers },
  { id: 'portfolio-agency', name_vi: 'Portfolio & Sáng Tạo', count: 1, icon: Palette },
];

export const PRICE_FILTER_OPTIONS = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-500k', label: 'Dưới 500.000 ₫' },
  { id: '500k-700k', label: '500.000 ₫ - 700.000 ₫' },
  { id: 'above-700k', label: 'Trên 700.000 ₫' },
];

export const POPULAR_BUILDERS = [
  { id: 'all', name: 'Tất cả Builder' },
  { id: 'elementor', name: 'Elementor Pro' },
  { id: 'ux builder', name: 'UX Builder (Flatsome)' },
  { id: 'divi builder', name: 'Divi Builder' },
  { id: 'wpbakery', name: 'WPBakery' },
  { id: 'gutenberg', name: 'Gutenberg' },
  { id: 'avada builder', name: 'Avada Builder' },
  { id: 'bebuilder', name: 'BeBuilder' },
];

export function ThemesCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currency = useCartStore((state) => state.currency);
  const addItem = useCartStore((state) => state.addItem);

  // Read URL query params
  const paramSearch = searchParams.get('search') || '';
  const paramCategory = searchParams.get('category') || 'all';
  const paramBuilder = searchParams.get('builder') || 'all';
  const paramPrice = searchParams.get('price') || 'all';
  const paramSort = searchParams.get('sort') || 'featured';
  const paramView = searchParams.get('view') || 'grid';

  // State
  const [searchTerm, setSearchTerm] = useState(paramSearch);
  const [selectedCategory, setSelectedCategory] = useState(paramCategory);
  const [selectedBuilder, setSelectedBuilder] = useState(paramBuilder);
  const [selectedPrice, setSelectedPrice] = useState(paramPrice);
  const [sortBy, setSortBy] = useState(paramSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>((paramView as 'grid' | 'list') || 'grid');
  const [isFiltering, setIsFiltering] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSearchTerm(paramSearch);
    setSelectedCategory(paramCategory);
    setSelectedBuilder(paramBuilder);
    setSelectedPrice(paramPrice);
    setSortBy(paramSort);
    if (paramView === 'grid' || paramView === 'list') {
      setViewMode(paramView);
    }
  }, [paramSearch, paramCategory, paramBuilder, paramPrice, paramSort, paramView]);

  // Update URL params whenever filters change
  const updateQueryParams = (updates: Record<string, string>) => {
    setIsFiltering(true);
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/themes?${params.toString()}`);
    setTimeout(() => {
      setIsFiltering(false);
    }, 180);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBuilder('all');
    setSelectedPrice('all');
    setSortBy('featured');
    router.push('/themes');
  };

  // Filter & Sort Logic
  const filteredThemes = useMemo(() => {
    return THEMES_DATA.filter((theme) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = theme.name.toLowerCase().includes(query);
        const matchesDesc = theme.short_desc_vi.toLowerCase().includes(query);
        const matchesBuilder = theme.page_builders.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBuilder) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'landing-page') {
          const isLandingTheme =
            theme.category === 'portfolio-agency' ||
            theme.name.toLowerCase().includes('landing') ||
            theme.short_desc_vi.toLowerCase().includes('landing') ||
            theme.page_builders.toLowerCase().includes('elementor') ||
            theme.page_builders.toLowerCase().includes('divi builder');
          if (!isLandingTheme) return false;
        } else if (theme.category !== selectedCategory) {
          return false;
        }
      }

      // Builder
      if (selectedBuilder !== 'all' && !theme.page_builders.toLowerCase().includes(selectedBuilder.toLowerCase())) {
        return false;
      }

      // Price
      if (selectedPrice !== 'all') {
        const range = PRICE_RANGES.find((p) => p.id === selectedPrice);
        if (range) {
          if (currency === 'VND') {
            if (theme.price_vnd < range.min_vnd || theme.price_vnd > range.max_vnd) return false;
          } else {
            if (theme.price_usd < range.min_usd || theme.price_usd > range.max_usd) return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return currency === 'VND' ? a.price_vnd - b.price_vnd : a.price_usd - b.price_usd;
      }
      if (sortBy === 'price-high') {
        return currency === 'VND' ? b.price_vnd - a.price_vnd : b.price_usd - a.price_usd;
      }
      if (sortBy === 'rating') {
        return b.rating_avg - a.rating_avg;
      }
      if (sortBy === 'newest') {
        return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
      }
      // 'featured'
      return (b.badge === 'HOT' ? 1 : 0) - (a.badge === 'HOT' ? 1 : 0);
    });
  }, [searchTerm, selectedCategory, selectedBuilder, selectedPrice, sortBy, currency]);

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategory !== 'all' ||
    selectedBuilder !== 'all' ||
    selectedPrice !== 'all';

  // Render Sidebar Content (shared between Desktop Sidebar and Mobile Drawer)
  const renderFilterWidgets = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4.5 h-4.5 text-blue-600" />
          <span className="text-sm font-black text-slate-900 uppercase tracking-wider">
            BỘ LỌC TÌM KIẾM
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      {/* Widget 1: Danh Mục Sản Phẩm (Categories) */}
      <div>
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Danh Mục Giao Diện</span>
        </h3>
        <div className="space-y-1">
          {STORE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  updateQueryParams({ category: cat.id });
                  setMobileFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-extrabold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate">{cat.name_vi}</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums shrink-0 ml-2 ${
                  isActive ? 'bg-blue-200/70 text-blue-900' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget 2: Mức Giá (Price Ranges) */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
          Khoảng Giá
        </h3>
        <div className="space-y-1.5">
          {PRICE_FILTER_OPTIONS.map((p) => {
            const isChecked = selectedPrice === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPrice(p.id);
                  updateQueryParams({ price: p.id });
                  setMobileFilterOpen(false);
                }}
                className="w-full flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer hover:text-blue-600 py-1 text-left"
              >
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                  isChecked ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                }`}>
                  {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span className={isChecked ? 'font-bold text-blue-700' : ''}>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget 3: Page Builder */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
          Page Builder
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_BUILDERS.map((b) => {
            const isActive = selectedBuilder === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBuilder(b.id);
                  updateQueryParams({ builder: b.id });
                  setMobileFilterOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget 4: Cam Kết Bản Quyền */}
      <div className="pt-3 border-t border-slate-100">
        <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-xl border border-blue-200/80 text-left">
          <div className="flex items-center gap-1.5 text-xs font-black text-blue-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Bản Quyền Sạch</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Mã nguồn gốc từ tác giả chính hãng, quét sạch VirusTotal, kích hoạt bản quyền tự động qua VietQR sau 30 giây.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6 sm:py-8 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-12">
        {/* Page Header & Breadcrumbs */}
        <div className="mb-6 sm:mb-8 pb-4 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                <Link href="/" className="hover:text-blue-600 transition">Trang Chủ</Link>
                <span>/</span>
                <span className="text-slate-700 font-extrabold">Kho Giao Diện</span>
                {selectedCategory !== 'all' && (
                  <>
                    <span>/</span>
                    <span className="text-blue-600 font-extrabold">
                      {STORE_CATEGORIES.find((c) => c.id === selectedCategory)?.name_vi || selectedCategory}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {selectedCategory === 'landing-page'
                  ? 'Theme WordPress Landing Page & Sáng Tạo'
                  : selectedCategory === 'e-commerce'
                  ? 'Theme WordPress Thương Mại Điện Tử & Bán Hàng'
                  : selectedCategory === 'corporate-b2b'
                  ? 'Theme WordPress Doanh Nghiệp & Dịch Vụ B2B'
                  : 'Kho Giao Diện Website & Plugin WordPress Bản Quyền'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                {selectedCategory === 'landing-page' ? (
                  <>Hiển thị <strong>{filteredThemes.length}</strong> mẫu theme Landing Page chuyển đổi cao, tối ưu tốc độ và tương thích hoàn hảo mọi Page Builder.</>
                ) : (
                  <>Hiển thị <strong>{filteredThemes.length} / {THEMES_DATA.length}</strong> mẫu theme bản quyền sạch 100%, chuẩn SEO, tải siêu tốc và kích hoạt tự động qua VietQR 24/7.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Shop Layout */}
        <div className="flex flex-col lg:flex-row gap-7 xl:gap-8 items-start">
          {/* ========================================================
              LEFT SIDEBAR: E-COMMERCE FILTERS (GIỐNG CÁC SHOP THẬT)
              ======================================================== */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              {renderFilterWidgets()}
            </div>
          </aside>

          {/* ========================================================
              RIGHT MAIN CONTENT: TOOLBAR + RESULTS GRID
              ======================================================== */}
          <main className="flex-1 min-w-0 w-full">
            {/* Top Control Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-xs mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Mobile Filter Toggle Button (< lg) */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold border border-blue-200 transition cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Mở Bộ Lọc Sản Phẩm</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateQueryParams({ search: e.target.value });
                  }}
                  placeholder="Tìm theme theo tên, builder..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 transition font-semibold"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      updateQueryParams({ search: '' });
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Right Toolbar Controls (Sort + View Mode) */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      updateQueryParams({ sort: e.target.value });
                    }}
                    aria-label="Sắp xếp kết quả"
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-slate-700 outline-none hover:bg-slate-100 focus:border-blue-500 transition cursor-pointer"
                  >
                    <option value="featured">Nổi bật nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="newest">Mới cập nhật</option>
                    <option value="price-low">Giá: Thấp đến cao</option>
                    <option value="price-high">Giá: Cao đến thấp</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('grid');
                      updateQueryParams({ view: 'grid' });
                    }}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Xem dạng lưới"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('list');
                      updateQueryParams({ view: 'list' });
                    }}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Xem dạng danh sách"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
                <span className="text-slate-400 font-bold">Đang lọc:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    <span>Từ khóa: &quot;{searchTerm}&quot;</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        updateQueryParams({ search: '' });
                      }}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    <span>
                      Danh mục: {STORE_CATEGORIES.find((c) => c.id === selectedCategory)?.name_vi || selectedCategory}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('all');
                        updateQueryParams({ category: 'all' });
                      }}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPrice !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    <span>Giá: {PRICE_FILTER_OPTIONS.find((p) => p.id === selectedPrice)?.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPrice('all');
                        updateQueryParams({ price: 'all' });
                      }}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBuilder !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    <span>Builder: {POPULAR_BUILDERS.find((b) => b.id === selectedBuilder)?.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBuilder('all');
                        updateQueryParams({ builder: 'all' });
                      }}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results Grid / List */}
            {isFiltering ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 min-h-[420px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ThemeCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredThemes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1.5">Không tìm thấy giao diện phù hợp</h3>
                <p className="text-sm text-slate-500 mb-6 font-medium">
                  Vui lòng thử thay đổi từ khóa hoặc xóa bớt tiêu chí lọc để xem thêm các mẫu theme khác tại Theme Store.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  Đặt Lại Tất Cả Bộ Lọc
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredThemes.map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} currency={currency} />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredThemes.map((theme) => {
                  const currentPrice =
                    currency === 'VND'
                      ? `${theme.price_vnd.toLocaleString('vi-VN')} ₫`
                      : `$${theme.price_usd}`;

                  const originalPrice =
                    theme.original_price_vnd && theme.original_price_usd
                      ? currency === 'VND'
                        ? `${theme.original_price_vnd.toLocaleString('vi-VN')} ₫`
                        : `$${theme.original_price_usd}`
                      : null;

                  return (
                    <div
                      key={theme.id}
                      className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-6 group"
                    >
                      <div className="relative w-full md:w-72 h-44 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={theme.thumbnail_url}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          {theme.discount_percent && (
                            <span className="bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                              GIẢM {theme.discount_percent}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mb-2">
                          <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/60">
                            {theme.category_name_vi}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-slate-800">{theme.rating_avg}</span>
                            <span className="text-slate-400">({theme.total_sales} đã bán)</span>
                          </div>
                          <span className="text-slate-300 hidden sm:inline">•</span>
                          <span className="text-slate-600 font-bold">{theme.page_builders}</span>
                        </div>

                        <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition mb-2">
                          <Link href={`/theme/${theme.slug}`}>{theme.name}</Link>
                        </h3>

                        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 font-normal">
                          {theme.short_desc_vi}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-bold">
                          <span className="px-2.5 py-1 rounded bg-slate-100">WordPress 6.x</span>
                          <span className="px-2.5 py-1 rounded bg-slate-100">WooCommerce 9.x</span>
                          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700">PageSpeed 99+ Xanh</span>
                          <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700">VietQR 30s</span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto shrink-0 flex flex-col xs:flex-row md:flex-col items-stretch xs:items-center md:items-end justify-between gap-3 sm:gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-left md:text-right">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-black text-rose-600">{currentPrice}</span>
                            {originalPrice && (
                              <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                                {originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="block text-xs text-emerald-600 font-bold mt-0.5">Bản quyền trọn đời</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/preview/${theme.slug}`}
                            className="flex-1 xs:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4.5 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-bold transition whitespace-nowrap leading-normal"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                            <span>Xem Demo</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => addItem(theme)}
                            className="flex-1 xs:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer whitespace-nowrap leading-normal"
                          >
                            <ShoppingBag className="w-4 h-4 shrink-0" />
                            <span>Thêm Giỏ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================
          MOBILE FILTER DRAWER (SLIDE-OVER GIỐNG SHOPEE / TIKI)
          ======================================================== */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900 uppercase">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Bộ Lọc Sản Phẩm</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 flex-1 overflow-y-auto">
              {renderFilterWidgets()}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Đặt Lại
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
              >
                Xem {filteredThemes.length} Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemesCatalog;
