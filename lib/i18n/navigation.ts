import type { Locale } from './config';
import { localizePath } from './paths';

export interface DocLink {
  title: string;
  href: string;
}

export interface DocSection {
  title: string;
  links: DocLink[];
}

export const GITHUB_URL = 'https://github.com/amirmatinjamshidi-rgb/route-intelligence';

const docsNavByLocale: Record<Locale, DocSection[]> = {
  en: [
    {
      title: 'Get Started',
      links: [
        { title: 'Introduction', href: '/docs' },
        { title: 'Installation', href: '/docs/installation' },
        { title: 'Quick Start', href: '/docs/quick-start' },
      ],
    },
    {
      title: 'Core Concepts',
      links: [
        { title: 'The Route Graph', href: '/docs/concepts' },
        { title: 'Nodes & Edges', href: '/docs/nodes-and-edges' },
        { title: 'Diagnostics', href: '/docs/diagnostics' },
      ],
    },
    {
      title: 'Usage',
      links: [
        { title: 'CLI Commands', href: '/docs/cli' },
        { title: 'Configuration', href: '/docs/configuration' },
        { title: 'Programmatic API', href: '/docs/api' },
      ],
    },
    {
      title: 'Ecosystem',
      links: [
        { title: 'Framework Plugins', href: '/docs/frameworks' },
        { title: 'Integrations', href: '/docs/integrations' },
        { title: 'Visualizing', href: '/docs/visualizing' },
      ],
    },
  ],
  fa: [
    {
      title: 'اول کار',
      links: [
        { title: 'این چیه اصلاً؟', href: '/docs' },
        { title: 'نصب', href: '/docs/installation' },
        { title: 'زود شروع کن', href: '/docs/quick-start' },
      ],
    },
    {
      title: 'مغزش چیه',
      links: [
        { title: 'گراف روت', href: '/docs/concepts' },
        { title: 'نود و یال', href: '/docs/nodes-and-edges' },
        { title: 'ارور و هشدار', href: '/docs/diagnostics' },
      ],
    },
    {
      title: 'دست به کار',
      links: [
        { title: 'دستورات CLI', href: '/docs/cli' },
        { title: 'کانفیگ', href: '/docs/configuration' },
        { title: 'API تو کد', href: '/docs/api' },
      ],
    },
    {
      title: 'دور و برش',
      links: [
        { title: 'پلاگین فریم‌ورک', href: '/docs/frameworks' },
        { title: 'وصل کردن به بقیه', href: '/docs/integrations' },
        { title: 'دیدن گراف', href: '/docs/visualizing' },
      ],
    },
  ],
};

export function getDocsNav(locale: Locale): DocSection[] {
  return docsNavByLocale[locale].map((section) => ({
    title: section.title,
    links: section.links.map((link) => ({
      title: link.title,
      href: localizePath(link.href, locale),
    })),
  }));
}

export function getFlatDocs(locale: Locale): DocLink[] {
  return getDocsNav(locale).flatMap((section) => section.links);
}

export function getAdjacentDocs(
  pathname: string,
  locale: Locale,
): { prev: DocLink | null; next: DocLink | null } {
  const flatDocs = getFlatDocs(locale);
  const index = flatDocs.findIndex((link) => link.href === pathname);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? flatDocs[index - 1] : null,
    next: index < flatDocs.length - 1 ? flatDocs[index + 1] : null,
  };
}
