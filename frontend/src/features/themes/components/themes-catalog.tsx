'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  Grid,
  List,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Check,
  Eye,
  ShoppingBag,
  Sparkles,
  X,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { THEMES_DATA, CATEGORIES_LIST, BUILDERS_LIST, PRICE_RANGES } from '@/shared/data/themes-data';
import { ThemeCard } from './theme-card';
import { useCartStore } from '@/shared/stores/cart.store';
import { ThemeItem } from '@/shared/types';
import Link from 'next/link';

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
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/themes?${params.toString()}`);
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
      if (selectedCategory !== 'all' && theme.category !== selectedCategory) {
        return false;
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

  return (
    <div className="py-8 px-2 sm:px-4 w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header (No Breadcrumb for Clean & Airy Storefront) */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight">
                Kho Giao Diện Website & Plugin WordPress Bản Quyền
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">
                Hiển thị <strong>{filteredThemes.length} / {THEMES_DATA.length}</strong> mẫu theme bản quyền sạch 100%, chuẩn SEO, tải siêu tốc và tương thích hoàn hảo Elementor Pro.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Horizontal Scrollable Category Pills Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    updateQueryParams({ category: cat.id });
                  }}
                  className={`px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                  }`}
                >
                  <span>{cat.name_vi}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Sleek Filter Toolbar (Search + Builder + Price + Sort + View) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                updateQueryParams({ search: e.target.value });
              }}
              placeholder="Lọc nhanh theo tên theme, builder..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-8 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-500 transition font-semibold"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  updateQueryParams({ search: '' });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown Filters Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Page Builder Selector */}
            <div className="relative">
              <select
                value={selectedBuilder}
                onChange={(e) => {
                  setSelectedBuilder(e.target.value);
                  updateQueryParams({ builder: e.target.value });
                }}
                aria-label="Chọn Page Builder"
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-8 text-sm font-bold text-slate-700 outline-none hover:bg-slate-100 focus:border-brand-500 transition cursor-pointer"
              >
                <option value="all">Mọi Page Builder</option>
                {BUILDERS_LIST.filter(b => b.id !== 'all').map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Selector */}
            <div className="relative">
              <select
                value={selectedPrice}
                onChange={(e) => {
                  setSelectedPrice(e.target.value);
                  updateQueryParams({ price: e.target.value });
                }}
                aria-label="Chọn khoảng giá"
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-8 text-sm font-bold text-slate-700 outline-none hover:bg-slate-100 focus:border-brand-500 transition cursor-pointer"
              >
                <option value="all">Mọi mức giá</option>
                {PRICE_RANGES.filter(p => p.id !== 'all').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name_vi}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateQueryParams({ sort: e.target.value });
                }}
                aria-label="Sắp xếp kết quả"
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-8 text-sm font-bold text-slate-700 outline-none hover:bg-slate-100 focus:border-brand-500 transition cursor-pointer"
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới cập nhật</option>
                <option value="price-low">Giá: Thấp đến cao</option>
                <option value="price-high">Giá: Cao đến thấp</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid / List) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => {
                  setViewMode('grid');
                  updateQueryParams({ view: 'grid' });
                }}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-brand-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Hiển thị dạng lưới"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setViewMode('list');
                  updateQueryParams({ view: 'list' });
                }}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-brand-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Hiển thị dạng danh sách"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition border border-rose-200 cursor-pointer"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Active Filters Pill Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-slate-400 font-bold">Đang lọc:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
                <span>Từ khóa: &quot;{searchTerm}&quot;</span>
                <button
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 font-bold border border-brand-200">
                <span>Ngành: {CATEGORIES_LIST.find(c => c.id === selectedCategory)?.name_vi}</span>
                <button
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
            {selectedBuilder !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
                <span>Builder: {BUILDERS_LIST.find(b => b.id === selectedBuilder)?.name}</span>
                <button
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

        {/* 4. Results List / Grid */}
        {filteredThemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1.5">Không tìm thấy giao diện phù hợp</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Vui lòng thử thay đổi từ khóa hoặc xóa bớt tiêu chí lọc để xem thêm các mẫu theme khác tại Theme Store.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-7 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-sm font-black uppercase tracking-wider transition shadow-glow cursor-pointer"
            >
              Đặt Lại Tất Cả Bộ Lọc
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 group"
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
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <span className="font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200/60">
                        {theme.category_name_vi}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-slate-800">{theme.rating_avg}</span>
                        <span className="text-slate-400">({theme.total_sales} đã bán)</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-bold">{theme.page_builders}</span>
                    </div>

                    <h3 className="font-black text-lg text-slate-900 group-hover:text-brand-600 transition mb-2">
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

                  <div className="w-full md:w-auto shrink-0 flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-rose-600">{currentPrice}</span>
                        {originalPrice && (
                          <span className="text-sm text-slate-400 line-through font-medium">
                            {originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="block text-xs text-emerald-600 font-bold mt-0.5">Bản quyền trọn đời</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/preview/${theme.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 text-sm font-bold transition whitespace-nowrap leading-normal"
                      >
                        <Eye className="w-4 h-4 shrink-0" />
                        <span>Xem Demo</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => addItem(theme)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-bold transition shadow-xs cursor-pointer whitespace-nowrap leading-normal"
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
      </div>
    </div>
  );
}
