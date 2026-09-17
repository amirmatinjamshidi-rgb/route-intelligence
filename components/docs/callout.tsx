'use client';

import { useLocale } from '@/components/locale-provider';
import { getUi } from '@/lib/i18n/ui';
import type { ReactNode } from 'react';

type CalloutKind = 'note' | 'tip' | 'warning';

const styles: Record<CalloutKind, string> = {
  note: 'border-brand/25 bg-[var(--brand-soft)]',
  tip: 'border-emerald-500/30 bg-emerald-500/8',
  warning: 'border-amber-500/30 bg-amber-500/8',
};

const labelClass: Record<CalloutKind, string> = {
  note: 'text-brand',
  tip: 'text-emerald-700 dark:text-emerald-400',
  warning: 'text-amber-700 dark:text-amber-400',
};

export function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}) {
  const locale = useLocale();
  const ui = getUi(locale);
  const fallback = kind === 'note' ? ui.note : kind === 'tip' ? ui.tip : ui.warning;

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles[kind]}`}>
      <p className={`mb-1 text-sm font-semibold ${labelClass[kind]}`}>{title ?? fallback}</p>
      <div className="text-sm leading-6 text-ink-muted">{children}</div>
    </div>
  );
}
