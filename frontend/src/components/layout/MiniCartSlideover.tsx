'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';

export function MiniCartSlideover() {
  const { items, isCartOpen, closeCart, removeItem, currency, getTotal } = useCartStore();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCartOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeCart();
      }
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), [tabindex="0"]',
      );
      if (!controls?.length) {
        event.preventDefault();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === dialogRef.current || !dialogRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || active === dialogRef.current || !dialogRef.current?.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const total = getTotal();
  const formattedTotal =
    currency === 'VND' ? `${total.toLocaleString('vi-VN')} đ` : `$${total}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md flex pl-3 sm:pl-0">
        <div
          ref={dialogRef}
          id="cart-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          tabIndex={-1}
          className="w-full h-full min-h-0 bg-white shadow-2xl flex flex-col outline-none animate-in slide-in-from-right duration-300 border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 shrink-0 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 id="cart-drawer-title" className="font-black text-base text-slate-900">
                  Giỏ Hàng Của Bạn
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">{items.length} theme trong giỏ</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng giỏ hàng"
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Benefit banner */}
          <div className="px-4 sm:px-6 py-3 shrink-0 bg-brand-50/70 border-b border-brand-100 flex items-center gap-2.5 text-xs text-brand-900">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span className="font-medium">Kích hoạt License tự động & cấp quyền cập nhật trọn đời.</span>
          </div>

          {/* Cart Item List */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Giỏ hàng đang trống</h4>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Khám phá hơn 500+ mẫu giao diện website tối ưu chuyển đổi và chuẩn SEO ngay hôm nay.
                </p>
                <Link
                  href="/themes"
                  onClick={closeCart}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Khám Phá Kho Theme
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice =
                  currency === 'VND'
                    ? `${item.price.toLocaleString('vi-VN')} đ`
                    : `$${item.price}`;

                return (
                  <div key={item.theme.id} className="py-4 flex gap-4 items-start group">
                    <img
                      src={item.theme.thumbnail_url}
                      alt={item.theme.name}
                      className="w-20 h-14 object-cover rounded-xl border border-slate-200 shrink-0 group-hover:scale-105 transition"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 hover:text-brand-600 transition break-words">
                        <Link href={`/theme/${item.theme.slug}`} onClick={closeCart}>
                          {item.theme.name}
                        </Link>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.theme.page_builders.split(',')[0]}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          Regular License
                        </span>
                        <span className="text-xs font-black text-brand-600">
                          {itemPrice}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Xóa ${item.theme.name} khỏi giỏ`}
                      onClick={() => removeItem(item.theme.id)}
                      className="text-slate-400 hover:text-accent-rose transition p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 shrink-0 border-t border-slate-100 bg-slate-50/70 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p className="text-[11px] text-slate-500 mb-3">Agency và Lifetime tạm chưa mở bán.</p>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>Tạm tính ({items.length} theme):</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mb-5" aria-live="polite" aria-atomic="true">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tổng cộng:</span>
                <span className="text-2xl font-black text-slate-900">{formattedTotal}</span>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-glow flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Thanh Toán Ngay (VietQR / Thẻ)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/themes"
                  onClick={closeCart}
                  className="w-full py-3 bg-white border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-600 font-bold text-xs uppercase tracking-wider rounded-xl text-center transition"
                >
                  Tiếp Tục Mua Sắm
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
