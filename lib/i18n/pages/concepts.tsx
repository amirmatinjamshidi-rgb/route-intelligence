import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { H2, InlineCode, LI, P, Prose, Strong, UL } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'The Route Graph',
    eyebrow: 'Core Concepts',
    lead: "Everything Route Intelligence does is built on one idea: your app's routing is a directed graph. Routes are nodes, navigations are edges, and analysis is just graph traversal.",
  },
  fa: {
    title: 'گراف مسیر',
    eyebrow: 'مفاهیم اصلی',
    lead: 'همهٔ کارهای Route Intelligence بر یک ایده بنا شده: مسیریابی اپلیکیشن شما یک گراف جهت‌دار است. مسیرها node هستند، navigationها یال‌اند و تحلیل همان پیمایش گراف است.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="model">The model</H2>
      <P>
        The graph is a <Strong>typed, directed multigraph</Strong>. Each <Strong>node</Strong> is a
        routable thing (a page, layout, API handler, redirect, or external URL). Each{' '}
        <Strong>edge</Strong> is a relationship between them (a navigation, redirect, rewrite, or
        layout parent link).
      </P>
      <P>
        Because it is a real graph, you can answer questions algorithmically:{' '}
        <em>
          Is this route reachable? Does this redirect loop? What links here? What is the shortest
          path from the home page to checkout?
        </em>
      </P>

      <H2 id="pipeline">The analysis pipeline</H2>
      <P>
        A run flows through a series of stages. Each stage has one job and hands its result to the
        next, which makes the engine easy to reason about and extend.
      </P>
      <UL>
        <LI>
          <Strong>FileSystem</Strong> — discover candidate files from your include/exclude globs.
        </LI>
        <LI>
          <Strong>Parse</Strong> — load source into the TypeScript compiler via ts-morph.
        </LI>
        <LI>
          <Strong>Semantic</Strong> — classify files (client vs server component, runtime).
        </LI>
        <LI>
          <Strong>RouteDiscovery</Strong> — plugins map files to route nodes.
        </LI>
        <LI>
          <Strong>NavigationAnalysis</Strong> — find <InlineCode>{'<Link>'}</InlineCode>,{' '}
          <InlineCode>router.push</InlineCode>, <InlineCode>redirect()</InlineCode>, and more.
        </LI>
        <LI>
          <Strong>MiddlewareAnalysis</Strong> — read matchers, redirects, and rewrites.
        </LI>
        <LI>
          <Strong>ConditionalAnalysis</Strong> — capture auth/role/flag guards on edges.
        </LI>
        <LI>
          <Strong>StaticAnalysis</Strong> — produce diagnostics (dead routes, cycles, …).
        </LI>
        <LI>
          <Strong>Metrics</Strong> — compute counts, maintainability, and risk scores.
        </LI>
        <LI>
          <Strong>Output</Strong> — serialize and export.
        </LI>
      </UL>

      <H2 id="plugins">Plugins keep the core framework-agnostic</H2>
      <P>
        The core never imports React or any framework. A{' '}
        <LA href="/docs/frameworks" locale={locale}>
          plugin
        </LA>{' '}
        implements the <InlineCode>FrameworkPlugin</InlineCode> interface to teach the pipeline how
        a specific framework discovers routes and expresses navigation. You can run several plugins
        at once.
      </P>
      <CodeBlock
        language="tsx"
        filename="ri.config.ts"
        code={`import { defineConfig } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';

export default defineConfig({
  root: '.',
  plugins: [NextPlugin({ appDir: 'app', pagesDir: 'pages' })],
});`}
      />

      <H2 id="incremental">Incremental by design</H2>
      <P>
        Re-analyzing an entire app on every keystroke is wasteful. Route Intelligence hashes each
        file and tracks a dependency map, so <InlineCode>watch</InlineCode> mode only recomputes the
        part of the graph affected by a change and emits a <InlineCode>GraphPatch</InlineCode>.
      </P>
      <Callout kind="note" title="One model, many consumers">
        The CLI, VS Code extension, visualizer, ESLint plugin, and GitHub Action all read the same
        serialized graph. Learn its shape in{' '}
        <LA href="/docs/nodes-and-edges" locale={locale}>
          Nodes & Edges
        </LA>
        .
      </Callout>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <H2 id="model">مدل</H2>
      <P>
        گراف یک <Strong>multigraph جهت‌دار و تایپ‌شده</Strong> است. هر <Strong>node</Strong> یک
        موجودیت قابل مسیریابی است (صفحه، layout، API handler، redirect یا URL خارجی). هر{' '}
        <Strong>یال</Strong> رابطه‌ای بین آن‌هاست (navigation، redirect، rewrite یا پیوند والد
        layout).
      </P>
      <P>
        چون یک گراف واقعی است، می‌توانید به‌صورت الگوریتمی به سؤالات پاسخ دهید:{' '}
        <em>
          آیا این مسیر قابل دسترسی است؟ آیا این redirect حلقه می‌زند؟ چه چیزی به اینجا لینک دارد؟
          کوتاه‌ترین مسیر از صفحهٔ اصلی تا checkout چیست؟
        </em>
      </P>

      <H2 id="pipeline">pipeline تحلیل</H2>
      <P>
        هر اجرا از مراحل متوالی عبور می‌کند. هر مرحله یک وظیفه دارد و نتیجه را به مرحلهٔ بعد می‌دهد؛
        این باعث می‌شود موتور قابل فهم و توسعه باشد.
      </P>
      <UL>
        <LI>
          <Strong>FileSystem</Strong> — کشف فایل‌های کاندید از globهای include/exclude.
        </LI>
        <LI>
          <Strong>Parse</Strong> — بارگذاری سورس در کامپایلر TypeScript از طریق ts-morph.
        </LI>
        <LI>
          <Strong>Semantic</Strong> — طبقه‌بندی فایل‌ها (کامپوننت client در برابر server، runtime).
        </LI>
        <LI>
          <Strong>RouteDiscovery</Strong> — pluginها فایل‌ها را به nodeهای مسیر نگاشت می‌کنند.
        </LI>
        <LI>
          <Strong>NavigationAnalysis</Strong> — یافتن <InlineCode>{'<Link>'}</InlineCode>،{' '}
          <InlineCode>router.push</InlineCode>، <InlineCode>redirect()</InlineCode> و موارد دیگر.
        </LI>
        <LI>
          <Strong>MiddlewareAnalysis</Strong> — خواندن matcherها، redirectها و rewriteها.
        </LI>
        <LI>
          <Strong>ConditionalAnalysis</Strong> — ثبت guardهای auth/role/flag روی یال‌ها.
        </LI>
        <LI>
          <Strong>StaticAnalysis</Strong> — تولید diagnosticها (مسیرهای مرده، چرخه‌ها و …).
        </LI>
        <LI>
          <Strong>Metrics</Strong> — محاسبهٔ شمارش‌ها، maintainability و امتیاز ریسک.
        </LI>
        <LI>
          <Strong>Output</Strong> — سریال‌سازی و export.
        </LI>
      </UL>

      <H2 id="plugins">pluginها هسته را مستقل از فریم‌ورک نگه می‌دارند</H2>
      <P>
        هسته هرگز React یا هیچ فریم‌ورکی را import نمی‌کند. یک{' '}
        <LA href="/docs/frameworks" locale={locale}>
          plugin
        </LA>{' '}
        interface <InlineCode>FrameworkPlugin</InlineCode> را پیاده‌سازی می‌کند تا به pipeline بیاموزد
        یک فریم‌ورک خاص چگونه مسیرها را کشف و navigation را بیان می‌کند. می‌توانید چند plugin را همزمان
        اجرا کنید.
      </P>
      <CodeBlock
        language="tsx"
        filename="ri.config.ts"
        code={`import { defineConfig } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';

export default defineConfig({
  root: '.',
  plugins: [NextPlugin({ appDir: 'app', pagesDir: 'pages' })],
});`}
      />

      <H2 id="incremental">طراحی افزایشی</H2>
      <P>
        تحلیل مجدد کل اپلیکیشن با هر keystroke هدررفت است. Route Intelligence هر فایل را hash می‌کند
        و نقشهٔ وابستگی را ردیابی می‌کند، بنابراین حالت <InlineCode>watch</InlineCode> فقط بخشی از
        گراف که تحت تأثیر تغییر قرار گرفته را دوباره محاسبه می‌کند و یک{' '}
        <InlineCode>GraphPatch</InlineCode> منتشر می‌کند.
      </P>
      <Callout kind="note" title="یک مدل، مصرف‌کنندگان متعدد">
        CLI، افزونه VS Code، visualizer، plugin ESLint و GitHub Action همگی همان گراف سریال‌شده را
        می‌خوانند. ساختار آن را در{' '}
        <LA href="/docs/nodes-and-edges" locale={locale}>
          Nodeها و یال‌ها
        </LA>{' '}
        بشناسید.
      </Callout>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
