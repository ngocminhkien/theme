'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition: Tạo hiệu ứng chuyển trang mượt mà (Smooth Route Morph + Top Laser Shimmer Bar)
 * mỗi khi người dùng điều hướng giữa các route trong Next.js App Router.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [stage, setStage] = useState<'entering' | 'entered'>('entering');

  useEffect(() => {
    setStage('entering');
    const raf = window.requestAnimationFrame(() => {
      const timer = window.setTimeout(() => {
        setStage('entered');
      }, 30);
      return () => window.clearTimeout(timer);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      key={pathname}
      data-route-stage={stage}
      className={`wm-page-transition ${
        stage === 'entered' ? 'wm-page-entered' : 'wm-page-entering'
      }`}
    >
      {/* Top Route Transition Laser Glow */}
      <div
        aria-hidden="true"
        className={`wm-route-laser ${
          stage === 'entering' ? 'wm-route-laser-active' : 'wm-route-laser-done'
        }`}
      />
      {children}
    </div>
  );
}

export default PageTransition;
