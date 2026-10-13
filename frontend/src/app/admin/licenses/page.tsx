'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Search,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Globe,
  Trash2,
  X,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  getLicenses,
  getLicenseDetail,
  deactivateLicenseDomain,
  resetLicenseDomains,
  AdminLicense,
  AdminLicenseDetail,
  Pagination,
} from '@/features/admin/api-client';

function LicensesManagementContent() {
  const [licenses, setLicenses] = useState<AdminLicense[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Activations Modal State
  const [selectedLicenseKey, setSelectedLicenseKey] = useState<string | null>(null);
  const [licenseDetail, setLicenseDetail] = useState<AdminLicenseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; success: boolean } | null>(null);

  const loadLicenses = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLicenses({
        page,
        limit: 10,
        search: searchTerm.trim() || undefined,
        status: statusFilter || undefined,
      });
      setLicenses(res.licenses);
      setPagination(res.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách bản quyền.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLicenses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenDetailModal = async (licenseKey: string) => {
    setSelectedLicenseKey(licenseKey);
    setActionMessage(null);
    try {
      setDetailLoading(true);
      const detail = await getLicenseDetail(licenseKey);
      setLicenseDetail(detail);
    } catch (err: any) {
      alert(err?.message || 'Không thể tải chi tiết license.');
      setSelectedLicenseKey(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeactivateDomain = async (domain: string) => {
    if (!selectedLicenseKey) return;
    if (!confirm(`Bạn có chắc chắn muốn hủy kích hoạt domain "${domain}"?`)) return;

    try {
      setActionMessage(null);
      await deactivateLicenseDomain(selectedLicenseKey, domain);
      setActionMessage({ text: `Đã hủy kích hoạt domain "${domain}" thành công.`, success: true });
      // Reload detail
      const detail = await getLicenseDetail(selectedLicenseKey);
      setLicenseDetail(detail);
      // Reload main table to sync quota
      loadLicenses(currentPage);
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Không thể hủy kích hoạt domain.', success: false });
    }
  };

  const handleResetDomains = async () => {
    if (!selectedLicenseKey) return;
    if (!confirm(`CẢNH BÁO: Đặt lại toàn bộ domain cho license "${selectedLicenseKey}"? Mọi domain đang kích hoạt sẽ bị hủy.`)) return;

    try {
      setActionMessage(null);
      await resetLicenseDomains(selectedLicenseKey);
      setActionMessage({ text: 'Đã đặt lại toàn bộ domain thành công!', success: true });
      const detail = await getLicenseDetail(selectedLicenseKey);
      setLicenseDetail(detail);
      loadLicenses(currentPage);
    } catch (err: any) {
      setActionMessage({ text: err?.message || 'Không thể đặt lại domain.', success: false });
    }
  };

  const renderQuotaBadge = (active: number, max: number) => {
    const ratio = max > 0 ? active / max : 0;
    let colorClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    let barColor = 'bg-emerald-500';

    if (ratio >= 1) {
      colorClass = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      barColor = 'bg-rose-500';
    } else if (ratio >= 0.8) {
      colorClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      barColor = 'bg-amber-500';
    }

    return (
      <div className="space-y-1 min-w-[110px]">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-300">{active} / {max} domains</span>
          <span className={`px-1.5 py-0.2 rounded border text-[9px] font-black uppercase ${colorClass}`}>
            {ratio >= 1 ? 'HẾT QUOTA' : `${Math.round(ratio * 100)}%`}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(100, ratio * 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-purple-400" />
            <span>Quản Lý Bản Quyền (Licenses)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi quota kích hoạt domain, kiểm tra khóa bản quyền và giải phóng giới hạn thiết bị.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLicenses(currentPage)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadLicenses(1);
          }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã License Key, email khách hàng hoặc tên theme..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-purple-500 transition cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang kích hoạt (active)</option>
              <option value="expired">Đã hết hạn (expired)</option>
              <option value="revoked">Đã thu hồi (revoked)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-purple-600/20"
            >
              Lọc
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Licenses Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6">Mã License Key</th>
                <th className="py-4 px-4">Theme Áp Dụng</th>
                <th className="py-4 px-4">Gói Bản Quyền</th>
                <th className="py-4 px-4">Sử Dụng Quota</th>
                <th className="py-4 px-4">Khách Hàng & Đơn</th>
                <th className="py-4 px-4">Trạng Thái</th>
                <th className="py-4 px-4 sm:px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Đang tải danh sách bản quyền...
                  </td>
                </tr>
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Không tìm thấy bản quyền nào.
                  </td>
                </tr>
              ) : (
                licenses.map((lic) => (
                  <tr key={lic.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-300 select-all text-xs">
                          {lic.license_key}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(lic.license_key)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Sao chép License Key"
                        >
                          {copiedKey === lic.license_key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Cấp ngày: {lic.created_at ? new Date(lic.created_at).toLocaleDateString('vi-VN') : '---'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{lic.theme_name}</div>
                      {lic.theme_slug && (
                        <div className="text-[11px] text-slate-400 font-mono">slug: {lic.theme_slug}</div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/40 text-[11px] font-bold uppercase tracking-wider">
                        {lic.license_type}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {renderQuotaBadge(lic.active_domains_count ?? 0, lic.max_domains ?? 1)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{lic.customer_name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{lic.customer_email}</div>
                      {lic.order_number && (
                        <Link
                          href={`/admin/orders/${lic.order_number}`}
                          className="text-[10px] text-indigo-400 hover:underline font-mono inline-block mt-0.5"
                        >
                          Đơn: {lic.order_number}
                        </Link>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          lic.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {lic.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenDetailModal(lic.license_key)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold transition cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Domain Quota</span>
                      </button>
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
            Hiển thị <strong>{licenses.length}</strong> / <strong>{pagination.total}</strong> bản quyền
            (Trang {pagination.page} / {pagination.total_pages || 1})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => loadLicenses(pagination.page - 1)}
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
              onClick={() => loadLicenses(pagination.page + 1)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVATIONS & DOMAIN DEACTIVATION MODAL */}
      {selectedLicenseKey && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedLicenseKey(null)}
        >
          <div
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Kích Hoạt Domain & Giới Hạn Quota</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Khóa: {selectedLicenseKey}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLicenseKey(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Feedback Banner */}
            {actionMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  actionMessage.success
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {actionMessage.text}
              </div>
            )}

            {detailLoading || !licenseDetail ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Đang tải danh sách domain kích hoạt...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Quota Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Quota Kích Hoạt Tối Đa:</span>
                    <span className="text-lg font-black text-white">
                      {licenseDetail.max_domains} domains ({licenseDetail.license_type})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetDomains}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-bold transition cursor-pointer"
                    title="Hủy kích hoạt toàn bộ domain để cấp lại"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Quota</span>
                  </button>
                </div>

                {/* Activations List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Danh Sách Domain Đã Gán ({licenseDetail.activations?.length || 0})
                  </h4>

                  {licenseDetail.activations && licenseDetail.activations.length > 0 ? (
                    <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                      {licenseDetail.activations.map((act) => (
                        <div
                          key={act.id}
                          className="p-3.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Globe className="w-3.5 h-3.5 text-indigo-400" />
                              <strong className="text-white font-mono">{act.domain}</strong>
                              {act.is_active ? (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  Active
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                                  Deactivated
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              IP: {act.ip_address || '127.0.0.1'} | Ngày kích hoạt: {new Date(act.activated_at).toLocaleString('vi-VN')}
                            </div>
                          </div>

                          {act.is_active ? (
                            <button
                              type="button"
                              onClick={() => handleDeactivateDomain(act.domain)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-bold transition cursor-pointer"
                              title="Hủy kích hoạt domain này để giải phóng quota"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hủy kích hoạt</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">Đã giải phóng</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                      Chưa có domain nào kích hoạt trên license key này.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLicensesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Đang tải danh sách bản quyền...</div>}>
      <LicensesManagementContent />
    </Suspense>
  );
}
