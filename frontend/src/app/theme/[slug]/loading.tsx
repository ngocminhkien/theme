import React from 'react';
import { Skeleton, ImageSkeleton } from '@/components/ui/Skeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ThemeDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative z-10 animate-in fade-in duration-300">
      <Header />
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="w-16 h-4 rounded-md" />
          <Skeleton className="w-4 h-4 rounded-md" />
          <Skeleton className="w-24 h-4 rounded-md" />
          <Skeleton className="w-4 h-4 rounded-md" />
          <Skeleton className="w-32 h-4 rounded-md" />
        </div>

        {/* 2-Columns Layout: Left Gallery / Right Checkout Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column (8 cols): Large Image Preview & Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <ImageSkeleton className="aspect-[16/10] w-full" />
            
            <div className="space-y-4 pt-4">
              <Skeleton className="w-2/5 h-8 rounded-xl" />
              <Skeleton className="w-full h-24 rounded-2xl" />
              <div className="grid grid-cols-3 gap-4 pt-4">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Purchase Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
              <Skeleton className="w-3/4 h-8 rounded-xl" />
              <Skeleton className="w-1/2 h-10 rounded-xl" />
              <Skeleton className="w-full h-12 rounded-2xl" />
              <Skeleton className="w-full h-12 rounded-2xl" />
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <Skeleton className="w-full h-5 rounded-md" />
                <Skeleton className="w-full h-5 rounded-md" />
                <Skeleton className="w-full h-5 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
