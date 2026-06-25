import type { ReactNode } from 'react';

type CalloutKind = 'note' | 'tip' | 'warning';

const styles: Record<CalloutKind, { ring: string; label: string; text: string }> = {
  note: {
    ring: 'border-brand/30 bg-brand/5',
    label: 'text-brand',
    text: 'Note',
  },
  tip: {
    ring: 'border-emerald-500/30 bg-emerald-500/5',
    label: 'text-emerald-600 dark:text-emerald-400',
    text: 'Tip',
  },
  warning: {
    ring: 'border-amber-500/30 bg-amber-500/5',
    label: 'text-amber-600 dark:text-amber-400',
    text: 'Warning',
  },
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
  const style = styles[kind];
  return (
    <div className={`rounded-xl border px-4 py-3 ${style.ring}`}>
      <p className={`mb-1 text-sm font-semibold ${style.label}`}>{title ?? style.text}</p>
      <div className="text-sm leading-6 text-ink-muted">{children}</div>
    </div>
  );
}
