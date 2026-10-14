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
  Lock,
  KeyRound,
  PackageCheck,
  ReceiptText,
  LogOut,
  ShieldCheck,
  Menu,
  Phone,
  Flame,
  LayoutGrid,
} from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';
import { THEMES_DATA, CATEGORIES_LIST } from '@/shared/data/themes-data';
import { ThemeSwitcherPill } from '@/components/layout/AmbientBackground';
import { getAuthToken, getCurrentUser, clearAuthToken, AuthUser } from '@/features/auth/auth-client';

export function HeaderMain({ isScrolled = false }: { isScrolled?: boolean }) {
  const router = useRouter();
  const { items, currency, openCart, isCartOpen } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleAccountMouseEnter = () => {
    if (!currentUser) return;
    if (accountMenuTimeoutRef.current) {
      clearTimeout(accountMenuTimeoutRef.current);
    }
    setAccountMenuOpen(true);
  };

  const handleAccountMouseLeave = () => {
    accountMenuTimeoutRef.current = setTimeout(() => {
      setAccountMenuOpen(false);
    }, 180);
  };

  const handleLogout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setAccountMenuOpen(false);
    window.location.href = '/login';
  };

  // Check auth session for account button
  useEffect(() => {
    if (getAuthToken()) {
      getCurrentUser().then(setCurrentUser).catch(() => null);
    }
  }, []);

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

  return (
    <div className="border-b border-slate-200/90 [html[data-site-theme='midnight']_&]:border-slate-800/90 relative z-40 w-full bg-white/95 backdrop-blur-xl [html[data-site-theme='midnight']_&]:bg-slate-950/95 shadow-2xs">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 h-16 sm:h-20 lg:h-22 flex items-center justify-between gap-2.5 sm:gap-5">
        {/* Brand Logo - THEME STORE */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 group min-w-0">
          <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-all duration-300 relative shrink-0">
            <Layers className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="hidden xs:inline-block absolute -top-1.5 -right-2 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase rounded-full bg-rose-500 text-white shadow-xs border border-white whitespace-nowrap leading-none tracking-tight">
              CHÍNH HÃNG
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-black text-lg xs:text-xl sm:text-2xl lg:text-3xl tracking-tight text-slate-900 [html[data-site-theme='midnight']_&]:text-white group-hover:text-blue-600 transition truncate">
              THEME<span className="text-amber-500">STORE</span>
            </span>
            <span className="hidden xs:inline-block px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 [html[data-site-theme='midnight']_&]:bg-cyan-500/15 [html[data-site-theme='midnight']_&]:text-cyan-300 [html[data-site-theme='midnight']_&]:border-cyan-500/30 shrink-0">
              PRO
            </span>
          </div>
        </Link>

        {/* Center: Smart Search Bar with Category Selector & Live Search (Fuller fluid width) */}
        <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-3xl xl:max-w-4xl relative min-w-0">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-slate-100 hover:bg-slate-100/90 focus-within:bg-white rounded-2xl border-2 border-slate-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all duration-200 overflow-hidden shadow-xs"
          >
            {/* Category Dropdown */}
            <div className="relative border-r border-slate-200 shrink-0 bg-slate-50 hidden lg:block">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Chọn danh mục theme"
                className="appearance-none bg-transparent pl-4 pr-8 py-3.5 text-sm font-bold text-slate-900 outline-none cursor-pointer hover:text-brand-600 transition"
              >
                <option value="all">Tất cả ngành nghề</option>
                {CATEGORIES_LIST.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_vi}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                className="w-full bg-transparent px-4 py-3 lg:py-3.5 text-sm text-slate-950 placeholder:text-slate-500 outline-none font-bold min-w-0"
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


          {/* Cart Icon Button (Giỏ hàng đưa sang trước, sau tìm kiếm) */}
          <button
            type="button"
            aria-label="Mở giỏ hàng"
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
            aria-controls="cart-drawer"
            onClick={openCart}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 relative shadow-md shadow-blue-500/20 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5 text-white transition-transform hover:scale-110" />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white [html[data-site-theme='midnight']_&]:border-slate-900 shadow-xs animate-in zoom-in-75">
                {items.length}
              </span>
            )}
          </button>

          {/* Account Icon Button with Smooth Hover Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleAccountMouseEnter}
            onMouseLeave={handleAccountMouseLeave}
          >
            <Link
              href={currentUser ? '/my-account' : '/login'}
              aria-label={currentUser ? `Tài khoản: ${currentUser.full_name}` : 'Đăng nhập tài khoản'}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border border-slate-200/90 [html[data-site-theme='midnight']_&]:border-slate-800 bg-slate-100/90 [html[data-site-theme='midnight']_&]:bg-slate-900/90 hover:bg-blue-50 [html[data-site-theme='midnight']_&]:hover:bg-slate-800 text-slate-700 [html[data-site-theme='midnight']_&]:text-slate-200 hover:text-blue-600 [html[data-site-theme='midnight']_&]:hover:text-cyan-300 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 shadow-2xs hover:shadow-xs hover:scale-105"
            >
              {currentUser ? (
                <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  {(currentUser.full_name || currentUser.email || 'U').charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5 transition-transform hover:scale-110" />
              )}
            </Link>

            {/* Hover Dropdown Menu: Chỉ hiển thị khi người dùng đã đăng nhập */}
            {accountMenuOpen && currentUser && (
              <div className="absolute right-0 top-full pt-2 w-72 sm:w-80 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                <div className="bg-white [html[data-site-theme='midnight']_&]:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18),0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 [html[data-site-theme='midnight']_&]:border-slate-800 p-2 text-slate-800 [html[data-site-theme='midnight']_&]:text-slate-100 overflow-hidden">
                  {/* User Info Header */}
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 [html[data-site-theme='midnight']_&]:from-slate-800/80 [html[data-site-theme='midnight']_&]:to-indigo-950/40 rounded-xl mb-1.5 border border-slate-100 [html[data-site-theme='midnight']_&]:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {(currentUser.full_name || currentUser.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 [html[data-site-theme='midnight']_&]:text-white truncate">
                          {currentUser.full_name || 'Khách hàng'}
                        </h4>
                        <p className="text-xs text-slate-500 [html[data-site-theme='midnight']_&]:text-slate-400 truncate">
                          {currentUser.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/80 text-blue-800 [html[data-site-theme='midnight']_&]:bg-blue-900/60 [html[data-site-theme='midnight']_&]:text-blue-300">
                          {currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.role === 'author' ? 'Tác giả VIP' : 'Khách hàng'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-0.5 py-1">
                    <Link
                      href="/my-account?tab=profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 [html[data-site-theme='midnight']_&]:hover:bg-slate-800 text-slate-700 [html[data-site-theme='midnight']_&]:text-slate-200 transition"
                    >
                      <UserRound className="w-4 h-4 text-blue-600 [html[data-site-theme='midnight']_&]:text-blue-400" />
                      <span>Thông tin cá nhân</span>
                    </Link>

                    <Link
                      href="/my-account?tab=password"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 [html[data-site-theme='midnight']_&]:hover:bg-slate-800 text-slate-700 [html[data-site-theme='midnight']_&]:text-slate-200 transition"
                    >
                      <Lock className="w-4 h-4 text-indigo-600 [html[data-site-theme='midnight']_&]:text-indigo-400" />
                      <span>Đổi mật khẩu</span>
                    </Link>

                    <Link
                      href="/my-account?tab=themes"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 [html[data-site-theme='midnight']_&]:hover:bg-slate-800 text-slate-700 [html[data-site-theme='midnight']_&]:text-slate-200 transition"
                    >
                      <PackageCheck className="w-4 h-4 text-emerald-600 [html[data-site-theme='midnight']_&]:text-emerald-400" />
                      <span>Theme đã mua & Tải về</span>
                    </Link>

                    <Link
                      href="/my-account?tab=licenses"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 [html[data-site-theme='midnight']_&]:hover:bg-slate-800 text-slate-700 [html[data-site-theme='midnight']_&]:text-slate-200 transition"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600 [html[data-site-theme='midnight']_&]:text-amber-400" />
                      <span>Quản lý License Bản quyền</span>
                    </Link>

                    <Link
                      href="/my-account?tab=orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 [html[data-site-theme='midnight']_&]:hover:bg-slate-800 text-slate-700 [html[data-site-theme='midnight']_&]:text-slate-200 transition"
                    >
                      <ReceiptText className="w-4 h-4 text-sky-600 [html[data-site-theme='midnight']_&]:text-sky-400" />
                      <span>Lịch sử đơn hàng</span>
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-50/70 hover:bg-blue-100 [html[data-site-theme='midnight']_&]:bg-blue-950/40 [html[data-site-theme='midnight']_&]:hover:bg-blue-900/50 text-blue-700 [html[data-site-theme='midnight']_&]:text-blue-300 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Trang Quản Trị Hệ Thống (Admin)</span>
                      </Link>
                    )}
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1 mt-1 border-t border-slate-100 [html[data-site-theme='midnight']_&]:border-slate-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg text-rose-600 hover:bg-rose-50 [html[data-site-theme='midnight']_&]:hover:bg-rose-950/30 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                <Link href="/themes?category=landing-page" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-brand-50">
                  Landing Page
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
