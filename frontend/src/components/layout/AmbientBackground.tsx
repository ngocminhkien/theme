'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Moon, Sun, Palette } from 'lucide-react';

export type SiteThemeMode = 'aurora' | 'midnight' | 'emerald';

const THEME_STORAGE_KEY = 'themestore-site-theme';

export const SITE_THEMES: Array<{
  id: SiteThemeMode;
  label: string;
  shortLabel: string;
  dotClass: string;
}> = [
  {
    id: 'aurora',
    label: 'Aurora Indigo (Sáng)',
    shortLabel: 'Aurora',
    dotClass: 'bg-gradient-to-r from-indigo-500 to-cyan-400',
  },
  {
    id: 'midnight',
    label: 'Midnight Cyber (Tối)',
    shortLabel: 'Midnight',
    dotClass: 'bg-gradient-to-r from-violet-500 to-amber-400',
  },
  {
    id: 'emerald',
    label: 'Emerald Royal (Ngọc)',
    shortLabel: 'Emerald',
    dotClass: 'bg-gradient-to-r from-emerald-500 to-teal-400',
  },
];

export function applySiteTheme(mode: SiteThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-site-theme', mode);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent('site-theme-change', { detail: mode }));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function useSiteTheme(): [SiteThemeMode, (mode: SiteThemeMode) => void] {
  const [theme, setTheme] = useState<SiteThemeMode>('midnight');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as SiteThemeMode | null;
      if (saved === 'aurora' || saved === 'midnight' || saved === 'emerald') {
        setTheme(saved);
        document.documentElement.setAttribute('data-site-theme', saved);
      } else {
        document.documentElement.setAttribute('data-site-theme', 'midnight');
      }
    } catch {
      document.documentElement.setAttribute('data-site-theme', 'midnight');
    }

    const onThemeChange = (e: Event) => {
      const custom = e as CustomEvent<SiteThemeMode>;
      if (custom.detail) {
        setTheme(custom.detail);
      }
    };
    window.addEventListener('site-theme-change', onThemeChange);
    return () => window.removeEventListener('site-theme-change', onThemeChange);
  }, []);

  const updateTheme = (next: SiteThemeMode) => {
    setTheme(next);
    applySiteTheme(next);
  };

  return [theme, updateTheme];
}

export function ThemeSwitcherPill({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useSiteTheme();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner ${
        compact ? 'gap-0.5 p-0.5' : 'gap-1 p-0.5'
      }`}
      role="group"
      aria-label="Chọn chủ đề giao diện (Theme)"
    >
      {!compact && (
        <span className="hidden 2xl:inline-flex items-center gap-1 pl-2.5 pr-1 text-[11px] font-bold text-slate-400">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <span>Theme:</span>
        </span>
      )}
      {SITE_THEMES.map((item) => {
        const active = theme === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTheme(item.id)}
            title={`Đổi giao diện sang ${item.label}`}
            className={`inline-flex items-center gap-1 rounded-full font-extrabold transition-all duration-300 cursor-pointer ${
              compact ? 'px-2 py-0.5 text-[10px] sm:text-[11px]' : 'px-2.5 py-1 text-[11px]'
            } ${
              active
                ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 text-white shadow-xs scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${item.dotClass} ${active ? 'ring-2 ring-white/60' : ''}`} />
            <span>{item.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * AmbientBackground:
 * 1. Multi-layer Aurora Mesh Orbs with organic drift & scroll parallax
 * 2. Architectural Perspective Grid + Animated Glowing Laser Beams
 * 3. Interactive Mouse Spotlight (GPU-accelerated via CSS custom properties)
 * 4. Top Real-Time Scroll Progress Indicator Bar
 */
export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [theme] = useSiteTheme();

  useEffect(() => {
    let rafId = 0;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.3;
    let currentX = targetX;
    let currentY = targetY;

    const updateScrollAndMouse = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      if (containerRef.current) {
        containerRef.current.style.setProperty('--scroll-offset', `${scrollTop * 0.12}px`);
        containerRef.current.style.setProperty('--scroll-offset-reverse', `${scrollTop * -0.08}px`);
      }
    };

    const animateSpotlight = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      if (containerRef.current) {
        containerRef.current.style.setProperty('--spotlight-x', `${currentX.toFixed(1)}px`);
        containerRef.current.style.setProperty('--spotlight-y', `${currentY.toFixed(1)}px`);
      }
      rafId = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(animateSpotlight);
      }
    };

    const handleScroll = () => {
      window.requestAnimationFrame(updateScrollAndMouse);
    };

    updateScrollAndMouse();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Top Scroll Progress Indicator Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3.5px] z-[100] pointer-events-none bg-slate-900/10 overflow-hidden"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-cyan-400 to-amber-400 shadow-[0_0_16px_rgba(99,102,241,0.9)] transition-transform duration-75 ease-out"
        />
      </div>

      {/* Multi-Layer Ambient Background Canvas */}
      <div
        ref={containerRef}
        aria-hidden="true"
        data-bg-theme={theme}
        className="ambient-bg-canvas fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
      >
        {/* Layer 1: Base Mesh Gradient */}
        <div className="ambient-base-layer absolute inset-0 transition-colors duration-700" />

        {/* Layer 2: Floating Aurora Orbs with Parallax */}
        <div
          className="absolute -top-36 -left-28 w-[520px] sm:w-[760px] h-[520px] sm:h-[760px] rounded-full ambient-orb-primary blur-[110px] animate-aurora-1"
          style={{ transform: 'translate3d(0, var(--scroll-offset-reverse, 0px), 0)' }}
        />
        <div
          className="absolute top-[12%] -right-32 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full ambient-orb-secondary blur-[120px] animate-aurora-2"
          style={{ transform: 'translate3d(0, var(--scroll-offset, 0px), 0)' }}
        />
        <div
          className="absolute bottom-[-12%] left-[18%] w-[500px] sm:w-[720px] h-[500px] sm:h-[720px] rounded-full ambient-orb-tertiary blur-[125px] animate-aurora-3"
          style={{ transform: 'translate3d(0, var(--scroll-offset-reverse, 0px), 0)' }}
        />
        <div
          className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[640px] h-[420px] sm:h-[640px] rounded-full ambient-orb-accent blur-[130px] opacity-60 animate-pulse-subtle"
        />

        {/* Layer 3: Architectural Perspective Grid & Dot Matrix */}
        <div className="ambient-grid-mesh absolute inset-0" />

        {/* Layer 4: Sweeping Light Beams along the Grid */}
        <div className="ambient-beam-horizontal" />
        <div className="ambient-beam-vertical" />

        {/* Layer 5: Interactive Cursor Spotlight */}
        <div className="ambient-cursor-spotlight absolute inset-0 hidden md:block" />

        {/* Layer 6: Subtle Tactile Noise / Film Grain */}
        <div className="ambient-noise-overlay absolute inset-0 opacity-[0.028]" />
      </div>
    </>
  );
}

export default AmbientBackground;
