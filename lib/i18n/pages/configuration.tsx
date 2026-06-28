import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Configuration',
    eyebrow: 'Usage',
    lead: 'Drop a ri.config.ts file at your project root to control what gets analyzed, which plugins run, and how rules behave. Use the typed defineConfig helper for autocomplete.',
  },
  fa: {
    title: 'پیکربندی',
    eyebrow: 'کاربرد',
    lead: 'فایل ri.config.ts را در ریشهٔ پروژه قرار دهید تا کنترل کنید چه چیزی تحلیل شود، کدام pluginها اجرا شوند و قوانین چگونه رفتار کنند. از helper تایپ‌شده defineConfig برای autocomplete استفاده کنید.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
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
        head={['Key', 'Type', 'Description']}
        rows={[
          [<InlineCode key="r">root</InlineCode>, 'string', 'Directory to analyze'],
          [
            <InlineCode key="p">plugins</InlineCode>,
            'FrameworkPlugin[]',
            'Framework plugins to run',
          ],
          [<InlineCode key="i">include</InlineCode>, 'string[]', 'Globs of files to scan'],
          [<InlineCode key="e">exclude</InlineCode>, 'string[]', 'Globs to ignore'],
          [
            <InlineCode key="c">cache</InlineCode>,
            '{ enabled, directory }',
            'Incremental cache settings',
          ],
          [
            <InlineCode key="o">output</InlineCode>,
            '{ formats, directory }',
            'Default export formats and folder',
          ],
          [
            <InlineCode key="ru">rules</InlineCode>,
            'Record<string, Severity>',
            'Per-rule severity overrides',
          ],
        ]}
      />

      <H2 id="includes">Includes & excludes</H2>
      <P>
        <InlineCode>include</InlineCode> and <InlineCode>exclude</InlineCode> are standard globs.
        Keep includes tight — scanning fewer files is faster and avoids false positives from
        fixtures or generated code.
      </P>
      <Callout kind="note" title="Sensible defaults">
        If you don't provide a config, the CLI uses{' '}
        <InlineCode>['app/**', 'pages/**', 'src/**', 'middleware.ts']</InlineCode> for includes and
        ignores <InlineCode>node_modules</InlineCode>, <InlineCode>.next</InlineCode>,{' '}
        <InlineCode>dist</InlineCode>, and test files.
      </Callout>

      <H2 id="rules">Rules</H2>
      <P>
        The <InlineCode>rules</InlineCode> map overrides diagnostic severities. Accepted values are{' '}
        <InlineCode>error</InlineCode>, <InlineCode>warn</InlineCode>, and{' '}
        <InlineCode>off</InlineCode>. See the full list in{' '}
        <LA href="/docs/diagnostics" locale={locale}>
          Diagnostics
        </LA>
        .
      </P>

      <H2 id="multiple-plugins">Multiple frameworks</H2>
      <P>
        Analyzing a monorepo with more than one router? Pass several plugins — the graph merges them
        into one model.
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
        <Strong>Next:</Strong> drive the engine directly from code with the{' '}
        <LA href="/docs/api" locale={locale}>
          programmatic API
        </LA>
        .
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="example">یک مثال کامل</H2>
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

      <H2 id="options">گزینه‌ها</H2>
      <Table
        head={['کلید', 'نوع', 'توضیح']}
        rows={[
          [<InlineCode key="r">root</InlineCode>, 'string', 'پوشه برای تحلیل'],
          [
            <InlineCode key="p">plugins</InlineCode>,
            'FrameworkPlugin[]',
            'pluginهای فریم‌ورک برای اجرا',
          ],
          [<InlineCode key="i">include</InlineCode>, 'string[]', 'globهای فایل‌های اسکن'],
          [<InlineCode key="e">exclude</InlineCode>, 'string[]', 'globهای نادیده‌گرفته'],
          [
            <InlineCode key="c">cache</InlineCode>,
            '{ enabled, directory }',
            'تنظیمات cache افزایشی',
          ],
          [
            <InlineCode key="o">output</InlineCode>,
            '{ formats, directory }',
            'فرمت‌های export پیش‌فرض و پوشه',
          ],
          [
            <InlineCode key="ru">rules</InlineCode>,
            'Record<string, Severity>',
            'override شدت هر قانون',
          ],
        ]}
      />

      <H2 id="includes">include و exclude</H2>
      <P>
        <InlineCode>include</InlineCode> و <InlineCode>exclude</InlineCode> globهای استاندارد هستند.
        includeها را محدود نگه دارید — اسکن فایل‌های کمتر سریع‌تر است و از false positive ناشی از
        fixture یا کد تولیدی جلوگیری می‌کند.
      </P>
      <Callout kind="note" title="پیش‌فرض‌های منطقی">
        اگر پیکربندی ندهید، CLI برای include از{' '}
        <InlineCode>['app/**', 'pages/**', 'src/**', 'middleware.ts']</InlineCode> استفاده می‌کند و{' '}
        <InlineCode>node_modules</InlineCode>، <InlineCode>.next</InlineCode>،{' '}
        <InlineCode>dist</InlineCode> و فایل‌های تست را نادیده می‌گیرد.
      </Callout>

      <H2 id="rules">قوانین</H2>
      <P>
        نقشهٔ <InlineCode>rules</InlineCode> شدت diagnosticها را override می‌کند. مقادیر مجاز{' '}
        <InlineCode>error</InlineCode>، <InlineCode>warn</InlineCode> و <InlineCode>off</InlineCode>{' '}
        هستند. فهرست کامل را در{' '}
        <LA href="/docs/diagnostics" locale={locale}>
          تشخیص‌ها
        </LA>{' '}
        ببینید.
      </P>

      <H2 id="multiple-plugins">چند فریم‌ورک</H2>
      <P>
        monorepo با بیش از یک router تحلیل می‌کنید؟ چند plugin بدهید — گراف آن‌ها را در یک مدل ادغام
        می‌کند.
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
        <Strong>بعدی:</Strong> موتور را مستقیماً از کد با{' '}
        <LA href="/docs/api" locale={locale}>
          API برنامه‌ای
        </LA>{' '}
        هدایت کنید.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
