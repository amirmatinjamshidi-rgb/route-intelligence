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
      className="group nav-link flex flex-col gap-1.5 rounded-2xl border border-line bg-surface/90 p-5 shadow-[var(--shadow)] hover:-translate-y-0.5 hover:border-brand/50"
    >
      <span className="flex items-center gap-1.5 font-semibold text-ink">
        {title}
        <span className="text-brand transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5">
          →
        </span>
      </span>
      <span className="text-sm leading-6 text-ink-muted">{children}</span>
    </Link>
  );
}
