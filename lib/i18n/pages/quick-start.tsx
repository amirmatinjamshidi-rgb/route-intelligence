import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, LI, OL, P, Prose, Strong } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Quick Start',
    eyebrow: 'Get Started',
    lead: 'Go from zero to an interactive route graph in under a minute. This guide assumes a Next.js project, but the workflow is identical for any supported framework.',
  },
  fa: {
    title: 'زود شروع کن',
    eyebrow: 'اول کار',
    lead: 'زیر یه دقیقه از صفر می‌رسی به گراف تو مرورگر. این صفحه Next فرض می‌کنه. React Router / TanStack فعلاً از کد، نه از CLI.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
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
        Open{' '}
        <LA href="http://localhost:3001" locale={locale}>
          http://localhost:3001
        </LA>{' '}
        to explore the graph.
      </P>

      <H2 id="3-check-health">3. Check for problems</H2>
      <P>
        <InlineCode>doctor</InlineCode> runs every static analysis rule and prints diagnostics —
        dead routes, broken links, redirect cycles, and more.
      </P>
      <CodeBlock language="bash" code="npx route-intelligence doctor --root . --strict" />
      <Callout kind="tip" title="CI-friendly">
        Pass <InlineCode>--strict</InlineCode> to exit with a non-zero code on warnings, so a broken
        link can fail your pipeline.
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
          Learn the{' '}
          <LA href="/docs/concepts" locale={locale}>
            route graph model
          </LA>{' '}
          that powers all of this.
        </LI>
        <LI>
          Add a{' '}
          <LA href="/docs/configuration" locale={locale}>
            configuration file
          </LA>{' '}
          to customize includes, plugins, and rules.
        </LI>
        <LI>
          Wire up{' '}
          <LA href="/docs/integrations" locale={locale}>
            integrations
          </LA>
          : ESLint, VS Code, and a GitHub Action for PRs.
        </LI>
      </OL>
      <P>
        <Strong>Tip:</Strong> add <InlineCode>analyze</InlineCode> to a{' '}
        <InlineCode>predev</InlineCode> or pre-commit step so your graph stays fresh.
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="1-analyze">۱. روت‌ها رو اسکن کن</H2>
      <P>
        از ریشه پروژه <InlineCode>analyze</InlineCode> بزن. <InlineCode>app/</InlineCode>،{' '}
        <InlineCode>pages/</InlineCode> و <InlineCode>middleware.ts</InlineCode> رو می‌گرده، گراف
        می‌ره تو <InlineCode>ri-output/graph.json</InlineCode>.
      </P>
      <CodeBlock language="bash" code="npx route-intelligence analyze --root ." />
      <P>چیزی شبیه این می‌بینی:</P>
      <CodeBlock
        language="text"
        code={`✔ Found 12 routes, 4 layouts
Written to ri-output/graph.json`}
      />

      <H2 id="2-visualize">۲. گراف رو تو مرورگر باز کن</H2>
      <P>
        <InlineCode>graph</InlineCode> هم تحلیل می‌کنه هم سرور محلی می‌زنه. سرچ کن، فیلتر بزن، روی نود
        کلیک کن.
      </P>
      <CodeBlock language="bash" code="npx route-intelligence graph --port 3001" />
      <P>
        برو{' '}
        <LA href="http://localhost:3001" locale={locale}>
          http://localhost:3001
        </LA>
        .
      </P>

      <H2 id="3-check-health">۳. ببین چی خرابه</H2>
      <P>
        <InlineCode>doctor</InlineCode> همه قانون‌ها رو می‌چرخونه: روت مرده، لینک شکسته، حلقه
        redirect.
      </P>
      <CodeBlock language="bash" code="npx route-intelligence doctor --root . --strict" />
      <Callout kind="tip" title="برای CI خوبه">
        با <InlineCode>--strict</InlineCode> حتی warning هم exit غیرصفر می‌ده، لینک شکسته پایپلاین رو
        می‌ترکونه.
      </Callout>

      <H2 id="4-export">۴. نمودار برای README</H2>
      <P>Mermaid بساز، بچسبون تو داک:</P>
      <CodeBlock
        language="bash"
        code="npx route-intelligence analyze --format mermaid --out ri-output"
      />

      <H2 id="what-next">بعدش؟</H2>
      <OL>
        <LI>
          <LA href="/docs/concepts" locale={locale}>
            مدل گراف
          </LA>{' '}
          رو یه دور بخون.
        </LI>
        <LI>
          اگه خواستی{' '}
          <LA href="/docs/configuration" locale={locale}>
            کانفیگ
          </LA>{' '}
          بذار.
        </LI>
        <LI>
          <LA href="/docs/integrations" locale={locale}>
            ESLint / VS Code / Action
          </LA>{' '}
          رو وصل کن.
        </LI>
      </OL>
      <P>
        <Strong>تیپ:</Strong> <InlineCode>analyze</InlineCode> رو بذار تو{' '}
        <InlineCode>predev</InlineCode> یا pre-commit تا گراف کهنه نمونه.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
