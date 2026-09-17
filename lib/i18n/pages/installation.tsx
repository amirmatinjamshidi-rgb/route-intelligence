import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, LI, P, Prose, Strong, Table, UL } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Installation',
    eyebrow: 'Get Started',
    lead: 'Route Intelligence is a set of small packages. Most people only install the CLI — it already pulls in core and the Next.js plugin.',
  },
  fa: {
    title: 'نصب',
    eyebrow: 'اول کار',
    lead: 'پکیج زیاده، ولی معمولاً فقط CLI کافیه. خودش core و پلاگین Next رو میاره.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="requirements">Requirements</H2>
      <UL>
        <LI>
          <Strong>Node.js 22+</Strong>
        </LI>
        <LI>
          Any of <Strong>npm 9+</Strong>, <Strong>Yarn</Strong>, or <Strong>Bun 1+</Strong>
        </LI>
      </UL>

      <H2 id="install-the-cli">Install the CLI</H2>
      <P>
        One package is enough to see results. The CLI depends on{' '}
        <InlineCode>@route-intelligence/core</InlineCode> and{' '}
        <InlineCode>@route-intelligence/next</InlineCode> — you do not install those yourself.
      </P>
      <CodeBlock language="npm" code="npm install -D @route-intelligence/cli" />
      <CodeBlock language="yarn" code="yarn add -D @route-intelligence/cli" />
      <CodeBlock language="bun" code="bun add -d @route-intelligence/cli" />

      <Callout kind="tip" title="Pick one package manager">
        The repo supports npm, Yarn, and Bun, but you should commit only one lockfile (
        <InlineCode>package-lock.json</InlineCode>, <InlineCode>yarn.lock</InlineCode>, or{' '}
        <InlineCode>bun.lock</InlineCode>). If you switch managers, delete{' '}
        <InlineCode>node_modules</InlineCode> and reinstall.
      </Callout>

      <H2 id="packages">The packages</H2>
      <P>
        Route Intelligence ships as a set of composable packages. The core never depends on React —
        framework knowledge lives in plugins.
      </P>
      <Table
        head={['Package', 'What it does']}
        rows={[
          [
            <InlineCode key="s">@route-intelligence/shared</InlineCode>,
            'Shared types and plugin interfaces',
          ],
          [
            <InlineCode key="c">@route-intelligence/core</InlineCode>,
            'Graph engine, analysis pipeline, exporters',
          ],
          [
            <InlineCode key="n">@route-intelligence/next</InlineCode>,
            'Next.js App + Pages Router plugin',
          ],
          [
            <InlineCode key="rr">@route-intelligence/react-router</InlineCode>,
            'React Router v6/v7 plugin',
          ],
          [<InlineCode key="t">@route-intelligence/tanstack</InlineCode>, 'TanStack Router plugin'],
          [
            <InlineCode key="cli">@route-intelligence/cli</InlineCode>,
            'Install this. analyze / graph / doctor',
          ],
          [
            <InlineCode key="v">@route-intelligence/visualizer</InlineCode>,
            'Interactive React Flow graph UI',
          ],
          [
            <InlineCode key="es">eslint-plugin-route-intelligence</InlineCode>,
            'ESLint rules backed by the graph',
          ],
          [<InlineCode key="vs">route-intelligence-vscode</InlineCode>, 'VS Code extension'],
          [
            <InlineCode key="ga">@route-intelligence/github-action</InlineCode>,
            'PR graph-diff comments',
          ],
          [
            <InlineCode key="pw">@route-intelligence/playwright</InlineCode>,
            'Test generation from the graph',
          ],
        ]}
      />

      <H2 id="from-source">Running from source</H2>
      <P>
        Cloning the monorepo? All root scripts auto-detect your package manager. After install,
        build once and analyze the current project:
      </P>
      <CodeBlock
        language="bash"
        code={`npm install
npm run build
npm run analyze`}
      />
      <P>
        See{' '}
        <LA href="/docs/quick-start" locale={locale}>
          Quick Start
        </LA>{' '}
        for what to do next.
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="requirements">چی لازم داری</H2>
      <UL>
        <LI>
          <Strong>Node.js 22+</Strong>
        </LI>
        <LI>
          یکی از <Strong>npm 9+</Strong>، <Strong>Yarn</Strong> یا <Strong>Bun 1+</Strong>
        </LI>
      </UL>

      <H2 id="install-the-cli">نصب CLI</H2>
      <P>
        برای دیدن نتیجه همین یکی کافیه. CLI خودش <InlineCode>core</InlineCode> و پلاگین Next رو
        میاره — جدا نصبشون نکن.
      </P>
      <CodeBlock language="npm" code="npm install -D @route-intelligence/cli" />
      <CodeBlock language="yarn" code="yarn add -D @route-intelligence/cli" />
      <CodeBlock language="bun" code="bun add -d @route-intelligence/cli" />

      <Callout kind="tip" title="یه package manager کافیه">
        npm، Yarn، Bun اوکی‌ان. فقط یه lockfile commit کن (<InlineCode>package-lock.json</InlineCode>
        ، <InlineCode>yarn.lock</InlineCode> یا <InlineCode>bun.lock</InlineCode>). عوض کردی؟{' '}
        <InlineCode>node_modules</InlineCode> رو پاک کن دوباره نصب کن.
      </Callout>

      <H2 id="packages">بقیه پکیج‌ها</H2>
      <P>هسته به React وصل نیست. دانش فریم‌ورک تو pluginـه. یوزر معمولی همون CLI رو می‌خواد.</P>
      <Table
        head={['پکیج', 'کی نصب کنه']}
        rows={[
          [<InlineCode key="cli">@route-intelligence/cli</InlineCode>, 'تو. همینه که نتیجه می‌ده'],
          [
            <InlineCode key="c">@route-intelligence/core</InlineCode>,
            'اگه خودت تو Node تحلیل می‌نویسی',
          ],
          [<InlineCode key="n">@route-intelligence/next</InlineCode>, 'با CLI میاد؛ جدا لازم نیست'],
          [<InlineCode key="s">@route-intelligence/shared</InlineCode>, 'تایپ‌ها. نویسنده پلاگین'],
          [
            <InlineCode key="rr">@route-intelligence/react-router</InlineCode>,
            'React Router — هنوز تو CLI نیست',
          ],
          [
            <InlineCode key="t">@route-intelligence/tanstack</InlineCode>,
            'TanStack — هنوز تو CLI نیست',
          ],
          [
            <InlineCode key="v">@route-intelligence/visualizer</InlineCode>,
            'گراف React Flow تو اپ خودت',
          ],
          [
            <InlineCode key="es">eslint-plugin-route-intelligence</InlineCode>,
            'بعد از analyze برای lint',
          ],
          [<InlineCode key="vs">route-intelligence-vscode</InlineCode>, 'از Marketplace، نه npm'],
          [<InlineCode key="ga">@route-intelligence/github-action</InlineCode>, 'گزارش روت تو PR'],
          [<InlineCode key="pw">@route-intelligence/playwright</InlineCode>, 'ساخت spec از گراف'],
        ]}
      />

      <H2 id="from-source">از سورس این ریپو</H2>
      <P>clone کردی؟ اسکریپت‌های root خودشون package manager رو می‌فهمن. نصب، build، بعد analyze:</P>
      <CodeBlock
        language="bash"
        code={`npm install
npm run build
npm run analyze`}
      />
      <P>
        بعدش برو{' '}
        <LA href="/docs/quick-start" locale={locale}>
          شروع سریع
        </LA>
        .
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
