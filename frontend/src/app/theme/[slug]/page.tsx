import { THEMES_DATA } from '@/shared/data/themes-data';
import ThemeDetailClient from './ThemeDetailClient';

export function generateStaticParams() {
  return THEMES_DATA.map((t) => ({ slug: t.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ThemeDetailClient slug={slug} />;
}
