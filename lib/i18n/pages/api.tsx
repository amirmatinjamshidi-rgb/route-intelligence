import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Programmatic API',
    eyebrow: 'Usage',
    lead: 'Everything the CLI does is available from @route-intelligence/core. Build the graph in a script, query it, run algorithms, and export it yourself.',
  },
  fa: {
    title: 'API برنامه‌ای',
    eyebrow: 'کاربرد',
    lead: 'هر کاری که CLI انجام می‌دهد از @route-intelligence/core در دسترس است. گراف را در اسکریپت بسازید، جستجو کنید، الگوریتم اجرا کنید و خودتان export کنید.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="analyze">Running an analysis</H2>
      <P>
        <InlineCode>createAnalyzer</InlineCode> takes a config and returns an analyzer. Call{' '}
        <InlineCode>analyze()</InlineCode> for a one-shot run, or <InlineCode>watch()</InlineCode>{' '}
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
        head={['Field', 'Description']}
        rows={[
          [<InlineCode key="g">graph</InlineCode>, 'A live RouteGraph instance you can query'],
          [<InlineCode key="m">metadata</InlineCode>, 'Counts and scores (routes, layouts, …)'],
          [<InlineCode key="d">diagnostics</InlineCode>, 'Flat list of all findings'],
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
        head={['Export', 'Kind']}
        rows={[
          [<InlineCode key="ca">createAnalyzer, defineConfig</InlineCode>, 'Entry points'],
          [<InlineCode key="rg">RouteGraph</InlineCode>, 'Graph class'],
          [
            <InlineCode key="al">
              findCycles, findDeadRoutes, findShortestPath, detectInfiniteRedirects,
              getMostConnected
            </InlineCode>,
            'Algorithms',
          ],
          [
            <InlineCode key="ex">
              exportJson · Mermaid · PlantUML · Dot · Html · Markdown
            </InlineCode>,
            'Exporters',
          ],
          [
            <InlineCode key="in">IncrementalCache, Invalidator, computeGraphPatch</InlineCode>,
            'Incremental tooling',
          ],
        ]}
      />
      <P>
        Types like <InlineCode>SerializedGraph</InlineCode>, <InlineCode>NodeAttributes</InlineCode>
        , and <InlineCode>FrameworkPlugin</InlineCode> live in{' '}
        <LA href="/docs/frameworks" locale={locale}>
          @route-intelligence/shared
        </LA>
        .
      </P>
      <P>
        <Strong>Note:</Strong> the analyzer never executes your application code — it reads source
        with the TypeScript compiler.
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="analyze">اجرای تحلیل</H2>
      <P>
        <InlineCode>createAnalyzer</InlineCode> یک config می‌گیرد و analyzer برمی‌گرداند. برای اجرای
        یک‌باره <InlineCode>analyze()</InlineCode> و برای به‌روزرسانی افزایشی{' '}
        <InlineCode>watch()</InlineCode> را فراخوانی کنید.
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

      <H2 id="result">شیء نتیجه</H2>
      <Table
        head={['فیلد', 'توضیح']}
        rows={[
          [<InlineCode key="g">graph</InlineCode>, 'نمونهٔ زنده RouteGraph قابل جستجو'],
          [<InlineCode key="m">metadata</InlineCode>, 'شمارش‌ها و امتیازها (مسیرها، layoutها و …)'],
          [<InlineCode key="d">diagnostics</InlineCode>, 'فهرست تخت همهٔ یافته‌ها'],
        ]}
      />

      <H2 id="querying">جستجو در گراف</H2>
      <P>
        <InlineCode>RouteGraph</InlineCode> یک گراف graphology تایپ‌شده را wrap می‌کند و helperهای
        جستجو به‌علاوه delegateهای الگوریتم را در اختیار می‌گذارد.
      </P>
      <CodeBlock
        language="ts"
        code={`import { findCycles, findDeadRoutes, findShortestPath } from '@route-intelligence/core';

const { graph } = result;

const dead = findDeadRoutes(graph);
const cycles = findCycles(graph);
const path = findShortestPath(graph, '/', '/checkout');`}
      />

      <H2 id="watching">watch تغییرات</H2>
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

      <H2 id="exporting">export</H2>
      <P>همان exporterهایی که CLI استفاده می‌کند به‌صورت تابع ساده export شده‌اند.</P>
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

      <H2 id="reference">exportهای عمومی</H2>
      <P>
        از <InlineCode>@route-intelligence/core</InlineCode>:
      </P>
      <Table
        head={['export', 'نوع']}
        rows={[
          [<InlineCode key="ca">createAnalyzer, defineConfig</InlineCode>, 'نقاط ورود'],
          [<InlineCode key="rg">RouteGraph</InlineCode>, 'کلاس گراف'],
          [
            <InlineCode key="al">
              findCycles, findDeadRoutes, findShortestPath, detectInfiniteRedirects,
              getMostConnected
            </InlineCode>,
            'الگوریتم‌ها',
          ],
          [
            <InlineCode key="ex">
              exportJson · Mermaid · PlantUML · Dot · Html · Markdown
            </InlineCode>,
            'exporterها',
          ],
          [
            <InlineCode key="in">IncrementalCache, Invalidator, computeGraphPatch</InlineCode>,
            'ابزار افزایشی',
          ],
        ]}
      />
      <P>
        تایپ‌هایی مثل <InlineCode>SerializedGraph</InlineCode>،{' '}
        <InlineCode>NodeAttributes</InlineCode> و <InlineCode>FrameworkPlugin</InlineCode> در{' '}
        <LA href="/docs/frameworks" locale={locale}>
          @route-intelligence/shared
        </LA>{' '}
        قرار دارند.
      </P>
      <P>
        <Strong>توجه:</Strong> analyzer هرگز کد اپلیکیشن شما را اجرا نمی‌کند — سورس را با کامپایلر
        TypeScript می‌خواند.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
