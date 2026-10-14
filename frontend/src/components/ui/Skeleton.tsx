'use client';

import React from 'react';
import { ImageIcon } from 'lucide-react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Primitive Skeleton component with modern CSS Shimmer effect
 */
export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-800/70 border border-slate-700/40 rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for Image Thumbnails with placeholder icon & shimmer
 */
export function ImageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-900/90 border border-slate-800/80 rounded-2xl flex items-center justify-center before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${className}`}
    >
      <ImageIcon className="w-8 h-8 text-slate-700/80 animate-pulse" />
    </div>
  );
}

/**
 * 1-to-1 matching ThemeCardSkeleton for Theme Grid
 */
export function ThemeCardSkeleton() {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/90 p-3 sm:p-4 flex flex-col justify-between shadow-lg relative overflow-hidden backdrop-blur-md">
      <div>
        {/* Thumbnail Image Skeleton */}
        <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl bg-slate-800/80 overflow-hidden mb-3.5 flex items-center justify-center before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-cyan-400/10 before:to-transparent">
          <ImageIcon className="w-8 h-8 text-slate-700 animate-pulse" />
          <div className="absolute top-2.5 left-2.5 w-16 h-5 rounded-full bg-slate-700/80" />
          <div className="absolute top-2.5 right-2.5 w-10 h-5 rounded-full bg-slate-700/80" />
        </div>

        {/* Category & Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-16 h-4 rounded-md" />
        </div>

        {/* Title */}
        <Skeleton className="w-3/4 h-5 sm:h-6 mb-2 rounded-lg" />
        <Skeleton className="w-1/2 h-3.5 mb-3 rounded-md" />

        {/* Feature Pills */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-16 h-4 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-full" />
          <Skeleton className="w-14 h-4 rounded-full" />
        </div>
      </div>

      {/* Pricing & CTA Button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <Skeleton className="w-24 h-5 sm:h-6 rounded-md mb-1" />
          <Skeleton className="w-16 h-3 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <Skeleton className="w-24 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Hero Section
 */
export function HeroSectionSkeleton() {
  return (
    <div className="max-w-5xl mx-auto pt-6 pb-12 px-4 text-center">
      {/* HUD Badge */}
      <div className="flex justify-center mb-6">
        <Skeleton className="w-80 h-7 rounded-full" />
      </div>

      {/* Headline */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <Skeleton className="w-4/5 h-10 sm:h-14 rounded-2xl" />
        <Skeleton className="w-3/5 h-10 sm:h-14 rounded-2xl" />
      </div>

      {/* Subtitle */}
      <div className="flex flex-col items-center gap-2 mb-8 max-w-2xl mx-auto">
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-4/5 h-4 rounded-md" />
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-10">
        <Skeleton className="w-full h-14 rounded-2xl sm:rounded-full" />
      </div>

      {/* Two Highlight Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 text-left relative overflow-hidden">
          <Skeleton className="w-36 h-6 rounded-full mb-4" />
          <Skeleton className="w-3/4 h-8 rounded-xl mb-3" />
          <Skeleton className="w-full h-16 rounded-xl mb-6" />
          <Skeleton className="w-40 h-10 rounded-xl" />
        </div>
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 text-left relative overflow-hidden">
          <Skeleton className="w-36 h-6 rounded-full mb-4" />
          <Skeleton className="w-3/4 h-8 rounded-xl mb-3" />
          <Skeleton className="w-full h-16 rounded-xl mb-6" />
          <Skeleton className="w-40 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Popular Categories strip
 */
export function PopularCategoriesSkeleton() {
  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-48 h-7 rounded-lg" />
        <Skeleton className="w-28 h-5 rounded-md" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 sm:h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/**
 * Complete PageSkeleton used during Next.js loading
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative z-10 animate-in fade-in duration-300">
      {/* Top Navbar Skeleton Bar */}
      <div className="h-11 bg-slate-950 border-b border-slate-800/80 px-4 flex items-center justify-between">
        <Skeleton className="w-48 h-4 rounded-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-24 h-5 rounded-full" />
          <Skeleton className="w-20 h-5 rounded-full" />
        </div>
      </div>

      {/* Main Header Skeleton Bar */}
      <div className="h-20 bg-slate-900/70 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="w-36 h-6 rounded-lg" />
        </div>
        <Skeleton className="hidden md:block flex-1 max-w-2xl h-11 rounded-2xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-28 h-10 rounded-2xl hidden xl:block" />
          <Skeleton className="w-28 h-10 rounded-2xl" />
        </div>
      </div>

      {/* Sub Navbar Skeleton */}
      <div className="h-12 bg-slate-900/90 border-b border-slate-800/80 px-4 sm:px-8 flex items-center gap-4">
        <Skeleton className="w-36 h-8 rounded-lg" />
        <div className="hidden lg:flex items-center gap-4 flex-1">
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-24 h-4 rounded-md" />
          <Skeleton className="w-28 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
      </div>

      {/* Main Hero Section Skeleton */}
      <main className="flex-1">
        <HeroSectionSkeleton />
        <PopularCategoriesSkeleton />

        {/* 8 Cards Theme Grid Skeleton */}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div>
              <Skeleton className="w-36 h-4 rounded-md mb-2" />
              <Skeleton className="w-64 h-8 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-9 rounded-full" />
              <Skeleton className="w-24 h-9 rounded-full" />
              <Skeleton className="w-24 h-9 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 xl:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ThemeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
