import { DocPage } from '@/components/docs/doc-page';
import type { Locale } from '@/lib/i18n/config';
import type { Metadata } from 'next';
import type { ComponentType } from 'react';

type PageModule = {
  getMeta: (locale: Locale) => { title: string; eyebrow: string; lead: string };
  Content: ComponentType<{ locale: Locale }>;
};

async function loadPageModule(slug: string): Promise<PageModule> {
  switch (slug) {
    case 'introduction':
      return import('@/lib/i18n/pages/introduction');
    case 'installation':
      return import('@/lib/i18n/pages/installation');
    case 'quick-start':
      return import('@/lib/i18n/pages/quick-start');
    case 'concepts':
      return import('@/lib/i18n/pages/concepts');
    case 'nodes-and-edges':
      return import('@/lib/i18n/pages/nodes-and-edges');
    case 'diagnostics':
      return import('@/lib/i18n/pages/diagnostics');
    case 'cli':
      return import('@/lib/i18n/pages/cli');
    case 'configuration':
      return import('@/lib/i18n/pages/configuration');
    case 'api':
      return import('@/lib/i18n/pages/api');
    case 'frameworks':
      return import('@/lib/i18n/pages/frameworks');
    case 'integrations':
      return import('@/lib/i18n/pages/integrations');
    case 'visualizing':
      return import('@/lib/i18n/pages/visualizing');
    default:
      throw new Error(`Unknown doc page: ${slug}`);
  }
}

export async function createDocPage(slug: string, locale: Locale) {
  const { getMeta, Content } = await loadPageModule(slug);
  const meta = getMeta(locale);
  return (
    <DocPage eyebrow={meta.eyebrow} title={meta.title} lead={meta.lead}>
      <Content locale={locale} />
    </DocPage>
  );
}

export async function createDocMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const { getMeta } = await loadPageModule(slug);
  return { title: getMeta(locale).title };
}
