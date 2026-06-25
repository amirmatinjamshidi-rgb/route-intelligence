/**
 * Single source of truth for the documentation navigation.
 *
 * The sidebar, the mobile nav, and the prev/next page footer are all derived
 * from this structure, so adding a page is a one-line change here plus the
 * matching `app/docs/<slug>/page.tsx` file.
 */

export interface DocLink {
  title: string;
  href: string;
}

export interface DocSection {
  title: string;
  links: DocLink[];
}

export const docsNav: DocSection[] = [
  {
    title: 'Get Started',
    links: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    links: [
      { title: 'The Route Graph', href: '/docs/concepts' },
      { title: 'Nodes & Edges', href: '/docs/nodes-and-edges' },
      { title: 'Diagnostics', href: '/docs/diagnostics' },
    ],
  },
  {
    title: 'Usage',
    links: [
      { title: 'CLI Commands', href: '/docs/cli' },
      { title: 'Configuration', href: '/docs/configuration' },
      { title: 'Programmatic API', href: '/docs/api' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { title: 'Framework Plugins', href: '/docs/frameworks' },
      { title: 'Integrations', href: '/docs/integrations' },
      { title: 'Visualizing', href: '/docs/visualizing' },
    ],
  },
];

export const flatDocs: DocLink[] = docsNav.flatMap((section) => section.links);

export function getAdjacentDocs(pathname: string): {
  prev: DocLink | null;
  next: DocLink | null;
} {
  const index = flatDocs.findIndex((link) => link.href === pathname);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? flatDocs[index - 1] : null,
    next: index < flatDocs.length - 1 ? flatDocs[index + 1] : null,
  };
}

export const GITHUB_URL = 'https://github.com/amirmatinjamshidi-rgb/route-intelligence';
