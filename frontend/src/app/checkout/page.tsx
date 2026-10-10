'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../shared/stores/cart.store.js';
import { VietQrModal } from '../../features/checkout/components/vietqr-modal.js';

export default function CheckoutPage() {
  const { items, currency, getTotal, clearCart } = useCartStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
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
        alert(json.message || 'Khởi tạo đơn hàng thất bại');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ Backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <Link href="/" className="text-xs font-semibold text-blue-600 hover:underline mb-4 inline-block">
          ← Quay lại cửa hàng
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh Toán Nhanh 1 Bước</h1>
        <p className="text-xs text-gray-500 mb-6">
          Nhận ngay License Key và link tải Theme `.zip` trong 3 giây sau khi thanh toán.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên của bạn</label>
            <input
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email nhận License & Link tải</label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Phương thức thanh toán</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-xs font-semibold ${
                  paymentMethod === 'vietqr' ? 'border-blue-600 bg-blue-50/50 text-blue-900' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'vietqr'}
                  onChange={() => setPaymentMethod('vietqr')}
                />
                Quét VietQR (3s)
              </label>

              <label
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-xs font-semibold ${
                  paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50/50 text-blue-900' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                />
                Thẻ Quốc Tế (Stripe)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Tổng thanh toán:</span>
            <span className="text-xl font-bold text-gray-900">
              {currency === 'VND' ? `${Number(total).toLocaleString('vi-VN')} đ` : `$${total}`}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition text-sm disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Xác Nhận & Thanh Toán Ngay'}
          </button>
        </form>
      </div>

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
