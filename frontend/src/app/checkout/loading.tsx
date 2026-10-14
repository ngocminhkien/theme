import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative z-10 animate-in fade-in duration-300">
      <Header />
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <Skeleton className="w-64 h-9 rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="w-full h-80 rounded-3xl" />
            <Skeleton className="w-full h-48 rounded-3xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="w-full h-96 rounded-3xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
