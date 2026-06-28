'use client';

import type { Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';

export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ui = getUi(locale);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-muted transition hover:text-ink"
        aria-label={ui.openNav}
      >
        {ui.menu}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label={ui.closeNav}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="scroll-rail absolute start-0 top-0 h-full w-72 overflow-y-auto bg-bg p-6 shadow-xl">
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-line px-3 py-1 text-sm text-ink-muted"
              >
                {ui.close}
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      ) : null}
    </div>
  );
}
