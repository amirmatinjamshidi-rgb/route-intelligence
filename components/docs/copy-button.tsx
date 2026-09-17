'use client';

import { useLocale } from '@/components/locale-provider';
import { getUi } from '@/lib/i18n/ui';
import { useState } from 'react';

export function CopyButton({ value }: { value: string }) {
  const locale = useLocale();
  const ui = getUi(locale);
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
      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-ink-faint transition hover:border-brand/40 hover:text-brand"
      aria-label={ui.copy}
    >
      {copied ? ui.copied : ui.copy}
    </button>
  );
}
