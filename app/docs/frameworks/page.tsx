import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { A, H2, H3, InlineCode, LI, P, Prose, Strong, UL } from '@/components/docs/content';
import { DocPage } from '@/components/docs/doc-page';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Framework Plugins' };

export default function FrameworksPage() {
  return (
    <DocPage
      eyebrow="Ecosystem"
      title="Framework Plugins"
      lead="The core engine is framework-agnostic. Plugins teach it how a given router discovers routes and expresses navigation. Mix and match them in your config."
    >
      <Prose>
        <H2 id="next">Next.js</H2>
        <P>
          <InlineCode>@route-intelligence/next</InlineCode> understands both the App Router and the
          Pages Router, including the full set of Next.js 16 file conventions —{' '}
          <InlineCode>page</InlineCode>, <InlineCode>layout</InlineCode>,{' '}
          <InlineCode>template</InlineCode>, <InlineCode>loading</InlineCode>,{' '}
          <InlineCode>error</InlineCode>, <InlineCode>not-found</InlineCode>,{' '}
          <InlineCode>forbidden</InlineCode>, <InlineCode>unauthorized</InlineCode>, route handlers,
          and middleware.
        </P>
        <CodeBlock
          language="ts"
          code={`import { NextPlugin } from '@route-intelligence/next';

NextPlugin({
  appDir: 'app',
  pagesDir: 'pages',
  customNavigationWrappers: [],
});`}
        />
        <H3 id="next-navigation">Navigation it detects</H3>
        <UL>
          <LI>
            <InlineCode>{'<Link href>'}</InlineCode> and intercepting/parallel routes
          </LI>
          <LI>
            <InlineCode>router.push / replace / prefetch / back / forward</InlineCode>
          </LI>
          <LI>
            <InlineCode>redirect()</InlineCode> and <InlineCode>permanentRedirect()</InlineCode>
          </LI>
          <LI>
            <InlineCode>NextResponse.redirect / rewrite</InlineCode> in middleware
          </LI>
          <LI>
            <InlineCode>window.location</InlineCode> and the History API
          </LI>
        </UL>
        <Callout kind="note" title="Middleware aware">
          The Next plugin reads <InlineCode>middleware.ts</InlineCode> matchers and extracts
          cookie/header conditions, so guarded routes show up as conditional edges.
        </Callout>

        <H2 id="react-router">React Router</H2>
        <P>
          <InlineCode>@route-intelligence/react-router</InlineCode> supports React Router v6 and v7,
          including data routers and nested route configs.
        </P>
        <CodeBlock
          language="ts"
          code={`import { ReactRouterPlugin } from '@route-intelligence/react-router';

ReactRouterPlugin();`}
        />

        <H2 id="tanstack">TanStack Router</H2>
        <P>
          <InlineCode>@route-intelligence/tanstack</InlineCode> understands TanStack Router's
          file-based and code-based route trees.
        </P>
        <CodeBlock
          language="ts"
          code={`import { TanStackPlugin } from '@route-intelligence/tanstack';

TanStackPlugin();`}
        />

        <H2 id="writing-a-plugin">Writing your own plugin</H2>
        <P>
          A plugin implements the <InlineCode>FrameworkPlugin</InlineCode> interface from{' '}
          <InlineCode>@route-intelligence/shared</InlineCode>. It declares which files it claims and
          contributes nodes and edges to the shared graph. Because the contract is small, supporting
          a new framework — or a house convention — is straightforward.
        </P>
        <P>
          <Strong>Next:</Strong> connect the graph to your editor and CI in{' '}
          <A href="/docs/integrations">Integrations</A>.
        </P>
      </Prose>
    </DocPage>
  );
}
