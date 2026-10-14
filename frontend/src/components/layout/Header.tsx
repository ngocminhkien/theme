'use client';

import React, { useState, useEffect } from 'react';
import { HeaderTopBar } from './HeaderTopBar';
import { HeaderMain } from './HeaderMain';
import { HeaderNavbar } from './HeaderNavbar';

export function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Khi người dùng cuộn xuống quá 25px: thanh đen trượt lên ẩn mượt mà
          setIsScrolled(scrollY > 25);

          const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
          setScrollProgress(Math.min(100, Math.max(0, scrolled)));

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Header cố định ở đỉnh màn hình */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-shadow duration-300 ${
          isScrolled
            ? 'shadow-lg shadow-slate-900/10'
            : 'shadow-xs'
        }`}
      >
        {/* Phần đen TopBar: Chuyển đổi trượt lên và biến mất mượt mà khi cuộn xuống */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
            isScrolled
              ? 'max-h-0 opacity-0 -translate-y-full pointer-events-none'
              : 'max-h-12 opacity-100 translate-y-0'
          }`}
        >
          <HeaderTopBar />
        </div>

        {/* Cụm Menu chính (HeaderMain + HeaderNavbar): Êm ái trượt lên sát đỉnh và giữ cố định */}
        <div className="w-full transition-all duration-300 ease-in-out relative">
          {/* HeaderMain ở z-40 để dropdown tài khoản và ô tìm kiếm luôn hiển thị nổi hoàn toàn bên trên HeaderNavbar */}
          <div className="relative z-40">
            <HeaderMain />
          </div>
          {/* HeaderNavbar ở z-20 */}
          <div className="relative z-20">
            <HeaderNavbar />
          </div>
        </div>

        {/* Thanh chỉ báo phần trăm cuộn trang (Scroll Progress Bar) */}
        <div
          className="h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Spacer giữ chỗ để nội dung trang bên dưới không bị Header che khuất */}
      <div
        aria-hidden="true"
        className="w-full shrink-0 h-[104px] sm:h-[124px] md:h-[136px] lg:h-[180px] pointer-events-none"
      />
    </>
  );
}
