import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { A, H2, InlineCode, P, Prose, Strong, Table } from "@/components/docs/content";
import { DocPage } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Programmatic API" };

export default function ApiPage() {
  return (
    <DocPage
      eyebrow="Usage"
      title="Programmatic API"
      lead="Everything the CLI does is available from @route-intelligence/core. Build the graph in a script, query it, run algorithms, and export it yourself."
    >
      <Prose>
        <H2 id="analyze">Running an analysis</H2>
        <P>
          <InlineCode>createAnalyzer</InlineCode> takes a config and returns an analyzer. Call{" "}
          <InlineCode>analyze()</InlineCode> for a one-shot run, or <InlineCode>watch()</InlineCode>{" "}
          for incremental updates.
        </P>
        <CodeBlock
          language="ts"
          code={`import { createAnalyzer } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';

const analyzer = createAnalyzer({
  root: process.cwd(),
  plugins: [NextPlugin()],
});

const result = await analyzer.analyze();
console.log(result.metadata.totalRoutes, 'routes');
console.log(result.diagnostics.length, 'diagnostics');`}
        />

        <H2 id="result">The result object</H2>
        <Table
          head={["Field", "Description"]}
          rows={[
            [<InlineCode key="g">graph</InlineCode>, "A live RouteGraph instance you can query"],
            [<InlineCode key="m">metadata</InlineCode>, "Counts and scores (routes, layouts, …)"],
            [<InlineCode key="d">diagnostics</InlineCode>, "Flat list of all findings"],
          ]}
        />

        <H2 id="querying">Querying the graph</H2>
        <P>
          The <InlineCode>RouteGraph</InlineCode> wraps a typed graphology graph and exposes query
          helpers plus algorithm delegates.
        </P>
        <CodeBlock
          language="ts"
          code={`import { findCycles, findDeadRoutes, findShortestPath } from '@route-intelligence/core';

const { graph } = result;

const dead = findDeadRoutes(graph);
const cycles = findCycles(graph);
const path = findShortestPath(graph, '/', '/checkout');`}
        />

        <H2 id="watching">Watching for changes</H2>
        <CodeBlock
          language="ts"
          code={`const watcher = analyzer.watch();

watcher.on('update', (patch) => {
  console.log('+', patch.addedNodes.length, '-', patch.removedNodeIds.length);
});

watcher.on('error', (err) => console.error(err));

// later…
await watcher.stop();`}
        />

        <H2 id="exporting">Exporting</H2>
        <P>The same exporters the CLI uses are exported as plain functions.</P>
        <CodeBlock
          language="ts"
          code={`import {
  exportJson,
  exportMermaid,
  exportPlantUML,
  exportDot,
  exportHtml,
  exportMarkdown,
} from '@route-intelligence/core';

const mermaid = exportMermaid(graph);
const json = exportJson(graph, process.cwd());`}
        />

        <H2 id="reference">Public exports</H2>
        <P>
          From <InlineCode>@route-intelligence/core</InlineCode>:
        </P>
        <Table
          head={["Export", "Kind"]}
          rows={[
            [<InlineCode key="ca">createAnalyzer, defineConfig</InlineCode>, "Entry points"],
            [<InlineCode key="rg">RouteGraph</InlineCode>, "Graph class"],
            [
              <InlineCode key="al">findCycles, findDeadRoutes, findShortestPath, detectInfiniteRedirects, getMostConnected</InlineCode>,
              "Algorithms",
            ],
            [<InlineCode key="ex">exportJson · Mermaid · PlantUML · Dot · Html · Markdown</InlineCode>, "Exporters"],
            [<InlineCode key="in">IncrementalCache, Invalidator, computeGraphPatch</InlineCode>, "Incremental tooling"],
          ]}
        />
        <P>
          Types like <InlineCode>SerializedGraph</InlineCode>, <InlineCode>NodeAttributes</InlineCode>,
          and <InlineCode>FrameworkPlugin</InlineCode> live in{" "}
          <A href="/docs/frameworks">@route-intelligence/shared</A>.
        </P>
        <P>
          <Strong>Note:</Strong> the analyzer never executes your application code — it reads source
          with the TypeScript compiler.
        </P>
      </Prose>
    </DocPage>
  );
}
