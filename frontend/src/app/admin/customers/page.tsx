'use client';

import React, { Suspense, useEffect, useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import {
  getCustomers,
  createCustomer,
  updateCustomerRole,
  AdminCustomer,
  AdminCustomerInput,
  Pagination,
} from '@/features/admin/api-client';
import { useAdminContext } from '@/features/admin/AdminGuard';

function CustomersManagementContent() {
  const { user: activeAdmin } = useAdminContext();

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
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
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Modal Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'customer' | 'admin' | 'author'>('customer');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Role updating indicator per user ID
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [roleUpdateMessage, setRoleUpdateMessage] = useState<{ text: string; success: boolean } | null>(null);

  const loadCustomers = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCustomers({
        page,
        limit: 10,
        search: searchTerm.trim() || undefined,
        role: roleFilter || undefined,
      });
      setCustomers(res.customers);
      setPagination(res.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách khách hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleOpenCreateModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormPhone('');
    setFormRole('customer');
    setFieldErrors({});
    setModalError(null);
    setIsModalOpen(true);
  };

  const validateCreateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formName.trim() || formName.trim().length < 2) {
      errors.name = 'Họ và tên bắt buộc từ 2 ký tự trở lên.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail.trim() || !emailRegex.test(formEmail.trim())) {
      errors.email = 'Email không hợp lệ.';
    }

    if (!formPassword || formPassword.length < 6) {
      errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    try {
      setModalSubmitting(true);
      setModalError(null);

      const payload: AdminCustomerInput = {
        full_name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword,
        phone: formPhone.trim() || undefined,
        role: formRole,
      };

      await createCustomer(payload);
      setIsModalOpen(false);
      await loadCustomers(currentPage);
    } catch (err: any) {
      setModalError(err?.message || 'Không thể tạo tài khoản người dùng.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleRoleChange = async (targetUser: AdminCustomer, nextRole: 'customer' | 'admin' | 'author') => {
    // SELF-DEMOTION SAFEGUARD: active admin cannot demote themselves away from admin
    if (activeAdmin && activeAdmin.id === targetUser.id && nextRole !== 'admin') {
      alert('Không thể tự hạ quyền quản trị của chính tài khoản đang đăng nhập.');
      return;
    }

    try {
      setUpdatingUserId(targetUser.id);
      setRoleUpdateMessage(null);
      await updateCustomerRole(targetUser.id, nextRole);
      setCustomers((prev) =>
        prev.map((c) => (c.id === targetUser.id ? { ...c, role: nextRole } : c))
      );
      setRoleUpdateMessage({
        text: `Đã cập nhật vai trò của ${targetUser.email} thành ${nextRole.toUpperCase()}.`,
        success: true,
      });
    } catch (err: any) {
      setRoleUpdateMessage({
        text: err?.message || 'Không thể cập nhật vai trò tài khoản.',
        success: false,
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatVnd = (val: number) => {
    return Number(val || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const formatUsd = (val: number) => {
    return '$' + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Quản Lý Khách Hàng & Phân Quyền (RBAC)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Danh sách người dùng, thống kê chi tiêu, phân quyền vai trò và bảo vệ tài khoản quản trị.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Người Dùng Mới</span>
        </button>
      </div>

      {/* Role Update Notification */}
      {roleUpdateMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
            roleUpdateMessage.success
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          <span>{roleUpdateMessage.text}</span>
          <button
            type="button"
            onClick={() => setRoleUpdateMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadCustomers(1);
          }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo email, tên khách hàng hoặc số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              <option value="customer">Khách hàng (customer)</option>
              <option value="admin">Quản trị viên (admin)</option>
              <option value="author">Tác giả theme (author)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Lọc
            </button>
          </div>
        </form>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Customers Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6">Thông Tin Người Dùng</th>
                <th className="py-4 px-4">Số Điện Thoại</th>
                <th className="py-4 px-4">Đơn Hàng</th>
                <th className="py-4 px-4">Tổng Chi Tiêu (VND & USD)</th>
                <th className="py-4 px-4">Vai Trò (Role)</th>
                <th className="py-4 px-4 sm:px-6 text-right">Thao Tác Phân Quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const isSelf = activeAdmin && activeAdmin.id === c.id;

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{c.full_name}</span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-black uppercase">
                              Bạn (Hiện Tại)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Đăng ký: {c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : '---'}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-400">
                        {c.phone || <span className="text-slate-600">---</span>}
                      </td>

                      <td className="py-4 px-4 font-bold text-white">
                        {c.orders_count ?? 0} đơn
                      </td>

                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-bold text-emerald-400">{formatVnd(c.total_spent_vnd)}</div>
                        {c.total_spent_usd > 0 && (
                          <div className="text-[11px] text-indigo-300 font-bold">{formatUsd(c.total_spent_usd)}</div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            c.role === 'admin'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : c.role === 'author'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {c.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                          <span>{c.role}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        {isSelf ? (
                          /* SELF-DEMOTION SAFEGUARD: disabled control with shield indicator */
                          <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs font-bold select-none cursor-not-allowed"
                            title="Không thể tự hạ quyền quản trị của chính tài khoản đang đăng nhập"
                          >
                            <Lock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Khóa Tự Hạ Quyền</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <select
                              value={c.role}
                              disabled={updatingUserId === c.id}
                              onChange={(e) => handleRoleChange(c, e.target.value as any)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer disabled:opacity-50"
                            >
                              <option value="customer">customer (Khách)</option>
                              <option value="admin">admin (Quản trị)</option>
                              <option value="author">author (Tác giả)</option>
                            </select>
                            {updatingUserId === c.id && (
                              <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Hiển thị <strong>{customers.length}</strong> / <strong>{pagination.total}</strong> tài khoản
            (Trang {pagination.page} / {pagination.total_pages || 1})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => loadCustomers(pagination.page - 1)}
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
              onClick={() => loadCustomers(pagination.page + 1)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE CUSTOMER MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Thêm Tài Khoản Người Dùng Mới</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="p-3 my-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 mt-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Họ và Tên <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Lê Văn Quản Trị"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                  required
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Địa Chỉ Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="admin2@example.test"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mật Khẩu Khởi Tạo (Tối thiểu 6 ký tự) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                  required
                />
                {fieldErrors.password && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Số Điện Thoại (Tùy chọn)
                </label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0987654321"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>

              {/* Initial Role */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Vai Trò Ban Đầu (Role)
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="customer">customer (Khách mua theme)</option>
                  <option value="admin">admin (Quản trị viên hệ thống)</option>
                  <option value="author">author (Tác giả đăng bán theme)</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {modalSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <span>Tạo Tài Khoản</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Đang tải danh sách khách hàng...</div>}>
      <CustomersManagementContent />
    </Suspense>
  );
}
