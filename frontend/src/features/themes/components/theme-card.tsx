import React from 'react';
import Link from 'next/link';
import { ThemeItem, Currency } from '../../../shared/types/index.js';
import { useCartStore } from '../../../shared/stores/cart.store.js';

interface ThemeCardProps {
  theme: ThemeItem;
  currency?: Currency;
}

export function ThemeCard({ theme, currency = 'VND' }: ThemeCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const priceText =
    currency === 'VND'
      ? `${Number(theme.price_vnd).toLocaleString('vi-VN')} đ`
      : `$${theme.price_usd}`;

  return (
    <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Thumbnail with overlay */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={theme.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}
          alt={theme.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={`/preview/${theme.slug}`}
            className="px-4 py-2 bg-white text-gray-900 rounded-md font-medium text-sm hover:bg-gray-100 shadow"
          >
            Xem Demo
          </Link>
          <Link
            href={`/theme/${theme.slug}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 shadow"
          >
            Chi Tiết
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
            {theme.page_builders || 'Elementor'}
          </span>
          <span className="text-xs text-gray-500">★ {theme.rating_avg} ({theme.total_sales} bán)</span>
        </div>

        <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
          <Link href={`/theme/${theme.slug}`}>{theme.name}</Link>
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {theme.short_desc_vi || 'Giao diện chuẩn SEO, tối ưu tốc độ và thân thiện thiết bị di động.'}
        </p>

        {/* Pricing & Buy Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">{priceText}</span>
          <button
            onClick={() => addItem(theme)}
            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition"
          >
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  );
}
