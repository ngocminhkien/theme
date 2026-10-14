'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface AnimatedCounterProps {
  end: number;
  duration?: number; // ms, default 1800
  decimals?: number; // số chữ số thập phân, default 0
  prefix?: string;
  suffix?: string;
  separator?: string; // '.', ',', or ''
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = '.',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Nếu chạy ngoài browser (SSR / test runner)
    if (typeof window === 'undefined') {
      setCount(end);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Fallback nếu browser không hỗ trợ IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          let startTime: number | null = null;

          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: Ease Out Exponential mượt mà
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeOutExpo * end;

            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  // Format hiển thị số
  const formatValue = () => {
    if (decimals > 0) {
      return count.toFixed(decimals);
    }
    const rounded = Math.floor(count);
    if (separator === '.') {
      return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    if (separator === ',') {
      return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return rounded.toString();
  };

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatValue()}
      {suffix}
    </span>
  );
}
