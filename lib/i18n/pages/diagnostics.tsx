import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, P, Prose, Strong, Table } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Diagnostics',
    eyebrow: 'Core Concepts',
    lead: 'Once the graph is built, Route Intelligence runs a suite of static checks over it. Each finding is a diagnostic with a rule id, a severity, and a precise source location.',
  },
  fa: {
    title: 'تشخیص‌ها',
    eyebrow: 'مفاهیم اصلی',
    lead: 'پس از ساخت گراف، Route Intelligence مجموعه‌ای از بررسی‌های استاتیک روی آن اجرا می‌کند. هر یافته یک diagnostic با شناسهٔ قانون، شدت و محل دقیق در سورس است.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="rules">Built-in rules</H2>
      <Table
        head={['Rule', 'Default', 'Description']}
        rows={[
          [
            <InlineCode key="dr">dead-route</InlineCode>,
            'warning',
            'A route no link or redirect can reach',
          ],
          [
            <InlineCode key="dl">dead-layout</InlineCode>,
            'warning',
            'A layout wrapping no reachable route',
          ],
          [
            <InlineCode key="bl">broken-link</InlineCode>,
            'error',
            "A link to a path that doesn't exist",
          ],
          [
            <InlineCode key="br">broken-redirect</InlineCode>,
            'error',
            'A redirect to a missing target',
          ],
          [
            <InlineCode key="rc">redirect-cycle</InlineCode>,
            'error',
            'Redirects that loop forever',
          ],
          [
            <InlineCode key="cn">circular-navigation</InlineCode>,
            'warning',
            'A navigation cycle between routes',
          ],
          [
            <InlineCode key="sr">shadowed-route / duplicate-route</InlineCode>,
            'warning',
            'Two routes resolving to one path',
          ],
          [
            <InlineCode key="or">open-redirect</InlineCode>,
            'error',
            'A redirect target derived from user input',
          ],
          [
            <InlineCode key="me">missing-error-boundary / missing-loading</InlineCode>,
            'info',
            'Recommended files are absent',
          ],
        ]}
      />

      <H2 id="severity">Severities</H2>
      <P>
        Every diagnostic is an <InlineCode>error</InlineCode>, <InlineCode>warning</InlineCode>, or{' '}
        <InlineCode>info</InlineCode>. Errors always fail <InlineCode>doctor</InlineCode> warnings
        fail only when you pass <InlineCode>--strict</InlineCode>.
      </P>

      <H2 id="customizing">Customizing severity</H2>
      <P>
        Override any rule's severity in{' '}
        <LA href="/docs/configuration" locale={locale}>
          your config file
        </LA>
        . Set a rule to <InlineCode>off</InlineCode> to disable it entirely.
      </P>
      <CodeBlock
        language="ts"
        filename="ri.config.ts"
        code={`export default defineConfig({
  rules: {
    'dead-route': 'warn',
    'broken-link': 'error',
    'redirect-cycle': 'error',
    'missing-loading': 'off',
  },
});`}
      />

      <H2 id="shape">The diagnostic shape</H2>
      <P>
        Diagnostics are attached to the graph (on nodes and edges) and also returned as a flat list.
        Each one looks like:
      </P>
      <CodeBlock
        language="ts"
        code={`interface Diagnostic {
  ruleId: string;        // e.g. 'broken-link'
  severity: 'error' | 'warning' | 'info';
  message: string;
  loc?: { filePath: string; line: number; column: number };
  nodeId?: string;
  edgeId?: string;
}`}
      />
      <Callout kind="tip" title="Same data everywhere">
        These diagnostics power the <InlineCode>doctor</InlineCode> command, the{' '}
        <LA href="/docs/integrations" locale={locale}>
          ESLint plugin
        </LA>
        , the VS Code Problems panel, and PR comments from the GitHub Action.{' '}
        <Strong>Write a rule once, surface it everywhere.</Strong>
      </Callout>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="rules">قوانین داخلی</H2>
      <Table
        head={['قانون', 'پیش‌فرض', 'توضیح']}
        rows={[
          [
            <InlineCode key="dr">dead-route</InlineCode>,
            'warning',
            'مسیرهایی که هیچ لینک یا redirectی به آن‌ها نمی‌رسد',
          ],
          [
            <InlineCode key="dl">dead-layout</InlineCode>,
            'warning',
            'layoutی که هیچ مسیر قابل دسترسی را wrap نمی‌کند',
          ],
          [<InlineCode key="bl">broken-link</InlineCode>, 'error', 'لینکی به مسیری که وجود ندارد'],
          [
            <InlineCode key="br">broken-redirect</InlineCode>,
            'error',
            'redirect به هدفی که وجود ندارد',
          ],
          [
            <InlineCode key="rc">redirect-cycle</InlineCode>,
            'error',
            'redirectهایی که برای همیشه حلقه می‌زنند',
          ],
          [
            <InlineCode key="cn">circular-navigation</InlineCode>,
            'warning',
            'چرخهٔ navigation بین مسیرها',
          ],
          [
            <InlineCode key="sr">shadowed-route / duplicate-route</InlineCode>,
            'warning',
            'دو مسیر که به یک path resolve می‌شوند',
          ],
          [
            <InlineCode key="or">open-redirect</InlineCode>,
            'error',
            'هدف redirect مشتق‌شده از ورودی کاربر',
          ],
          [
            <InlineCode key="me">missing-error-boundary / missing-loading</InlineCode>,
            'info',
            'فایل‌های توصیه‌شده وجود ندارند',
          ],
        ]}
      />

      <H2 id="severity">شدت‌ها</H2>
      <P>
        هر diagnostic یک <InlineCode>error</InlineCode>، <InlineCode>warning</InlineCode> یا{' '}
        <InlineCode>info</InlineCode> است. errorها همیشه <InlineCode>doctor</InlineCode> را fail
        می‌کنند؛ warningها فقط با <InlineCode>--strict</InlineCode> fail می‌شوند.
      </P>

      <H2 id="customizing">سفارشی‌سازی شدت</H2>
      <P>
        شدت هر قانون را در{' '}
        <LA href="/docs/configuration" locale={locale}>
          فایل پیکربندی
        </LA>{' '}
        خود override کنید. یک قانون را روی <InlineCode>off</InlineCode> بگذارید تا کاملاً غیرفعال
        شود.
      </P>
      <CodeBlock
        language="ts"
        filename="ri.config.ts"
        code={`export default defineConfig({
  rules: {
    'dead-route': 'warn',
    'broken-link': 'error',
    'redirect-cycle': 'error',
    'missing-loading': 'off',
  },
});`}
      />

      <H2 id="shape">ساختار diagnostic</H2>
      <P>
        diagnosticها به گراف متصل می‌شوند (روی nodeها و یال‌ها) و همچنین به‌صورت فهرست تخت برگردانده
        می‌شوند. هر کدام شبیه این است:
      </P>
      <CodeBlock
        language="ts"
        code={`interface Diagnostic {
  ruleId: string;        // e.g. 'broken-link'
  severity: 'error' | 'warning' | 'info';
  message: string;
  loc?: { filePath: string; line: number; column: number };
  nodeId?: string;
  edgeId?: string;
}`}
      />
      <Callout kind="tip" title="همان داده در همه‌جا">
        این diagnosticها دستور <InlineCode>doctor</InlineCode>،{' '}
        <LA href="/docs/integrations" locale={locale}>
          plugin ESLint
        </LA>
        ، پنل Problems در VS Code و کامنت‌های PR از GitHub Action را تغذیه می‌کنند.{' '}
        <Strong>یک‌بار قانون بنویسید، همه‌جا نمایش دهید.</Strong>
      </Callout>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
