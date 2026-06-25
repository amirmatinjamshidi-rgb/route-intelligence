'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('main h2[id], main h3[id]'));
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent?.replace(/#$/, '').trim() ?? '',
        level: node.tagName === 'H2' ? 2 : 3,
      })),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '0px 0px -75% 0px', threshold: 1 },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">On this page</p>
      <ul className="flex flex-col gap-1 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`-ml-px block border-l py-1 text-sm transition ${
                heading.level === 3 ? 'pl-6' : 'pl-3'
              } ${
                activeId === heading.id
                  ? 'border-brand font-medium text-brand'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
