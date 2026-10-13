'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  KeyRound,
  Users,
  Store,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AdminGuard, useAdminContext } from '@/features/admin/AdminGuard';
import { ThemeSwitcherPill } from '@/components/layout/AmbientBackground';
import { clearAuthToken } from '@/features/auth/auth-client';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tổng Quan', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Đơn Hàng', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Themes Catalog', href: '/admin/themes', icon: Layers },
  { label: 'Quản Lý Bản Quyền', href: '/admin/licenses', icon: KeyRound },
  { label: 'Khách Hàng & RBAC', href: '/admin/customers', icon: Users },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuthToken();
    router.replace('/login');
  };

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out md:static ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <Link
            href="/admin"
            className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'md:justify-center' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-sm tracking-tight text-white truncate">THEME PORTAL</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 truncate">
                  Admin Console
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                    active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                />
                {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
          {/* Storefront Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition ${
              isCollapsed ? 'md:justify-center md:px-0' : ''
            }`}
            title={isCollapsed ? 'Xem Cửa Hàng' : undefined}
          >
            <Store className="w-5 h-5 text-emerald-400 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="truncate">Xem Cửa Hàng</span>}
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition cursor-pointer ${
              isCollapsed ? 'md:justify-center md:px-0' : ''
            }`}
            title={isCollapsed ? 'Đăng xuất' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="truncate">Đăng Xuất</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs font-bold transition mt-2 cursor-pointer"
            aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Area: Topbar + Page Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Topbar */}
        <header className="h-16 sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0">
          {/* Left Controls (Mobile Menu Toggle + Page Context) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="hidden sm:inline">Quản Trị Hệ Thống</span>
              <span className="hidden sm:inline text-slate-600">/</span>
              <span className="text-white">
                {NAV_ITEMS.find((n) => isActive(n))?.label || 'Bảng Điều Khiển'}
              </span>
            </div>
          </div>

          {/* Right Controls (Theme Switcher + Admin Profile) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Switcher Pill */}
            <ThemeSwitcherPill compact />

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-black text-xs shrink-0">
                {user?.full_name ? user.full_name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">
                  {user?.full_name || 'Quản Trị Viên'}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">
                  {user?.email}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminGuard>
  );
}
