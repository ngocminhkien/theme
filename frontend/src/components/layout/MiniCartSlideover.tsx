'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCartStore } from '@/shared/stores/cart.store';

export function MiniCartSlideover() {
  const { items, isCartOpen, closeCart, removeItem, currency, getTotal } = useCartStore();

  if (!isCartOpen) return null;

  const total = getTotal();
  const formattedTotal =
    currency === 'VND' ? `${total.toLocaleString('vi-VN')} đ` : `$${total}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Giỏ Hàng Của Bạn
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">{items.length} theme trong giỏ</span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Benefit banner */}
          <div className="px-6 py-3 bg-brand-50/70 border-b border-brand-100 flex items-center gap-2.5 text-xs text-brand-900">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span className="font-medium">Kích hoạt License tự động & cấp quyền cập nhật trọn đời.</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
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
                      <h4 className="text-xs font-bold text-slate-900 hover:text-brand-600 transition line-clamp-1">
                        <Link href={`/theme/${item.theme.slug}`} onClick={closeCart}>
                          {item.theme.name}
                        </Link>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.theme.page_builders.split(',')[0]}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {item.license_type}
                        </span>
                        <span className="text-xs font-black text-brand-600">
                          {itemPrice}
                        </span>
                      </div>
                    </div>
                    <button
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
            <div className="p-6 border-t border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between mb-5">
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
