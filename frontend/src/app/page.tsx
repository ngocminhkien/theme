'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { MarqueeFeatures } from '@/components/home/MarqueeFeatures';
import { PopularCategories } from '@/components/home/PopularCategories';
import { FeaturedThemesSection } from '@/components/home/FeaturedThemesSection';
import { PromoDealBanner } from '@/components/home/PromoDealBanner';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* SaaS Glassmorphic Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section: Centered Big Search, Glow Grid & Highlight Banners */}
        <HeroSection />

        {/* Feature Grid Trust Strip */}
        <MarqueeFeatures />

        {/* Popular Categories Grid */}
        <PopularCategories />

        {/* Featured Themes Grid with Filter Tabs */}
        <FeaturedThemesSection />

        {/* Promotional Countdown Deal Banner */}
        <PromoDealBanner />
      </main>

      {/* SaaS Dark Footer */}
      <Footer />

    </div>
  );
}
