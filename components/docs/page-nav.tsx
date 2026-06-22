"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdjacentDocs } from "@/lib/navigation";


export function PageNav() {
  const pathname = usePathname();
  const { prev, next } = getAdjacentDocs(pathname);

  if (!prev && !next) return null;

  return (
    <div className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="flex flex-col rounded-xl border border-line p-4 transition hover:border-brand"
        >
          <span className="text-xs text-ink-faint">Previous</span>
          <span className="font-semibold text-brand">← {prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex flex-col rounded-xl border border-line p-4 text-right transition hover:border-brand sm:items-end"
        >
          <span className="text-xs text-ink-faint">Next</span>
          <span className="font-semibold text-brand">{next.title} →</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
