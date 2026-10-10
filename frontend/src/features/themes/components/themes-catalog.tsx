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
  ChevronRight,
  Eye,
  ShoppingBag,
  Sparkles,
  X,
  Layers,
  ArrowUpRight,
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
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <Link href="/" className="hover:text-brand-600 transition">Trang Chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700">Khám Phá Theme</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Kho Giao Diện Website Bản Quyền Chuẩn SEO
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Hiển thị {filteredThemes.length} / {THEMES_DATA.length} giao diện chuyên nghiệp tương thích WordPress, WooCommerce & Elementor.
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
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-glow'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <span>{cat.name_vi}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
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
              placeholder="Lọc nhanh theo tên theme, công nghệ..."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-500 transition font-medium"
            />
            {searchTerm && (
              <button
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

          {/* Dropdown Filters Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Page Builder Selector */}
            <div className="relative">
              <select
                value={selectedBuilder}
                onChange={(e) => {
                  setSelectedBuilder(e.target.value);
                  updateQueryParams({ builder: e.target.value });
                }}
                className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 pr-7 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 focus:border-brand-500 transition cursor-pointer"
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
                className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 pr-7 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 focus:border-brand-500 transition cursor-pointer"
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
                className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 pr-7 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 focus:border-brand-500 transition cursor-pointer"
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới cập nhật</option>
                <option value="price-low">Giá: Thấp đến cao</option>
                <option value="price-high">Giá: Cao đến thấp</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid / List) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => {
                  setViewMode('grid');
                  updateQueryParams({ view: 'grid' });
                }}
                className={`p-1.5 rounded-lg transition ${
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
                className={`p-1.5 rounded-lg transition ${
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-accent-rose hover:bg-rose-50 transition border border-rose-200 cursor-pointer"
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
            <span className="text-slate-400 font-semibold">Đang lọc:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                <span>Từ khóa: &quot;{searchTerm}&quot;</span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    updateQueryParams({ search: '' });
                  }}
                  className="hover:text-accent-rose"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 font-medium border border-brand-200">
                <span>Ngành: {CATEGORIES_LIST.find(c => c.id === selectedCategory)?.name_vi}</span>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    updateQueryParams({ category: 'all' });
                  }}
                  className="hover:text-accent-rose"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBuilder !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                <span>Builder: {BUILDERS_LIST.find(b => b.id === selectedBuilder)?.name}</span>
                <button
                  onClick={() => {
                    setSelectedBuilder('all');
                    updateQueryParams({ builder: 'all' });
                  }}
                  className="hover:text-accent-rose"
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
            <h3 className="text-lg font-black text-slate-900 mb-1">Không tìm thấy giao diện phù hợp</h3>
            <p className="text-xs text-slate-500 mb-6">
              Vui lòng thử thay đổi từ khóa hoặc xóa bớt tiêu chí lọc để xem thêm các mẫu theme khác.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-glow cursor-pointer"
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
                  ? `${theme.price_vnd.toLocaleString('vi-VN')} đ`
                  : `$${theme.price_usd}`;

              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 group"
                >
                  <div className="relative w-full md:w-64 h-40 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={theme.thumbnail_url}
                      alt={theme.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      {theme.discount_percent && (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                          -{theme.discount_percent}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-[11px] mb-1.5">
                      <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                        {theme.category_name_vi}
                      </span>
                      <div className="flex items-center gap-1 text-slate-500 font-semibold">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{theme.rating_avg}</span>
                        <span className="text-slate-400">({theme.total_sales} đã bán)</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">{theme.page_builders}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 hover:text-brand-600 transition mb-2">
                      <Link href={`/theme/${theme.slug}`}>{theme.name}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                      {theme.short_desc_vi}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100">WordPress 6.x</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100">WooCommerce 9.x</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100">Tối ưu Mobile 100%</span>
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-xl font-black text-brand-600">{currentPrice}</span>
                      <span className="block text-[10px] text-slate-400">Bản quyền trọn đời</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/preview/${theme.slug}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </Link>
                      <button
                        onClick={() => addItem(theme)}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
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
