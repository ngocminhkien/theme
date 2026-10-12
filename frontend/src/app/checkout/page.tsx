'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock, ShoppingBag, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/shared/stores/cart.store';
import { VietQrModal } from '@/features/checkout/components/vietqr-modal';

export default function CheckoutPage() {
  const { items, currency, getTotal, clearCart } = useCartStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'stripe'>('vietqr');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<{ orderNumber: string; qrUrl: string; amount: number } | null>(null);

  const total = getTotal() || (currency === 'VND' ? 890000 : 49);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Vui lòng nhập họ tên và email nhận License.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fullName,
          customer_email: email,
          customer_phone: phone,
          total_amount: total,
          currency,
          payment_method: paymentMethod,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.vietQrUrl) {
        setQrData({
          orderNumber: json.data.orderNumber,
          qrUrl: json.data.vietQrUrl,
          amount: total,
        });
        clearCart();
      } else {
        // Fallback demo QR if backend server isn't running
        const demoOrderNumber = `TS-${Date.now().toString().slice(-6)}`;
        const demoQrUrl = `https://api.vietqr.io/image/970422-0987654321-compact.jpg?amount=${total}&addInfo=THANH+TOAN+${demoOrderNumber}&accountName=THEMESTORE+VN`;
        setQrData({
          orderNumber: demoOrderNumber,
          qrUrl: demoQrUrl,
          amount: total,
        });
        clearCart();
      }
    } catch {
      // Fallback demo QR for client-side test
      const demoOrderNumber = `TS-${Date.now().toString().slice(-6)}`;
      const demoQrUrl = `https://api.vietqr.io/image/970422-0987654321-compact.jpg?amount=${total}&addInfo=THANH+TOAN+${demoOrderNumber}&accountName=THEMESTORE+VN`;
      setQrData({
        orderNumber: demoOrderNumber,
        qrUrl: demoQrUrl,
        amount: total,
      });
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  const formattedTotal =
    currency === 'VND' ? `${Number(total).toLocaleString('vi-VN')} đ` : `$${total}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại cửa hàng</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Customer Info Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Thanh Toán Đơn Hàng & Nhận Key Bản Quyền
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              License Key và file nén Theme sẽ được gửi tự động đến email của bạn ngay sau khi hoàn tất thanh toán.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Họ và tên của bạn <span className="text-accent-rose">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Email nhận License Key & Link Tải <span className="text-accent-rose">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Số điện thoại Zalo (để hỗ trợ kỹ thuật nếu cần)
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition font-medium"
                />
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Chọn Phương Thức Thanh Toán
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === 'vietqr'
                        ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      className="mt-0.5 accent-brand-600"
                    />
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Quét Mã VietQR (24/7)</span>
                      <span className="text-xs text-slate-500">Xác nhận tức thì sau 3s, hỗ trợ mọi app ngân hàng.</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('stripe')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === 'stripe'
                        ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="mt-0.5 accent-brand-600"
                    />
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Thẻ Quốc Tế (Stripe)</span>
                      <span className="text-xs text-slate-500">Visa, MasterCard, PayPal, bảo mật SSL.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl transition shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  <span>{loading ? 'Đang Xử Lý Giao Dịch...' : 'Xác Nhận & Thanh Toán Ngay'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-black text-base uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Tóm Tắt Đơn Hàng ({items.length} Theme)
              </h3>

              {items.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 mb-6 border border-slate-200">
                  Bạn đang thanh toán gói mẫu: <strong className="text-slate-900">WoodMart - Multipurpose WooCommerce Theme</strong>.
                </div>
              ) : (
                <div className="space-y-3 mb-6 divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.theme.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-sm">
                      <div>
                        <strong className="text-slate-900 block line-clamp-1">{item.theme.name}</strong>
                        <span className="text-xs text-slate-500">Gói: {item.license_type}</span>
                      </div>
                      <span className="font-extrabold text-brand-600 shrink-0">
                        {currency === 'VND' ? `${item.price.toLocaleString('vi-VN')} đ` : `$${item.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Phí dịch vụ:</span>
                  <span className="text-emerald-600 font-semibold">Miễn phí (0 đ)</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Hỗ trợ cài đặt 1-1:</span>
                  <span className="text-brand-600 font-semibold">Được tặng kèm</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-2xl text-brand-600">{formattedTotal}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Giao dịch bảo mật mã hóa SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Cam kết hoàn tiền trong 7 ngày nếu lỗi kỹ thuật</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* VietQR Popup Modal */}
      {qrData && (
        <VietQrModal
          orderNumber={qrData.orderNumber}
          amountVnd={qrData.amount}
          qrUrl={qrData.qrUrl}
          onClose={() => setQrData(null)}
        />
      )}
    </div>
  );
}
