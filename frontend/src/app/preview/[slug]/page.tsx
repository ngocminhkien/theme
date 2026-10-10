'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { LivePreviewBar } from '../../../features/preview/components/live-preview-bar.js';

export default function PreviewPage() {
  const params = useParams();
  const slug = params?.slug as string || 'woodmart';

  return (
    <LivePreviewBar
      themeName="Woodmart Multipurpose Theme"
      themeSlug={slug}
      demoUrl="https://woodmart.xtemos.com/"
      priceVnd={890000}
    />
  );
}
