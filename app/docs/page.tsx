import { Callout } from '@/components/docs/callout';
import { Card, CardGrid } from '@/components/docs/card';
import { A, H2, InlineCode, LI, P, Prose, Strong, UL } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Introduction' };

export default function IntroductionPage() {
  return (
    <DocPage
      eyebrow="Get Started"
      title="Introduction"
      lead="Route Intelligence is the React DevTools for routing. It statically analyzes your React and Next.js codebase and builds a complete, typed graph of every route, layout, redirect, and navigation in your app."
    >
      <Prose>
        <P>
          Modern apps spread routing across dozens of files: pages, layouts, middleware, and{' '}
          <InlineCode>{'<Link>'}</InlineCode> calls scattered through components. Route Intelligence
          reads all of it <Strong>without running your app</Strong> and turns it into a single graph
          you can query, visualize, lint, and document.
        </P>

        <H2 id="what-you-get">What you get</H2>
        <UL>
          <LI>
            <Strong>A typed route graph</Strong> — every route, layout, API handler, redirect, and
            navigation edge in one model.
          </LI>
          <LI>
            <Strong>Static diagnostics</Strong> — dead routes, broken links, redirect cycles, and
            missing error boundaries, caught before runtime.
          </LI>
          <LI>
            <Strong>Visualizations & docs</Strong> — export to Mermaid, PlantUML, DOT, HTML, JSON,
            or an interactive browser graph.
          </LI>
          <LI>
            <Strong>Ecosystem integrations</Strong> — a CLI, VS Code extension, ESLint rules, a
            GitHub Action, and Playwright test generation.
          </LI>
        </UL>

        <H2 id="how-it-works">How it works</H2>
        <P>
          The core engine never depends on React. Instead, framework support is provided through{' '}
          <Strong>plugins</Strong> (Next.js, React Router, TanStack Router). A plugin teaches the
          analyzer how a framework maps files to routes; the core handles parsing, graph building,
          analysis, and export. Everything flows through one shared, typed graph model.
        </P>

        <Callout kind="note" title="Static, not runtime">
          Route Intelligence uses <A href="https://ts-morph.com">ts-morph</A> to read your source
          with the TypeScript compiler. It never executes your code, so it is safe to run in CI and
          on untrusted branches.
        </Callout>

        <H2 id="next-steps">Next steps</H2>
        <CardGrid>
          <Card href="/docs/installation" title="Installation">
            Add Route Intelligence to your project with npm, Yarn, or Bun.
          </Card>
          <Card href="/docs/quick-start" title="Quick Start">
            Analyze your routes and open the graph in under a minute.
          </Card>
          <Card href="/docs/concepts" title="The Route Graph">
            Understand the model that powers everything else.
          </Card>
          <Card href="/docs/cli" title="CLI Commands">
            The full command reference: analyze, graph, doctor, and more.
          </Card>
        </CardGrid>
      </Prose>
    </DocPage>
  );
}
