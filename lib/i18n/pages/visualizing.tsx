import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, LI, P, Prose, Strong, Table, UL } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Visualizing',
    eyebrow: 'Ecosystem',
    lead: 'A routing graph is far easier to understand when you can see it. Route Intelligence exports to every popular diagram format and ships an interactive browser visualizer.',
  },
  fa: {
    title: 'مصورسازی',
    eyebrow: 'اکوسیستم',
    lead: 'وقتی گراف مسیریابی را ببینید، فهم آن بسیار آسان‌تر است. Route Intelligence به همهٔ فرمت‌های رایج نمودار export می‌کند و یک visualizer تعاملی مرورگر هم دارد.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="formats">Export formats</H2>
      <Table
        head={['Format', 'Best for']}
        rows={[
          [<InlineCode key="j">json</InlineCode>, 'Programmatic use, ESLint, CI'],
          [<InlineCode key="m">mermaid</InlineCode>, 'READMEs, wikis, GitHub-rendered diagrams'],
          [<InlineCode key="p">plantuml</InlineCode>, 'Architecture docs, Confluence'],
          [<InlineCode key="d">dot</InlineCode>, 'Graphviz rendering and layout control'],
          [<InlineCode key="h">html</InlineCode>, 'A standalone, shareable report'],
          [<InlineCode key="md">markdown</InlineCode>, 'A route table for documentation'],
        ]}
      />

      <H2 id="mermaid">Mermaid</H2>
      <P>The quickest path to a diagram you can drop into a Markdown file:</P>
      <CodeBlock
        language="bash"
        code="route-intelligence analyze --format mermaid --out ri-output"
      />
      <P>
        Paste the contents of <InlineCode>ri-output/graph.mermaid</InlineCode> into any
        Mermaid-aware renderer (GitHub,{' '}
        <LA href="https://mermaid.live" locale={locale}>
          mermaid.live
        </LA>
        , your docs tool).
      </P>

      <H2 id="interactive">The interactive visualizer</H2>
      <P>
        <InlineCode>route-intelligence graph</InlineCode> serves a local browser UI. It is built on
        React Flow and supports:
      </P>
      <UL>
        <LI>
          <Strong>Search</Strong> across routes by path.
        </LI>
        <LI>
          <Strong>Overlays</Strong> to toggle dead routes, API routes, and dynamic segments.
        </LI>
        <LI>
          <Strong>Node detail</Strong> panels showing type, file, and depth.
        </LI>
        <LI>
          <Strong>Layouts</Strong> — hierarchical, force-directed, and radial.
        </LI>
      </UL>
      <CodeBlock language="bash" code={'route-intelligence graph --port 3001'} />
      <Callout kind="note" title="Powered by the same JSON">
        The visualizer just renders <InlineCode>ri-output/graph.json</InlineCode>. You can host that
        file anywhere and point the <InlineCode>@route-intelligence/visualizer</InlineCode> app at
        it.
      </Callout>

      <H2 id="docs-output">Generated route docs</H2>
      <P>
        For a written reference rather than a diagram, <InlineCode>docs</InlineCode> produces a
        route table in Markdown or HTML:
      </P>
      <CodeBlock
        language="bash"
        code="route-intelligence docs --format markdown --out docs/routes"
      />
      <P>
        <Strong>That's the tour.</Strong> Revisit the{' '}
        <LA href="/docs/cli" locale={locale}>
          CLI reference
        </LA>{' '}
        for every flag, or the{' '}
        <LA href="/docs/api" locale={locale}>
          programmatic API
        </LA>{' '}
        to build your own tooling on top of the graph.
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="formats">فرمت‌های export</H2>
      <Table
        head={['فرمت', 'بهترین برای']}
        rows={[
          [<InlineCode key="j">json</InlineCode>, 'استفاده برنامه‌ای، ESLint، CI'],
          [
            <InlineCode key="m">mermaid</InlineCode>,
            'READMEها، wikiها، نمودارهای رندرشده در GitHub',
          ],
          [<InlineCode key="p">plantuml</InlineCode>, 'مستندات معماری، Confluence'],
          [<InlineCode key="d">dot</InlineCode>, 'رندر Graphviz و کنترل layout'],
          [<InlineCode key="h">html</InlineCode>, 'گزارش مستقل و قابل اشتراک'],
          [<InlineCode key="md">markdown</InlineCode>, 'جدول مسیر برای مستندات'],
        ]}
      />

      <H2 id="mermaid">Mermaid</H2>
      <P>سریع‌ترین راه برای نموداری که در فایل Markdown قرار دهید:</P>
      <CodeBlock
        language="bash"
        code="route-intelligence analyze --format mermaid --out ri-output"
      />
      <P>
        محتوای <InlineCode>ri-output/graph.mermaid</InlineCode> را در هر رندرکنندهٔ سازگار با Mermaid
        (GitHub،{' '}
        <LA href="https://mermaid.live" locale={locale}>
          mermaid.live
        </LA>
        ، ابزار مستندات شما) paste کنید.
      </P>

      <H2 id="interactive">visualizer تعاملی</H2>
      <P>
        <InlineCode>route-intelligence graph</InlineCode> یک رابط مرورگر محلی سرو می‌کند. بر پایهٔ
        React Flow ساخته شده و این قابلیت‌ها را دارد:
      </P>
      <UL>
        <LI>
          <Strong>جستجو</Strong> در مسیرها بر اساس path.
        </LI>
        <LI>
          <Strong>Overlayها</Strong> برای نمایش/مخفی کردن مسیرهای مرده، API routeها و segmentهای
          پویا.
        </LI>
        <LI>
          <Strong>جزئیات node</Strong> با نوع، فایل و عمق.
        </LI>
        <LI>
          <Strong>Layoutها</Strong> — سلسله‌مراتبی، force-directed و شعاعی.
        </LI>
      </UL>
      <CodeBlock language="bash" code={'route-intelligence graph --port 3001'} />
      <Callout kind="note" title="با همان JSON">
        visualizer فقط <InlineCode>ri-output/graph.json</InlineCode> را رندر می‌کند. می‌توانید آن فایل
        را هر جا host کنید و اپ <InlineCode>@route-intelligence/visualizer</InlineCode> را به آن
        اشاره دهید.
      </Callout>

      <H2 id="docs-output">مستندات مسیر تولیدشده</H2>
      <P>
        برای مرجع نوشتاری به‌جای نمودار، دستور <InlineCode>docs</InlineCode> جدول مسیر در Markdown یا
        HTML تولید می‌کند:
      </P>
      <CodeBlock
        language="bash"
        code="route-intelligence docs --format markdown --out docs/routes"
      />
      <P>
        <Strong>این هم از تور.</Strong> برای همهٔ flagها به{' '}
        <LA href="/docs/cli" locale={locale}>
          مرجع CLI
        </LA>{' '}
        برگردید، یا با{' '}
        <LA href="/docs/api" locale={locale}>
          API برنامه‌ای
        </LA>{' '}
        ابزار خودتان را روی گراف بسازید.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
