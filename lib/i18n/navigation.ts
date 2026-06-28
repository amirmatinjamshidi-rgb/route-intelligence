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
      title: 'شروع کار',
      links: [
        { title: 'معرفی', href: '/docs' },
        { title: 'نصب', href: '/docs/installation' },
        { title: 'شروع سریع', href: '/docs/quick-start' },
      ],
    },
    {
      title: 'مفاهیم پایه',
      links: [
        { title: 'گراف مسیر', href: '/docs/concepts' },
        { title: 'گره‌ها و یال‌ها', href: '/docs/nodes-and-edges' },
        { title: 'تشخیص‌ها', href: '/docs/diagnostics' },
      ],
    },
    {
      title: 'کاربرد',
      links: [
        { title: 'دستورات CLI', href: '/docs/cli' },
        { title: 'پیکربندی', href: '/docs/configuration' },
        { title: 'API برنامه‌نویسی', href: '/docs/api' },
      ],
    },
    {
      title: 'اکوسیستم',
      links: [
        { title: 'افزونه‌های فریم‌ورک', href: '/docs/frameworks' },
        { title: 'یکپارچه‌سازی‌ها', href: '/docs/integrations' },
        { title: 'مصورسازی', href: '/docs/visualizing' },
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
