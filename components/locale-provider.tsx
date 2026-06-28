'use client';

import type { Locale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/paths';
import { createContext, useContext } from 'react';

const LocaleContext = createContext<Locale>('en');

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useLocalizedHref(href: string): string {
  const locale = useLocale();
  if (href.startsWith('http') || href.startsWith('#')) return href;
  return localizePath(href, locale);
}
