import type { Locale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/paths';
import Link from 'next/link';
import type { ReactNode } from 'react';

const linkClass =
  'font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand';

export function LA({
  href,
  locale,
  children,
}: {
  href: string;
  locale: Locale;
  children: ReactNode;
}) {
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
        {children}
      </a>
    );
  }
  return (
    <Link href={localizePath(href, locale)} className={linkClass}>
      {children}
    </Link>
  );
}

export function LCard({
  href,
  locale,
  title,
  children,
}: {
  href: string;
  locale: Locale;
  title: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={localizePath(href, locale)}
      className="group flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 transition hover:border-brand hover:shadow-sm"
    >
      <span className="flex items-center gap-1.5 font-semibold text-ink">
        {title}
        <span className="text-brand transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
          →
        </span>
      </span>
      <span className="text-sm leading-6 text-ink-muted">{children}</span>
    </Link>
  );
}
