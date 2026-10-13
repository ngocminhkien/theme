'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, ChevronLeft, ClipboardList, LayoutDashboard, LogOut, Menu, PackageOpen, ShieldCheck, UsersRound, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { clearAdminSession } from '@/lib/auth';
import type { AdminUser } from '@/lib/types';

const menu = [
  { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/themes', label: 'Quản lý theme', icon: PackageOpen },
  { href: '/orders', label: 'Đơn hàng', icon: ClipboardList },
  { href: '/customers', label: 'Khách hàng', icon: UsersRound },
  { href: '/licenses', label: 'Bản quyền', icon: ShieldCheck },
  { href: '/reports', label: 'Báo cáo', icon: BarChart3 },
];
const titles: Record<string, string> = { dashboard: 'Tổng quan', themes: 'Quản lý theme', orders: 'Đơn hàng', customers: 'Khách hàng', licenses: 'Bản quyền', reports: 'Báo cáo' };

export function AdminShell({ user, children }: { user: AdminUser; children: ReactNode }) {
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const key = pathname.split('/')[1] || 'dashboard';
  const signOut = () => { clearAdminSession(); router.replace('/login'); };
  const nav = (mobile = false) => <nav className="space-y-1 px-3 py-5">{menu.map(({ href, label, icon: Icon }) => {
    const active = pathname === href;
    return <Link onClick={() => mobile && setMobileOpen(false)} key={href} href={href} title={compact ? label : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}><Icon size={19} /><span className={compact && !mobile ? 'lg:hidden' : ''}>{label}</span></Link>;
  })}</nav>;
  return <div className="min-h-screen bg-[#f5f7fb]">
    {mobileOpen && <button aria-label="Đóng điều hướng" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy transition-[width,transform] duration-200 ${compact ? 'lg:w-20' : 'lg:w-72'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5"><Link href="/dashboard" className="flex min-w-0 items-center gap-3 text-white"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-500 font-heading text-lg font-black">T</span><span className={compact ? 'hidden' : 'font-heading font-extrabold tracking-tight'}>ThemeStore</span></Link><button onClick={() => setMobileOpen(false)} className="text-slate-400 lg:hidden"><X size={21} /></button></div>
      {nav(mobileOpen)}
      <div className="mt-auto border-t border-white/10 p-3"><div className={`mb-3 flex items-center gap-3 px-2 ${compact ? 'lg:justify-center' : ''}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">{user.full_name.slice(0, 1).toUpperCase()}</span><div className={compact ? 'lg:hidden' : 'min-w-0'}><p className="truncate text-sm font-semibold text-white">{user.full_name}</p><p className="truncate text-xs text-slate-400">Administrator</p></div></div><button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/10 hover:text-white"><LogOut size={18} /><span className={compact ? 'lg:hidden' : ''}>Đăng xuất</span></button></div>
    </aside>
    <main className={`min-h-screen transition-[margin] duration-200 ${compact ? 'lg:ml-20' : 'lg:ml-72'}`}><header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} aria-label="Mở menu" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={20} /></button><button onClick={() => setCompact(!compact)} aria-label="Thu gọn menu" className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:block"><ChevronLeft className={compact ? 'rotate-180' : ''} size={19} /></button><div><p className="text-xs text-slate-400">Quản trị / <span className="text-slate-500">{titles[key]}</span></p><p className="font-heading text-base font-bold text-ink">{titles[key]}</p></div></div><div className="hidden text-right sm:block"><p className="text-sm font-bold text-slate-800">{user.full_name}</p><p className="text-xs text-slate-500">{user.email}</p></div></header><div className="mx-auto max-w-[1550px] p-4 sm:p-7">{children}</div></main>
  </div>;
}
