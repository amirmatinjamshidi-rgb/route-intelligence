import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { Logo } from "@/components/logo";
import { GITHUB_URL } from "@/lib/navigation";

const features = [
  {
    title: "A typed route graph",
    body: "Every route, layout, API handler, redirect, and navigation in one queryable model.",
  },
  {
    title: "Static diagnostics",
    body: "Dead routes, broken links, and redirect cycles — caught in CI, before runtime.",
  },
  {
    title: "Framework-agnostic core",
    body: "Next.js, React Router, and TanStack Router support via small, composable plugins.",
  },
  {
    title: "Visualize & document",
    body: "Export to Mermaid, PlantUML, DOT, HTML, or an interactive browser graph.",
  },
  {
    title: "Editor & CI integrations",
    body: "A CLI, VS Code extension, ESLint rules, and a GitHub Action for pull requests.",
  },
  {
    title: "Incremental by design",
    body: "Watch mode hashes files and only recomputes the part of the graph that changed.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/docs"
              className="rounded-lg px-3 py-1.5 text-ink-muted transition hover:bg-surface hover:text-ink"
            >
              Docs
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-3 py-1.5 text-ink-muted transition hover:bg-surface hover:text-ink"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
      
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-20 text-center sm:px-6 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Static routing analysis for React & Next.js
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            See your routing as a{" "}
            <span className="text-brand">graph</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
            Route Intelligence is the React DevTools for routing. It statically analyzes your
            codebase and builds a complete, typed graph of every route, layout, redirect, and
            navigation — without ever running your app.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-strong"
            >
              Read the docs
            </Link>
            <Link
              href="/docs/quick-start"
              className="rounded-full border border-line px-6 py-3 font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              Quick start
            </Link>
          </div>

          <div className="mx-auto mt-12 max-w-xl text-left">
            <CodeBlock
              language="bash"
              code={`npm install -D @route-intelligence/cli @route-intelligence/next
npx route-intelligence graph --port 3001`}
            />
          </div>
        </section>

      
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <h2 className="font-semibold text-ink">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

      
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface px-6 py-14 text-center">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink">
              Ready to map your routes?
            </h2>
            <p className="max-w-lg text-ink-muted">
              Install the CLI, run one command, and explore your app's routing in an interactive
              graph.
            </p>
            <Link
              href="/docs/installation"
              className="mt-2 rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-strong"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-ink-faint sm:flex-row sm:px-6">
          <Logo />
          <p>MIT licensed · Built on a typed route graph.</p>
        </div>
      </footer>
    </div>
  );
}
