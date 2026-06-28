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
    <nav className="flex flex-col gap-7" aria-label={ui.docNavLabel}>
      {docsNav.map((section) => (
        <div key={section.title} className="flex flex-col gap-1.5">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
            {section.title}
          </p>
          <ul className="flex flex-col">
            {section.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition ${
                      active
                        ? 'bg-brand/10 font-semibold text-brand'
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
