import { LanguageSwitcher } from '@/components/docs/language-switcher';
import { Logo } from '@/components/logo';
import type { Locale } from '@/lib/i18n/config';
import { GITHUB_URL } from '@/lib/i18n/navigation';
import { localizePath } from '@/lib/i18n/paths';
import { getUi } from '@/lib/i18n/ui';
import Link from 'next/link';
import { MobileNav } from './mobile-nav';

export function TopNav({ locale }: { locale: Locale }) {
  const ui = getUi(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-transparent backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <MobileNav locale={locale} />
          <Logo href={localizePath('/', locale)} />
        </div>

        <nav className="flex items-center gap-1 text-sm">
          <LanguageSwitcher locale={locale} />
          <Link
            href={localizePath('/docs', locale)}
            className="rounded-lg px-3 py-1.5 text-ink-muted transition hover:bg-surface hover:text-ink"
          >
            {ui.docs}
          </Link>
          <Link
            href={localizePath('/docs/cli', locale)}
            className="hidden rounded-lg px-3 py-1.5 text-ink-muted transition hover:bg-surface hover:text-ink sm:block"
          >
            {ui.cli}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-3 py-1.5 text-ink-muted transition hover:bg-surface hover:text-ink"
          >
            {ui.github}
          </a>
        </nav>
      </div>
    </header>
  );
}
