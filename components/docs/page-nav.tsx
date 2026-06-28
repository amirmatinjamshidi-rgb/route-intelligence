'use client';

import { useLocale } from '@/components/locale-provider';
import { getAdjacentDocs } from '@/lib/i18n/navigation';
import { getUi } from '@/lib/i18n/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PageNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const ui = getUi(locale);
  const { prev, next } = getAdjacentDocs(pathname, locale);

  if (!prev && !next) return null;

  return (
    <div className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="flex flex-col rounded-xl border border-line p-4 transition hover:border-brand"
        >
          <span className="text-xs text-ink-faint">{ui.previous}</span>
          <span className="font-semibold text-brand">
            <span className="inline-block rtl:rotate-180">←</span> {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex flex-col rounded-xl border border-line p-4 text-end transition hover:border-brand sm:items-end"
        >
          <span className="text-xs text-ink-faint">{ui.next}</span>
          <span className="font-semibold text-brand">
            {next.title} <span className="inline-block rtl:rotate-180">→</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
