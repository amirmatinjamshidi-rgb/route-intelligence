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
    lead: 'Route Intelligence is a monorepo of small, focused packages. Install the CLI to get started, or pull in individual packages as you need them.',
  },
  fa: {
    title: 'نصب',
    eyebrow: 'شروع کار',
    lead: 'Route Intelligence یک monorepo از بسته‌های کوچک و متمرکز است. برای شروع CLI را نصب کنید، یا بسته‌های جداگانه را در صورت نیاز اضافه کنید.',
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
      <P>The CLI is the fastest way to try Route Intelligence. Install it as a dev dependency:</P>
      <CodeBlock
        language="npm"
        code="npm install -D @route-intelligence/cli @route-intelligence/next"
      />
      <CodeBlock
        language="yarn"
        code="yarn add -D @route-intelligence/cli @route-intelligence/next"
      />
      <CodeBlock
        language="bun"
        code="bun add -d @route-intelligence/cli @route-intelligence/next"
      />

      <Callout kind="tip" title="Pick one package manager">
        The repo supports npm, Yarn, and Bun, but you should commit only one lockfile (
        <InlineCode>package-lock.json</InlineCode>, <InlineCode>yarn.lock</InlineCode>, or{' '}
        <InlineCode>bun.lock</InlineCode>). If you switch managers, delete managers, delete{' '}
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
          [<InlineCode key="cli">@route-intelligence/cli</InlineCode>, 'Command-line interface'],
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
      <H2 id="requirements">پیش‌نیازها</H2>
      <UL>
        <LI>
          <Strong>Node.js 22+</Strong>
        </LI>
        <LI>
          یکی از <Strong>npm 9+</Strong>، <Strong>Yarn</Strong> یا <Strong>Bun 1+</Strong>
        </LI>
      </UL>

      <H2 id="install-the-cli">نصب CLI</H2>
      <P>سریع‌ترین راه برای امتحان Route Intelligence، نصب CLI به‌عنوان dev dependency است:</P>
      <CodeBlock
        language="npm"
        code="npm install -D @route-intelligence/cli @route-intelligence/next"
      />
      <CodeBlock
        language="yarn"
        code="yarn add -D @route-intelligence/cli @route-intelligence/next"
      />
      <CodeBlock
        language="bun"
        code="bun add -d @route-intelligence/cli @route-intelligence/next"
      />

      <Callout kind="tip" title="یک package manager انتخاب کنید">
        این مخزن از npm، Yarn و Bun پشتیبانی می‌کند، اما فقط باید یک lockfile را commit کنید (
        <InlineCode>package-lock.json</InlineCode>، <InlineCode>yarn.lock</InlineCode> یا{' '}
        <InlineCode>bun.lock</InlineCode>). اگر package manager را عوض کردید،{' '}
        <InlineCode>node_modules</InlineCode> را حذف کنید و دوباره نصب کنید.
      </Callout>

      <H2 id="packages">بسته‌ها</H2>
      <P>
        Route Intelligence به‌صورت مجموعه‌ای از بسته‌های ترکیبی عرضه می‌شود. هسته هرگز به React وابسته
        نیست — دانش فریم‌ورک در plugins قرار دارد.
      </P>
      <Table
        head={['بسته', 'کاربرد']}
        rows={[
          [
            <InlineCode key="s">@route-intelligence/shared</InlineCode>,
            'تایپ‌ها و interfaceهای مشترک plugin',
          ],
          [
            <InlineCode key="c">@route-intelligence/core</InlineCode>,
            'موتور گراف، pipeline تحلیل و exporterها',
          ],
          [
            <InlineCode key="n">@route-intelligence/next</InlineCode>,
            'plugin برای Next.js App + Pages Router',
          ],
          [
            <InlineCode key="rr">@route-intelligence/react-router</InlineCode>,
            'plugin برای React Router v6/v7',
          ],
          [
            <InlineCode key="t">@route-intelligence/tanstack</InlineCode>,
            'plugin برای TanStack Router',
          ],
          [<InlineCode key="cli">@route-intelligence/cli</InlineCode>, 'رابط خط فرمان'],
          [
            <InlineCode key="v">@route-intelligence/visualizer</InlineCode>,
            'رابط گراف تعاملی React Flow',
          ],
          [
            <InlineCode key="es">eslint-plugin-route-intelligence</InlineCode>,
            'قوانین ESLint مبتنی بر گراف',
          ],
          [<InlineCode key="vs">route-intelligence-vscode</InlineCode>, 'افزونه VS Code'],
          [
            <InlineCode key="ga">@route-intelligence/github-action</InlineCode>,
            'کامنت graph-diff در PR',
          ],
          [<InlineCode key="pw">@route-intelligence/playwright</InlineCode>, 'تولید تست از گراف'],
        ]}
      />

      <H2 id="from-source">اجرای از سورس</H2>
      <P>
        monorepo را clone کرده‌اید؟ همهٔ اسکریپت‌های root به‌صورت خودکار package manager شما را تشخیص
        می‌دهند. پس از نصب، یک‌بار build کنید و پروژهٔ فعلی را تحلیل کنید:
      </P>
      <CodeBlock
        language="bash"
        code={`npm install
npm run build
npm run analyze`}
      />
      <P>
        برای گام‌های بعدی به{' '}
        <LA href="/docs/quick-start" locale={locale}>
          شروع سریع
        </LA>{' '}
        مراجعه کنید.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
