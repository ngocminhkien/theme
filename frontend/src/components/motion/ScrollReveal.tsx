'use client';

import React, { useEffect, useRef, useState } from 'react';

export type ScrollRevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'tilt-up';

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * ScrollReveal: Component tạo hiệu ứng xuất hiện mượt mà khi người dùng cuộn xuống (Scroll-Triggered Reveal).
 * Sử dụng IntersectionObserver kết hợp GPU-accelerated CSS transforms & spring easing.
 */
export function ScrollReveal({
  children,
  variant = 'fade-up',
  delayMs = 0,
  durationMs = 700,
  threshold = 0.12,
  once = true,
  className = '',
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      data-scroll-reveal={variant}
      data-visible={isVisible ? 'true' : 'false'}
      style={{
        transitionDelay: delayMs ? `${delayMs}ms` : undefined,
        transitionDuration: durationMs ? `${durationMs}ms` : undefined,
      }}
      className={`wm-scroll-reveal wm-reveal-${variant} ${
        isVisible ? 'wm-reveal-visible' : 'wm-reveal-hidden'
      } ${className}`.trim()}
    >
      {children}
    </Component>
  );
}

/**
 * GlobalScrollObserver: Tự động kích hoạt hiệu ứng cuộn xuống cho mọi phần tử có thuộc tính `[data-reveal]`
 * hoặc `.wm-auto-reveal` trên toàn trang mà không cần bọc thủ công từng thẻ con.
 */
export function GlobalScrollObserver() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observeElements = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        '[data-reveal]:not([data-reveal-bound="true"])'
      );

      if (elements.length === 0) return null;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('wm-reveal-visible');
              entry.target.setAttribute('data-visible', 'true');
              io.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      elements.forEach((el) => {
        el.setAttribute('data-reveal-bound', 'true');
        io.observe(el);
      });

      return io;
    };

    const io = observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      io?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}

export default ScrollReveal;
