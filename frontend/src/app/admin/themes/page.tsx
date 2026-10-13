'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Edit,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  Sliders,
  DollarSign,
  Tag,
} from 'lucide-react';
import {
  getThemes,
  createTheme,
  updateTheme,
  getCategories,
  AdminTheme,
  AdminThemeInput,
  AdminCategory,
  Pagination,
} from '@/features/admin/api-client';

function ThemesManagementContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');

  const [themes, setThemes] = useState<AdminTheme[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
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
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialAction === 'new');
  const [editingTheme, setEditingTheme] = useState<AdminTheme | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formPriceVnd, setFormPriceVnd] = useState<number | string>(599000);
  const [formPriceUsd, setFormPriceUsd] = useState<number | string>(29);
  const [formCategoryId, setFormCategoryId] = useState<number | ''>(1);
  const [formStatus, setFormStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formLiveDemoUrl, setFormLiveDemoUrl] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');

  // Validation Errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadData = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const [themesRes, categoriesRes] = await Promise.all([
        getThemes({
          page,
          limit: 10,
          search: searchTerm.trim() || undefined,
          status: statusFilter || undefined,
          category_id: typeof categoryFilter === 'number' ? categoryFilter : undefined,
        }),
        getCategories(),
      ]);
      setThemes(themesRes.themes);
      setPagination(themesRes.pagination);
      setCategories(categoriesRes.categories || []);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách themes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter]);

  const handleOpenCreateModal = () => {
    setEditingTheme(null);
    setFormName('');
    setFormSlug('');
    setFormPriceVnd(599000);
    setFormPriceUsd(29);
    setFormCategoryId(categories[0]?.id || 1);
    setFormStatus('published');
    setFormShortDesc('');
    setFormLiveDemoUrl('');
    setFormThumbnailUrl('');
    setFieldErrors({});
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (theme: AdminTheme) => {
    setEditingTheme(theme);
    setFormName(theme.name);
    setFormSlug(theme.slug);
    setFormPriceVnd(theme.price_vnd);
    setFormPriceUsd(theme.price_usd);
    setFormCategoryId(theme.category_id || (categories[0]?.id || 1));
    setFormStatus(theme.status);
    setFormShortDesc(theme.short_desc_vi || '');
    setFormLiveDemoUrl(theme.live_demo_url || '');
    setFormThumbnailUrl(theme.thumbnail_url || '');
    setFieldErrors({});
    setModalError(null);
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formName.trim() || formName.trim().length > 200) {
      errors.name = 'Tên theme bắt buộc từ 1 đến 200 ký tự.';
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!formSlug.trim() || !slugRegex.test(formSlug.trim())) {
      errors.slug = 'Slug chỉ chấp nhận chữ thường, số và dấu gạch nối (kebab-case, ví dụ: woodmart-pro).';
    }

    const pVnd = Number(formPriceVnd);
    if (!Number.isFinite(pVnd) || pVnd < 0) {
      errors.price_vnd = 'Giá VND phải là số không âm.';
    }

    const pUsd = Number(formPriceUsd);
    if (!Number.isFinite(pUsd) || pUsd < 0) {
      errors.price_usd = 'Giá USD phải là số không âm.';
    }

    const isHttpUrl = (val: string) => {
      try {
        const u = new URL(val);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (formLiveDemoUrl.trim() && !isHttpUrl(formLiveDemoUrl.trim())) {
      errors.live_demo_url = 'Demo URL phải bắt đầu bằng http:// hoặc https://';
    }

    if (formThumbnailUrl.trim() && !isHttpUrl(formThumbnailUrl.trim())) {
      errors.thumbnail_url = 'Thumbnail URL phải bắt đầu bằng http:// hoặc https://';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setModalSubmitting(true);
      setModalError(null);

      const payload: AdminThemeInput = {
        name: formName.trim(),
        slug: formSlug.trim(),
        price_vnd: Number(formPriceVnd),
        price_usd: Number(formPriceUsd),
        category_id: typeof formCategoryId === 'number' ? formCategoryId : null,
        status: formStatus,
        short_desc_vi: formShortDesc.trim() || undefined,
        live_demo_url: formLiveDemoUrl.trim() || undefined,
        thumbnail_url: formThumbnailUrl.trim() || undefined,
      };

      if (editingTheme) {
        await updateTheme(editingTheme.id, payload);
      } else {
        await createTheme(payload);
      }

      setIsModalOpen(false);
      await loadData(currentPage);
    } catch (err: any) {
      setModalError(err?.message || 'Không thể lưu thông tin theme.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleToggleStatus = async (theme: AdminTheme) => {
    const nextStatus = theme.status === 'published' ? 'draft' : 'published';
    try {
      await updateTheme(theme.id, { status: nextStatus });
      setThemes((prev) =>
        prev.map((t) => (t.id === theme.id ? { ...t, status: nextStatus } : t))
      );
    } catch (err: any) {
      alert(err?.message || 'Không thể cập nhật trạng thái theme.');
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
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Quản Lý Kho Themes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Thêm mới, cấu hình giá bán đa tiền tệ (VND/USD), quản lý trạng thái xuất bản.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Theme Mới</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadData(1);
          }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên theme hoặc slug..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : '')}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_vi}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đang xuất bản (published)</option>
              <option value="draft">Bản nháp (draft)</option>
              <option value="archived">Lưu trữ (archived)</option>
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

      {/* Themes Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6">Thông Tin Theme</th>
                <th className="py-4 px-4">Danh Mục</th>
                <th className="py-4 px-4">Giá Bán (VND & USD)</th>
                <th className="py-4 px-4">Doanh Số</th>
                <th className="py-4 px-4">Trạng Thái</th>
                <th className="py-4 px-4 sm:px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Đang tải danh sách theme...
                  </td>
                </tr>
              ) : themes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Không tìm thấy theme nào phù hợp.
                  </td>
                </tr>
              ) : (
                themes.map((theme) => (
                  <tr key={theme.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-white text-sm">{theme.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">slug: {theme.slug}</div>
                      {theme.current_version && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono mt-1 inline-block">
                          v{theme.current_version}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-bold">
                        {theme.category_name || 'WordPress Theme'}
                      </span>
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <div className="font-bold text-emerald-400">{formatVnd(theme.price_vnd)}</div>
                      <div className="text-[11px] text-indigo-300 font-bold">{formatUsd(theme.price_usd)}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {theme.total_sales ?? 0} lượt mua
                    </td>
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(theme)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          theme.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                        title="Nhấn để đổi trạng thái xuất bản"
                      >
                        {theme.status === 'published' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right space-x-2 whitespace-nowrap">
                      {theme.live_demo_url && (
                        <a
                          href={theme.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                          title="Xem bản demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(theme)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-bold transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Hiển thị <strong>{themes.length}</strong> / <strong>{pagination.total}</strong> themes
            (Trang {pagination.page} / {pagination.total_pages || 1})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => loadData(pagination.page - 1)}
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
              onClick={() => loadData(pagination.page + 1)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT THEME MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-black tracking-tight">
                {editingTheme ? `Chỉnh Sửa Theme #${editingTheme.id}` : 'Thêm Mới Theme Vào Catalog'}
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
            <form onSubmit={handleModalSubmit} className="space-y-4 mt-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tên Theme <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: WoodMart - Multipurpose WooCommerce Theme"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                  required
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Slug (Đường dẫn tĩnh) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                  placeholder="ví-dụ: woodmart-multipurpose"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-hidden focus:border-indigo-500 transition"
                  required
                />
                {fieldErrors.slug && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.slug}</p>
                )}
              </div>

              {/* Dual Prices: VND & USD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Giá Bán VND (đ) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formPriceVnd}
                    onChange={(e) => setFormPriceVnd(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                    required
                  />
                  {fieldErrors.price_vnd && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.price_vnd}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Giá Bán USD ($) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPriceUsd}
                    onChange={(e) => setFormPriceUsd(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                    required
                  />
                  {fieldErrors.price_usd && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.price_usd}</p>
                  )}
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Danh Mục
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_vi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Trạng Thái Xuất Bản
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition cursor-pointer"
                  >
                    <option value="published">Xuất bản (published)</option>
                    <option value="draft">Bản nháp (draft)</option>
                    <option value="archived">Lưu trữ (archived)</option>
                  </select>
                </div>
              </div>

              {/* Live Demo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Live Demo URL (Đường dẫn xem thử)
                </label>
                <input
                  type="url"
                  value={formLiveDemoUrl}
                  onChange={(e) => setFormLiveDemoUrl(e.target.value)}
                  placeholder="https://demo.xtemos.com/woodmart"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                />
                {fieldErrors.live_demo_url && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.live_demo_url}</p>
                )}
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Thumbnail URL (Ảnh thu nhỏ)
                </label>
                <input
                  type="url"
                  value={formThumbnailUrl}
                  onChange={(e) => setFormThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                />
                {fieldErrors.thumbnail_url && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.thumbnail_url}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mô Tả Ngắn (Tiếng Việt)
                </label>
                <textarea
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  rows={3}
                  placeholder="Giới thiệu các điểm nổi bật của theme..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-indigo-500 transition"
                />
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
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>{editingTheme ? 'Cập Nhật Theme' : 'Tạo Theme Mới'}</span>
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

export default function AdminThemesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Đang tải danh sách themes...</div>}>
      <ThemesManagementContent />
    </Suspense>
  );
}
