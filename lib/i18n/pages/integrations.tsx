import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, H3, InlineCode, LI, P, Prose, Strong, Table, UL } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Integrations',
    eyebrow: 'Ecosystem',
    lead: 'The graph is most useful where you already work. Route Intelligence ships an ESLint plugin, a VS Code extension, a GitHub Action, and Playwright test generation — all reading the same model.',
  },
  fa: {
    title: 'یکپارچه‌سازی‌ها',
    eyebrow: 'اکوسیستم',
    lead: 'گراف بیشترین فایده را جایی دارد که همین حالا کار می‌کنید. Route Intelligence plugin ESLint، افزونه VS Code، GitHub Action و تولید تست Playwright را عرضه می‌کند — همه همان مدل را می‌خوانند.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
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
          [<InlineCode key="c">detect-route-cycles</InlineCode>, 'Navigation that closes a cycle'],
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
        against the base branch, and posts a comment summarizing added, removed, and changed routes
        — plus any new diagnostics.
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
        Want diagrams instead of tests? Head to{' '}
        <LA href="/docs/visualizing" locale={locale}>
          Visualizing
        </LA>{' '}
        to turn the graph into Mermaid, PlantUML, DOT, or an interactive browser view.
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="eslint">plugin ESLint</H2>
      <P>
        <InlineCode>eslint-plugin-route-intelligence</InlineCode> فایل{' '}
        <InlineCode>ri-output/graph.json</InlineCode> را بارگذاری می‌کند و کد شما را در برابر آن lint
        می‌کند. ابتدا <InlineCode>analyze</InlineCode> را اجرا کنید تا گراف وجود داشته باشد.
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
        head={['قانون', 'چه چیزی را می‌گیرد']}
        rows={[
          [
            <InlineCode key="b">no-broken-route</InlineCode>,
            '<Link href> که به مسیر ناموجود اشاره می‌کند',
          ],
          [
            <InlineCode key="i">no-invalid-redirect</InlineCode>,
            'redirect()/permanentRedirect() به هدفی که وجود ندارد',
          ],
          [
            <InlineCode key="d">no-dead-page</InlineCode>,
            'ویرایش فایلی که مسیر غیرقابل دسترسی است',
          ],
          [
            <InlineCode key="p">prefer-route-constants</InlineCode>,
            'رشتهٔ path به‌صورت inline در hrefها',
          ],
          [<InlineCode key="c">detect-route-cycles</InlineCode>, 'navigation که چرخه را می‌بندد'],
        ]}
      />

      <H2 id="vscode">افزونه VS Code</H2>
      <P>
        <InlineCode>route-intelligence-vscode</InlineCode> گراف را به ویرایشگر می‌آورد:
      </P>
      <UL>
        <LI>
          با <Strong>Hover</Strong> روی هر مسیر یا لینک ببینید به کجا می‌رود و چه چیزی به آن لینک
          دارد.
        </LI>
        <LI>
          <Strong>Go to definition</Strong> از لینک مستقیماً به فایل مسیر هدف می‌پرد.
        </LI>
        <LI>
          <Strong>Diagnostics</Strong> مسیرهای مرده و لینک‌های شکسته را در پنل Problems نشان می‌دهند.
        </LI>
        <LI>
          <Strong>Tree viewها</Strong> مسیرهای ورودی و خروجی فایل فعلی را فهرست می‌کنند.
        </LI>
      </UL>

      <H2 id="github-action">GitHub Action</H2>
      <P>
        <InlineCode>@route-intelligence/github-action</InlineCode> یک PR را تحلیل می‌کند، گراف آن را
        با branch پایه diff می‌کند و کامنتی با خلاصهٔ مسیرهای اضافه، حذف و تغییر‌یافته — به‌علاوه
        diagnosticهای جدید — می‌گذارد.
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
      <Callout kind="tip" title="شناسایی regression مسیریابی در review">
        Action را با <InlineCode>doctor --strict</InlineCode> جفت کنید تا لینک شکسته یا چرخهٔ
        redirect مانع merge شود.
      </Callout>

      <H2 id="playwright">تولید تست Playwright</H2>
      <P>
        <InlineCode>@route-intelligence/playwright</InlineCode> گراف را به تست end-to-end تبدیل
        می‌کند: یال‌های navigation را طی می‌کند، resolve شدن لینک‌ها را assert می‌کند و مسیرهای گم‌شده را
        بررسی می‌کند.
      </P>
      <CodeBlock
        language="ts"
        code={`import { generateNavigationTests, generateBrokenLinkTests } from '@route-intelligence/playwright';
import graph from './ri-output/graph.json' assert { type: 'json' };

const navSpec = generateNavigationTests(graph, { baseUrl: 'http://localhost:3000' });
const linkSpec = generateBrokenLinkTests(graph);
// write these strings to your e2e/ folder and run Playwright`}
      />

      <H3 id="more">بیشتر</H3>
      <P>
        به‌جای تست، نمودار می‌خواهید؟ به{' '}
        <LA href="/docs/visualizing" locale={locale}>
          مصورسازی
        </LA>{' '}
        بروید تا گراف را به Mermaid، PlantUML، DOT یا نمای تعاملی مرورگر تبدیل کنید.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
