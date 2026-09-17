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
    readyBody: 'Install the CLI, run one command, and explore your app’s routing in a live graph.',
    footer: 'MIT licensed · Built on a typed route graph.',
    heroBadge: 'Static routing analysis for React & Next.js',
    heroTitle: 'See your routing as a',
    heroTitleHighlight: 'graph',
    heroLead:
      'Route Intelligence is DevTools for routing. It reads your codebase and builds a typed graph of every route, layout, redirect, and link — without ever running the app.',
    linkToSection: 'Link to this section',
    onThisPage: 'On this page',
    copy: 'Copy',
    copied: 'Copied',
    note: 'Note',
    tip: 'Tip',
    warning: 'Warning',
  },
  fa: {
    docs: 'داک',
    cli: 'CLI',
    github: 'گیت‌هاب',
    menu: 'منو',
    close: 'ببند',
    openNav: 'منو رو باز کن',
    closeNav: 'منو رو ببند',
    previous: 'قبلی',
    next: 'بعدی',
    docNavLabel: 'داک',
    readDocs: 'بریم داک',
    quickStart: 'زود شروع کن',
    getStarted: 'بزن بریم',
    readyTitle: 'می‌خوای ببینی روت‌هات کجان؟',
    readyBody: 'CLI رو بذار، یه دستور بزن، گراف مسیر اپ تو مرورگر باز می‌شه.',
    footer: 'لایسنس MIT · همه‌چیز رو یه گراف تایپ‌شده نگه می‌داره.',
    heroBadge: 'روت‌هاتو بدون اجرای اپ می‌خونه',
    heroTitle: 'روت‌هاتو مثل',
    heroTitleHighlight: 'گراف',
    heroLead:
      'این یه جورایی DevTools روتینگه. کد رو می‌خونه، از هر page و layout و لینک یه گراف می‌سازه — اپ رو روشن نمی‌کنه.',
    linkToSection: 'لینک این بخش',
    onThisPage: 'تو این صفحه',
    copy: 'کپی',
    copied: 'کپی شد',
    note: 'یه نکته',
    tip: 'تیپ',
    warning: 'حواست باشه',
  },
} as const;

export type UiStrings = (typeof ui)[Locale];

export function getUi(locale: Locale): UiStrings {
  return ui[locale];
}
