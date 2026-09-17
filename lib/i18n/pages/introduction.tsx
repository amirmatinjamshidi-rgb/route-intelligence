import { Callout } from '@/components/docs/callout';
import { CardGrid } from '@/components/docs/card';
import { H2, InlineCode, LI, P, Prose, Strong, UL } from '@/components/docs/content';
import type { Locale } from '@/lib/i18n/config';
import { LA, LCard } from '@/lib/i18n/localized';
import type { PageMetaByLocale } from './types';

const meta: PageMetaByLocale = {
  en: {
    title: 'Introduction',
    eyebrow: 'Get Started',
    lead: 'Route Intelligence is the React DevTools for routing. It statically analyzes your React and Next.js codebase and builds a complete, typed graph of every route, layout, redirect, and navigation in your app.',
  },
  fa: {
    title: 'این چیه اصلاً؟',
    eyebrow: 'اول کار',
    lead: 'یه جورایی DevTools روتینگ برای Reactـه. کد Next/React رو می‌خونه، از هر روت و layout و لینک یه گراف می‌سازه — اپ رو روشن نمی‌کنه.',
  },
};

export function getMeta(locale: Locale) {
  return meta[locale];
}

function ContentEn({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <P>
        Modern apps spread routing across dozens of files: pages, layouts, middleware, and{' '}
        <InlineCode>{'<Link>'}</InlineCode> calls scattered through components. Route Intelligence
        reads all of it <Strong>without running your app</Strong> and turns it into a single graph
        you can query, visualize, lint, and document.
      </P>

      <H2 id="what-you-get">What you get</H2>
      <UL>
        <LI>
          <Strong>A typed route graph</Strong> — every route, layout, API handler, redirect, and
          navigation edge in one model.
        </LI>
        <LI>
          <Strong>Static diagnostics</Strong> — dead routes, broken links, redirect cycles, and
          missing error boundaries, caught before runtime.
        </LI>
        <LI>
          <Strong>Visualizations & docs</Strong> — export to Mermaid, PlantUML, DOT, HTML, JSON, or
          an interactive browser graph.
        </LI>
        <LI>
          <Strong>Ecosystem integrations</Strong> — a CLI, VS Code extension, ESLint rules, a GitHub
          Action, and Playwright test generation.
        </LI>
      </UL>

      <H2 id="how-it-works">How it works</H2>
      <P>
        The core engine never depends on React. Instead, framework support is provided through{' '}
        <Strong>plugins</Strong> (Next.js, React Router, TanStack Router). A plugin teaches the
        analyzer how a framework maps files to routes; the core handles parsing, graph building,
        analysis, and export. Everything flows through one shared, typed graph model.
      </P>

      <Callout kind="note" title="Static, not runtime">
        Route Intelligence uses{' '}
        <LA href="https://ts-morph.com" locale={locale}>
          ts-morph
        </LA>{' '}
        to read your source with the TypeScript compiler. It never executes your code, so it is safe
        to run in CI and on untrusted branches.
      </Callout>

      <H2 id="next-steps">Next steps</H2>
      <CardGrid>
        <LCard href="/docs/installation" locale={locale} title="Installation">
          Add Route Intelligence to your project with npm, Yarn, or Bun.
        </LCard>
        <LCard href="/docs/quick-start" locale={locale} title="Quick Start">
          Analyze your routes and open the graph in under a minute.
        </LCard>
        <LCard href="/docs/concepts" locale={locale} title="The Route Graph">
          Understand the model that powers everything else.
        </LCard>
        <LCard href="/docs/cli" locale={locale} title="CLI Commands">
          The full command reference: analyze, graph, doctor, and more.
        </LCard>
      </CardGrid>
    </Prose>
  );
}

function ContentFa({ locale }: { locale: Locale }) {
  return (
    <Prose>
      <P>
        روت تو اپ امروزی همه‌جا پخشه: page، layout، middleware، یه عالمه{' '}
        <InlineCode>{'<Link>'}</InlineCode> تو کامپوننت‌ها. این ابزار همه‌شون رو{' '}
        <Strong>بدون روشن کردن اپ</Strong> می‌خونه و می‌ریزه تو یه گراف — سرچ کن، ببین، lint بزن، داک
        بساز.
      </P>

      <H2 id="what-you-get">چی گیرت میاد</H2>
      <UL>
        <LI>
          <Strong>گراف تایپ‌شده</Strong> — روت، layout، API، redirect، لینک؛ همه‌ش یه جا.
        </LI>
        <LI>
          <Strong>هشدار قبل از اجرا</Strong> — روت مرده، لینک شکسته، حلقه redirect، error boundary
          جاافتاده.
        </LI>
        <LI>
          <Strong>نمودار و داک</Strong> — Mermaid، PlantUML، DOT، HTML، JSON یا گراف تو مرورگر.
        </LI>
        <LI>
          <Strong>ابزار دور و بر</Strong> — CLI، VS Code، ESLint، GitHub Action، تست Playwright.
        </LI>
      </UL>

      <H2 id="how-it-works">چطور کار می‌کنه</H2>
      <P>
        هسته به React قفل نیست. فریم‌ورک با <Strong>plugin</Strong> میاد (Next، React Router،
        TanStack). پلاگین می‌گه فایل‌ها چی‌جور روت می‌شن؛ هسته parse می‌کنه، گراف می‌سازه، تحلیل می‌کنه،
        export می‌ده. همه‌چیز از یه مدل مشترک رد می‌شه.
      </P>

      <Callout kind="note" title="استاتیکه، اجرا نمی‌کنه">
        با{' '}
        <LA href="https://ts-morph.com" locale={locale}>
          ts-morph
        </LA>{' '}
        و کامپایلر TypeScript سورس رو می‌خونه. کدت اجرا نمی‌شه؛ تو CI و روی branch غریبه هم خیالت
        راحته.
      </Callout>

      <H2 id="next-steps">بعدش چی</H2>
      <CardGrid>
        <LCard href="/docs/installation" locale={locale} title="نصب">
          معمولاً فقط CLI کافیه. npm / Yarn / Bun.
        </LCard>
        <LCard href="/docs/quick-start" locale={locale} title="زود شروع کن">
          اسکن کن، زیر یه دقیقه گراف رو باز کن.
        </LCard>
        <LCard href="/docs/concepts" locale={locale} title="گراف روت">
          مدلی که همه‌چیز روش سواره.
        </LCard>
        <LCard href="/docs/cli" locale={locale} title="دستورات CLI">
          analyze، graph، doctor و اینا.
        </LCard>
      </CardGrid>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
