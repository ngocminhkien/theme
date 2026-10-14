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
  const [stage, setStage] = useState<'entering' | 'entered'>('entered');

  useEffect(() => {
    setStage('entering');
    const timer = window.setTimeout(() => {
      setStage('entered');
    }, 250);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="wm-page-transition w-full">
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
