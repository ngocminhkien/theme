'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { getOrderStatus, isConfirmedPaid, type CheckoutOrder } from '../api-client';

interface VietQrModalProps {
  order: CheckoutOrder;
  qrUrl: string;
  onPaid: () => void;
  onClose: () => void;
}
export function VietQrModal({ order, qrUrl, onPaid, onClose }: VietQrModalProps) {
  const [checking, setChecking] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [message, setMessage] = useState('Đang chờ máy chủ xác nhận thanh toán.');
  const paidRef = useRef(false);

  const checkStatus = useCallback(async () => {
    if (checking || paidRef.current) return;
    setChecking(true);
    try {
      const status = await getOrderStatus(order);
      if (isConfirmedPaid(status, order)) {
        paidRef.current = true;
        setMessage('Thanh toán đã được máy chủ xác nhận.');
        onPaid();
        return;
      }
      if (status.payment_status === 'failed' || status.payment_status === 'refunded' || status.order_status === 'cancelled') {
        setMessage('Đơn hàng không ở trạng thái có thể thanh toán. Giỏ hàng vẫn được giữ; vui lòng liên hệ hỗ trợ trước khi tạo đơn mới.');
        return;
      }
      setMessage('Chưa có xác nhận thanh toán. Vui lòng hoàn tất chuyển khoản rồi kiểm tra lại.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Chưa kiểm tra được trạng thái. Vui lòng thử lại.');
    } finally {
      setChecking(false);
    }
  }, [checking, onPaid, order]);

  useEffect(() => {
    const timer = window.setInterval(() => { void checkStatus(); }, 5000);
    return () => window.clearInterval(timer);
  }, [checkStatus]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="vietqr-title">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92dvh] overflow-y-auto p-5 sm:p-6 text-center shadow-2xl relative">
        <button type="button" onClick={onClose} aria-label="Đóng mã thanh toán"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">✕</button>
        <h3 id="vietqr-title" className="text-lg sm:text-2xl font-black text-slate-900 mb-1 pr-6">Quét Mã VietQR Thanh Toán</h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">Quét bằng ứng dụng ngân hàng bất kỳ. Nội dung chuyển khoản đã chứa mã đơn hàng.</p>
        <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 mb-4 flex justify-center">
          {imageError ? (
            <p className="max-w-xs text-xs leading-relaxed text-rose-700" role="alert">
              Không tải được hình mã VietQR do máy chủ trả về. Đơn và giỏ hàng vẫn được giữ nguyên; vui lòng đóng cửa sổ, kiểm tra cấu hình thanh toán rồi thử lại.
            </p>
          ) : (
            <img src={qrUrl} alt={'Mã VietQR cho đơn ' + order.orderNumber}
              className="w-48 sm:w-56 max-w-full h-auto object-contain rounded-lg shadow-sm" onError={() => setImageError(true)} />
          )}
        </div>
        <div className="text-left bg-blue-50/70 p-3.5 rounded-xl text-xs sm:text-sm space-y-1.5 mb-4 text-slate-700">
          <div className="flex justify-between"><span>Mã đơn hàng:</span><span className="font-bold text-blue-800">{order.orderNumber}</span></div>
          <div className="flex justify-between"><span>Số tiền:</span><span className="font-black text-emerald-700 text-sm sm:text-base">{order.total_amount.toLocaleString('vi-VN')} đ</span></div>
        </div>
        <p className="text-xs text-gray-600 mb-3" role="status">{message}</p>
        <button type="button" onClick={() => void checkStatus()} disabled={checking || paidRef.current}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-xs font-extrabold text-white hover:bg-brand-500 disabled:opacity-50">
          {paidRef.current ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className={'w-4 h-4 ' + (checking ? 'animate-spin' : '')} />}
          {paidRef.current ? 'Đã Xác Nhận Thanh Toán' : checking ? 'Đang Kiểm Tra...' : 'Kiểm Tra Trạng Thái'}
        </button>
        <p className="mt-3 text-[11px] text-gray-500">Giỏ chỉ được cập nhật sau khi trạng thái thanh toán được máy chủ xác nhận.</p>
      </div>
    </div>
  );
}
