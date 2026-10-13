'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  User,
  CreditCard,
  KeyRound,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  getOrderDetail,
  updateOrderStatus,
  AdminOrderDetail,
} from '@/features/admin/api-client';

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update state
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve(params).then((p) => {
      if (p?.orderNumber) {
        setOrderNumber(p.orderNumber);
      }
    });
  }, [params]);

  const loadOrderDetail = async (numberToLoad: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderDetail(numberToLoad);
      setOrder(data);
      setPaymentStatus(data.payment_status);
      setOrderStatus(data.order_status);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải chi tiết đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      loadOrderDetail(orderNumber);
    }
  }, [orderNumber]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;
    try {
      setUpdating(true);
      setUpdateMessage(null);
      await updateOrderStatus(orderNumber, {
        payment_status: paymentStatus || undefined,
        order_status: orderStatus || undefined,
      });
      setUpdateMessage({ text: 'Cập nhật trạng thái đơn hàng thành công!', success: true });
      await loadOrderDetail(orderNumber);
    } catch (err: any) {
      setUpdateMessage({
        text: err?.message || 'Không thể cập nhật trạng thái đơn hàng.',
        success: false,
      });
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatVnd = (val: number) => {
    return Number(val || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const formatUsd = (val: number) => {
    return '$' + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã thanh toán</span>
          </span>
        );
      case 'pending':
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ xử lý</span>
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Thất bại / Hủy</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700/60 text-slate-300 border border-slate-600">
            <span>Hoàn tiền</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
        <p className="text-sm font-bold">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 max-w-lg mx-auto bg-slate-900 border border-rose-500/30 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Không tìm thấy đơn hàng</h2>
        <p className="text-xs text-slate-400">{error || `Không có dữ liệu cho mã đơn "${orderNumber}"`}</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            aria-label="Quay lại danh sách đơn hàng"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-white font-mono tracking-tight">
                {order.order_number}
              </h1>
              {getStatusBadge(order.payment_status)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Thời gian khởi tạo: {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadOrderDetail(order.order_number)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Tải lại</span>
        </button>
      </div>

      {/* Main Grid: Customer Info & Status Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Customer Profile + Line Items + Licenses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Payment Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Thông Tin Khách Hàng</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="text-sm font-bold text-white">{order.customer_name}</div>
                <div className="text-slate-300 font-mono">{order.customer_email}</div>
                {order.customer_phone && (
                  <div className="text-slate-400">Số điện thoại: {order.customer_phone}</div>
                )}
                {order.user_id && (
                  <div className="text-[11px] text-slate-500">Mã tài khoản (User ID): #{order.user_id}</div>
                )}
              </div>
            </div>

            {/* Payment Box */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Chi Tiết Thanh Toán</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="text-sm font-bold text-emerald-400">
                  {order.currency === 'USD' ? formatUsd(order.total_amount) : formatVnd(order.total_amount)}
                </div>
                <div className="text-slate-300 capitalize">
                  Cổng: <strong>{order.payment_method}</strong>
                </div>
                <div className="text-slate-400">
                  Tiến trình đơn: <strong className="text-slate-200 capitalize">{order.order_status}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sản Phẩm Trong Đơn Hàng ({order.items?.length || 0})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Theme / Sản phẩm</th>
                    <th className="py-3 px-4">Gói License</th>
                    <th className="py-3 px-4 text-right">Đơn Giá</th>
                    <th className="py-3 px-4 text-right">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{item.theme_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">slug: {item.theme_slug}</div>
                        </td>
                        <td className="py-3.5 px-4 uppercase text-[11px] font-bold text-indigo-300">
                          {item.license_type}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium">
                          {order.currency === 'USD' ? formatUsd(item.unit_price) : formatVnd(item.unit_price)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-white">
                          {order.currency === 'USD' ? formatUsd(item.subtotal) : formatVnd(item.subtotal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">
                        Không có sản phẩm trong đơn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Licenses Generated Section */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Bản Quyền Đã Cấp ({order.licenses?.length || 0})
              </h3>
            </div>

            {order.licenses && order.licenses.length > 0 ? (
              <div className="space-y-3">
                {order.licenses.map((lic) => (
                  <div
                    key={lic.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-purple-300 select-all">
                          {lic.license_key}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(lic.license_key)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                          title="Sao chép License Key"
                        >
                          {copiedKey === lic.license_key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Theme: <strong>{lic.theme_name}</strong> | Gói: <strong className="uppercase">{lic.license_type}</strong> | Giới hạn: <strong>{lic.max_domains} domain(s)</strong>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                      {lic.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Chưa có bản quyền nào được kích hoạt hoặc đơn hàng chưa hoàn tất thanh toán.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Order Status Update Action Card */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Cập Nhật Trạng Thái Đơn
              </h3>
            </div>

            {updateMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  updateMessage.success
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {updateMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              {/* Payment Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Trạng Thái Thanh Toán (payment_status)
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="pending">pending (Chờ thanh toán)</option>
                  <option value="paid">paid (Đã thanh toán)</option>
                  <option value="failed">failed (Thất bại)</option>
                  <option value="refunded">refunded (Đã hoàn tiền)</option>
                </select>
              </div>

              {/* Order Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tiến Trình Đơn Hàng (order_status)
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="processing">processing (Đang xử lý)</option>
                  <option value="completed">completed (Hoàn thành)</option>
                  <option value="cancelled">cancelled (Đã hủy)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang Lưu...</span>
                  </>
                ) : (
                  <span>Lưu Thay Đổi</span>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p>• Trạng thái <strong>paid</strong> sẽ tính vào doanh thu thực nhận.</p>
              <p>• Trạng thái <strong>completed</strong> cho phép khách hàng tải source code trong portal.</p>
            </div>
          </div>

          {/* Payment Transactions Log */}
          {order.payments && order.payments.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Giao Dịch Cổng Thanh Toán
              </h4>
              <div className="space-y-2 text-xs">
                {order.payments.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-300 text-[11px]">{p.transaction_id}</span>
                      <span className="text-[10px] font-bold uppercase text-emerald-400">{p.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Cổng: <strong>{p.gateway}</strong> | Số tiền: <strong>{order.currency === 'USD' ? formatUsd(p.amount) : formatVnd(p.amount)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
