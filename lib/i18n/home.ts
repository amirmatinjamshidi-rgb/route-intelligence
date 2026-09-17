import type { Locale } from './config';

export interface HomeFeature {
  title: string;
  body: string;
}

export interface HomeContent {
  features: HomeFeature[];
}

const homeContent: Record<Locale, HomeContent> = {
  en: {
    features: [
      {
        title: 'A typed route graph',
        body: 'Every route, layout, API handler, redirect, and navigation in one queryable model.',
      },
      {
        title: 'Static diagnostics',
        body: 'Dead routes, broken links, and redirect cycles — caught in CI, before runtime.',
      },
      {
        title: 'Framework-agnostic core',
        body: 'Next.js, React Router, and TanStack Router via small plugins. CLI ships Next.js today.',
      },
      {
        title: 'Visualize & document',
        body: 'Export to Mermaid, PlantUML, DOT, HTML, or an interactive browser graph.',
      },
      {
        title: 'Editor & CI',
        body: 'CLI, VS Code extension, ESLint rules, and a GitHub Action for pull requests.',
      },
      {
        title: 'Incremental by design',
        body: 'Watch mode hashes files and only recomputes the part of the graph that changed.',
      },
    ],
  },
  fa: {
    features: [
      {
        title: 'گراف روت، تایپ‌شده',
        body: 'page، layout، API، redirect، لینک — همه‌ش تو یه جا که بتونی روش کار کنی.',
      },
      {
        title: 'باگ روت قبل از پروداکشن',
        body: 'روت مرده، لینک مرده، حلقه redirect. تو CI می‌گیری، نه وقتی کاربر گیر کرده.',
      },
      {
        title: 'به فریم‌ورک قفل نیست',
        body: 'Next، React Router، TanStack با پلاگین. فعلاً CLI همون Next رو بلده.',
      },
      {
        title: 'ببین، بکش بیرون',
        body: 'Mermaid، PlantUML، DOT، HTML، یا گراف تو مرورگر.',
      },
      {
        title: 'ادیتور و پایپلاین',
        body: 'CLI، VS Code، ESLint، GitHub Action برای PR.',
      },
      {
        title: 'فقط چیزایی که عوض شدن',
        body: 'watch فایل رو hash می‌کنه، همون تیکه گراف رو دوباره حساب می‌کنه.',
      },
    ],
  },
};

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale];
}
