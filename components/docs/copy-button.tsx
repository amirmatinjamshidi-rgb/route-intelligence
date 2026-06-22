"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (e.g. non-secure context) — fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-line bg-bg px-2 py-1 font-mono text-xs text-ink-muted transition hover:border-brand hover:text-brand"
      aria-label="Copy code to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
