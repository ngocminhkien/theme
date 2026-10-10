'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LivePreviewBarProps {
  themeName: string;
  themeSlug: string;
  demoUrl: string;
  priceVnd: number;
}

type DeviceView = 'desktop' | 'tablet' | 'mobile';

export function LivePreviewBar({ themeName, themeSlug, demoUrl, priceVnd }: LivePreviewBarProps) {
  const [device, setDevice] = useState<DeviceView>('desktop');

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-900">
      {/* Top Controller Bar */}
      <header className="h-14 bg-gray-950 border-b border-gray-800 text-white flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-blue-500 hover:text-white transition">
            ← Marketplace
          </Link>
          <span className="text-sm font-medium text-gray-300 hidden sm:inline">
            {themeName}
          </span>
        </div>

        {/* Responsive Device Switcher */}
        <div className="flex items-center bg-gray-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              device === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              device === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Tablet
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              device === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Mobile
          </button>
        </div>

        {/* Action Button: Sticky Buy Now */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-green-400 hidden sm:inline">
            {Number(priceVnd).toLocaleString('vi-VN')} đ
          </span>
          <Link
            href={`/checkout?theme=${themeSlug}`}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-md shadow transition"
          >
            MUA THEME NÀY
          </Link>
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Mở URL demo gốc"
            className="text-gray-400 hover:text-white text-xs"
          >
            ✕
          </a>
        </div>
      </header>

      {/* Embedded Iframe Container */}
      <main className="flex-1 w-full bg-gray-900 flex justify-center items-center overflow-hidden">
        <div className={`h-full ${getContainerWidth()} transition-all duration-300 shadow-2xl bg-white`}>
          <iframe
            src={demoUrl}
            title={themeName}
            className="w-full h-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
