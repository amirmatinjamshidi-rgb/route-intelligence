'use client';

import { type Locale, localeNames, locales } from '@/lib/i18n/config';
import { switchLocalePath } from '@/lib/i18n/paths';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-line p-0.5 text-xs">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={switchLocalePath(pathname, code)}
            aria-current={active ? 'true' : undefined}
            className={`rounded-md px-2 py-1 font-medium transition ${
              active ? 'bg-brand/10 text-brand' : 'text-ink-muted hover:bg-surface hover:text-ink'
            }`}
          >
            {localeNames[code]}
          </Link>
        );
      })}
    </div>
  );
}
