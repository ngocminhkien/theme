import type { Metadata } from 'next';
import React from 'react';
import { CartRoot } from '@/components/layout/CartRoot';
import './globals.css';

export const metadata: Metadata = {
  title: 'THEMESTORE | Sàn Giao Diện Website & Template Bản Quyền Chuẩn SEO',
  description: 'Nền tảng thương mại điện tử chuyên cung cấp theme website, template WordPress & WooCommerce bản quyền chuẩn SEO, tốc độ siêu nhanh và kích hoạt tự động.',
  keywords: ['ThemeStore', 'Theme WordPress', 'WooCommerce template', 'Giao diện website', 'Elementor theme', 'Theme bản quyền'],
  authors: [{ name: 'THEMESTORE Engineering Team' }],
  openGraph: {
    title: 'THEMESTORE - Digital Theme Marketplace',
    description: 'Kho Theme WordPress & WooCommerce Đa Ngành Chuẩn SEO, tốc độ siêu tốc.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-brand-500/20 selection:text-brand-900 font-sans">
        {children}
        <CartRoot />
      </body>
    </html>
  );
}
