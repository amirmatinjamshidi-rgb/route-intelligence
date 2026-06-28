import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Nodes & Edges',
    eyebrow: 'Core Concepts',
    lead: 'The serialized graph is plain JSON: a list of nodes, a list of edges, and some metadata. Here is exactly what each one contains.',
  },
  fa: {
    title: 'Nodeها و یال‌ها',
    eyebrow: 'مفاهیم اصلی',
    lead: 'گراف سریال‌شده JSON ساده است: فهرستی از nodeها، فهرستی از یال‌ها و مقداری metadata. در اینجا دقیقاً محتوای هر کدام را می‌بینید.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="node-types">Node types</H2>
      <P>
        Every node has a <InlineCode>type</InlineCode> drawn from a fixed union. This mirrors
        Next.js file conventions plus a few synthetic kinds for redirects and external links.
      </P>
      <Table
        head={['Type', 'Meaning']}
        rows={[
          [<InlineCode key="r">route</InlineCode>, 'A user-facing page'],
          [<InlineCode key="l">layout</InlineCode>, 'Shared UI wrapping child routes'],
          [<InlineCode key="t">template</InlineCode>, 'A re-mounting layout'],
          [<InlineCode key="lo">loading / error / not-found</InlineCode>, 'Special UI states'],
          [<InlineCode key="f">forbidden / unauthorized</InlineCode>, 'Next.js auth boundaries'],
          [<InlineCode key="m">middleware</InlineCode>, 'Edge middleware'],
          [<InlineCode key="a">api-route</InlineCode>, 'A route handler / API endpoint'],
          [<InlineCode key="rd">redirect / rewrite</InlineCode>, 'Synthetic navigation targets'],
          [<InlineCode key="e">external-url</InlineCode>, 'A link leaving your app'],
        ]}
      />

      <H2 id="node-attributes">Node attributes</H2>
      <P>
        Nodes carry rich metadata so consumers don't have to re-derive it. Highlights from{' '}
        <InlineCode>NodeAttributes</InlineCode>:
      </P>
      <Table
        head={['Field', 'Description']}
        rows={[
          [<InlineCode key="p">path</InlineCode>, 'URL path, e.g. /blog/[slug]'],
          [<InlineCode key="d">isDynamic, isCatchAll</InlineCode>, 'Dynamic segment flags'],
          [
            <InlineCode key="i">isIntercepted, isParallelSlot</InlineCode>,
            'Advanced App Router features',
          ],
          [
            <InlineCode key="rt">runtime, rendering</InlineCode>,
            'nodejs/edge and static/dynamic/isr',
          ],
          [<InlineCode key="re">isReachable, isDead</InlineCode>, 'Reachability analysis results'],
          [<InlineCode key="c">conditions</InlineCode>, 'Auth/role/flag guards in scope'],
          [<InlineCode key="dg">diagnostics</InlineCode>, 'Problems attached to this node'],
        ]}
      />

      <H2 id="edge-types">Edge types</H2>
      <P>
        Edges describe how you get from one node to another. The <InlineCode>source</InlineCode>{' '}
        attribute records <em>how</em> the navigation was expressed in code — a{' '}
        <InlineCode>{'<Link>'}</InlineCode>, <InlineCode>router.push</InlineCode>,{' '}
        <InlineCode>redirect()</InlineCode>, <InlineCode>NextResponse.redirect</InlineCode>, and so
        on.
      </P>
      <Table
        head={['Edge type', 'Meaning']}
        rows={[
          [<InlineCode key="n">navigation</InlineCode>, 'A link or programmatic navigation'],
          [<InlineCode key="cn">conditional-navigation</InlineCode>, 'Navigation behind a guard'],
          [
            <InlineCode key="rd">redirect / permanent-redirect</InlineCode>,
            'Server or client redirect',
          ],
          [<InlineCode key="rw">rewrite</InlineCode>, 'URL rewrite (middleware/config)'],
          [
            <InlineCode key="lp">layout-parent / template-parent</InlineCode>,
            'Composition relationships',
          ],
          [<InlineCode key="mm">middleware-match</InlineCode>, 'A route matched by middleware'],
          [<InlineCode key="pf">prefetch</InlineCode>, 'Prefetched route'],
        ]}
      />

      <H2 id="shape">The serialized shape</H2>
      <P>
        A trimmed example of <InlineCode>graph.json</InlineCode>:
      </P>
      <CodeBlock
        language="json"
        filename="ri-output/graph.json"
        code={`{
  "version": "1.0",
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "root": "/my/app",
  "nodes": [
    {
      "id": "app::page.tsx",
      "attributes": { "type": "route", "path": "/", "isDead": false }
    }
  ],
  "edges": [
    {
      "id": "navigation:app::page.tsx->/about",
      "source": "app::page.tsx",
      "target": "app::about::page.tsx",
      "attributes": { "type": "navigation", "source": "Link" }
    }
  ],
  "metadata": { "totalRoutes": 1, "totalLayouts": 1, "deadRouteCount": 0 }
}`}
      />

      <H2 id="consuming">Consuming the graph</H2>
      <P>
        Because it's just JSON, you can read it anywhere. For type-safe access, import the{' '}
        <InlineCode>SerializedGraph</InlineCode> type from{' '}
        <InlineCode>@route-intelligence/shared</InlineCode> or use the{' '}
        <LA href="/docs/api" locale={locale}>
          programmatic API
        </LA>{' '}
        to work with a live <InlineCode>RouteGraph</InlineCode> instance.
      </P>
      <CodeBlock
        language="ts"
        code={`import type { SerializedGraph } from '@route-intelligence/shared';
import graph from './ri-output/graph.json' assert { type: 'json' };

const deadRoutes = (graph as SerializedGraph).nodes.filter(
  (node) => node.attributes.isDead,
);`}
      />
      <P>
        <Strong>Tip:</Strong> the same fields drive the{' '}
        <LA href="/docs/diagnostics" locale={locale}>
          diagnostics
        </LA>{' '}
        you'll see in <InlineCode>doctor</InlineCode> and ESLint.
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="node-types">انواع node</H2>
      <P>
        هر node یک <InlineCode>type</InlineCode> از یک union ثابت دارد. این با قراردادهای فایل
        Next.js و چند نوع مصنوعی برای redirectها و لینک‌های خارجی هم‌خوان است.
      </P>
      <Table
        head={['نوع', 'معنی']}
        rows={[
          [<InlineCode key="r">route</InlineCode>, 'صفحهٔ قابل مشاهده برای کاربر'],
          [<InlineCode key="l">layout</InlineCode>, 'رابط مشترک دور مسیرهای فرزند'],
          [<InlineCode key="t">template</InlineCode>, 'layout با mount مجدد'],
          [<InlineCode key="lo">loading / error / not-found</InlineCode>, 'حالت‌های ویژهٔ UI'],
          [<InlineCode key="f">forbidden / unauthorized</InlineCode>, 'مرزهای auth در Next.js'],
          [<InlineCode key="m">middleware</InlineCode>, 'middleware لبه'],
          [<InlineCode key="a">api-route</InlineCode>, 'route handler / endpoint API'],
          [<InlineCode key="rd">redirect / rewrite</InlineCode>, 'اهداف navigation مصنوعی'],
          [<InlineCode key="e">external-url</InlineCode>, 'لینکی که از اپلیکیشن خارج می‌شود'],
        ]}
      />

      <H2 id="node-attributes">ویژگی‌های node</H2>
      <P>
        nodeها metadata غنی دارند تا مصرف‌کنندگان مجبور نباشند دوباره استخراج کنند. نکات برجسته از{' '}
        <InlineCode>NodeAttributes</InlineCode>:
      </P>
      <Table
        head={['فیلد', 'توضیح']}
        rows={[
          [<InlineCode key="p">path</InlineCode>, 'مسیر URL، مثلاً /blog/[slug]'],
          [<InlineCode key="d">isDynamic, isCatchAll</InlineCode>, 'پرچم‌های segment پویا'],
          [
            <InlineCode key="i">isIntercepted, isParallelSlot</InlineCode>,
            'قابلیت‌های پیشرفته App Router',
          ],
          [
            <InlineCode key="rt">runtime, rendering</InlineCode>,
            'nodejs/edge و static/dynamic/isr',
          ],
          [<InlineCode key="re">isReachable, isDead</InlineCode>, 'نتایج تحلیل دسترسی'],
          [<InlineCode key="c">conditions</InlineCode>, 'guardهای auth/role/flag در محدوده'],
          [<InlineCode key="dg">diagnostics</InlineCode>, 'مشکلات متصل به این node'],
        ]}
      />

      <H2 id="edge-types">انواع یال</H2>
      <P>
        یال‌ها توضیح می‌دهند چگونه از یک node به دیگری می‌رسید. ویژگی <InlineCode>source</InlineCode>{' '}
        ثبت می‌کند navigation در کد <em>چگونه</em> بیان شده — یک <InlineCode>{'<Link>'}</InlineCode>،{' '}
        <InlineCode>router.push</InlineCode>، <InlineCode>redirect()</InlineCode>،{' '}
        <InlineCode>NextResponse.redirect</InlineCode> و غیره.
      </P>
      <Table
        head={['نوع یال', 'معنی']}
        rows={[
          [<InlineCode key="n">navigation</InlineCode>, 'لینک یا navigation برنامه‌ای'],
          [<InlineCode key="cn">conditional-navigation</InlineCode>, 'navigation پشت guard'],
          [
            <InlineCode key="rd">redirect / permanent-redirect</InlineCode>,
            'redirect سمت سرور یا client',
          ],
          [<InlineCode key="rw">rewrite</InlineCode>, 'rewrite URL (middleware/config)'],
          [<InlineCode key="lp">layout-parent / template-parent</InlineCode>, 'روابط ترکیب'],
          [<InlineCode key="mm">middleware-match</InlineCode>, 'مسیر match‌شده توسط middleware'],
          [<InlineCode key="pf">prefetch</InlineCode>, 'مسیر prefetch‌شده'],
        ]}
      />

      <H2 id="shape">ساختار سریال‌شده</H2>
      <P>
        نمونهٔ کوتاه‌شده از <InlineCode>graph.json</InlineCode>:
      </P>
      <CodeBlock
        language="json"
        filename="ri-output/graph.json"
        code={`{
  "version": "1.0",
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "root": "/my/app",
  "nodes": [
    {
      "id": "app::page.tsx",
      "attributes": { "type": "route", "path": "/", "isDead": false }
    }
  ],
  "edges": [
    {
      "id": "navigation:app::page.tsx->/about",
      "source": "app::page.tsx",
      "target": "app::about::page.tsx",
      "attributes": { "type": "navigation", "source": "Link" }
    }
  ],
  "metadata": { "totalRoutes": 1, "totalLayouts": 1, "deadRouteCount": 0 }
}`}
      />

      <H2 id="consuming">مصرف گراف</H2>
      <P>
        چون فقط JSON است، می‌توانید هر جا بخوانید. برای دسترسی type-safe، تایپ{' '}
        <InlineCode>SerializedGraph</InlineCode> را از{' '}
        <InlineCode>@route-intelligence/shared</InlineCode> import کنید یا از{' '}
        <LA href="/docs/api" locale={locale}>
          API برنامه‌ای
        </LA>{' '}
        برای کار با نمونهٔ زندهٔ <InlineCode>RouteGraph</InlineCode> استفاده کنید.
      </P>
      <CodeBlock
        language="ts"
        code={`import type { SerializedGraph } from '@route-intelligence/shared';
import graph from './ri-output/graph.json' assert { type: 'json' };

const deadRoutes = (graph as SerializedGraph).nodes.filter(
  (node) => node.attributes.isDead,
);`}
      />
      <P>
        <Strong>نکته:</Strong> همان فیلدها{' '}
        <LA href="/docs/diagnostics" locale={locale}>
          diagnosticها
        </LA>{' '}
        را در <InlineCode>doctor</InlineCode> و ESLint هدایت می‌کنند.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
