import type { ReactNode } from "react";
import { Lead } from "./content";
import { PageNav } from "./page-nav";

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
      <header className="mb-8 flex flex-col gap-3">
        {eyebrow ? (
          <span className="text-sm font-semibold uppercase tracking-wider text-brand">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
        <Lead>{lead}</Lead>
      </header>

      {children}

      <PageNav />
    </article>
  );
}
