import type { Metadata } from "next";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { A, H2, InlineCode, P, Prose, Strong, Table } from "@/components/docs/content";
import { DocPage } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Configuration" };

export default function ConfigurationPage() {
  return (
    <DocPage
      eyebrow="Usage"
      title="Configuration"
      lead="Drop a ri.config.ts file at your project root to control what gets analyzed, which plugins run, and how rules behave. Use the typed defineConfig helper for autocomplete."
    >
      <Prose>
        <H2 id="example">A complete example</H2>
        <CodeBlock
          language="ts"
          filename="ri.config.ts"
          code={`import { defineConfig } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';

export default defineConfig({
  root: '.',
  plugins: [
    NextPlugin({
      appDir: 'app',
      pagesDir: 'pages',
      customNavigationWrappers: [],
    }),
  ],
  include: ['app/**', 'pages/**', 'middleware.ts'],
  exclude: ['**/*.test.ts', '**/*.spec.ts', 'node_modules/**'],
  cache: {
    enabled: true,
    directory: '.route-intelligence',
  },
  output: {
    formats: ['json', 'mermaid'],
    directory: 'ri-output',
  },
  rules: {
    'dead-route': 'warn',
    'broken-link': 'error',
    'redirect-cycle': 'error',
  },
});`}
        />

        <H2 id="options">Options</H2>
        <Table
          head={["Key", "Type", "Description"]}
          rows={[
            [<InlineCode key="r">root</InlineCode>, "string", "Directory to analyze"],
            [<InlineCode key="p">plugins</InlineCode>, "FrameworkPlugin[]", "Framework plugins to run"],
            [<InlineCode key="i">include</InlineCode>, "string[]", "Globs of files to scan"],
            [<InlineCode key="e">exclude</InlineCode>, "string[]", "Globs to ignore"],
            [<InlineCode key="c">cache</InlineCode>, "{ enabled, directory }", "Incremental cache settings"],
            [<InlineCode key="o">output</InlineCode>, "{ formats, directory }", "Default export formats and folder"],
            [<InlineCode key="ru">rules</InlineCode>, "Record<string, Severity>", "Per-rule severity overrides"],
          ]}
        />

        <H2 id="includes">Includes & excludes</H2>
        <P>
          <InlineCode>include</InlineCode> and <InlineCode>exclude</InlineCode> are standard globs.
          Keep includes tight — scanning fewer files is faster and avoids false positives from
          fixtures or generated code.
        </P>
        <Callout kind="note" title="Sensible defaults">
          If you don't provide a config, the CLI uses{" "}
          <InlineCode>['app/**', 'pages/**', 'src/**', 'middleware.ts']</InlineCode> for includes and
          ignores <InlineCode>node_modules</InlineCode>, <InlineCode>.next</InlineCode>,{" "}
          <InlineCode>dist</InlineCode>, and test files.
        </Callout>

        <H2 id="rules">Rules</H2>
        <P>
          The <InlineCode>rules</InlineCode> map overrides diagnostic severities. Accepted values are{" "}
          <InlineCode>error</InlineCode>, <InlineCode>warn</InlineCode>, and <InlineCode>off</InlineCode>.
          See the full list in <A href="/docs/diagnostics">Diagnostics</A>.
        </P>

        <H2 id="multiple-plugins">Multiple frameworks</H2>
        <P>
          Analyzing a monorepo with more than one router? Pass several plugins — the graph merges
          them into one model.
        </P>
        <CodeBlock
          language="ts"
          code={`import { NextPlugin } from '@route-intelligence/next';
import { ReactRouterPlugin } from '@route-intelligence/react-router';

export default defineConfig({
  plugins: [NextPlugin(), ReactRouterPlugin()],
});`}
        />
        <P>
          <Strong>Next:</Strong> drive the engine directly from code with the{" "}
          <A href="/docs/api">programmatic API</A>.
        </P>
      </Prose>
    </DocPage>
  );
}
