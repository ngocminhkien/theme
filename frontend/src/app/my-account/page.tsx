'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, KeyRound, LogOut, PackageCheck, ReceiptText, UserRound } from 'lucide-react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { clearAuthToken, getAuthToken, getCurrentUser, login, register, type AuthUser } from '@/features/auth/auth-client';
import { getMyLicenses, getMyOrders, requestThemeDownload, type PortalLicense, type PortalOrder } from '@/features/account/api-client';

type Tab = 'overview' | 'orders' | 'themes' | 'licenses';

function money(amount: number, currency: 'VND' | 'USD') {
  return currency === 'VND' ? amount.toLocaleString('vi-VN') + ' đ' : '$' + amount;
}

function statusText(order: PortalOrder) {
  if (order.payment_status === 'paid' && order.order_status === 'completed') return 'Đã thanh toán';
  if (order.payment_status === 'failed' || order.order_status === 'cancelled') return 'Không thành công';
  return 'Đang chờ thanh toán';
}

function MyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [licenses, setLicenses] = useState<PortalLicense[]>([]);
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const returnTo = searchParams.get('returnTo');
  const safeReturnTo = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : null;

  async function loadPortal() {
    if (!getAuthToken()) { setLoading(false); return; }
    setLoading(true);
    try {
      const [nextUser, nextOrders, nextLicenses] = await Promise.all([getCurrentUser(), getMyOrders(), getMyLicenses()]);
      setUser(nextUser);
      setOrders(nextOrders);
      setLicenses(nextLicenses);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Chưa tải được Customer Portal.');
      setUser(null);
    } finally { setLoading(false); }
  }

  useEffect(() => { void loadPortal(); }, []);

  const paidOrders = orders.filter(order => order.payment_status === 'paid' && order.order_status === 'completed');
  const purchasedThemes = useMemo(() => {
    const themes = new Map<number, { id: number; name: string; orderNumber: string; license: string }>();
    paidOrders.forEach(order => order.items.forEach(item => themes.set(item.theme_id, {
      id: item.theme_id, name: item.theme_name, orderNumber: order.orderNumber, license: item.license_type,
    })));
    return [...themes.values()];
  }, [paidOrders]);

  async function submitAuth(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    setBusy(true);
    try {
      const session = authMode === 'login'
        ? await login(email.trim(), password)
        : await register({ full_name: fullName.trim(), email: email.trim(), password, phone: phone.trim() || undefined });
      setUser(session.user);
      if (safeReturnTo) router.replace(safeReturnTo);
      else await loadPortal();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể xác thực tài khoản.');
    } finally { setBusy(false); }
  }

  async function download(license: PortalLicense) {
    setMessage('');
    try {
      await requestThemeDownload(license.license_key);
      setMessage('Đang chuẩn bị tệp tải xuống.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Chưa thể chuẩn bị tệp tải xuống.');
    }
  }

  function logout() {
    clearAuthToken();
    setUser(null); setOrders([]); setLicenses([]); setMessage('Đã đăng xuất.');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 py-10 flex-1">
        {!user && !loading && <section className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6"><div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center"><UserRound className="w-6 h-6" /></div><div><h1 className="text-xl font-black">Đăng Nhập Customer Portal</h1><p className="text-xs text-slate-500">Đơn hàng và license chỉ hiển thị cho tài khoản sở hữu.</p></div></div>
          <form onSubmit={submitAuth} className="space-y-4">
            {authMode === 'register' && <label className="block text-xs font-bold text-slate-700">Họ và tên<input required value={fullName} onChange={event => setFullName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal" /></label>}
            <label className="block text-xs font-bold text-slate-700">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal" /></label>
            {authMode === 'register' && <label className="block text-xs font-bold text-slate-700">Số điện thoại (tuỳ chọn)<input value={phone} onChange={event => setPhone(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal" /></label>}
            <label className="block text-xs font-bold text-slate-700">Mật khẩu<input required minLength={6} type="password" value={password} onChange={event => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal" /></label>
            {message && <p className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700" role="alert">{message}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-brand-600 py-3 text-xs font-bold text-white disabled:opacity-50">{busy ? 'Đang xử lý…' : authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</button>
          </form>
          <button type="button" onClick={() => { setAuthMode(value => value === 'login' ? 'register' : 'login'); setMessage(''); }} className="mt-4 w-full text-xs font-bold text-brand-600">{authMode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button>
        </section>}

        {loading && <p className="text-center text-sm text-slate-500">Đang tải Customer Portal…</p>}
        {user && !loading && <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"><div><h1 className="text-2xl font-black text-slate-900">Customer Portal</h1><p className="text-sm text-slate-500 mt-1">Xin chào {user.full_name}. Quản lý đơn hàng và license của chính bạn.</p></div><button type="button" onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700"><LogOut className="w-4 h-4" />Đăng xuất</button></div>
          <div className="flex overflow-x-auto gap-2 border-b border-slate-200 mb-6">{([['overview', 'Tổng quan'], ['orders', 'Đơn hàng'], ['themes', 'Theme đã mua'], ['licenses', 'License']] as const).map(([id, label]) => <button key={id} type="button" onClick={() => setTab(id)} className={`shrink-0 px-4 py-3 text-xs font-bold border-b-2 ${tab === id ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}>{label}</button>)}</div>
          {message && <p className="mb-5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800" role="status">{message}</p>}
          {tab === 'overview' && <div className="grid sm:grid-cols-3 gap-4"><Metric label="Tổng đơn" value={String(orders.length)} icon={ReceiptText} /><Metric label="Đã thanh toán" value={String(paidOrders.length)} icon={PackageCheck} /><Metric label="License đang có" value={String(licenses.filter(license => license.status === 'active').length)} icon={KeyRound} /></div>}
          {tab === 'orders' && <div className="space-y-4">{orders.length === 0 ? <Empty text="Bạn chưa có đơn hàng nào thuộc tài khoản này." /> : orders.map(order => <article key={order.orderNumber} className="bg-white rounded-2xl border border-slate-200 p-5"><div className="flex flex-col sm:flex-row justify-between gap-3"><div><strong className="text-sm text-slate-900">{order.orderNumber}</strong><p className="text-xs text-slate-500 mt-1">{new Date(order.created_at).toLocaleString('vi-VN')} · {statusText(order)}</p></div><strong className="text-brand-600">{money(order.total_amount, order.currency)}</strong></div><div className="mt-4 text-xs text-slate-600">{order.items.map(item => item.theme_name).join(', ')}</div><Link href={`/checkout/order-received?order=${encodeURIComponent(order.orderNumber)}`} className="inline-block mt-4 text-xs font-bold text-brand-600">Xem biên nhận →</Link></article>)}</div>}
          {tab === 'themes' && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{purchasedThemes.length === 0 ? <Empty text="Theme sẽ xuất hiện sau khi đơn được máy chủ xác nhận thanh toán." /> : purchasedThemes.map(theme => <article key={theme.id} className="bg-white rounded-2xl border border-slate-200 p-5"><PackageCheck className="w-5 h-5 text-emerald-600 mb-3" /><strong className="text-sm block">{theme.name}</strong><p className="mt-1 text-xs text-slate-500">Đơn {theme.orderNumber} · {theme.license}</p></article>)}</div>}
          {tab === 'licenses' && <div className="space-y-4">{licenses.length === 0 ? <Empty text="License sẽ xuất hiện sau khi đơn hàng thanh toán thành công." /> : licenses.map(license => <article key={license.license_key} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><strong className="text-sm text-slate-900">{license.theme_name || 'Theme'}</strong><p className="mt-1 text-xs text-slate-500"><code>{license.license_key}</code> · {license.status} · tối đa {license.max_domains} domain</p></div><button type="button" disabled={license.status !== 'active'} onClick={() => void download(license)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Download className="w-4 h-4" />Tải theme</button></article>)}</div>}
        </section>}
      </main>
      <Footer />
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof ReceiptText }) {
  return <div className="bg-white rounded-2xl border border-slate-200 p-5"><Icon className="w-5 h-5 text-brand-600 mb-3" /><span className="text-2xl font-black text-slate-900 block">{value}</span><span className="text-xs text-slate-500">{label}</span></div>;
}

function Empty({ text }: { text: string }) {
  return <p className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">{text}</p>;
}

export default function MyAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 py-10 flex-1">
          <p className="text-center text-sm text-slate-500">Đang tải Customer Portal…</p>
        </main>
        <Footer />
      </div>
    }>
      <MyAccountContent />
    </Suspense>
  );
}

