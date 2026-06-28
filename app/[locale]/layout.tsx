import { LocaleAttributes } from '@/components/locale-attributes';
import { LocaleProvider } from '@/components/locale-provider';
import { type Locale, locales } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <LocaleProvider locale={locale}>
      <LocaleAttributes locale={locale} />
      {children}
    </LocaleProvider>
  );
}
