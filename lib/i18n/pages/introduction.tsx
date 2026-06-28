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
    title: 'معرفی',
    eyebrow: 'شروع کار',
    lead: 'Route Intelligence همان DevTools مسیریابی برای React است. این ابزار به‌صورت استاتیک کدبیس React و Next.js شما را تحلیل می‌کند و گراف کامل و تایپ‌شده‌ای از هر مسیر، layout، redirect و navigation در اپلیکیشن می‌سازد.',
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
        اپلیکیشن‌های مدرن مسیریابی را در ده‌ها فایل پراکنده می‌کنند: صفحات، layoutها، middleware و
        فراخوانی‌های <InlineCode>{'<Link>'}</InlineCode> در سراسر کامپوننت‌ها. Route Intelligence همهٔ
        این‌ها را <Strong>بدون اجرای اپلیکیشن</Strong> می‌خواند و به یک گراف واحد تبدیل می‌کند که
        می‌توانید آن را جستجو، مصورسازی، lint و مستند کنید.
      </P>

      <H2 id="what-you-get">چه چیزی به دست می‌آورید</H2>
      <UL>
        <LI>
          <Strong>گراف مسیر تایپ‌شده</Strong> — هر مسیر، layout، API handler، redirect و یال
          navigation در یک مدل.
        </LI>
        <LI>
          <Strong>تشخیص استاتیک</Strong> — مسیرهای مرده، لینک‌های شکسته، چرخه‌های redirect و error
          boundaryهای گم‌شده، قبل از runtime شناسایی می‌شوند.
        </LI>
        <LI>
          <Strong>مصورسازی و مستندات</Strong> — خروجی به Mermaid، PlantUML، DOT، HTML، JSON یا گراف
          تعاملی مرورگر.
        </LI>
        <LI>
          <Strong>یکپارچه‌سازی‌های اکوسیستم</Strong> — CLI، افزونه VS Code، قوانین ESLint، GitHub
          Action و تولید تست Playwright.
        </LI>
      </UL>

      <H2 id="how-it-works">چگونه کار می‌کند</H2>
      <P>
        موتور اصلی هرگز به React وابسته نیست. در عوض، پشتیبانی از فریم‌ورک‌ها از طریق{' '}
        <Strong>plugins</Strong> (Next.js، React Router، TanStack Router) فراهم می‌شود. هر plugin به
        تحلیل‌گر می‌آموزد که یک فریم‌ورک چگونه فایل‌ها را به مسیر نگاشت می‌کند؛ هستهٔ اصلی parsing، ساخت
        گراف، تحلیل و export را انجام می‌دهد. همهٔ جریان‌ها از یک مدل گراف مشترک و تایپ‌شده عبور می‌کنند.
      </P>

      <Callout kind="note" title="استاتیک، نه runtime">
        Route Intelligence از{' '}
        <LA href="https://ts-morph.com" locale={locale}>
          ts-morph
        </LA>{' '}
        برای خواندن سورس با کامپایلر TypeScript استفاده می‌کند. هرگز کد شما را اجرا نمی‌کند، بنابراین
        اجرای آن در CI و روی branchهای ناشناخته امن است.
      </Callout>

      <H2 id="next-steps">گام‌های بعدی</H2>
      <CardGrid>
        <LCard href="/docs/installation" locale={locale} title="نصب">
          Route Intelligence را با npm، Yarn یا Bun به پروژه اضافه کنید.
        </LCard>
        <LCard href="/docs/quick-start" locale={locale} title="شروع سریع">
          مسیرها را تحلیل کنید و گراف را در کمتر از یک دقیقه باز کنید.
        </LCard>
        <LCard href="/docs/concepts" locale={locale} title="گراف مسیر">
          مدلی را بشناسید که همهٔ قابلیت‌ها بر پایهٔ آن ساخته شده‌اند.
        </LCard>
        <LCard href="/docs/cli" locale={locale} title="دستورات CLI">
          مرجع کامل دستورات: analyze، graph، doctor و بیشتر.
        </LCard>
      </CardGrid>
    </Prose>
  );
}

export function Content({ locale }: { locale: Locale }) {
  if (locale === 'fa') return <ContentFa locale={locale} />;
  return <ContentEn locale={locale} />;
}
