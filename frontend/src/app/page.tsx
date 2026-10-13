'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { MarqueeFeatures } from '@/components/home/MarqueeFeatures';
import { PopularCategories } from '@/components/home/PopularCategories';
import { FeaturedThemesSection } from '@/components/home/FeaturedThemesSection';
import { PromoDealBanner } from '@/components/home/PromoDealBanner';
import ScrollReveal from '@/components/motion/ScrollReveal';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent relative z-10">
      {/* SaaS Glassmorphic Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section: Centered Big Search, Glow Grid & Highlight Banners */}
        <ScrollReveal variant="fade-up" durationMs={650}>
          <HeroSection />
        </ScrollReveal>

        {/* Feature Grid Trust Strip */}
        <ScrollReveal variant="fade-up" delayMs={60}>
          <MarqueeFeatures />
        </ScrollReveal>

        {/* Popular Categories Grid */}
        <ScrollReveal variant="fade-up" delayMs={80}>
          <PopularCategories />
        </ScrollReveal>

        {/* Featured Themes Grid with Filter Tabs */}
        <ScrollReveal variant="fade-up" delayMs={80}>
          <FeaturedThemesSection />
        </ScrollReveal>

        {/* Promotional Countdown Deal Banner */}
        <ScrollReveal variant="tilt-up" delayMs={90}>
          <PromoDealBanner />
        </ScrollReveal>
      </main>

      {/* SaaS Dark Footer */}
      <ScrollReveal variant="fade-up" delayMs={50}>
        <Footer />
      </ScrollReveal>
    </div>
  );
}
