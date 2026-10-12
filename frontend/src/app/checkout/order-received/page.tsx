'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock3, PackageOpen, RefreshCw, XCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAuthToken } from '@/features/auth/auth-client';
import { getOrderReceipt, type OrderReceipt } from '@/features/account/api-client';
import { Suspense, useEffect, useState } from 'react';

const MAX_POLLS = 12;

function money(amount: number, currency: 'VND' | 'USD') {
  return currency === 'VND' ? amount.toLocaleString('vi-VN') + ' đ' : '$' + amount;
}

function isTerminal(order: OrderReceipt) {
  return (order.payment_status === 'paid' && order.order_status === 'completed')
    || ['failed', 'refunded'].includes(order.payment_status)
    || order.order_status === 'cancelled';
}

function OrderReceivedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!/^OD-\d{8}-[A-F0-9]{6}$/i.test(orderNumber)) {
      setError('Mã đơn hàng không hợp lệ.');
      setLoading(false);
      return;
    }
    if (!getAuthToken()) {
      setError('Vui lòng đăng nhập để xem biên nhận đơn hàng của bạn.');
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    void getOrderReceipt(orderNumber)
      .then((next) => { if (active) { setReceipt(next); setError(''); } })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Chưa tải được đơn hàng.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderNumber, attempt]);

  useEffect(() => {
    if (!receipt || isTerminal(receipt) || attempt >= MAX_POLLS) return;
    const timer = window.setTimeout(() => setAttempt(value => value + 1), 5000);
    return () => window.clearTimeout(timer);
  }, [receipt, attempt]);

  const status = receipt?.payment_status === 'paid' && receipt.order_status === 'completed'
    ? { label: 'Thanh toán đã xác nhận', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    : receipt?.payment_status === 'failed' || receipt?.order_status === 'cancelled'
      ? { label: 'Đơn chưa thể thanh toán', icon: XCircle, color: 'text-rose-700 bg-rose-50 border-rose-200' }
      : { label: 'Đang chờ xác nhận thanh toán', icon: Clock3, color: 'text-amber-700 bg-amber-50 border-amber-200' };
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="w-full max-w-3xl mx-auto px-4 py-10 flex-1">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center"><PackageOpen className="w-6 h-6" /></div>
            <div><h1 className="text-xl font-black text-slate-900">Biên Nhận Đơn Hàng</h1><p className="text-xs text-slate-500 mt-1">Thông tin chỉ được tải sau khi máy chủ kiểm tra tài khoản của bạn.</p></div>
          </div>
          {loading && <p className="text-sm text-slate-600">Đang tải biên nhận…</p>}
          {error && <div className="rounded-xl bg-rose-50 text-rose-700 p-4 text-sm" role="alert">{error}</div>}
          {receipt && !loading && <>
            <div className={`rounded-2xl border p-4 flex items-center gap-3 ${status.color}`}>
              <StatusIcon className="w-5 h-5 shrink-0" /><div><strong className="text-sm block">{status.label}</strong><span className="text-xs">Mã đơn: {receipt.orderNumber}</span></div>
            </div>
            {receipt.payment_status === 'pending' && <p className="mt-3 text-xs text-slate-500">Đang kiểm tra lại tối đa {MAX_POLLS} lần. Giỏ hàng chỉ được xóa sau khi thanh toán được máy chủ xác nhận.</p>}
            <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
              {receipt.items.map(item => <div key={item.theme_id} className="py-4 flex justify-between gap-4 text-sm"><div><strong className="block text-slate-900">{item.theme_name}</strong><span className="text-xs text-slate-500">{item.license_type} license</span></div><span className="font-bold text-brand-600">{money(item.unit_price, receipt.currency)}</span></div>)}
            </div>
            <dl className="grid grid-cols-2 gap-4 mt-6 text-sm"><div><dt className="text-slate-500">Phương thức</dt><dd className="font-bold text-slate-900 uppercase">{receipt.payment_method}</dd></div><div><dt className="text-slate-500">Tổng tiền</dt><dd className="font-black text-brand-600">{money(receipt.total_amount, receipt.currency)}</dd></div></dl>
            {receipt.licenses.length > 0 && <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4"><h2 className="font-bold text-emerald-900 text-sm">License đã được cấp</h2>{receipt.licenses.map(license => <p key={license.license_key} className="mt-2 text-xs text-emerald-800"><strong>{license.theme_name}</strong>: <code>{license.license_key}</code></p>)}</div>}
          </>}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/themes" className="flex-1 text-center py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-brand-400">Quay Lại Cửa Hàng</Link>
            <Link href="/my-account" className="flex-1 text-center py-3 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500">Customer Portal</Link>
            {receipt && !isTerminal(receipt) && <button type="button" onClick={() => setAttempt(value => value + 1)} className="px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold inline-flex justify-center items-center gap-2"><RefreshCw className="w-4 h-4" />Kiểm tra lại</button>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderReceivedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="w-full max-w-3xl mx-auto px-4 py-10 flex-1">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <p className="text-sm text-slate-600">Đang tải biên nhận đơn hàng…</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <OrderReceivedContent />
    </Suspense>
  );
}

