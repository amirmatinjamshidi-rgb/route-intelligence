import type { Metadata } from "next";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { A, H2, InlineCode, LI, P, Prose, Strong, Table, UL } from "@/components/docs/content";
import { DocPage } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Installation" };

export default function InstallationPage() {
  return (
    <DocPage
      eyebrow="Get Started"
      title="Installation"
      lead="Route Intelligence is a monorepo of small, focused packages. Install the CLI to get started, or pull in individual packages as you need them."
    >
      <Prose>
        <H2 id="requirements">Requirements</H2>
        <UL>
          <LI>
            <Strong>Node.js 22+</Strong>
          </LI>
          <LI>
            Any of <Strong>npm 9+</Strong>, <Strong>pnpm 9+</Strong>, <Strong>Yarn</Strong>, or{" "}
            <Strong>Bun 1+</Strong>
          </LI>
        </UL>

        <H2 id="install-the-cli">Install the CLI</H2>
        <P>The CLI is the fastest way to try Route Intelligence. Install it as a dev dependency:</P>
        <CodeBlock language="npm" code={`npm install -D @route-intelligence/cli @route-intelligence/next`} />
        <CodeBlock language="pnpm" code={`pnpm add -D @route-intelligence/cli @route-intelligence/next`} />
        <CodeBlock language="yarn" code={`yarn add -D @route-intelligence/cli @route-intelligence/next`} />
        <CodeBlock language="bun" code={`bun add -d @route-intelligence/cli @route-intelligence/next`} />

        <Callout kind="tip" title="Pick one package manager">
          The repo supports all four managers, but you should commit only one lockfile (
          <InlineCode>package-lock.json</InlineCode>, <InlineCode>pnpm-lock.yaml</InlineCode>,{" "}
          <InlineCode>yarn.lock</InlineCode>, or <InlineCode>bun.lock</InlineCode>). If you switch
          managers, delete <InlineCode>node_modules</InlineCode> and reinstall.
        </Callout>

        <H2 id="packages">The packages</H2>
        <P>
          Route Intelligence ships as a set of composable packages. The core never depends on React
          — framework knowledge lives in plugins.
        </P>
        <Table
          head={["Package", "What it does"]}
          rows={[
            [<InlineCode key="s">@route-intelligence/shared</InlineCode>, "Shared types and plugin interfaces"],
            [<InlineCode key="c">@route-intelligence/core</InlineCode>, "Graph engine, analysis pipeline, exporters"],
            [<InlineCode key="n">@route-intelligence/next</InlineCode>, "Next.js App + Pages Router plugin"],
            [<InlineCode key="rr">@route-intelligence/react-router</InlineCode>, "React Router v6/v7 plugin"],
            [<InlineCode key="t">@route-intelligence/tanstack</InlineCode>, "TanStack Router plugin"],
            [<InlineCode key="cli">@route-intelligence/cli</InlineCode>, "Command-line interface"],
            [<InlineCode key="v">@route-intelligence/visualizer</InlineCode>, "Interactive React Flow graph UI"],
            [<InlineCode key="es">eslint-plugin-route-intelligence</InlineCode>, "ESLint rules backed by the graph"],
            [<InlineCode key="vs">route-intelligence-vscode</InlineCode>, "VS Code extension"],
            [<InlineCode key="ga">@route-intelligence/github-action</InlineCode>, "PR graph-diff comments"],
            [<InlineCode key="pw">@route-intelligence/playwright</InlineCode>, "Test generation from the graph"],
          ]}
        />

        <H2 id="from-source">Running from source</H2>
        <P>
          Cloning the monorepo? All root scripts auto-detect your package manager. After install,
          build once and analyze the current project:
        </P>
        <CodeBlock
          language="bash"
          code={`npm install
npm run build
npm run analyze`}
        />
        <P>
          See <A href="/docs/quick-start">Quick Start</A> for what to do next.
        </P>
      </Prose>
    </DocPage>
  );
}
