import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, InlineCode, LI, P, Prose, Strong, UL } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'The Route Graph' };

export default function ConceptsPage() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="The Route Graph"
      lead="Everything Route Intelligence does is built on one idea: your app's routing is a directed graph. Routes are nodes, navigations are edges, and analysis is just graph traversal."
    >
      <Prose>
        <H2 id="model">The model</H2>
        <P>
          The graph is a <Strong>typed, directed multigraph</Strong>. Each <Strong>node</Strong> is
          a routable thing (a page, layout, API handler, redirect, or external URL). Each{' '}
          <Strong>edge</Strong> is a relationship between them (a navigation, redirect, rewrite, or
          layout parent link).
        </P>
        <P>
          Because it is a real graph, you can answer questions algorithmically:{' '}
          <em>
            Is this route reachable? Does this redirect loop? What links here? What is the shortest
            path from the home page to checkout?
          </em>
        </P>

        <H2 id="pipeline">The analysis pipeline</H2>
        <P>
          A run flows through a series of stages. Each stage has one job and hands its result to the
          next, which makes the engine easy to reason about and extend.
        </P>
        <UL>
          <LI>
            <Strong>FileSystem</Strong> — discover candidate files from your include/exclude globs.
          </LI>
          <LI>
            <Strong>Parse</Strong> — load source into the TypeScript compiler via ts-morph.
          </LI>
          <LI>
            <Strong>Semantic</Strong> — classify files (client vs server component, runtime).
          </LI>
          <LI>
            <Strong>RouteDiscovery</Strong> — plugins map files to route nodes.
          </LI>
          <LI>
            <Strong>NavigationAnalysis</Strong> — find <InlineCode>{'<Link>'}</InlineCode>,{' '}
            <InlineCode>router.push</InlineCode>, <InlineCode>redirect()</InlineCode>, and more.
          </LI>
          <LI>
            <Strong>MiddlewareAnalysis</Strong> — read matchers, redirects, and rewrites.
          </LI>
          <LI>
            <Strong>ConditionalAnalysis</Strong> — capture auth/role/flag guards on edges.
          </LI>
          <LI>
            <Strong>StaticAnalysis</Strong> — produce diagnostics (dead routes, cycles, …).
          </LI>
          <LI>
            <Strong>Metrics</Strong> — compute counts, maintainability, and risk scores.
          </LI>
          <LI>
            <Strong>Output</Strong> — serialize and export.
          </LI>
        </UL>

        <H2 id="plugins">Plugins keep the core framework-agnostic</H2>
        <P>
          The core never imports React or any framework. A <A href="/docs/frameworks">plugin</A>{' '}
          implements the <InlineCode>FrameworkPlugin</InlineCode> interface to teach the pipeline
          how a specific framework discovers routes and expresses navigation. You can run several
          plugins at once.
        </P>
        <CodeBlock
          language="tsx"
          filename="ri.config.ts"
          code={`import { defineConfig } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';

export default defineConfig({
  root: '.',
  plugins: [NextPlugin({ appDir: 'app', pagesDir: 'pages' })],
});`}
        />

        <H2 id="incremental">Incremental by design</H2>
        <P>
          Re-analyzing an entire app on every keystroke is wasteful. Route Intelligence hashes each
          file and tracks a dependency map, so <InlineCode>watch</InlineCode> mode only recomputes
          the part of the graph affected by a change and emits a <InlineCode>GraphPatch</InlineCode>
          .
        </P>
        <Callout kind="note" title="One model, many consumers">
          The CLI, VS Code extension, visualizer, ESLint plugin, and GitHub Action all read the same
          serialized graph. Learn its shape in <A href="/docs/nodes-and-edges">Nodes & Edges</A>.
        </Callout>
      </Prose>
    </DocPage>
  );
}
