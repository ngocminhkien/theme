'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Coins,
  ShoppingBag,
  Layers,
  KeyRound,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  RefreshCw,
  Plus,
  AlertCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { getStats, AdminDashboardStats } from '@/features/admin/api-client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thống kê bảng điều khiển.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalOrders = stats?.orders.total || 0;
  const paidOrders = stats?.orders.paid || 0;
  const pendingOrders = stats?.orders.pending || 0;
  const failedOrders = stats?.orders.failed || 0;

  const paidRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : '0.0';
  const pendingRate = totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(1) : '0.0';
  const failedRate = totalOrders > 0 ? ((failedOrders / totalOrders) * 100).toFixed(1) : '0.0';

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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bảng Điều Khiển Tổng Quan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Số liệu thống kê thời gian thực từ cơ sở dữ liệu Woodmart Digital Theme Marketplace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm Mới</span>
          </button>
          <Link
            href="/admin/themes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Theme Mới</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-200 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="px-3 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-xs font-bold text-white transition"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* MULTI-CURRENCY REVENUE KPI CARDS (STRICT SEPARATION: VND & USD NEVER AGGREGATED!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Doanh Thu VND Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                  Doanh Thu Thực Nhận (VND)
                </span>
                <span className="text-xs text-slate-400">Đơn hàng thanh toán SePAY / VietQR</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              VND SEPARATE
            </span>
          </div>

          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {loading ? (
                <span className="animate-pulse text-slate-600">---.--- ₫</span>
              ) : (
                formatVnd(stats?.revenue.vnd || 0)
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Chỉ kết chuyển từ các đơn có trạng thái <strong className="text-emerald-300">paid</strong></span>
            </p>
          </div>
        </div>

        {/* Doanh Thu USD Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 block">
                  Doanh Thu Thực Nhận (USD)
                </span>
                <span className="text-xs text-slate-400">Đơn hàng thanh toán Stripe / Quốc tế</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
              USD SEPARATE
            </span>
          </div>

          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {loading ? (
                <span className="animate-pulse text-slate-600">$---.--</span>
              ) : (
                formatUsd(stats?.revenue.usd || 0)
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Bảo toàn độc lập tài chính, không quy đổi tỷ giá sang VND</span>
            </p>
          </div>
        </div>
      </div>

      {/* OPERATIONAL COUNTERS & CONVERSION FUNNEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders & Conversion */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Tổng Đơn Hàng</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {loading ? '...' : totalOrders}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
            <span className="text-slate-400">Tỷ lệ thành công:</span>
            <span className="font-bold text-emerald-400">{paidRate}%</span>
          </div>
        </div>

        {/* Paid vs Pending Breakdown */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Đơn Chờ Xử Lý</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {loading ? '...' : pendingOrders}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
            <span className="text-slate-400">Tỷ lệ đơn chờ:</span>
            <span className="font-bold text-amber-400">{pendingRate}%</span>
          </div>
        </div>

        {/* Active Themes Count */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Themes Trong Kho</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {loading ? '...' : stats?.themes_count || 0}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
            <span className="text-slate-400">Khách đăng ký:</span>
            <span className="font-bold text-indigo-400">{stats?.customers_count || 0}</span>
          </div>
        </div>

        {/* Active Licenses Count */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">Bản Quyền Đang Hoạt Động</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300">
            {loading ? '...' : stats?.active_licenses_count || 0}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
            <span className="text-slate-400">Đơn thất bại:</span>
            <span className="font-bold text-rose-400">{failedOrders} ({failedRate}%)</span>
          </div>
        </div>
      </div>

      {/* OPERATIONAL SHORTCUTS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/admin/orders?status=pending"
          className="flex flex-col p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition">Đơn Chờ Xử Lý</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Xác nhận chuyển khoản VietQR</span>
        </Link>

        <Link
          href="/admin/themes"
          className="flex flex-col p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Quản Lý Themes</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Cập nhật giá và xuất bản</span>
        </Link>

        <Link
          href="/admin/licenses"
          className="flex flex-col p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 transition group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-purple-300 transition">Kiểm Tra License</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Quản lý quota và domain</span>
        </Link>

        <Link
          href="/admin/customers"
          className="flex flex-col p-4 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">Người Dùng & Phân Quyền</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Cấp quyền và quản lý tài khoản</span>
        </Link>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <span>Đơn Hàng Gần Đây</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">5 giao dịch phát sinh gần nhất trong hệ thống</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Mã Đơn</th>
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Số Tiền</th>
                <th className="py-3.5 px-4">Phương Thức</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4">Thời Gian</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : !stats?.recent_orders || stats.recent_orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Chưa có đơn hàng nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                stats.recent_orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-white">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{order.customer_email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {order.currency === 'USD' ? formatUsd(order.total_amount) : formatVnd(order.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] font-bold text-slate-300">
                      {order.payment_method}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(order.payment_status)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---'}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.order_number}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-bold transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Xem</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
