import type { Locale } from './config';

const ui = {
  en: {
    docs: 'Docs',
    cli: 'CLI',
    github: 'GitHub',
    menu: 'Menu',
    close: 'Close',
    openNav: 'Open navigation menu',
    closeNav: 'Close navigation menu',
    previous: 'Previous',
    next: 'Next',
    docNavLabel: 'Documentation',
    readDocs: 'Read the docs',
    quickStart: 'Quick start',
    getStarted: 'Get started',
    readyTitle: 'Ready to map your routes?',
    readyBody:
      "Install the CLI, run one command, and explore your app's routing in an interactive graph.",
    footer: 'MIT licensed · Built on a typed route graph.',
    heroBadge: 'Static routing analysis for React & Next.js',
    heroTitle: 'See your routing as a',
    heroTitleHighlight: 'graph',
    heroLead:
      'Route Intelligence is the React DevTools for routing. It statically analyzes your codebase and builds a complete, typed graph of every route, layout, redirect, and navigation — without ever running your app.',
    linkToSection: 'Link to this section',
  },
  fa: {
    docs: 'مستندات',
    cli: 'رابط خط فرمان',
    github: 'گیت‌هاب',
    menu: 'منو',
    close: 'بستن',
    openNav: 'باز کردن منوی ناوبری',
    closeNav: 'بستن منوی ناوبری',
    previous: 'قبلی',
    next: 'بعدی',
    docNavLabel: 'مستندات',
    readDocs: 'مطالعه مستندات',
    quickStart: 'شروع سریع',
    getStarted: 'شروع کنید',
    readyTitle: 'آماده نقشه‌برداری از مسیرها هستید؟',
    readyBody:
      'CLI را نصب کنید، یک دستور اجرا کنید و مسیریابی برنامه را در یک گراف تعاملی کاوش کنید.',
    footer: 'مجوز MIT · ساخته‌شده بر پایه گراف مسیر تایپ‌شده.',
    heroBadge: 'تحلیل استاتیک مسیریابی برای React و Next.js',
    heroTitle: 'مسیریابی خود را به‌صورت',
    heroTitleHighlight: 'گراف',
    heroLead:
      'Route Intelligence ابزار DevTools مسیریابی برای React است. کدبیس شما را به‌صورت استاتیک تحلیل می‌کند و گراف کامل و تایپ‌شده‌ای از هر مسیر، layout، redirect و navigation می‌سازد — بدون اجرای برنامه.',
    linkToSection: 'پیوند به این بخش',
  },
} as const;

export type UiStrings = (typeof ui)[Locale];

export function getUi(locale: Locale): UiStrings {
  return ui[locale];
}
