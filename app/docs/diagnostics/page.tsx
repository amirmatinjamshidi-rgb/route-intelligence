import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Diagnostics' };

export default function DiagnosticsPage() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="Diagnostics"
      lead="Once the graph is built, Route Intelligence runs a suite of static checks over it. Each finding is a diagnostic with a rule id, a severity, and a precise source location."
    >
      <Prose>
        <H2 id="rules">Built-in rules</H2>
        <Table
          head={['Rule', 'Default', 'Description']}
          rows={[
            [
              <InlineCode key="dr">dead-route</InlineCode>,
              'warning',
              'A route no link or redirect can reach',
            ],
            [
              <InlineCode key="dl">dead-layout</InlineCode>,
              'warning',
              'A layout wrapping no reachable route',
            ],
            [
              <InlineCode key="bl">broken-link</InlineCode>,
              'error',
              "A link to a path that doesn't exist",
            ],
            [
              <InlineCode key="br">broken-redirect</InlineCode>,
              'error',
              'A redirect to a missing target',
            ],
            [
              <InlineCode key="rc">redirect-cycle</InlineCode>,
              'error',
              'Redirects that loop forever',
            ],
            [
              <InlineCode key="cn">circular-navigation</InlineCode>,
              'warning',
              'A navigation cycle between routes',
            ],
            [
              <InlineCode key="sr">shadowed-route / duplicate-route</InlineCode>,
              'warning',
              'Two routes resolving to one path',
            ],
            [
              <InlineCode key="or">open-redirect</InlineCode>,
              'error',
              'A redirect target derived from user input',
            ],
            [
              <InlineCode key="me">missing-error-boundary / missing-loading</InlineCode>,
              'info',
              'Recommended files are absent',
            ],
          ]}
        />

        <H2 id="severity">Severities</H2>
        <P>
          Every diagnostic is an <InlineCode>error</InlineCode>, <InlineCode>warning</InlineCode>,
          or <InlineCode>info</InlineCode>. Errors always fail <InlineCode>doctor</InlineCode>
          warnings fail only when you pass <InlineCode>--strict</InlineCode>.
        </P>

        <H2 id="customizing">Customizing severity</H2>
        <P>
          Override any rule's severity in <A href="/docs/configuration">your config file</A>. Set a
          rule to <InlineCode>off</InlineCode> to disable it entirely.
        </P>
        <CodeBlock
          language="ts"
          filename="ri.config.ts"
          code={`export default defineConfig({
  rules: {
    'dead-route': 'warn',
    'broken-link': 'error',
    'redirect-cycle': 'error',
    'missing-loading': 'off',
  },
});`}
        />

        <H2 id="shape">The diagnostic shape</H2>
        <P>
          Diagnostics are attached to the graph (on nodes and edges) and also returned as a flat
          list. Each one looks like:
        </P>
        <CodeBlock
          language="ts"
          code={`interface Diagnostic {
  ruleId: string;        // e.g. 'broken-link'
  severity: 'error' | 'warning' | 'info';
  message: string;
  loc?: { filePath: string; line: number; column: number };
  nodeId?: string;
  edgeId?: string;
}`}
        />
        <Callout kind="tip" title="Same data everywhere">
          These diagnostics power the <InlineCode>doctor</InlineCode> command, the{' '}
          <A href="/docs/integrations">ESLint plugin</A>, the VS Code Problems panel, and PR
          comments from the GitHub Action.{' '}
          <Strong>Write a rule once, surface it everywhere.</Strong>
        </Callout>
      </Prose>
    </DocPage>
  );
}
