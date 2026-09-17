import type { ReactNode } from 'react';
import { Lead } from './content';
import { PageNav } from './page-nav';

/**
 * Standard shell for every documentation page: an eyebrow + title + lead
 * header, the body content, and the prev/next footer. Pages only provide
 * their content.
 */
export function DocPage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="doc-hero mb-10 px-6 py-8 sm:px-8">
        <div className="relative z-10 flex flex-col gap-3">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-[2.75rem] sm:leading-tight">
            {title}
          </h1>
          <Lead>{lead}</Lead>
        </div>
      </header>

      {children}

      <PageNav />
    </article>
  );
}
