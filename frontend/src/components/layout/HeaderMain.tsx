'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Layers,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  User,
  UserRound,
  Menu,
  Phone,
  Flame,
  LayoutGrid,
} from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';
import { THEMES_DATA, CATEGORIES_LIST } from '@/shared/data/themes-data';
import { ThemeSwitcherPill } from '@/components/layout/AmbientBackground';

export function HeaderMain() {
  const router = useRouter();
  const { items, currency, getTotal, openCart, isCartOpen } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close live search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered themes for live search popup
  const searchResults = THEMES_DATA.filter((theme) => {
    const matchCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    const matchQuery =
      theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.short_desc_vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.page_builders.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchQuery;
  }).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    if (searchTerm.trim()) {
      router.push(
        `/themes?search=${encodeURIComponent(searchTerm.trim())}${
          selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''
        }`
      );
    } else if (selectedCategory !== 'all') {
      router.push(`/themes?category=${selectedCategory}`);
    } else {
      router.push('/themes');
    }
  };

  const totalPrice = getTotal();
  const priceDisplay =
    currency === 'VND'
      ? `${totalPrice.toLocaleString('vi-VN')} ₫`
      : `$${totalPrice}`;

  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 transition-all duration-200 shadow-xs w-full">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 h-16 sm:h-20 lg:h-22 flex items-center justify-between gap-2.5 sm:gap-5">
        {/* Brand Logo - THEME STORE */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 group min-w-0">
          <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-all duration-300 relative shrink-0">
            <Layers className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="hidden xs:inline-block absolute -top-1.5 -right-2 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase rounded-full bg-rose-500 text-white shadow-xs border border-white whitespace-nowrap leading-none tracking-tight">
              CHÍNH HÃNG
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-lg xs:text-xl sm:text-3xl tracking-tight text-slate-900 group-hover:text-brand-600 transition truncate">
                THEME<span className="text-amber-500">STORE</span>
              </span>
              <span className="hidden xs:inline-block px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-black bg-brand-50 text-brand-700 border border-brand-200 shrink-0">
                PRO
              </span>
            </div>
            <span className="hidden sm:block text-xs font-bold tracking-tight text-slate-500 uppercase line-clamp-1">
              Thế giới Theme & Plugin WordPress bản quyền chính hãng
            </span>
          </div>
        </Link>

        {/* Center: Smart Search Bar with Category Selector & Live Search (Fuller fluid width) */}
        <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-3xl xl:max-w-4xl relative min-w-0">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-slate-100 hover:bg-slate-100/90 focus-within:bg-white rounded-2xl border-2 border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all duration-200 overflow-hidden shadow-xs"
          >
            {/* Category Dropdown */}
            <div className="relative border-r border-slate-200 shrink-0 bg-slate-50 hidden lg:block">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Chọn danh mục theme"
                className="appearance-none bg-transparent pl-4 pr-8 py-3.5 text-sm font-bold text-slate-700 outline-none cursor-pointer hover:text-brand-600 transition"
              >
                <option value="all">Tất cả ngành nghề</option>
                {CATEGORIES_LIST.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_vi}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input field */}
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Tìm theme theo tên, ngành nghề (Bán hàng, Bất động sản, Flatsome, WoodMart...)"
                className="w-full bg-transparent px-4 py-3 lg:py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none font-semibold min-w-0"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="mr-2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-5 lg:px-7 py-3 lg:py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 transition shrink-0 cursor-pointer shadow-xs"
              title="Tìm kiếm theme"
            >
              <Search className="w-4.5 h-4.5" />
              <span className="hidden lg:inline">Tìm Kiếm</span>
            </button>
          </form>

          {/* Live Search Popup Dropdown */}
          {showSearchDropdown && searchTerm.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-100">
                <span>Kết quả tìm kiếm phù hợp ({searchResults.length})</span>
                <span className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded font-extrabold">
                  Nhấn Enter để xem tất cả
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/theme/${item.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition group"
                    >
                      <img
                        src={item.thumbnail_url}
                        alt={item.name}
                        className="w-14 h-10 object-cover rounded-xl border border-slate-200 shrink-0 group-hover:scale-105 transition"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 truncate group-hover:text-brand-600 transition">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 font-black px-1.5 py-0.2 rounded shrink-0 border border-amber-200">
                            {item.discount_percent ? `-${item.discount_percent}%` : 'HOT'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.short_desc_vi}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-rose-600 block">
                          {currency === 'VND'
                            ? `${item.price_vnd.toLocaleString('vi-VN')} ₫`
                            : `$${item.price_usd}`}
                        </span>
                        {item.original_price_vnd && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {currency === 'VND'
                              ? `${item.original_price_vnd.toLocaleString('vi-VN')} ₫`
                              : `$${item.original_price_usd}`}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                  <div className="p-2 text-center bg-slate-50/50 rounded-b-xl">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg hover:bg-brand-50 transition cursor-pointer"
                    >
                      <span>Xem tất cả kết quả cho &quot;{searchTerm}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-xs text-slate-400">
                  Không tìm thấy theme nào khớp với từ khóa &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Mobile Search Toggle, Account Portal, Mini Cart & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            aria-label="Mở tìm kiếm"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>


          {/* Cart Button */}
          <button
            type="button"
            aria-label="Mở giỏ hàng"
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
            aria-controls="cart-drawer"
            onClick={openCart}
            className="flex items-center gap-2 sm:gap-3.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-brand-600 hover:to-indigo-600 text-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-glow transition-all duration-200 cursor-pointer group shrink-0 sm:min-w-[140px]"
            title="Mở giỏ hàng"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition text-white" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 sm:-top-2.5 sm:-right-2.5 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-xs">
                  {items.length}
                </span>
              )}
            </div>

            <div className="hidden xs:flex flex-col text-left whitespace-nowrap min-w-0 pr-0.5 sm:pr-1">
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium group-hover:text-white/90 leading-tight">
                Giỏ Hàng
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400 group-hover:text-white leading-tight tracking-tight mt-0.5">
                {priceDisplay}
              </span>
            </div>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            aria-label="Mở menu điều hướng"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Bar (< md) */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50/95 px-3 py-3 animate-in fade-in duration-150">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Chọn danh mục theme trên di động"
                className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-500 max-w-[140px] shrink-0"
              >
                <option value="all">Tất cả ngành</option>
                {CATEGORIES_LIST.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_vi}
                  </option>
                ))}
              </select>
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theme (WoodMart, Flatsome...)"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-500 font-semibold"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
              >
                Tìm
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer (< md) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[104px] z-50 md:hidden bg-slate-950/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-b border-slate-200 shadow-2xl max-h-[calc(100vh-104px)] overflow-y-auto px-4 py-5 space-y-5 animate-in slide-in-from-top-2 duration-200"
          >
            {/* Theme Atmosphere Selector Row on Mobile */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-700">Giao diện (Theme):</span>
              <ThemeSwitcherPill />
            </div>

            {/* Quick Account Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-brand-600 text-white text-xs font-extrabold shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Đăng Nhập / VIP</span>
              </Link>
              <Link
                href="/my-account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
              >
                <UserRound className="w-4 h-4 text-brand-600" />
                <span>Customer Portal</span>
              </Link>
            </div>

            {/* Main Navigation Links */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Điều hướng nhanh
              </div>
              <nav className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-brand-50 text-brand-700">
                  Trang Chủ
                </Link>
                <Link href="/themes" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50">
                  Kho Theme (Tất cả)
                </Link>
                <Link href="/themes?category=e-commerce" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50">
                  Theme Bán Hàng
                </Link>
                <Link href="/themes?category=corporate-b2b" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50">
                  Theme Doanh Nghiệp
                </Link>
                <Link href="/themes?builder=elementor" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50">
                  Elementor Pro
                </Link>
                <Link href="/themes?category=real-estate" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50">
                  Bất Động Sản
                </Link>
                <Link href="/themes?sort=featured" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50">
                  Theme Chuẩn SEO
                </Link>
                <Link href="/preview/woodmart" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Demo</span>
                </Link>
              </nav>
            </div>

            {/* Categories List */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                <LayoutGrid className="w-3.5 h-3.5 text-brand-600" />
                <span>Tất cả danh mục</span>
              </div>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                {CATEGORIES_LIST.map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.id === 'all' ? '/themes' : `/themes?category=${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span>{cat.name_vi}</span>
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Hotline & Flash Deal */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <a
                href="tel:0988666888"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Hotline/Zalo: 0988.666.888</span>
              </a>
              <Link
                href="/themes?deals=weekly"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-black"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Deal Giảm 35% Tuần Này</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
