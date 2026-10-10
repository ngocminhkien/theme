'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { LivePreviewBar } from '@/features/preview/components/live-preview-bar';
import { THEMES_DATA } from '@/shared/data/themes-data';

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const theme = THEMES_DATA.find((t) => t.slug === slug) || THEMES_DATA[0];

  return <LivePreviewBar theme={theme} />;
}
