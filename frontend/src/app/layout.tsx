import type { Metadata } from 'next';
import React from 'react';
import { CartRoot } from '@/components/layout/CartRoot';
import './globals.css';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import AmbientBackground from '@/components/layout/AmbientBackground';
import { GlobalScrollObserver } from '@/components/motion/ScrollReveal';

export const metadata: Metadata = {
  title: 'THEME STORE | Thế Giới Theme & Plugin WordPress Bản Quyền Chính Hãng Giá Tốt Chuẩn SEO',
  description: 'Nền tảng thương mại điện tử chuyên cung cấp hơn 500+ Theme WordPress, WooCommerce & Plugin bản quyền giá rẻ chuẩn SEO, sạch 100% không mã độc, tối ưu tốc độ Google PageSpeed 99+ và kích hoạt tự động qua VietQR trong 30 giây.',
  keywords: [
    'Theme Store',
    'themestore.vn',
    'Theme WordPress giá rẻ',
    'Plugin WordPress bản quyền',
    'WooCommerce template',
    'WoodMart bản quyền',
    'Flatsome theme',
    'Elementor Pro',
    'Theme chuẩn SEO',
  ],
  authors: [{ name: 'THEMESTORE.VN Team' }],
  openGraph: {
    title: 'THEME STORE - Thế Giới Theme & Plugin WordPress Bản Quyền Giá Rẻ',
    description: 'Kho 500+ Theme WordPress & Plugin bản quyền giá rẻ, chuẩn SEO, kích hoạt tự động 24/7.',
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
    <html lang="vi" data-site-theme="aurora" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen text-slate-900 antialiased selection:bg-indigo-600/20 selection:text-indigo-900 font-sans relative overflow-x-hidden">
        <AmbientBackground />
        <GlobalScrollObserver />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        <CartRoot />
        <FloatingWidgets />
      </body>
    </html>
  );
}
