'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Eye, Plus, RefreshCw, Search, ShieldCheck, UserRound } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { dateTime, money } from '@/lib/format';
import type { Customer, License, Order, Pagination as PaginationInfo } from '@/lib/types';
import { EmptyState, ErrorState, LoadingBlock, Modal, PageHeader, Pagination, Panel, StatusBadge } from '@/components/primitives';

type CustomerDetail = { customer: Customer; orders: Order[]; licenses: License[] };

function roleLabel(role?: string) {
  if (role === 'admin') return 'Quản trị viên (admin)';
  if (role === 'author') return 'Tác giả (author)';
  return 'Người dùng (customer)';
}

function CreateCustomerModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Customer['role']>('customer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminApi.createCustomer({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role,
      });
      onCreated();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tạo tài khoản.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Tạo tài khoản mới (Người dùng / Admin)" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 p-5 text-sm">
        <div>
          <label className="mb-1 block font-semibold text-slate-700">Họ và tên *</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ví dụ: Ngọc Minh Kiên"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">Email đăng nhập *</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@woodmart.vn"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">Số điện thoại</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">Mật khẩu (tối thiểu 6 ký tự) *</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">Vai trò (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Customer['role'])}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-semibold text-slate-800"
            >
              <option value="customer">Người dùng (customer - Mặc định)</option>
              <option value="admin">Quản trị viên (admin)</option>
              <option value="author">Tác giả (author)</option>
            </select>
          </div>
        </div>
        {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Đang tạo…' : 'Tạo tài khoản'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CustomerDetails({
  data,
  onClose,
  onRoleUpdated,
}: {
  data: CustomerDetail;
  onClose: () => void;
  onRoleUpdated: (role: Customer['role']) => Promise<void>;
}) {
  const [selectedRole, setSelectedRole] = useState<Customer['role']>(data.customer.role || 'customer');
  const [savingRole, setSavingRole] = useState(false);
  const [roleError, setRoleError] = useState('');
  const [roleSuccess, setRoleSuccess] = useState('');

  const handleSaveRole = async () => {
    setRoleError('');
    setRoleSuccess('');
    setSavingRole(true);
    try {
      await onRoleUpdated(selectedRole);
      setRoleSuccess('Đã cập nhật vai trò (role) tài khoản thành công.');
    } catch (reason) {
      setRoleError(reason instanceof Error ? reason.message : 'Không thể cập nhật vai trò.');
    } finally {
      setSavingRole(false);
    }
  };

  return (
    <Modal title={data.customer.full_name} onClose={onClose}>
      <div className="space-y-5 p-5">
        <div className="rounded-xl bg-slate-50 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-slate-800">{data.customer.email}</p>
            <StatusBadge value={data.customer.role || 'customer'} />
          </div>
          <p className="mt-1 text-slate-500">
            {data.customer.phone || 'Chưa có số điện thoại'} · {data.customer.country_code || '—'} · Vai trò: <strong>{roleLabel(data.customer.role)}</strong>
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-2 font-heading text-sm font-bold text-slate-800">Phân quyền tài khoản (Role)</h3>
          <p className="mb-3 text-xs text-slate-500">
            Mặc định khi tạo tài khoản mới là <strong>Người dùng (customer)</strong>. Chỉ nâng quyền <strong>Quản trị viên (admin)</strong> cho nhân sự quản trị hệ thống.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Customer['role'])}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
            >
              <option value="customer">Người dùng (customer - Mặc định)</option>
              <option value="admin">Quản trị viên (admin)</option>
              <option value="author">Tác giả (author)</option>
            </select>
            <button
              type="button"
              disabled={savingRole || selectedRole === (data.customer.role || 'customer')}
              onClick={handleSaveRole}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {savingRole ? 'Đang lưu…' : 'Lưu vai trò'}
            </button>
          </div>
          {roleError && <p className="mt-2 text-xs font-semibold text-rose-600">{roleError}</p>}
          {roleSuccess && <p className="mt-2 text-xs font-semibold text-emerald-600">{roleSuccess}</p>}
        </section>

        <section>
          <h3 className="mb-2 font-heading font-bold">Lịch sử đơn hàng</h3>
          {data.orders.length ? (
            <div className="divide-y rounded-xl border border-slate-200">
              {data.orders.map((order) => (
                <div key={order.id} className="flex justify-between gap-3 p-3 text-sm">
                  <div>
                    <p className="font-bold">{order.order_number}</p>
                    <p className="text-xs text-slate-500">{dateTime(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{money(order.total_amount, order.currency)}</p>
                    <StatusBadge value={order.payment_status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Chưa có đơn hàng.</p>
          )}
        </section>

        <section>
          <h3 className="mb-2 font-heading font-bold">License</h3>
          {data.licenses.length ? (
            <div className="space-y-2">
              {data.licenses.map((license) => (
                <div key={license.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <div>
                    <p className="font-semibold">{license.theme_name}</p>
                    <p className="font-mono text-xs text-slate-500">{license.license_key}</p>
                  </div>
                  <StatusBadge value={license.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Chưa có license.</p>
          )}
        </section>
      </div>
    </Modal>
  );
}

export function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .customers({ page, search, role: roleFilter || undefined })
      .then((data) => {
        setCustomers(data.customers);
        setPagination(data.pagination);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Không thể tải danh sách tài khoản.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, search, roleFilter]);

  const showDetail = async (id: number) => {
    try {
      setDetail(await adminApi.customer(id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tải thông tin tài khoản.');
    }
  };

  const handleRoleUpdate = async (newRole: Customer['role']) => {
    if (!detail) return;
    await adminApi.updateCustomerRole(detail.customer.id, newRole);
    setDetail({
      ...detail,
      customer: { ...detail.customer, role: newRole },
    });
    load();
  };

  return (
    <>
      <PageHeader eyebrow="Tài khoản & Phân quyền" title="Người dùng, Admin và Quyền sở hữu">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={16} /> Tạo tài khoản
        </button>
      </PageHeader>
      <Panel className="mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
            <span className="sr-only">Tìm người dùng</span>
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm"
              placeholder="Tên, email hoặc số điện thoại"
            />
          </label>
          <select
            aria-label="Lọc theo vai trò"
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700"
          >
            <option value="">Tất cả vai trò (Role)</option>
            <option value="customer">Người dùng (customer)</option>
            <option value="admin">Quản trị viên (admin)</option>
            <option value="author">Tác giả (author)</option>
          </select>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600">
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </Panel>
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : loading ? (
        <Panel>
          <LoadingBlock lines={8} />
        </Panel>
      ) : (
        <Panel>
          {customers.length === 0 ? (
            <EmptyState title="Không có tài khoản" detail="Không tìm thấy người dùng khớp điều kiện." />
          ) : (
            <>
              <div className="table-scroll">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Tài khoản</th>
                      <th className="px-5 py-3">Vai trò (Role)</th>
                      <th className="px-5 py-3">Đơn hàng</th>
                      <th className="px-5 py-3">Đã chi</th>
                      <th className="px-5 py-3">Trạng thái</th>
                      <th className="px-5 py-3">Tham gia</th>
                      <th className="px-5 py-3">
                        <span className="sr-only">Chi tiết</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">{customer.full_name}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="inline-flex items-center gap-1.5">
                            {customer.role === 'admin' ? (
                              <ShieldCheck size={15} className="text-blue-600" />
                            ) : (
                              <UserRound size={15} className="text-slate-500" />
                            )}
                            <StatusBadge value={customer.role || 'customer'} />
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold">{customer.orders_count}</td>
                        <td className="px-5 py-4 text-xs font-semibold">
                          {money(customer.total_spent_vnd, 'VND')}
                          <br />
                          {money(customer.total_spent_usd, 'USD')}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge value={customer.status} />
                        </td>
                        <td className="px-5 py-4 text-slate-500">{dateTime(customer.created_at)}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => showDetail(customer.id)} title="Xem chi tiết & Phân quyền" className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination && <Pagination pagination={pagination} onPage={setPage} />}
            </>
          )}
        </Panel>
      )}
      {detail && <CustomerDetails data={detail} onClose={() => setDetail(null)} onRoleUpdated={handleRoleUpdate} />}
      {creating && <CreateCustomerModal onClose={() => setCreating(false)} onCreated={load} />}
    </>
  );
}
