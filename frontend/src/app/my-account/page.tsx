'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Download,
  KeyRound,
  LogOut,
  PackageCheck,
  ReceiptText,
  UserRound,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  clearAuthToken,
  getAuthToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  type AuthUser,
} from '@/features/auth/auth-client';
import {
  getMyLicenses,
  getMyOrders,
  requestThemeDownload,
  type PortalLicense,
  type PortalOrder,
} from '@/features/account/api-client';

type Tab = 'overview' | 'themes' | 'licenses' | 'orders' | 'profile' | 'password';

function money(amount: number, currency: 'VND' | 'USD') {
  return currency === 'VND' ? amount.toLocaleString('vi-VN') + ' ₫' : '$' + amount;
}

function statusBadge(order: PortalOrder) {
  if (order.payment_status === 'paid' && order.order_status === 'completed') {
    return {
      label: 'Đã thanh toán',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500',
    };
  }
  if (order.payment_status === 'failed' || order.order_status === 'cancelled') {
    return {
      label: 'Thất bại / Đã hủy',
      color: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-500',
    };
  }
  return {
    label: 'Chờ thanh toán',
    color: 'bg-amber-50 text-amber-700 border-amber-200/60',
    dot: 'bg-amber-500',
  };
}

function MyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as Tab | null;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [licenses, setLicenses] = useState<PortalLicense[]>([]);
  const [tab, setTab] = useState<Tab>(() => {
    if (tabParam && ['overview', 'themes', 'licenses', 'orders', 'profile', 'password'].includes(tabParam)) {
      return tabParam;
    }
    return 'overview';
  });

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Profile Edit State
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Edit State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync tab with URL query parameter
  useEffect(() => {
    if (tabParam && ['overview', 'themes', 'licenses', 'orders', 'profile', 'password'].includes(tabParam)) {
      setTab(tabParam);
    }
  }, [tabParam]);

  async function loadPortal() {
    if (!getAuthToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const nextUser = await getCurrentUser();
      setUser(nextUser);
      setEditFullName(nextUser.full_name || '');
      setEditPhone(nextUser.phone || '');

      // Load orders and licenses
      try {
        const [nextOrders, nextLicenses] = await Promise.all([
          getMyOrders().catch(() => []),
          getMyLicenses().catch(() => []),
        ]);
        setOrders(nextOrders || []);
        setLicenses(nextLicenses || []);
      } catch {
        setOrders([]);
        setLicenses([]);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPortal();
  }, []);

  const paidOrders = orders.filter(
    (order) => order.payment_status === 'paid' && order.order_status === 'completed'
  );

  const purchasedThemes = useMemo(() => {
    const themes = new Map<number, { id: number; name: string; orderNumber: string; license: string }>();
    paidOrders.forEach((order) =>
      order.items.forEach((item) =>
        themes.set(item.theme_id, {
          id: item.theme_id,
          name: item.theme_name,
          orderNumber: order.orderNumber,
          license: item.license_type,
        })
      )
    );
    return [...themes.values()];
  }, [paidOrders]);

  async function handleDownload(license: PortalLicense) {
    setActionMessage(null);
    try {
      await requestThemeDownload(license.license_key);
      setActionMessage({
        type: 'success',
        text: `Đang khởi tạo tệp tải xuống cho "${license.theme_name || 'Theme'}". Vui lòng kiểm tra mục tải xuống của trình duyệt!`,
      });
    } catch (error) {
      setActionMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Chưa thể tải tệp lúc này. Vui lòng thử lại sau.',
      });
    }
  }

  function handleCopyLicense(key: string) {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      const updated = await updateProfile({
        full_name: editFullName.trim(),
        phone: editPhone.trim() || undefined,
      });
      setUser(updated);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công!' });
    } catch (error: any) {
      setProfileMsg({ type: 'error', text: error?.message || 'Không thể cập nhật hồ sơ.' });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword });
      setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordMsg({ type: 'error', text: error?.message || 'Đổi mật khẩu thất bại.' });
    } finally {
      setPasswordSaving(false);
    }
  }

  function handleLogout() {
    clearAuthToken();
    setUser(null);
    window.location.href = '/login';
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
        {/* ========================================================================= */}
        {/* STATE: NOT LOGGED IN (Sleek card instead of ugly raw login form)           */}
        {/* ========================================================================= */}
        {!user && !loading && (
          <section className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)] text-center my-12 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Customer Portal</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Khu vực quản lý License Key bản quyền, tải theme và xem hóa đơn mua hàng dành riêng cho khách hàng đã đăng nhập.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/login?redirect=/my-account"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:scale-[1.02] transition"
              >
                <span>Đăng Nhập Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
              >
                Về Trang Chủ
              </Link>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* STATE: LOADING                                                            */}
        {/* ========================================================================= */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Đang tải bảng điều khiển tài khoản…</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE: AUTHENTICATED USER DASHBOARD                                       */}
        {/* ========================================================================= */}
        {user && !loading && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* HERO COVER BANNER */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-1/4 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl sm:text-3xl font-black flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 border-2 border-white/20">
                    {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-white">
                        {user.full_name || 'Khách hàng ThemeStore'}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        {user.role === 'admin'
                          ? 'Quản trị viên'
                          : user.role === 'author'
                          ? 'Tác giả VIP'
                          : 'Khách hàng VIP'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.email}</span>
                      {user.phone && (
                        <>
                          <span>·</span>
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.phone}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Bảng điều khiển Admin</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-200 border border-white/10 font-bold text-xs transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>

              {/* QUICK METRICS BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                    <span>Theme sở hữu</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{purchasedThemes.length}</div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>License kích hoạt</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {licenses.filter((l) => l.status === 'active').length}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <ReceiptText className="w-4 h-4 text-sky-400" />
                    <span>Tổng đơn hàng</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{orders.length}</div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Bảo mật tài khoản</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã bảo vệ 256-bit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB CONTROLS */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-200/90 shadow-xs flex overflow-x-auto gap-1">
              {[
                { id: 'overview', label: 'Tổng quan', icon: Layers },
                { id: 'themes', label: 'Kho Theme & Tải về', icon: PackageCheck, count: purchasedThemes.length },
                { id: 'licenses', label: 'Quản lý License', icon: KeyRound, count: licenses.length },
                { id: 'orders', label: 'Lịch sử đơn hàng', icon: ReceiptText, count: orders.length },
                { id: 'profile', label: 'Thông tin cá nhân', icon: UserRound },
                { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
              ].map(({ id, label, icon: Icon, count }) => {
                const isActive = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTab(id as Tab);
                      setActionMessage(null);
                    }}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {typeof count === 'number' && count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ACTION ALERT TOAST */}
            {actionMessage && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-in fade-in ${
                  actionMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {actionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB CONTENT: OVERVIEW                                                 */}
            {/* ===================================================================== */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Left 2 cols: Quick Start Guide & Recent Themes */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Welcome Box */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="font-black text-slate-900 text-base">Hướng dẫn kích hoạt bản quyền Theme</h2>
                          <p className="text-xs text-slate-500">3 bước đơn giản để kích hoạt theme trên WordPress</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="font-extrabold text-blue-600 text-sm block mb-1">01</span>
                          <strong className="block text-slate-800 font-bold mb-0.5">Tải tệp ZIP</strong>
                          <span className="text-slate-500">Vào tab &quot;Kho Theme&quot; và tải bản cài đặt mới nhất.</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="font-extrabold text-indigo-600 text-sm block mb-1">02</span>
                          <strong className="block text-slate-800 font-bold mb-0.5">Cài lên WordPress</strong>
                          <span className="text-slate-500">Giao diện → Thêm mới → Tải giao diện lên → Kích hoạt.</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="font-extrabold text-emerald-600 text-sm block mb-1">03</span>
                          <strong className="block text-slate-800 font-bold mb-0.5">Dán License Key</strong>
                          <span className="text-slate-500">Sao chép mã tại tab &quot;License&quot; để nhận cập nhật tự động.</span>
                        </div>
                      </div>
                    </div>

                    {/* Recently Purchased Themes */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-slate-900 text-base">Theme đã sở hữu gần đây</h3>
                        <button
                          type="button"
                          onClick={() => setTab('themes')}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Xem tất cả</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {purchasedThemes.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <PackageCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-600">Bạn chưa có Theme nào trong tài khoản.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 mb-4">
                            Sau khi thanh toán đơn hàng thành công, theme sẽ tự động xuất hiện tại đây.
                          </p>
                          <Link
                            href="/themes"
                            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                          >
                            <span>Khám phá kho Theme</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {purchasedThemes.slice(0, 4).map((theme) => (
                            <div
                              key={theme.id}
                              className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition flex items-center justify-between gap-3 group"
                            >
                              <div className="min-w-0">
                                <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition">
                                  {theme.name}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Đơn #{theme.orderNumber} · {theme.license}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setTab('licenses')}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-[11px] transition shrink-0 cursor-pointer"
                              >
                                License
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right 1 col: Account Overview Card */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                      <h3 className="font-black text-slate-900 text-sm">Hồ sơ khách hàng</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">Họ và tên</span>
                          <span className="font-bold text-slate-900">{user.full_name || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">Email</span>
                          <span className="font-bold text-slate-900 truncate max-w-[160px]">{user.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">Số điện thoại</span>
                          <span className="font-bold text-slate-900">{user.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">Quyền hạn</span>
                          <span className="font-bold text-blue-600 uppercase">{user.role || 'customer'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTab('profile')}
                        className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 font-bold text-xs transition cursor-pointer"
                      >
                        Chỉnh sửa thông tin
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-blue-100/80 p-5 space-y-2">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span>Cần hỗ trợ kỹ thuật?</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Đội ngũ kỹ thuật viên ThemeStore Pro sẵn sàng hỗ trợ bạn cài đặt theme và sửa lỗi 24/7.
                      </p>
                      <a
                        href="https://zalo.me"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 pt-1"
                      >
                        <span>Chat với hỗ trợ viên</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB CONTENT: THEMES & DOWNLOADS                                       */}
            {/* ===================================================================== */}
            {tab === 'themes' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Kho Theme đã mua</h2>
                    <p className="text-xs text-slate-500">Tải tệp mã nguồn (.ZIP) sạch 100%, không giới hạn số lần tải.</p>
                  </div>
                  <Link
                    href="/themes"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Mua thêm Theme</span>
                  </Link>
                </div>

                {purchasedThemes.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-sm text-slate-800 mb-1">Chưa có theme nào được kích hoạt</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                      Sau khi bạn thanh toán đơn hàng thành công qua VietQR hoặc cổng thanh toán, Theme sẽ xuất hiện tại đây ngay lập tức.
                    </p>
                    <Link
                      href="/themes"
                      className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                    >
                      <span>Xem danh mục Theme bán chạy</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {purchasedThemes.map((theme) => {
                      const matchedLicense = licenses.find((l) => l.theme_name === theme.name) || licenses[0];
                      return (
                        <div
                          key={theme.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-blue-200 transition flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                              <PackageCheck className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 mb-1">{theme.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-[10px]">
                                Đơn #{theme.orderNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                                {theme.license}
                              </span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100 space-y-2">
                            {matchedLicense ? (
                              <button
                                type="button"
                                onClick={() => handleDownload(matchedLicense)}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                                <span>Tải Theme (.ZIP)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setTab('licenses')}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                              >
                                <KeyRound className="w-4 h-4" />
                                <span>Xem License Key</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB CONTENT: LICENSES                                                 */}
            {/* ===================================================================== */}
            {tab === 'licenses' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Quản lý Bản quyền (License Keys)</h2>
                    <p className="text-xs text-slate-500">Mã kích hoạt chính hãng dùng để kích hoạt tính năng tự động cập nhật.</p>
                  </div>
                </div>

                {licenses.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <KeyRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-sm text-slate-800 mb-1">Chưa có License Key nào</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                      License Key sẽ được hệ thống tự động sinh và gửi cho bạn ngay khi đơn hàng hoàn tất.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {licenses.map((license) => (
                      <div
                        key={license.license_key}
                        className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="font-bold text-sm text-slate-900">{license.theme_name || 'WordPress Theme'}</h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                license.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {license.status === 'active' ? 'Đang hoạt động' : 'Hết hạn'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {license.license_type || 'Regular'}
                            </span>
                          </div>

                          {/* License Key Box with Copy Button */}
                          <div className="flex items-center gap-2 mt-2">
                            <code className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 font-mono text-xs font-bold text-slate-800 tracking-wider">
                              {license.license_key}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyLicense(license.license_key)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition cursor-pointer"
                            >
                              {copiedKey === license.license_key ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold">Đã sao chép!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Sao chép</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2">
                            Sử dụng tối đa: <strong>{license.max_domains || 1} tên miền</strong> (domain) hoạt động đồng thời.
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownload(license)}
                            className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải gói Theme</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB CONTENT: ORDERS                                                   */}
            {/* ===================================================================== */}
            {tab === 'orders' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Lịch sử đơn hàng</h2>
                    <p className="text-xs text-slate-500">Tra cứu các hóa đơn thanh toán và biên nhận điện tử.</p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <ReceiptText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-sm text-slate-800 mb-1">Chưa có giao dịch đơn hàng nào</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                      Bạn chưa thực hiện đơn đặt mua theme nào. Hãy dạo quanh kho giao diện để chọn theme ưng ý nhé!
                    </p>
                    <Link
                      href="/themes"
                      className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                    >
                      <span>Xem kho Theme</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const badge = statusBadge(order);
                      return (
                        <div
                          key={order.orderNumber}
                          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-black text-sm text-slate-900">#{order.orderNumber}</span>
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                  <span>{badge.label}</span>
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                                <span>· Phương thức: {order.payment_method?.toUpperCase()}</span>
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <span className="text-base font-black text-slate-900 block">
                                {money(order.total_amount, order.currency)}
                              </span>
                              <Link
                                href={`/checkout/order-received?order=${encodeURIComponent(order.orderNumber)}`}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>Xem biên nhận</span>
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-600">
                            {order.items.map((item) => (
                              <span key={item.theme_id} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                                {item.theme_name} ({item.license_type})
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB CONTENT: PROFILE                                                  */}
            {/* ===================================================================== */}
            {tab === 'profile' && (
              <div className="max-w-2xl bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-black text-slate-900">Thông tin cá nhân</h2>
                  <p className="text-xs text-slate-500">Cập nhật họ tên và thông tin liên lạc của tài khoản.</p>
                </div>

                {profileMsg && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-3 ${
                      profileMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {profileMsg.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        placeholder="Nhập họ và tên đầy đủ"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Địa chỉ Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        disabled
                        type="email"
                        value={user.email}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Email đăng nhập cố định liên kết với xác thực Google / Hệ thống.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Số điện thoại liên hệ</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="Ví dụ: 0912 345 678"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                    >
                      {profileSaving ? 'Đang lưu…' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB CONTENT: PASSWORD                                                 */}
            {/* ===================================================================== */}
            {tab === 'password' && (
              <div className="max-w-2xl bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-black text-slate-900">Đổi mật khẩu tài khoản</h2>
                  <p className="text-xs text-slate-500">Cập nhật mật khẩu định kỳ để nâng cao bảo mật tài khoản.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800 leading-relaxed mb-6 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Lưu ý đối với tài khoản Google / GitHub:</span>
                    <p className="mt-0.5 text-blue-700">
                      Nếu bạn sử dụng tính năng Đăng nhập bằng Google hoặc GitHub, tài khoản của bạn đã được bảo vệ bởi bảo mật 2 lớp của Google/GitHub và không bắt buộc phải đặt mật khẩu riêng.
                    </p>
                  </div>
                </div>

                {passwordMsg && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-3 ${
                      passwordMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {passwordMsg.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                    >
                      {passwordSaving ? 'Đang cập nhật…' : 'Cập nhật mật khẩu'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function MyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
          <Header />
          <main className="w-full max-w-7xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-500">Đang tải Customer Portal…</p>
          </main>
          <Footer />
        </div>
      }
    >
      <MyAccountContent />
    </Suspense>
  );
}
