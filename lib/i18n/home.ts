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
        body: 'Next.js, React Router, and TanStack Router support via small, composable plugins.',
      },
      {
        title: 'Visualize & document',
        body: 'Export to Mermaid, PlantUML, DOT, HTML, or an interactive browser graph.',
      },
      {
        title: 'Editor & CI integrations',
        body: 'A CLI, VS Code extension, ESLint rules, and a GitHub Action for pull requests.',
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
        title: 'گراف مسیر تایپ‌شده',
        body: 'هر مسیر، layout، API handler، redirect و navigation در یک مدل قابل جستجو.',
      },
      {
        title: 'تشخیص استاتیک',
        body: 'مسیرهای مرده، لینک‌های شکسته و چرخه‌های redirect — قبل از runtime در CI شناسایی می‌شوند.',
      },
      {
        title: 'هسته مستقل از فریم‌ورک',
        body: 'پشتیبانی از Next.js، React Router و TanStack Router با افزونه‌های کوچک و ترکیبی.',
      },
      {
        title: 'مصورسازی و مستندسازی',
        body: 'خروجی به Mermaid، PlantUML، DOT، HTML یا گراف تعاملی مرورگر.',
      },
      {
        title: 'یکپارچه‌سازی با ویرایشگر و CI',
        body: 'CLI، افزونه VS Code، قوانین ESLint و GitHub Action برای pull requestها.',
      },
      {
        title: 'طراحی افزایشی',
        body: 'حالت watch فایل‌ها را hash می‌کند و فقط بخش تغییر‌یافته گراف را دوباره محاسبه می‌کند.',
      },
    ],
  },
};

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale];
}
