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
    title: 'شروع سریع',
    eyebrow: 'شروع کار',
    lead: 'در کمتر از یک دقیقه از صفر به گراف مسیر تعاملی برسید. این راهنما پروژه Next.js را فرض می‌کند، اما گردش کار برای هر فریم‌ورک پشتیبانی‌شده یکسان است.',
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
      <H2 id="1-analyze">۱. تحلیل مسیرها</H2>
      <P>
        <InlineCode>analyze</InlineCode> را از ریشهٔ پروژه اجرا کنید. این دستور{' '}
        <InlineCode>app/</InlineCode>، <InlineCode>pages/</InlineCode> و{' '}
        <InlineCode>middleware.ts</InlineCode> را اسکن می‌کند و گراف را در{' '}
        <InlineCode>ri-output/graph.json</InlineCode> می‌نویسد.
      </P>
      <CodeBlock language="bash" code="npx route-intelligence analyze --root ." />
      <P>خلاصه‌ای شبیه این باید ببینید:</P>
      <CodeBlock
        language="text"
        code={`✔ Found 12 routes, 4 layouts
Written to ri-output/graph.json`}
      />

      <H2 id="2-visualize">۲. باز کردن گراف تعاملی</H2>
      <P>
        دستور <InlineCode>graph</InlineCode> تحلیل می‌کند و رابط مرورگر محلی را اجرا می‌کند؛ در آنجا
        می‌توانید مسیرها را جستجو کنید، overlayها را تغییر دهید و nodeها را بررسی کنید.
      </P>
      <CodeBlock language="bash" code="npx route-intelligence graph --port 3001" />
      <P>
        برای کاوش گراف،{' '}
        <LA href="http://localhost:3001" locale={locale}>
          http://localhost:3001
        </LA>{' '}
        را باز کنید.
      </P>

      <H2 id="3-check-health">۳. بررسی مشکلات</H2>
      <P>
        <InlineCode>doctor</InlineCode> همهٔ قوانین تحلیل استاتیک را اجرا می‌کند و diagnosticها را چاپ
        می‌کند — مسیرهای مرده، لینک‌های شکسته، چرخه‌های redirect و موارد دیگر.
      </P>
      <CodeBlock language="bash" code="npx route-intelligence doctor --root . --strict" />
      <Callout kind="tip" title="مناسب برای CI">
        با <InlineCode>--strict</InlineCode> در صورت warning هم با کد غیرصفر خارج می‌شود، تا لینک
        شکسته pipeline شما را fail کند.
      </Callout>

      <H2 id="4-export">۴. خروجی برای مستندات یا نمودار</H2>
      <P>یک نمودار Mermaid بسازید که بتوانید در README یا wiki قرار دهید:</P>
      <CodeBlock
        language="bash"
        code="npx route-intelligence analyze --format mermaid --out ri-output"
      />

      <H2 id="what-next">بعدش چه؟</H2>
      <OL>
        <LI>
          <LA href="/docs/concepts" locale={locale}>
            مدل گراف مسیر
          </LA>{' '}
          را بشناسید که پایهٔ همهٔ این قابلیت‌هاست.
        </LI>
        <LI>
          یک{' '}
          <LA href="/docs/configuration" locale={locale}>
            فایل پیکربندی
          </LA>{' '}
          اضافه کنید تا includeها، pluginها و قوانین را سفارشی کنید.
        </LI>
        <LI>
          <LA href="/docs/integrations" locale={locale}>
            یکپارچه‌سازی‌ها
          </LA>{' '}
          را راه بیندازید: ESLint، VS Code و GitHub Action برای PRها.
        </LI>
      </OL>
      <P>
        <Strong>نکته:</Strong> <InlineCode>analyze</InlineCode> را به مرحلهٔ{' '}
        <InlineCode>predev</InlineCode> یا pre-commit اضافه کنید تا گراف همیشه به‌روز بماند.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
