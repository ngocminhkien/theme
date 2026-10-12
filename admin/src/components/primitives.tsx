'use client';

import { AlertCircle, ChevronLeft, ChevronRight, Inbox, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Pagination as PaginationInfo } from '@/lib/types';

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div><p className="mb-1 text-xs font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p><h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1></div>
    {children && <div className="flex flex-wrap gap-2">{children}</div>}
  </div>;
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white shadow-panel ${className}`}>{children}</section>;
}

export function LoadingBlock({ lines = 4 }: { lines?: number }) {
  return <div className="space-y-3 p-6">{Array.from({ length: lines }, (_, index) => <div key={index} className="skeleton h-5 w-full" />)}</div>;
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-8 text-center"><div className="rounded-full bg-blue-50 p-3 text-blue-600"><Inbox size={24} /></div><h2 className="font-semibold text-slate-800">{title}</h2><p className="max-w-sm text-sm leading-6 text-slate-500">{detail}</p></div>;
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-900"><AlertCircle size={24} /><p className="max-w-lg text-sm">{message}</p>{retry && <button onClick={retry} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-rose-200">Thử lại</button>}</div>;
}

const badge: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100', completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100', active: 'bg-emerald-50 text-emerald-700 ring-emerald-100', published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  pending: 'bg-amber-50 text-amber-700 ring-amber-100', processing: 'bg-amber-50 text-amber-700 ring-amber-100', draft: 'bg-slate-100 text-slate-600 ring-slate-200',
  failed: 'bg-rose-50 text-rose-700 ring-rose-100', cancelled: 'bg-rose-50 text-rose-700 ring-rose-100', revoked: 'bg-rose-50 text-rose-700 ring-rose-100', banned: 'bg-rose-50 text-rose-700 ring-rose-100', archived: 'bg-slate-100 text-slate-600 ring-slate-200', expired: 'bg-slate-100 text-slate-600 ring-slate-200', inactive: 'bg-slate-100 text-slate-600 ring-slate-200', refunded: 'bg-purple-50 text-purple-700 ring-purple-100',
};
export function StatusBadge({ value }: { value: string }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ring-inset ${badge[value] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>{value}</span>; }

export function Pagination({ pagination, onPage }: { pagination: PaginationInfo; onPage: (page: number) => void }) {
  if (pagination.total_pages <= 1) return null;
  return <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500"><span>{pagination.total} kết quả</span><div className="flex items-center gap-2"><button aria-label="Trang trước" disabled={pagination.page <= 1} onClick={() => onPage(pagination.page - 1)} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronLeft size={17} /></button><span>Trang {pagination.page}/{pagination.total_pages}</span><button aria-label="Trang sau" disabled={pagination.page >= pagination.total_pages} onClick={() => onPage(pagination.page + 1)} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronRight size={17} /></button></div></div>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-0 sm:items-center sm:justify-center sm:p-5"><div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"><div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4"><h2 className="font-heading font-bold text-slate-900">{title}</h2><button onClick={onClose} aria-label="Đóng" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div>{children}</div></div>;
}
