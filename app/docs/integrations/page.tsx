import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, H3, InlineCode, LI, P, Prose, Strong, Table, UL } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Integrations' };

export default function IntegrationsPage() {
  return (
    <DocPage
      eyebrow="Ecosystem"
      title="Integrations"
      lead="The graph is most useful where you already work. Route Intelligence ships an ESLint plugin, a VS Code extension, a GitHub Action, and Playwright test generation — all reading the same model."
    >
      <Prose>
        <H2 id="eslint">ESLint plugin</H2>
        <P>
          <InlineCode>eslint-plugin-route-intelligence</InlineCode> loads{' '}
          <InlineCode>ri-output/graph.json</InlineCode> and lints your code against it. Run{' '}
          <InlineCode>analyze</InlineCode> first so the graph exists.
        </P>
        <CodeBlock
          language="js"
          filename="eslint.config.mjs"
          code={`import routeIntelligence from 'eslint-plugin-route-intelligence';

export default [
  {
    plugins: { 'route-intelligence': routeIntelligence },
    rules: {
      'route-intelligence/no-broken-route': 'error',
      'route-intelligence/no-invalid-redirect': 'error',
      'route-intelligence/no-dead-page': 'warn',
      'route-intelligence/prefer-route-constants': 'off',
      'route-intelligence/detect-route-cycles': 'warn',
    },
  },
];`}
        />
        <Table
          head={['Rule', 'Catches']}
          rows={[
            [
              <InlineCode key="b">no-broken-route</InlineCode>,
              '<Link href> pointing at a nonexistent route',
            ],
            [
              <InlineCode key="i">no-invalid-redirect</InlineCode>,
              'redirect()/permanentRedirect() to a missing target',
            ],
            [
              <InlineCode key="d">no-dead-page</InlineCode>,
              'Editing a file that is an unreachable route',
            ],
            [
              <InlineCode key="p">prefer-route-constants</InlineCode>,
              'Inline path string literals in hrefs',
            ],
            [
              <InlineCode key="c">detect-route-cycles</InlineCode>,
              'Navigation that closes a cycle',
            ],
          ]}
        />

        <H2 id="vscode">VS Code extension</H2>
        <P>
          <InlineCode>route-intelligence-vscode</InlineCode> brings the graph into the editor:
        </P>
        <UL>
          <LI>
            <Strong>Hover</Strong> any route or link to see where it leads and what links to it.
          </LI>
          <LI>
            <Strong>Go to definition</Strong> jumps from a link straight to the target route file.
          </LI>
          <LI>
            <Strong>Diagnostics</Strong> surface dead routes and broken links in the Problems panel.
          </LI>
          <LI>
            <Strong>Tree views</Strong> list incoming and outgoing routes for the current file.
          </LI>
        </UL>

        <H2 id="github-action">GitHub Action</H2>
        <P>
          <InlineCode>@route-intelligence/github-action</InlineCode> analyzes a PR, diffs its graph
          against the base branch, and posts a comment summarizing added, removed, and changed
          routes — plus any new diagnostics.
        </P>
        <CodeBlock
          language="yaml"
          filename=".github/workflows/routes.yml"
          code={`name: Route Intelligence
on: pull_request

jobs:
  routes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - uses: route-intelligence/github-action@v1
        with:
          root: .`}
        />
        <Callout kind="tip" title="Catch routing regressions in review">
          Pair the Action with <InlineCode>doctor --strict</InlineCode> so a broken link or redirect
          cycle blocks the merge.
        </Callout>

        <H2 id="playwright">Playwright test generation</H2>
        <P>
          <InlineCode>@route-intelligence/playwright</InlineCode> turns the graph into end-to-end
          tests: it walks navigation edges, asserts links resolve, and probes for missing routes.
        </P>
        <CodeBlock
          language="ts"
          code={`import { generateNavigationTests, generateBrokenLinkTests } from '@route-intelligence/playwright';
import graph from './ri-output/graph.json' assert { type: 'json' };

const navSpec = generateNavigationTests(graph, { baseUrl: 'http://localhost:3000' });
const linkSpec = generateBrokenLinkTests(graph);
// write these strings to your e2e/ folder and run Playwright`}
        />

        <H3 id="more">More</H3>
        <P>
          Want diagrams instead of tests? Head to <A href="/docs/visualizing">Visualizing</A> to
          turn the graph into Mermaid, PlantUML, DOT, or an interactive browser view.
        </P>
      </Prose>
    </DocPage>
  );
}
