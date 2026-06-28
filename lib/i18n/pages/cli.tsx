import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, H3, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'CLI Commands',
    eyebrow: 'Usage',
    lead: 'The route-intelligence CLI wraps the engine in six commands. Run it via npx, your package manager, or directly against the built bundle.',
  },
  fa: {
    title: 'دستورات CLI',
    eyebrow: 'کاربرد',
    lead: 'CLI route-intelligence موتور را در شش دستور می‌پیچد. آن را با npx، package manager یا مستقیماً روی bundle ساخته‌شده اجرا کنید.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="invocation">Invocation</H2>
      <P>There are three equivalent ways to run the CLI:</P>
      <CodeBlock
        language="bash"
        code={`# Via npx (installed as a dependency)
npx route-intelligence <command> [options]

# Via a package.json script
npm run analyze

# Directly against the built bundle (from a clone)
node packages/cli/dist/cli.js <command> [options]`}
      />

      <H2 id="analyze">analyze</H2>
      <P>Analyze routing and write the graph to disk in the format of your choice.</P>
      <CodeBlock
        language="bash"
        code="route-intelligence analyze --root . --format json --out ri-output"
      />
      <Table
        head={['Option', 'Default', 'Description']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root to analyze'],
          [
            <InlineCode key="f">-f, --format</InlineCode>,
            'json',
            'json · mermaid · plantuml · dot · html · markdown',
          ],
          [<InlineCode key="o">-o, --out</InlineCode>, 'ri-output', 'Output directory'],
        ]}
      />

      <H2 id="graph">graph</H2>
      <P>Analyze, then start a local server with an interactive graph browser.</P>
      <CodeBlock language="bash" code="route-intelligence graph --port 3001 --host localhost" />
      <Table
        head={['Option', 'Default', 'Description']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root'],
          [<InlineCode key="p">-p, --port</InlineCode>, '3001', 'Port to serve on'],
          [<InlineCode key="h">--host</InlineCode>, 'localhost', 'Host to bind'],
        ]}
      />

      <H2 id="doctor">doctor</H2>
      <P>Run every diagnostic rule and report problems. Ideal for CI.</P>
      <CodeBlock language="bash" code="route-intelligence doctor --root . --strict --format text" />
      <Table
        head={['Option', 'Default', 'Description']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root'],
          [<InlineCode key="s">--strict</InlineCode>, 'off', 'Exit non-zero on warnings too'],
          [<InlineCode key="f">-f, --format</InlineCode>, 'text', 'text · json'],
        ]}
      />
      <Callout kind="tip" title="Use it as a CI gate">
        <InlineCode>doctor</InlineCode> exits with code 1 when there are errors (or warnings under{' '}
        <InlineCode>--strict</InlineCode>), so a broken link fails the build.
      </Callout>

      <H2 id="docs">docs</H2>
      <P>Generate human-readable route documentation in Markdown or HTML.</P>
      <CodeBlock
        language="bash"
        code="route-intelligence docs --format markdown --out docs/routes"
      />
      <Table
        head={['Option', 'Default', 'Description']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'Project root'],
          [<InlineCode key="f">-f, --format</InlineCode>, 'markdown', 'markdown · html'],
          [<InlineCode key="o">-o, --out</InlineCode>, 'docs/routes', 'Output directory'],
        ]}
      />

      <H2 id="export">export</H2>
      <P>Export the raw graph for use in other tools.</P>
      <CodeBlock
        language="bash"
        code="route-intelligence export --format mermaid --out ri-export"
      />
      <P>
        <Strong>Formats:</Strong> <InlineCode>json</InlineCode>, <InlineCode>mermaid</InlineCode>,{' '}
        <InlineCode>plantuml</InlineCode>, <InlineCode>dot</InlineCode>. See{' '}
        <LA href="/docs/visualizing" locale={locale}>
          Visualizing
        </LA>{' '}
        for what to do with each.
      </P>

      <H2 id="watch">watch</H2>
      <P>
        Watch the project and incrementally update the graph as files change, printing a patch
        summary on every update. Press <InlineCode>Ctrl+C</InlineCode> to stop.
      </P>
      <CodeBlock language="bash" code="route-intelligence watch --root ." />
      <CodeBlock
        language="text"
        code={`Watching for route changes...
Graph updated: +1 nodes, -0 nodes`}
      />

      <H3 id="exit-codes">Exit codes</H3>
      <Table
        head={['Code', 'Meaning']}
        rows={[
          ['0', 'Success (no errors; no warnings under --strict)'],
          ['1', 'Diagnostics failed, or an unknown format/argument'],
        ]}
      />
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="invocation">فراخوانی</H2>
      <P>سه روش معادل برای اجرای CLI وجود دارد:</P>
      <CodeBlock
        language="bash"
        code={`# Via npx (installed as a dependency)
npx route-intelligence <command> [options]

# Via a package.json script
npm run analyze

# Directly against the built bundle (from a clone)
node packages/cli/dist/cli.js <command> [options]`}
      />

      <H2 id="analyze">analyze</H2>
      <P>مسیریابی را تحلیل می‌کند و گراف را روی دیسک با فرمت دلخواه می‌نویسد.</P>
      <CodeBlock
        language="bash"
        code="route-intelligence analyze --root . --format json --out ri-output"
      />
      <Table
        head={['گزینه', 'پیش‌فرض', 'توضیح']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'ریشهٔ پروژه برای تحلیل'],
          [
            <InlineCode key="f">-f, --format</InlineCode>,
            'json',
            'json · mermaid · plantuml · dot · html · markdown',
          ],
          [<InlineCode key="o">-o, --out</InlineCode>, 'ri-output', 'پوشهٔ خروجی'],
        ]}
      />

      <H2 id="graph">graph</H2>
      <P>تحلیل می‌کند و سپس سرور محلی با مرورگر گراف تعاملی راه می‌اندازد.</P>
      <CodeBlock language="bash" code="route-intelligence graph --port 3001 --host localhost" />
      <Table
        head={['گزینه', 'پیش‌فرض', 'توضیح']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'ریشهٔ پروژه'],
          [<InlineCode key="p">-p, --port</InlineCode>, '3001', 'پورت سرو'],
          [<InlineCode key="h">--host</InlineCode>, 'localhost', 'میزبان bind'],
        ]}
      />

      <H2 id="doctor">doctor</H2>
      <P>همهٔ قوانین diagnostic را اجرا می‌کند و مشکلات را گزارش می‌دهد. ایده‌آل برای CI.</P>
      <CodeBlock language="bash" code="route-intelligence doctor --root . --strict --format text" />
      <Table
        head={['گزینه', 'پیش‌فرض', 'توضیح']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'ریشهٔ پروژه'],
          [<InlineCode key="s">--strict</InlineCode>, 'off', 'خروج غیرصفر روی warningها هم'],
          [<InlineCode key="f">-f, --format</InlineCode>, 'text', 'text · json'],
        ]}
      />
      <Callout kind="tip" title="به‌عنوان دروازه CI">
        <InlineCode>doctor</InlineCode> در صورت وجود error (یا warning با{' '}
        <InlineCode>--strict</InlineCode>) با کد ۱ خارج می‌شود، تا لینک شکسته build را fail کند.
      </Callout>

      <H2 id="docs">docs</H2>
      <P>مستندات مسیر قابل خواندن برای انسان در Markdown یا HTML تولید می‌کند.</P>
      <CodeBlock
        language="bash"
        code="route-intelligence docs --format markdown --out docs/routes"
      />
      <Table
        head={['گزینه', 'پیش‌فرض', 'توضیح']}
        rows={[
          [<InlineCode key="r">-r, --root</InlineCode>, '.', 'ریشهٔ پروژه'],
          [<InlineCode key="f">-f, --format</InlineCode>, 'markdown', 'markdown · html'],
          [<InlineCode key="o">-o, --out</InlineCode>, 'docs/routes', 'پوشهٔ خروجی'],
        ]}
      />

      <H2 id="export">export</H2>
      <P>گراف خام را برای استفاده در ابزارهای دیگر export می‌کند.</P>
      <CodeBlock
        language="bash"
        code="route-intelligence export --format mermaid --out ri-export"
      />
      <P>
        <Strong>فرمت‌ها:</Strong> <InlineCode>json</InlineCode>، <InlineCode>mermaid</InlineCode>،{' '}
        <InlineCode>plantuml</InlineCode>، <InlineCode>dot</InlineCode>. برای کار با هر کدام به{' '}
        <LA href="/docs/visualizing" locale={locale}>
          مصورسازی
        </LA>{' '}
        مراجعه کنید.
      </P>

      <H2 id="watch">watch</H2>
      <P>
        پروژه را watch می‌کند و با تغییر فایل‌ها گراف را به‌صورت افزایشی به‌روز می‌کند و خلاصهٔ patch را
        در هر به‌روزرسانی چاپ می‌کند. برای توقف <InlineCode>Ctrl+C</InlineCode> را بزنید.
      </P>
      <CodeBlock language="bash" code="route-intelligence watch --root ." />
      <CodeBlock
        language="text"
        code={`Watching for route changes...
Graph updated: +1 nodes, -0 nodes`}
      />

      <H3 id="exit-codes">کدهای خروج</H3>
      <Table
        head={['کد', 'معنی']}
        rows={[
          ['0', 'موفق (بدون error؛ بدون warning با --strict)'],
          ['1', 'diagnosticها fail شدند، یا فرمت/آرگومان ناشناخته'],
        ]}
      />
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
