import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-2xl mb-6">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
        Không Tìm Thấy Trang
      </h1>
      <p className="text-slate-500 max-w-md mb-8 text-sm">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm"
      >
        Về Trang Chủ
      </Link>
    </div>
  );
}
