'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, LayoutTemplate, ChevronDown, X, Sparkles, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';
import { THEMES_DATA, CATEGORIES_LIST } from '@/shared/data/themes-data';

export function HeaderMain() {
  const router = useRouter();
  const { items, currency, getTotal, openCart, isCartOpen } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
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
    if (searchTerm.trim()) {
      router.push(`/themes?search=${encodeURIComponent(searchTerm.trim())}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`);
    } else if (selectedCategory !== 'all') {
      router.push(`/themes?category=${selectedCategory}`);
    }
  };

  const totalPrice = getTotal();
  const priceDisplay =
    currency === 'VND'
      ? `${totalPrice.toLocaleString('vi-VN')} đ`
      : `$${totalPrice}`;

  return (
    <div className="bg-white/85 backdrop-blur-xl border-b border-slate-200/70 sticky top-0 z-40 transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo - THEMESTORE */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-all duration-300">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition">
                THEMESTORE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-brand-50 text-brand-600 border border-brand-200">
                PRO
              </span>
            </div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
              Digital Theme Marketplace
            </span>
          </div>
        </Link>

        {/* Center: Search Bar with Glass Pill & Quick Category */}
        <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-2xl relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white rounded-2xl border border-slate-200/80 focus-within:border-brand-500/50 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all duration-200 overflow-hidden shadow-xs"
          >
            {/* Category Dropdown */}
            <div className="relative border-r border-slate-200/80 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent pl-4 pr-8 py-3 text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:text-brand-600 transition"
              >
                <option value="all">Tất cả ngành</option>
                {CATEGORIES_LIST.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_vi}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input field */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Tìm kiếm giao diện theo ngành nghề, công nghệ, page builder..."
                className="w-full bg-transparent px-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="mr-2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition shrink-0 cursor-pointer shadow-xs"
              title="Tìm kiếm theme"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Live Search Popup Dropdown */}
          {showSearchDropdown && searchTerm.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-3 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                <span>Gợi ý kết quả tìm kiếm ({searchResults.length})</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Enter để xem tất cả</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/theme/${item.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition group"
                    >
                      <img
                        src={item.thumbnail_url}
                        alt={item.name}
                        className="w-12 h-9 object-cover rounded-lg border border-slate-200 shrink-0 group-hover:scale-105 transition"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 truncate group-hover:text-brand-600 transition">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-brand-600 bg-brand-50 font-semibold px-1.5 py-0.2 rounded shrink-0">
                            {item.page_builders.split(',')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.short_desc_vi}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-brand-600">
                          {currency === 'VND' ? `${item.price_vnd.toLocaleString('vi-VN')} đ` : `$${item.price_usd}`}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <div className="p-2 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg hover:bg-brand-50 transition"
                    >
                      <span>Xem tất cả kết quả cho &quot;{searchTerm}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  Không tìm thấy theme phù hợp với &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Explore Themes & Mini Cart */}
        <div className="flex items-center gap-3">
          <Link
            href="/themes"
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition"
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Kho Theme</span>
          </Link>

          {/* Cart Button */}
          <button
            type="button"
            aria-label="Mở giỏ hàng"
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
            aria-controls="cart-drawer"
            onClick={openCart}
            className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-2xl shadow-sm hover:shadow-glow transition-all duration-200 cursor-pointer group"
            title="Mở giỏ hàng"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent-rose text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {items.length}
                </span>
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-slate-400 group-hover:text-white/80 leading-none">
                Giỏ Hàng
              </span>
              <span className="text-xs font-bold text-white leading-tight mt-0.5">
                {priceDisplay}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
