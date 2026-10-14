'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  RefreshCw,
  Coins,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { getAnalytics, AdminAnalytics } from '@/features/admin/api-client';

type TimeRangeDays = 7 | 30 | 90;

export default function AdminReportsPage() {
  const [days, setDays] = useState<TimeRangeDays>(30);
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (selectedDays = days) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAnalytics(selectedDays);
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải báo cáo kinh doanh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  // Aggregate totals for the period
  const periodTotals = useMemo(() => {
    if (!data?.series?.length) {
      return { totalOrders: 0, totalVnd: 0, totalUsd: 0 };
    }
    return data.series.reduce(
      (acc, curr) => ({
        totalOrders: acc.totalOrders + (curr.orders || 0),
        totalVnd: acc.totalVnd + (curr.revenue_vnd || 0),
        totalUsd: acc.totalUsd + (curr.revenue_usd || 0),
      }),
      { totalOrders: 0, totalVnd: 0, totalUsd: 0 }
    );
  }, [data]);

  // Find max orders for bar chart scaling
  const maxOrders = useMemo(() => {
    if (!data?.series?.length) return 1;
    return Math.max(1, ...data.series.map((point) => point.orders));
  }, [data]);

  const formatVnd = (val: number) => {
    return Number(val || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const formatUsd = (val: number) => {
    return '$' + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
      }
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              Business Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-indigo-400 shrink-0" />
            <span>Báo Cáo & Phân Tích Kinh Doanh</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi khối lượng đơn hàng, doanh thu thực nhận và xu hướng mua sắm theo thời gian.
          </p>
        </div>

        {/* Time Range Controls & Refresh */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick Range Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            {([7, 30, 90] as TimeRangeDays[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  days === d
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {d} Ngày
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchAnalytics(days)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm Mới</span>
          </button>
        </div>
      </div>

      {/* Financial Invariant Notice */}
      <div className="px-4 py-3 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 text-indigo-300 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          Doanh thu chỉ tính các đơn hàng có trạng thái <strong className="text-emerald-400 font-bold">paid</strong>.
          Doanh thu VND và USD được hạch toán riêng biệt, tuyệt đối không quy đổi chéo.
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-200 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchAnalytics(days)}
            className="px-3 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-xs font-bold text-white transition cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Summary KPI Cards for Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Paid Orders in Period */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Đơn Đã Thanh Toán
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {loading ? <span className="animate-pulse text-slate-600">---</span> : periodTotals.totalOrders}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Trong {days} ngày gần đây
          </p>
        </div>

        {/* VND Period Revenue */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
              Doanh Thu Kỳ Này (VND)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {loading ? <span className="animate-pulse text-slate-600">---.--- ₫</span> : formatVnd(periodTotals.totalVnd)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            SePAY / VietQR Bank Transfer
          </p>
        </div>

        {/* USD Period Revenue */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
              Doanh Thu Kỳ Này (USD)
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {loading ? <span className="animate-pulse text-slate-600">$ --.--</span> : formatUsd(periodTotals.totalUsd)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Stripe Card Checkout
          </p>
        </div>
      </div>

      {/* Main Charts & Top Themes Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        {/* Daily Paid Orders Chart */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Số Đơn Đã Thanh Toán Theo Ngày</h2>
                  <p className="text-xs text-slate-400">Khối lượng đơn hoàn tất trong {days} ngày gần đây</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
                Đỉnh: {maxOrders} đơn/ngày
              </span>
            </div>

            {loading ? (
              <div className="h-72 flex items-center justify-center text-slate-500 text-xs animate-pulse">
                Đang tải dữ liệu biểu đồ...
              </div>
            ) : !data?.series?.length ? (
              <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-10 h-10 mb-2 stroke-1 opacity-50" />
                <p className="text-sm font-semibold text-slate-400">Chưa có dữ liệu đơn hàng</p>
                <p className="text-xs mt-1">Không có đơn đã thanh toán nào trong {days} ngày qua.</p>
              </div>
            ) : (
              <div className="flex h-72 items-end gap-1 border-b border-l border-slate-800 px-2 pt-6 pb-2">
                {data.series.map((point) => {
                  const heightPercent = Math.max(4, (point.orders / maxOrders) * 100);
                  return (
                    <div
                      key={point.date}
                      className="group relative flex h-full min-w-4 flex-1 flex-col justify-end"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                        <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 text-[11px] text-white font-mono whitespace-nowrap shadow-xl border border-slate-700">
                          <span className="font-bold">{point.date}</span>
                          <span className="text-indigo-400 ml-1.5">{point.orders} đơn</span>
                        </div>
                        <div className="w-2 h-2 bg-slate-950 rotate-45 border-r border-b border-slate-700 -mt-1" />
                      </div>

                      {/* Bar with gradient and hover state */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all duration-200 ${
                          point.orders > 0
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 group-hover:from-indigo-500 group-hover:to-cyan-400 shadow-sm shadow-indigo-500/20'
                            : 'bg-slate-800/40 group-hover:bg-slate-800'
                        }`}
                      />

                      {/* Rotated Date Label */}
                      <span className="mt-2 block rotate-[-55deg] origin-top-left whitespace-nowrap text-[9px] font-mono text-slate-500 group-hover:text-slate-300">
                        {formatShortDate(point.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 mt-6 border-t border-slate-800/80">
            <span>Trục hoành: Ngày đặt hàng</span>
            <span>Trục tung: Tỷ lệ theo đơn cao nhất</span>
          </div>
        </div>

        {/* Top Purchased Themes */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Theme Được Mua Nhiều Nhất</h2>
                <p className="text-xs text-slate-400">Xếp hạng theo số lượt mua đã thanh toán</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 rounded-xl bg-slate-800/50 animate-pulse" />
                ))}
              </div>
            ) : !data?.top_themes?.length ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Chưa có dữ liệu theme được mua trong kỳ này.
              </div>
            ) : (
              <div className="space-y-3.5">
                {data.top_themes.map((theme, index) => (
                  <div
                    key={theme.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/themes/${theme.slug}`}
                          target="_blank"
                          className="text-xs font-bold text-white hover:text-indigo-400 transition truncate block"
                          title={theme.name}
                        >
                          {theme.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {theme.purchases} lượt mua
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400">
                        {formatVnd(theme.revenue_vnd)}
                      </div>
                      <div className="text-[11px] font-bold text-cyan-400">
                        {formatUsd(theme.revenue_usd)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Tối đa 5 themes bán chạy nhất</span>
            <Link
              href="/admin/themes"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition"
            >
              <span>Xem catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Revenue Breakdown Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Chi Tiết Doanh Thu Từng Ngày</h2>
            <p className="text-xs text-slate-400 mt-0.5">Bảng kê chi tiết số lượng đơn và doanh thu tách bạch VND / USD</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
            {data?.series?.length || 0} bản ghi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6">Ngày</th>
                <th className="py-4 px-4 text-center">Đơn Đã Thanh Toán</th>
                <th className="py-4 px-4 text-right">Doanh Thu VND</th>
                <th className="py-4 px-4 sm:px-6 text-right">Doanh Thu USD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    Đang tải danh sách dữ liệu doanh thu...
                  </td>
                </tr>
              ) : !data?.series?.length ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    Không có bản ghi doanh thu nào trong khoảng thời gian đã chọn.
                  </td>
                </tr>
              ) : (
                data.series.map((point) => (
                  <tr key={point.date} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-white whitespace-nowrap">
                      {point.date}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {point.orders}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-400 whitespace-nowrap">
                      {formatVnd(point.revenue_vnd)}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right font-bold text-cyan-400 whitespace-nowrap">
                      {formatUsd(point.revenue_usd)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Totals Footer Row */}
            {Boolean(data?.series?.length) && (
              <tfoot className="bg-slate-950/90 font-bold text-white border-t border-slate-800">
                <tr>
                  <td className="py-4 px-4 sm:px-6 uppercase text-xs tracking-wider text-slate-400">
                    Tổng Cộng ({days} ngày)
                  </td>
                  <td className="py-4 px-4 text-center text-indigo-300 text-sm">
                    {periodTotals.totalOrders}
                  </td>
                  <td className="py-4 px-4 text-right text-emerald-400 text-sm">
                    {formatVnd(periodTotals.totalVnd)}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right text-cyan-400 text-sm">
                    {formatUsd(periodTotals.totalUsd)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
