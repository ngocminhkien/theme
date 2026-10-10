'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface VietQrModalProps {
  orderNumber: string;
  amountVnd: number;
  qrUrl: string;
  onClose: () => void;
}

export function VietQrModal({ orderNumber, amountVnd, qrUrl, onClose }: VietQrModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(600); // 10 phút đếm ngược

  // Đồng hồ đếm ngược và kiểm tra trạng thái thanh toán tự động
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Polling API kiểm tra trạng thái mỗi 3 giây
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/orders/${orderNumber}/status`);
        const json = await res.json();
        if (json.data?.payment_status === 'paid') {
          clearInterval(pollInterval);
          router.push(`/checkout/order-received?order=${orderNumber}`);
        }
      } catch {
        // Bỏ qua lỗi polling mạng tạm thời
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [orderNumber, router]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Quét Mã VietQR Thanh Toán
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Mở App Ngân hàng bất kỳ (Vietcombank, MB, Techcombank, MoMo...) để quét
        </p>

        {/* QR Code Container */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 flex justify-center">
          <img
            src={qrUrl}
            alt="Mã VietQR"
            className="w-56 h-auto object-contain rounded-lg shadow-sm"
          />
        </div>

        {/* Payment Details */}
        <div className="text-left bg-blue-50/60 p-3 rounded-lg text-xs space-y-1 mb-4 text-gray-700">
          <div className="flex justify-between">
            <span>Mã đơn hàng:</span>
            <span className="font-bold text-blue-800">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Số tiền:</span>
            <span className="font-bold text-green-700 text-sm">
              {Number(amountVnd).toLocaleString('vi-VN')} đ
            </span>
          </div>
          <div className="flex justify-between">
            <span>Thời gian giữ mã:</span>
            <span className="font-semibold text-red-600">{formatTime(countdown)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Đang chờ ngân hàng xác nhận giao dịch tự động trong 3s...
        </div>
      </div>
    </div>
  );
}
