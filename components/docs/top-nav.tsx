import Link from "next/link";
import { Logo } from "@/components/logo";
import { GITHUB_URL } from "@/lib/navigation";
import { MobileNav } from "./mobile-nav";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-transparent backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <MobileNav />
          <Logo />
        </div>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/docs"
            className="rounded-lg px-3 py-1.5 text-ink-muted transition hover:bg-surface hover:text-ink"
          >
            Docs
          </Link>
          <Link
            href="/docs/cli"
            className="hidden rounded-lg px-3 py-1.5 text-ink-muted transition hover:bg-surface hover:text-ink sm:block"
          >
            CLI
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
  );
}
