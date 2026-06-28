import Link from 'next/link';
import type { ReactNode } from 'react';

export function Prose({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5 leading-7 text-ink-muted">{children}</div>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-lg leading-8 text-ink-muted sm:text-xl">{children}</p>;
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

function anchor(id: string) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className="ms-2 text-ink-faint opacity-0 transition group-hover:opacity-100"
    >
      #
    </a>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="group mt-6 scroll-mt-24 text-2xl font-bold text-ink">
      {children}
      {anchor(id)}
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="group mt-4 scroll-mt-24 text-xl font-semibold text-ink">
      {children}
      {anchor(id)}
    </h3>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-2 ps-6 marker:text-ink-faint">{children}</ul>;
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="flex list-decimal flex-col gap-2 ps-6 marker:text-ink-faint">{children}</ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="ps-1">{children}</li>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
      {children}
    </code>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith('http');
  const className =
    'font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-start text-sm">
        <thead>
          <tr className="bg-surface">
            {head.map((cell) => (
              <th key={cell} className="border-b border-line px-4 py-3 font-semibold text-ink">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={head.map((column, col) => `${column}:${String(row[col])}`).join('|')}
              className="align-top"
            >
              {row.map((cell, col) => (
                <td
                  key={head[col]}
                  className="border-b border-line px-4 py-3 text-ink-muted last:border-b-0 [tr:last-child_&]:border-b-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
