'use client';

import { type Locale, isRtl } from '@/lib/i18n/config';
import { useEffect } from 'react';

export function LocaleAttributes({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
