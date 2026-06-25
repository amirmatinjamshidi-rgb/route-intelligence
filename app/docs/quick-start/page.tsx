import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, InlineCode, LI, OL, P, Prose, Strong } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Quick Start' };

export default function QuickStartPage() {
  return (
    <DocPage
      eyebrow="Get Started"
      title="Quick Start"
      lead="Go from zero to an interactive route graph in under a minute. This guide assumes a Next.js project, but the workflow is identical for any supported framework."
    >
      <Prose>
        <H2 id="1-analyze">1. Analyze your routes</H2>
        <P>
          Run <InlineCode>analyze</InlineCode> from your project root. It scans{' '}
          <InlineCode>app/</InlineCode>, <InlineCode>pages/</InlineCode>, and{' '}
          <InlineCode>middleware.ts</InlineCode>, then writes a graph to{' '}
          <InlineCode>ri-output/graph.json</InlineCode>.
        </P>
        <CodeBlock language="bash" code="npx route-intelligence analyze --root ." />
        <P>You should see a summary like:</P>
        <CodeBlock
          language="text"
          code={`✔ Found 12 routes, 4 layouts
Written to ri-output/graph.json`}
        />

        <H2 id="2-visualize">2. Open the interactive graph</H2>
        <P>
          The <InlineCode>graph</InlineCode> command analyzes and launches a local browser UI where
          you can search routes, toggle overlays, and inspect nodes.
        </P>
        <CodeBlock language="bash" code="npx route-intelligence graph --port 3001" />
        <P>
          Open <A href="http://localhost:3001">http://localhost:3001</A> to explore the graph.
        </P>

        <H2 id="3-check-health">3. Check for problems</H2>
        <P>
          <InlineCode>doctor</InlineCode> runs every static analysis rule and prints diagnostics —
          dead routes, broken links, redirect cycles, and more.
        </P>
        <CodeBlock language="bash" code="npx route-intelligence doctor --root . --strict" />
        <Callout kind="tip" title="CI-friendly">
          Pass <InlineCode>--strict</InlineCode> to exit with a non-zero code on warnings, so a
          broken link can fail your pipeline.
        </Callout>

        <H2 id="4-export">4. Export for docs or diagrams</H2>
        <P>Generate a Mermaid diagram you can paste into a README or wiki:</P>
        <CodeBlock
          language="bash"
          code="npx route-intelligence analyze --format mermaid --out ri-output"
        />

        <H2 id="what-next">What next?</H2>
        <OL>
          <LI>
            Learn the <A href="/docs/concepts">route graph model</A> that powers all of this.
          </LI>
          <LI>
            Add a <A href="/docs/configuration">configuration file</A> to customize includes,
            plugins, and rules.
          </LI>
          <LI>
            Wire up <A href="/docs/integrations">integrations</A>: ESLint, VS Code, and a GitHub
            Action for PRs.
          </LI>
        </OL>
        <P>
          <Strong>Tip:</Strong> add <InlineCode>analyze</InlineCode> to a{' '}
          <InlineCode>predev</InlineCode> or pre-commit step so your graph stays fresh.
        </P>
      </Prose>
    </DocPage>
  );
}
