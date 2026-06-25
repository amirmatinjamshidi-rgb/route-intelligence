import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, InlineCode, LI, P, Prose, Strong, Table, UL } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Visualizing' };

export default function VisualizingPage() {
  return (
    <DocPage
      eyebrow="Ecosystem"
      title="Visualizing the graph"
      lead="A routing graph is far easier to understand when you can see it. Route Intelligence exports to every popular diagram format and ships an interactive browser visualizer."
    >
      <Prose>
        <H2 id="formats">Export formats</H2>
        <Table
          head={['Format', 'Best for']}
          rows={[
            [<InlineCode key="j">json</InlineCode>, 'Programmatic use, ESLint, CI'],
            [<InlineCode key="m">mermaid</InlineCode>, 'READMEs, wikis, GitHub-rendered diagrams'],
            [<InlineCode key="p">plantuml</InlineCode>, 'Architecture docs, Confluence'],
            [<InlineCode key="d">dot</InlineCode>, 'Graphviz rendering and layout control'],
            [<InlineCode key="h">html</InlineCode>, 'A standalone, shareable report'],
            [<InlineCode key="md">markdown</InlineCode>, 'A route table for documentation'],
          ]}
        />

        <H2 id="mermaid">Mermaid</H2>
        <P>The quickest path to a diagram you can drop into a Markdown file:</P>
        <CodeBlock
          language="bash"
          code={`route-intelligence analyze --format mermaid --out ri-output`}
        />
        <P>
          Paste the contents of <InlineCode>ri-output/graph.mermaid</InlineCode> into any
          Mermaid-aware renderer (GitHub, <A href="https://mermaid.live">mermaid.live</A>, your docs
          tool).
        </P>

        <H2 id="interactive">The interactive visualizer</H2>
        <P>
          <InlineCode>route-intelligence graph</InlineCode> serves a local browser UI. It is built
          on React Flow and supports:
        </P>
        <UL>
          <LI>
            <Strong>Search</Strong> across routes by path.
          </LI>
          <LI>
            <Strong>Overlays</Strong> to toggle dead routes, API routes, and dynamic segments.
          </LI>
          <LI>
            <Strong>Node detail</Strong> panels showing type, file, and depth.
          </LI>
          <LI>
            <Strong>Layouts</Strong> — hierarchical, force-directed, and radial.
          </LI>
        </UL>
        <CodeBlock language="bash" code={`route-intelligence graph --port 3001`} />
        <Callout kind="note" title="Powered by the same JSON">
          The visualizer just renders <InlineCode>ri-output/graph.json</InlineCode>. You can host
          that file anywhere and point the <InlineCode>@route-intelligence/visualizer</InlineCode>{' '}
          app at it.
        </Callout>

        <H2 id="docs-output">Generated route docs</H2>
        <P>
          For a written reference rather than a diagram, <InlineCode>docs</InlineCode> produces a
          route table in Markdown or HTML:
        </P>
        <CodeBlock
          language="bash"
          code={`route-intelligence docs --format markdown --out docs/routes`}
        />
        <P>
          <Strong>That's the tour.</Strong> Revisit the <A href="/docs/cli">CLI reference</A> for
          every flag, or the <A href="/docs/api">programmatic API</A> to build your own tooling on
          top of the graph.
        </P>
      </Prose>
    </DocPage>
  );
}
