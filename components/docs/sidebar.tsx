'use client';

import { useLocale } from '@/components/locale-provider';
import { getDocsNav } from '@/lib/i18n/navigation';
import { getUi } from '@/lib/i18n/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const ui = getUi(locale);
  const docsNav = getDocsNav(locale);

  return (
    <nav className="flex flex-col gap-8" aria-label={ui.docNavLabel}>
      {docsNav.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            {section.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`nav-link block rounded-xl px-3 py-2 text-sm ${
                      active
                        ? 'bg-[var(--brand-soft)] font-semibold text-brand shadow-[inset_3px_0_0_0_var(--brand)]'
                        : 'text-ink-muted hover:bg-surface hover:text-ink'
                    }`}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
