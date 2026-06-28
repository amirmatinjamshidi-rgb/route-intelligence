import type { Locale } from '@/lib/i18n/config';
import { createDocMetadata, createDocPage } from '@/lib/i18n/create-doc-page';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createDocMetadata('visualizing', locale as Locale);
}

export default async function VisualizingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createDocPage('visualizing', locale as Locale);
}
