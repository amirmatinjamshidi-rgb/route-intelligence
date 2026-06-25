import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nodes & Edges' };

export default function NodesAndEdgesPage() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="Nodes & Edges"
      lead="The serialized graph is plain JSON: a list of nodes, a list of edges, and some metadata. Here is exactly what each one contains."
    >
      <Prose>
        <H2 id="node-types">Node types</H2>
        <P>
          Every node has a <InlineCode>type</InlineCode> drawn from a fixed union. This mirrors
          Next.js file conventions plus a few synthetic kinds for redirects and external links.
        </P>
        <Table
          head={['Type', 'Meaning']}
          rows={[
            [<InlineCode key="r">route</InlineCode>, 'A user-facing page'],
            [<InlineCode key="l">layout</InlineCode>, 'Shared UI wrapping child routes'],
            [<InlineCode key="t">template</InlineCode>, 'A re-mounting layout'],
            [<InlineCode key="lo">loading / error / not-found</InlineCode>, 'Special UI states'],
            [<InlineCode key="f">forbidden / unauthorized</InlineCode>, 'Next.js auth boundaries'],
            [<InlineCode key="m">middleware</InlineCode>, 'Edge middleware'],
            [<InlineCode key="a">api-route</InlineCode>, 'A route handler / API endpoint'],
            [<InlineCode key="rd">redirect / rewrite</InlineCode>, 'Synthetic navigation targets'],
            [<InlineCode key="e">external-url</InlineCode>, 'A link leaving your app'],
          ]}
        />

        <H2 id="node-attributes">Node attributes</H2>
        <P>
          Nodes carry rich metadata so consumers don't have to re-derive it. Highlights from{' '}
          <InlineCode>NodeAttributes</InlineCode>:
        </P>
        <Table
          head={['Field', 'Description']}
          rows={[
            [<InlineCode key="p">path</InlineCode>, 'URL path, e.g. /blog/[slug]'],
            [<InlineCode key="d">isDynamic, isCatchAll</InlineCode>, 'Dynamic segment flags'],
            [
              <InlineCode key="i">isIntercepted, isParallelSlot</InlineCode>,
              'Advanced App Router features',
            ],
            [
              <InlineCode key="rt">runtime, rendering</InlineCode>,
              'nodejs/edge and static/dynamic/isr',
            ],
            [
              <InlineCode key="re">isReachable, isDead</InlineCode>,
              'Reachability analysis results',
            ],
            [<InlineCode key="c">conditions</InlineCode>, 'Auth/role/flag guards in scope'],
            [<InlineCode key="dg">diagnostics</InlineCode>, 'Problems attached to this node'],
          ]}
        />

        <H2 id="edge-types">Edge types</H2>
        <P>
          Edges describe how you get from one node to another. The <InlineCode>source</InlineCode>{' '}
          attribute records <em>how</em> the navigation was expressed in code — a{' '}
          <InlineCode>{'<Link>'}</InlineCode>, <InlineCode>router.push</InlineCode>,{' '}
          <InlineCode>redirect()</InlineCode>, <InlineCode>NextResponse.redirect</InlineCode>, and
          so on.
        </P>
        <Table
          head={['Edge type', 'Meaning']}
          rows={[
            [<InlineCode key="n">navigation</InlineCode>, 'A link or programmatic navigation'],
            [<InlineCode key="cn">conditional-navigation</InlineCode>, 'Navigation behind a guard'],
            [
              <InlineCode key="rd">redirect / permanent-redirect</InlineCode>,
              'Server or client redirect',
            ],
            [<InlineCode key="rw">rewrite</InlineCode>, 'URL rewrite (middleware/config)'],
            [
              <InlineCode key="lp">layout-parent / template-parent</InlineCode>,
              'Composition relationships',
            ],
            [<InlineCode key="mm">middleware-match</InlineCode>, 'A route matched by middleware'],
            [<InlineCode key="pf">prefetch</InlineCode>, 'Prefetched route'],
          ]}
        />

        <H2 id="shape">The serialized shape</H2>
        <P>
          A trimmed example of <InlineCode>graph.json</InlineCode>:
        </P>
        <CodeBlock
          language="json"
          filename="ri-output/graph.json"
          code={`{
  "version": "1.0",
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "root": "/my/app",
  "nodes": [
    {
      "id": "app::page.tsx",
      "attributes": { "type": "route", "path": "/", "isDead": false }
    }
  ],
  "edges": [
    {
      "id": "navigation:app::page.tsx->/about",
      "source": "app::page.tsx",
      "target": "app::about::page.tsx",
      "attributes": { "type": "navigation", "source": "Link" }
    }
  ],
  "metadata": { "totalRoutes": 1, "totalLayouts": 1, "deadRouteCount": 0 }
}`}
        />

        <H2 id="consuming">Consuming the graph</H2>
        <P>
          Because it's just JSON, you can read it anywhere. For type-safe access, import the{' '}
          <InlineCode>SerializedGraph</InlineCode> type from{' '}
          <InlineCode>@route-intelligence/shared</InlineCode> or use the{' '}
          <A href="/docs/api">programmatic API</A> to work with a live{' '}
          <InlineCode>RouteGraph</InlineCode> instance.
        </P>
        <CodeBlock
          language="ts"
          code={`import type { SerializedGraph } from '@route-intelligence/shared';
import graph from './ri-output/graph.json' assert { type: 'json' };

const deadRoutes = (graph as SerializedGraph).nodes.filter(
  (node) => node.attributes.isDead,
);`}
        />
        <P>
          <Strong>Tip:</Strong> the same fields drive the{' '}
          <A href="/docs/diagnostics">diagnostics</A> you'll see in <InlineCode>doctor</InlineCode>{' '}
          and ESLint.
        </P>
      </Prose>
    </DocPage>
  );
}
