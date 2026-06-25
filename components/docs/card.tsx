import Link from 'next/link';
import type { ReactNode } from 'react';

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function Card({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 transition hover:border-brand hover:shadow-sm"
    >
      <span className="flex items-center gap-1.5 font-semibold text-ink">
        {title}
        <span className="text-brand transition group-hover:translate-x-0.5">→</span>
      </span>
      <span className="text-sm leading-6 text-ink-muted">{children}</span>
    </Link>
  );
}
