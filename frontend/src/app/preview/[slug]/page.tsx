import { THEMES_DATA } from '@/shared/data/themes-data';
import { LivePreviewBar } from '@/features/preview/components/live-preview-bar';

export function generateStaticParams() {
  return THEMES_DATA.map((t) => ({ slug: t.slug }));
}

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const theme = THEMES_DATA.find((t) => t.slug === slug) || THEMES_DATA[0];

  return <LivePreviewBar theme={theme} />;
}
