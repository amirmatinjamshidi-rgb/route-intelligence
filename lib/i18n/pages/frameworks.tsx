import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, H3, InlineCode, LI, P, Prose, Strong, UL } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Framework Plugins',
    eyebrow: 'Ecosystem',
    lead: 'The core engine is framework-agnostic. Plugins teach it how a given router discovers routes and expresses navigation. Mix and match them in your config.',
  },
  fa: {
    title: 'pluginهای فریم‌ورک',
    eyebrow: 'اکوسیستم',
    lead: 'موتور اصلی مستقل از فریم‌ورک است. pluginها به آن می‌آموزند یک router مشخص چگونه مسیرها را کشف و navigation را بیان می‌کند. آن‌ها را در پیکربندی ترکیب کنید.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="next">Next.js</H2>
      <P>
        <InlineCode>@route-intelligence/next</InlineCode> understands both the App Router and the
        Pages Router, including the full set of Next.js 16 file conventions —{' '}
        <InlineCode>page</InlineCode>, <InlineCode>layout</InlineCode>,{' '}
        <InlineCode>template</InlineCode>, <InlineCode>loading</InlineCode>,{' '}
        <InlineCode>error</InlineCode>, <InlineCode>not-found</InlineCode>,{' '}
        <InlineCode>forbidden</InlineCode>, <InlineCode>unauthorized</InlineCode>, route handlers,
        and middleware.
      </P>
      <CodeBlock
        language="ts"
        code={`import { NextPlugin } from '@route-intelligence/next';

NextPlugin({
  appDir: 'app',
  pagesDir: 'pages',
  customNavigationWrappers: [],
});`}
      />
      <H3 id="next-navigation">Navigation it detects</H3>
      <UL>
        <LI>
          <InlineCode>{'<Link href>'}</InlineCode> and intercepting/parallel routes
        </LI>
        <LI>
          <InlineCode>router.push / replace / prefetch / back / forward</InlineCode>
        </LI>
        <LI>
          <InlineCode>redirect()</InlineCode> and <InlineCode>permanentRedirect()</InlineCode>
        </LI>
        <LI>
          <InlineCode>NextResponse.redirect / rewrite</InlineCode> in middleware
        </LI>
        <LI>
          <InlineCode>window.location</InlineCode> and the History API
        </LI>
      </UL>
      <Callout kind="note" title="Middleware aware">
        The Next plugin reads <InlineCode>middleware.ts</InlineCode> matchers and extracts
        cookie/header conditions, so guarded routes show up as conditional edges.
      </Callout>

      <H2 id="react-router">React Router</H2>
      <P>
        <InlineCode>@route-intelligence/react-router</InlineCode> supports React Router v6 and v7,
        including data routers and nested route configs.
      </P>
      <CodeBlock
        language="ts"
        code={`import { ReactRouterPlugin } from '@route-intelligence/react-router';

ReactRouterPlugin();`}
      />

      <H2 id="tanstack">TanStack Router</H2>
      <P>
        <InlineCode>@route-intelligence/tanstack</InlineCode> understands TanStack Router's
        file-based and code-based route trees.
      </P>
      <CodeBlock
        language="ts"
        code={`import { TanStackPlugin } from '@route-intelligence/tanstack';

TanStackPlugin();`}
      />

      <H2 id="writing-a-plugin">Writing your own plugin</H2>
      <P>
        A plugin implements the <InlineCode>FrameworkPlugin</InlineCode> interface from{' '}
        <InlineCode>@route-intelligence/shared</InlineCode>. It declares which files it claims and
        contributes nodes and edges to the shared graph. Because the contract is small, supporting a
        new framework — or a house convention — is straightforward.
      </P>
      <P>
        <Strong>Next:</Strong> connect the graph to your editor and CI in{' '}
        <LA href="/docs/integrations" locale={locale}>
          Integrations
        </LA>
        .
      </P>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="next">Next.js</H2>
      <P>
        <InlineCode>@route-intelligence/next</InlineCode> هم App Router و هم Pages Router را
        می‌شناسد، از جمله مجموعهٔ کامل قراردادهای فایل Next.js 16 — <InlineCode>page</InlineCode>،{' '}
        <InlineCode>layout</InlineCode>، <InlineCode>template</InlineCode>،{' '}
        <InlineCode>loading</InlineCode>، <InlineCode>error</InlineCode>،{' '}
        <InlineCode>not-found</InlineCode>، <InlineCode>forbidden</InlineCode>،{' '}
        <InlineCode>unauthorized</InlineCode>، route handlerها و middleware.
      </P>
      <CodeBlock
        language="ts"
        code={`import { NextPlugin } from '@route-intelligence/next';

NextPlugin({
  appDir: 'app',
  pagesDir: 'pages',
  customNavigationWrappers: [],
});`}
      />
      <H3 id="next-navigation">navigationهایی که تشخیص می‌دهد</H3>
      <UL>
        <LI>
          <InlineCode>{'<Link href>'}</InlineCode> و مسیرهای intercepting/parallel
        </LI>
        <LI>
          <InlineCode>router.push / replace / prefetch / back / forward</InlineCode>
        </LI>
        <LI>
          <InlineCode>redirect()</InlineCode> و <InlineCode>permanentRedirect()</InlineCode>
        </LI>
        <LI>
          <InlineCode>NextResponse.redirect / rewrite</InlineCode> در middleware
        </LI>
        <LI>
          <InlineCode>window.location</InlineCode> و History API
        </LI>
      </UL>
      <Callout kind="note" title="آگاه به middleware">
        plugin Next، matcherهای <InlineCode>middleware.ts</InlineCode> را می‌خواند و شرط‌های
        cookie/header را استخراج می‌کند، بنابراین مسیرهای محافظت‌شده به‌صورت یال شرطی نمایش داده
        می‌شوند.
      </Callout>

      <H2 id="react-router">React Router</H2>
      <P>
        <InlineCode>@route-intelligence/react-router</InlineCode> از React Router v6 و v7، از جمله
        data routerها و پیکربندی مسیرهای تو در تو پشتیبانی می‌کند.
      </P>
      <CodeBlock
        language="ts"
        code={`import { ReactRouterPlugin } from '@route-intelligence/react-router';

ReactRouterPlugin();`}
      />

      <H2 id="tanstack">TanStack Router</H2>
      <P>
        <InlineCode>@route-intelligence/tanstack</InlineCode> درخت مسیرهای file-based و code-based
        TanStack Router را می‌شناسد.
      </P>
      <CodeBlock
        language="ts"
        code={`import { TanStackPlugin } from '@route-intelligence/tanstack';

TanStackPlugin();`}
      />

      <H2 id="writing-a-plugin">نوشتن plugin خودتان</H2>
      <P>
        یک plugin interface <InlineCode>FrameworkPlugin</InlineCode> را از{' '}
        <InlineCode>@route-intelligence/shared</InlineCode> پیاده‌سازی می‌کند. اعلام می‌کند کدام فایل‌ها
        را claim می‌کند و nodeها و یال‌ها را به گراف مشترک اضافه می‌کند. چون قرارداد کوچک است، پشتیبانی
        از فریم‌ورک جدید — یا قرارداد داخلی — ساده است.
      </P>
      <P>
        <Strong>بعدی:</Strong> گراف را به ویرایشگر و CI در{' '}
        <LA href="/docs/integrations" locale={locale}>
          یکپارچه‌سازی‌ها
        </LA>{' '}
        وصل کنید.
      </P>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
