'use client';

import { useEffect, useState } from 'react';
import { Copy, RefreshCw, Search } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { dateTime } from '@/lib/format';
import type { License, Pagination as PaginationInfo } from '@/lib/types';
import { EmptyState, ErrorState, LoadingBlock, PageHeader, Pagination, Panel, StatusBadge } from '@/components/primitives';

export function LicenseManager() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = () => {
    setLoading(true); setError('');
    adminApi.licenses({ page, search, status })
      .then((data) => { setLicenses(data.licenses); setPagination(data.pagination); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Không thể tải license.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [page, search, status]);

  const copy = async (key: string) => {
    try { await navigator.clipboard.writeText(key); setNotice('Đã sao chép license key.'); }
    catch { setNotice('Trình duyệt không cho phép sao chép key.'); }
  };

  return <>
    <PageHeader eyebrow="Bản quyền" title="License đã cấp" />
    <p className="-mt-4 mb-5 text-sm text-slate-500">Chỉ xem dữ liệu quyền sở hữu. Việc cấp, thu hồi hoặc kích hoạt license tiếp tục thuộc luồng backend chuyên biệt.</p>
    {notice && <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</p>}
    <Panel className="mb-5 p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
        <label className="relative"><Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} /><span className="sr-only">Tìm license</span><input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm" placeholder="License key, theme hoặc email" /></label>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Tất cả trạng thái</option><option value="active">Active</option><option value="expired">Expired</option><option value="revoked">Revoked</option></select>
        <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600"><RefreshCw size={16} /> Làm mới</button>
      </div>
    </Panel>
    {error ? <ErrorState message={error} retry={load} /> : loading ? <Panel><LoadingBlock lines={8} /></Panel> : <Panel>
      {licenses.length === 0 ? <EmptyState title="Không có license" detail="Không tìm thấy license khớp điều kiện hiện tại." /> : <>
        <div className="table-scroll"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">License key</th><th className="px-5 py-3">Theme / khách hàng</th><th className="px-5 py-3">Loại</th><th className="px-5 py-3">Domain</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Cấp lúc</th></tr></thead><tbody className="divide-y divide-slate-100">
          {licenses.map((license) => <tr key={license.id}><td className="px-5 py-4"><button onClick={() => copy(license.license_key)} title="Sao chép key" className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 hover:text-blue-600">{license.license_key}<Copy size={14} /></button></td><td className="px-5 py-4"><p className="font-bold text-slate-800">{license.theme_name || '—'}</p><p className="text-xs text-slate-500">{license.customer_email || 'Chưa gắn khách hàng'}</p></td><td className="px-5 py-4 capitalize text-slate-600">{license.license_type}</td><td className="px-5 py-4 font-semibold text-slate-700">{license.active_domains_count}/{license.max_domains}</td><td className="px-5 py-4"><StatusBadge value={license.status} /></td><td className="px-5 py-4 text-slate-500">{dateTime(license.created_at)}</td></tr>)}
        </tbody></table></div>
        {pagination && <Pagination pagination={pagination} onPage={setPage} />}
      </>}
    </Panel>}
  </>;
}
