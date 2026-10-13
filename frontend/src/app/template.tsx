import React from 'react';
import PageTransition from '@/components/motion/PageTransition';

/**
 * Next.js App Router Template:
 * Khác với `layout.tsx`, `template.tsx` tự động khởi tạo instance mới khi chuyển route,
 * kích hoạt hiệu ứng chuyển trang (PageTransition) mượt mà giữa Home, Themes, Theme Detail, Checkout và My Account.
 */
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
