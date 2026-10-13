'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { getOrders, AdminOrder, Pagination } from '@/features/admin/api-client';

function OrdersListContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrdersList = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrders({
        page,
        limit: 10,
        search: searchTerm.trim() || undefined,
        status: statusFilter || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });
      setOrders(res.orders);
      setPagination(res.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrdersList(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
    getOrders({ page: 1, limit: 10 }).then((res) => {
      setOrders(res.orders);
      setPagination(res.pagination);
    });
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã thanh toán</span>
          </span>
        );
      case 'pending':
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ xử lý</span>
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Thất bại / Hủy</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700/60 text-slate-300 border border-slate-600">
            <span>Hoàn tiền</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            <span>Quản Lý Đơn Hàng</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tra cứu, kiểm tra trạng thái thanh toán và cập nhật tiến trình đơn hàng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrdersList(currentPage)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn (OD-...), email hoặc tên khách hàng..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="paid">Đã thanh toán (paid)</option>
              <option value="pending">Chờ xử lý (pending)</option>
              <option value="failed">Thất bại (failed)</option>
              <option value="refunded">Hoàn tiền (refunded)</option>
              <option value="completed">Hoàn tất (completed)</option>
              <option value="cancelled">Đã hủy (cancelled)</option>
            </select>

            {/* Date Filters */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-transparent text-[11px] text-white focus:outline-hidden cursor-pointer"
                title="Từ ngày"
              />
              <span className="text-slate-600 text-xs">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-transparent text-[11px] text-white focus:outline-hidden cursor-pointer"
                title="Đến ngày"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Lọc
            </button>

            {(searchTerm || statusFilter || dateFrom || dateTo) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Đặt lại
              </button>
            )}
          </div>
        </form>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {[
            { label: 'Tất Cả', val: '' },
            { label: 'Đã Thanh Toán', val: 'paid' },
            { label: 'Chờ Xử Lý', val: 'pending' },
            { label: 'Thất Bại / Hủy', val: 'failed' },
            { label: 'Hoàn Tiền', val: 'refunded' },
          ].map((tab) => (
            <button
              key={tab.val}
              type="button"
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.val
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6">Mã Đơn Hàng</th>
                <th className="py-4 px-4">Khách Hàng</th>
                <th className="py-4 px-4">Số Tiền</th>
                <th className="py-4 px-4">Thanh Toán</th>
                <th className="py-4 px-4">Trạng Thái</th>
                <th className="py-4 px-4">Ngày Tạo</th>
                <th className="py-4 px-4 sm:px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-white whitespace-nowrap">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{order.customer_email}</div>
                      {order.customer_phone && (
                        <div className="text-[10px] text-slate-500">{order.customer_phone}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                      {order.currency === 'USD' ? formatUsd(order.total_amount) : formatVnd(order.total_amount)}
                    </td>
                    <td className="py-4 px-4 uppercase text-[11px] font-bold text-slate-300 whitespace-nowrap">
                      {order.payment_method}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(order.payment_status)}
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---'}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.order_number}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-bold transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Chi tiết</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Hiển thị <strong>{orders.length}</strong> / <strong>{pagination.total}</strong> đơn hàng
            (Trang {pagination.page} / {pagination.total_pages || 1})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => fetchOrdersList(pagination.page - 1)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-slate-950 font-mono font-bold text-white border border-slate-800">
              {pagination.page}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.total_pages || loading}
              onClick={() => fetchOrdersList(pagination.page + 1)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Đang tải danh sách đơn hàng...</div>}>
      <OrdersListContent />
    </Suspense>
  );
}
