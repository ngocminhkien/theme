'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Lock, RefreshCw, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { hydrateCart, useCartStore } from '@/shared/stores/cart.store';
import { VietQrModal } from '@/features/checkout/components/vietqr-modal';
import { CheckoutRequest } from '@/features/checkout/checkout-request';
import { buildCheckoutPayload, validateCheckout, type CheckoutErrors } from '@/features/checkout/checkout-schema';
import type { CheckoutOrder } from '@/features/checkout/api-client';
import type { CartItem } from '@/shared/types';
import { getAuthToken } from '@/features/auth/auth-client';

interface PendingCheckout {
  order: CheckoutOrder;
  items: CartItem[];
}
function formatMoney(total: number, currency: 'VND' | 'USD') {
  return currency === 'VND' ? total.toLocaleString('vi-VN') + ' đ' : '$' + total;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, currency, getTotal, removeItem } = useCartStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [showQr, setShowQr] = useState(false);
  const request = useRef(new CheckoutRequest());

  useEffect(() => {
    // Cart storage is synchronous and already catches unavailable localStorage.
    // Hydrate here as well as CartRoot so Checkout never remains disabled when
    // a privacy-restricted browser has no usable localStorage implementation.
    hydrateCart();
    setHydrated(true);
    setHasSession(Boolean(getAuthToken()));
  }, []);

  const total = getTotal();
  const fields = { fullName, email, phone };

  function updateErrors(nextFields = fields) {
    const next = validateCheckout(nextFields, items, currency);
    setErrors(next);
    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading || pending) return;
    if (!getAuthToken()) {
      setSubmitError('Vui lòng đăng nhập trước khi tạo đơn để bảo vệ lịch sử đơn hàng và license của bạn.');
      return;
    }
    const validation = updateErrors();
    if (Object.keys(validation).length) return;

    setSubmitError('');
    setLoading(true);
    try {
      const order = await request.current.submit(buildCheckoutPayload(fields, items, currency));
      if (order.payment_status === 'paid' && order.order_status === 'completed') {
        // An API response may report an already-paid retried order. Remove only its
        // original items, never clear newer unrelated cart entries.
        items.forEach(item => removeItem(item.theme.id));
        router.replace('/checkout/order-received?order=' + encodeURIComponent(order.orderNumber));
        return;
      }
      setPending({ order, items: [...items] });
      setShowQr(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Chưa tạo được đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  function handlePaid() {
    if (!pending) return;
    pending.items.forEach(item => removeItem(item.theme.id));
    setShowQr(false);
    router.replace('/checkout/order-received?order=' + encodeURIComponent(pending.order.orderNumber));
  }

  const formDisabled = !hydrated || loading || Boolean(pending);
  const visibleItems = pending?.items || items;
  const visibleTotal = pending?.order.total_amount ?? total;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại cửa hàng</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">Thanh Toán Đơn Hàng & Nhận Key Bản Quyền</h1>
            <p className="text-xs text-slate-500 mb-6">
              License Key và file nén Theme chỉ được gửi sau khi hệ thống xác nhận thanh toán.
            </p>

            {pending ? (
              <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 text-sm text-slate-700 space-y-3" role="status">
                <div className="flex gap-3">
                  <ShoppingBag className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">Đơn {pending.order.orderNumber} đã được lưu.</p>
                    <p className="text-xs mt-1">
                      {pending.order.payment_status === 'paid'
                        ? 'Thanh toán đã được máy chủ xác nhận.'
                        : 'Đơn đang chờ xác nhận thanh toán. Giỏ hàng chưa bị xóa.'}
                    </p>
                  </div>
                </div>
                {pending.order.payment_status === 'pending' && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setShowQr(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-brand-500">
                      <RefreshCw className="w-3.5 h-3.5" /> Mở mã VietQR / kiểm tra trạng thái
                    </button>
                    <Link href={'/checkout/order-received?order=' + encodeURIComponent(pending.order.orderNumber)} className="inline-flex items-center rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-xs font-extrabold text-brand-700">
                      Xem biên nhận
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Họ và tên của bạn <span className="text-accent-rose">*</span>
                  </label>
                  <input id="checkout-name" type="text" autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'checkout-name-error' : undefined}
                    placeholder="Ví dụ: Nguyễn Văn An" value={fullName}
                    onChange={(e) => { setFullName(e.target.value); if (errors.fullName) updateErrors({ ...fields, fullName: e.target.value }); }}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition font-medium" />
                  {errors.fullName && <p id="checkout-name-error" className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Email nhận License Key & Link Tải <span className="text-accent-rose">*</span>
                  </label>
                  <input id="checkout-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                    placeholder="example@gmail.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) updateErrors({ ...fields, email: e.target.value }); }}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition font-medium" />
                  {errors.email && <p id="checkout-email-error" className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Số điện thoại Zalo (để hỗ trợ kỹ thuật nếu cần)</label>
                  <input id="checkout-phone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                    placeholder="0912 345 678" value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (errors.phone) updateErrors({ ...fields, phone: e.target.value }); }}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition font-medium" />
                  {errors.phone && <p id="checkout-phone-error" className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <div className="pt-2">
                  <p className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Phương Thức Thanh Toán</p>
                  <div className="rounded-2xl border border-brand-600 bg-brand-50/60 p-3.5 flex items-start gap-3">
                    <input type="radio" checked readOnly aria-label="VietQR" className="mt-0.5 accent-brand-600" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Quét Mã VietQR (VND)</span>
                      <span className="text-[11px] text-slate-500">Chỉ hiển thị mã QR do máy chủ trả về sau khi đơn được lưu.</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Stripe/PayPal và thanh toán USD chưa được tích hợp thật nên hiện không thể chọn; không tự chuyển sang QR demo hay quy đổi tiền.
                  </p>
                  {errors.payment && <p className="mt-1.5 text-xs text-red-600">{errors.payment}</p>}
                </div>

                {errors.cart && <p className="text-xs text-red-600" role="alert">{errors.cart}</p>}
                {submitError && <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700" role="alert">{submitError}</p>}
                {!hasSession && <Link href="/my-account?returnTo=/checkout" className="block text-center text-xs font-bold text-brand-600 hover:text-brand-700">Đăng nhập hoặc tạo tài khoản để thanh toán</Link>}

                <div className="pt-4">
                  <button type="submit" disabled={formDisabled}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <Lock className="w-4 h-4" />
                    <span>{!hydrated ? 'Đang Khôi Phục Giỏ Hàng...' : loading ? 'Đang Lưu Đơn Hàng...' : 'Tạo Đơn & Nhận Mã VietQR'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Tóm Tắt Đơn Hàng ({visibleItems.length} Theme)
              </h3>
              {!hydrated ? (
                <p className="text-xs text-slate-500 py-4">Đang khôi phục giỏ hàng…</p>
              ) : visibleItems.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 mb-6 border border-slate-200">Giỏ hàng đang trống. Hãy quay lại cửa hàng để chọn theme.</div>
              ) : (
                <div className="space-y-3 mb-6 divide-y divide-slate-100">
                  {visibleItems.map((item) => (
                    <div key={item.theme.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <strong className="text-slate-900 block line-clamp-1">{item.theme.name}</strong>
                        <span className="text-[11px] text-slate-500">Gói: Regular License</span>
                      </div>
                      <span className="font-extrabold text-brand-600 shrink-0">{formatMoney(item.price, currency)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-500"><span>Phí dịch vụ:</span><span className="text-emerald-600 font-semibold">Miễn phí</span></div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Tổng tiền:</span><span className="text-xl text-brand-600">{formatMoney(visibleTotal, currency)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Chỉ xác nhận hoàn tất khi máy chủ báo thanh toán thành công</span></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showQr && pending?.order.vietQrUrl && (
        <VietQrModal order={pending.order} qrUrl={pending.order.vietQrUrl} onPaid={handlePaid} onClose={() => setShowQr(false)} />
      )}
    </div>
  );
}
