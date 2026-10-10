import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital Theme Marketplace | Kho Giao Diện Bản Quyền Quốc Tế & Việt Nam',
  description: 'Nền tảng mua bán theme WordPress, WooCommerce chuẩn SEO, tối ưu tốc độ, kích hoạt License tự động.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
