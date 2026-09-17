import { CodeBlock } from '@/components/docs/code-block';
import { LanguageSwitcher } from '@/components/docs/language-switcher';
import { Logo } from '@/components/logo';
import type { Locale } from '@/lib/i18n/config';
import { getHomeContent } from '@/lib/i18n/home';
import { GITHUB_URL } from '@/lib/i18n/navigation';
import { localizePath } from '@/lib/i18n/paths';
import { getUi } from '@/lib/i18n/ui';
import Link from 'next/link';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const ui = getUi(locale);
  const { features } = getHomeContent(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass-nav sticky top-0 z-40 border-b border-line/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo href={localizePath('/', locale)} />
          <nav className="flex items-center gap-1 text-sm">
            <LanguageSwitcher locale={locale} />
            <Link
              href={localizePath('/docs', locale)}
              className="nav-link rounded-full px-3 py-1.5 text-ink-muted hover:bg-surface hover:text-ink"
            >
              {ui.docs}
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-link rounded-full px-3 py-1.5 text-ink-muted hover:bg-surface hover:text-ink"
            >
              {ui.github}
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-5xl font-bold tracking-tight text-ink sm:text-6xl">
              Route<span className="text-brand">Intelligence</span>
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-sm text-ink-muted shadow-[var(--shadow)]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_4px_var(--brand-soft)]" />
              {ui.heroBadge}
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {ui.heroTitle}{' '}
              <span className="bg-linear-to-r from-brand to-sky-500 bg-clip-text text-transparent">
                {ui.heroTitleHighlight}
                {locale === 'fa' ? ' ببین.' : '.'}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
              {ui.heroLead}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={localizePath('/docs', locale)}
                className="btn-primary rounded-full px-6 py-3 font-semibold shadow-[var(--shadow)]"
              >
                {ui.readDocs}
              </Link>
              <Link
                href={localizePath('/docs/quick-start', locale)}
                className="btn-ghost rounded-full px-6 py-3 font-semibold"
              >
                {ui.quickStart}
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <CodeBlock
              language="bash"
              code={`npm install -D @route-intelligence/cli
npx route-intelligence graph --port 3001
# Generate analysis reports in different formats
npx route-intelligence analyze --format html --out ri-output
npx route-intelligence analyze --format mermaid --out ri-output
npx route-intelligence analyze --format plantuml --out ri-output
`}
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 border-t border-line/80 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="relative pe-2">
                <div className="mb-3 h-0.5 w-10 bg-brand" />
                <h2 className="text-base font-semibold text-ink">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="doc-hero px-6 py-14 text-center sm:px-10">
            <div className="relative z-10">
              <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-ink">
                {ui.readyTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-ink-muted">{ui.readyBody}</p>
              <Link
                href={localizePath('/docs/installation', locale)}
                className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 font-semibold"
              >
                {ui.getStarted}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-ink-faint sm:flex-row sm:px-6">
          <Logo href={localizePath('/', locale)} />
          <p>{ui.footer}</p>
        </div>
      </footer>
    </div>
  );
}
