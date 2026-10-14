import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function MyAccountLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative z-10 animate-in fade-in duration-300">
      <Header />
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div>
            <Skeleton className="w-48 h-7 rounded-lg mb-2" />
            <Skeleton className="w-32 h-4 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <div className="md:col-span-3 space-y-4">
            <Skeleton className="w-full h-32 rounded-3xl" />
            <Skeleton className="w-full h-48 rounded-3xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
