'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAdminProfile, loginAdmin } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => { getAdminProfile().then(() => router.replace('/dashboard')).catch(() => undefined); }, [router]);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setPending(true);
    try { await loginAdmin(email, password); router.replace('/dashboard'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể đăng nhập.'); } finally { setPending(false); }
  };
  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,.55),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,.24),transparent_33%)]" />
        <div className="relative flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 font-heading text-xl font-black">T</span>
          <span className="font-heading text-lg font-extrabold">ThemeStore Admin</span>
        </div>
        <div className="relative max-w-lg">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-sm font-semibold text-blue-100">
            <ShieldCheck size={16} /> Khu vực quản trị được bảo vệ
          </p>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-white">
            Điều hành marketplace từ một nơi.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Theo dõi đơn hàng, catalog, khách hàng và doanh thu với dữ liệu trực tiếp từ hệ thống.
          </p>
        </div>
        <p className="relative text-sm text-slate-500">Chỉ tài khoản có quyền quản trị mới truy cập được.</p>
      </section>

      <section className="flex items-center justify-center bg-[#f8fafc] p-5 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-panel sm:p-9">
          <div className="mb-6">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <LockKeyhole size={21} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[.15em] text-blue-600">ThemeStore</p>
            <h1 className="mt-1 font-heading text-3xl font-extrabold text-ink">Đăng nhập Admin</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Dùng tài khoản quản trị đã được cấp. Quyền truy cập được kiểm tra lại bởi API.
            </p>
          </div>

          {/* Quick Fill Admin Button */}
          <div className="mb-5 p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-blue-900">Tài khoản quản trị viên mẫu:</p>
              <p className="text-blue-700 font-mono text-[11px]">admin@woodmart.vn</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@woodmart.vn');
                setPassword('Admin@123456');
                setError('');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Tự điền
            </button>
          </div>

          {error && (
            <p role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 font-medium">
              {error}
            </p>
          )}

          <label className="mb-4 block text-sm font-bold text-slate-700">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500"
              placeholder="admin@woodmart.vn"
            />
          </label>

          <label className="mb-6 block text-sm font-bold text-slate-700">
            Mật khẩu
            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500"
              placeholder="••••••••"
            />
          </label>

          <button
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-65 cursor-pointer"
          >
            {pending ? 'Đang xác thực…' : <>Vào Dashboard <ArrowRight size={18} /></>}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Không có tài khoản quản trị? Liên hệ người phụ trách hệ thống để được cấp quyền.
          </p>
        </form>
      </section>
    </main>
  );
}
