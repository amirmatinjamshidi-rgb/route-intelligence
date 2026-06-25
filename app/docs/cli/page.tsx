import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, H3, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'CLI Commands' };

export default function CliPage() {
  return (
    <DocPage
      eyebrow="Usage"
      title="CLI Commands"
      lead="The route-intelligence CLI wraps the engine in six commands. Run it via npx, your package manager, or directly against the built bundle."
    >
      <Prose>
        <H2 id="invocation">Invocation</H2>
        <P>There are three equivalent ways to run the CLI:</P>
        <CodeBlock
          language="bash"
          code={`# Via npx (installed as a dependency)
npx route-intelligence <command> [options]

# Via a package.json script
npm run analyze

# Directly against the built bundle (from a clone)
node packages/cli/dist/cli.js <command> [options]`}
        />

        <H2 id="analyze">analyze</H2>
        <P>Analyze routing and write the graph to disk in the format of your choice.</P>
        <CodeBlock
          language="bash"
          code="route-intelligence analyze --root . --format json --out ri-output"
        />
        <Table
          head={['Option', 'Default', 'Description']}
          rows={[
            [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root to analyze'],
            [
              <InlineCode key="f">-f, --format</InlineCode>,
              'json',
              'json · mermaid · plantuml · dot · html · markdown',
            ],
            [<InlineCode key="o">-o, --out</InlineCode>, 'ri-output', 'Output directory'],
          ]}
        />

        <H2 id="graph">graph</H2>
        <P>Analyze, then start a local server with an interactive graph browser.</P>
        <CodeBlock language="bash" code="route-intelligence graph --port 3001 --host localhost" />
        <Table
          head={['Option', 'Default', 'Description']}
          rows={[
            [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root'],
            [<InlineCode key="p">-p, --port</InlineCode>, '3001', 'Port to serve on'],
            [<InlineCode key="h">--host</InlineCode>, 'localhost', 'Host to bind'],
          ]}
        />

        <H2 id="doctor">doctor</H2>
        <P>Run every diagnostic rule and report problems. Ideal for CI.</P>
        <CodeBlock
          language="bash"
          code="route-intelligence doctor --root . --strict --format text"
        />
        <Table
          head={['Option', 'Default', 'Description']}
          rows={[
            [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root'],
            [<InlineCode key="s">--strict</InlineCode>, 'off', 'Exit non-zero on warnings too'],
            [<InlineCode key="f">-f, --format</InlineCode>, 'text', 'text · json'],
          ]}
        />
        <Callout kind="tip" title="Use it as a CI gate">
          <InlineCode>doctor</InlineCode> exits with code 1 when there are errors (or warnings under{' '}
          <InlineCode>--strict</InlineCode>), so a broken link fails the build.
        </Callout>

        <H2 id="docs">docs</H2>
        <P>Generate human-readable route documentation in Markdown or HTML.</P>
        <CodeBlock
          language="bash"
          code="route-intelligence docs --format markdown --out docs/routes"
        />
        <Table
          head={['Option', 'Default', 'Description']}
          rows={[
            [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root'],
            [<InlineCode key="f">-f, --format</InlineCode>, 'markdown', 'markdown · html'],
            [<InlineCode key="o">-o, --out</InlineCode>, 'docs/routes', 'Output directory'],
          ]}
        />

        <H2 id="export">export</H2>
        <P>Export the raw graph for use in other tools.</P>
        <CodeBlock
          language="bash"
          code="route-intelligence export --format mermaid --out ri-export"
        />
        <P>
          <Strong>Formats:</Strong> <InlineCode>json</InlineCode>, <InlineCode>mermaid</InlineCode>,{' '}
          <InlineCode>plantuml</InlineCode>, <InlineCode>dot</InlineCode>. See{' '}
          <A href="/docs/visualizing">Visualizing</A> for what to do with each.
        </P>

        <H2 id="watch">watch</H2>
        <P>
          Watch the project and incrementally update the graph as files change, printing a patch
          summary on every update. Press <InlineCode>Ctrl+C</InlineCode> to stop.
        </P>
        <CodeBlock language="bash" code="route-intelligence watch --root ." />
        <CodeBlock
          language="text"
          code={`Watching for route changes...
Graph updated: +1 nodes, -0 nodes`}
        />

        <H3 id="exit-codes">Exit codes</H3>
        <Table
          head={['Code', 'Meaning']}
          rows={[
            ['0', 'Success (no errors; no warnings under --strict)'],
            ['1', 'Diagnostics failed, or an unknown format/argument'],
          ]}
        />
      </Prose>
    </DocPage>
  );
}
