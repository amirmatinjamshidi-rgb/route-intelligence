import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  
  code: string;

  language?: string;

  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const trimmed = code.replace(/^\n+/, "").replace(/\n+$/, "");
  const label = filename ?? language;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-code-bg">
      {label ? (
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="font-mono text-xs text-ink-faint">{label}</span>
          <CopyButton value={trimmed} />
        </div>
      ) : (
        <div className="flex justify-end px-2 pt-2">
          <CopyButton value={trimmed} />
        </div>
      )}
      <pre className="scroll-rail overflow-x-auto px-4 pb-4 pt-2 text-sm leading-6">
        <code className="font-mono text-code-ink">{trimmed}</code>
      </pre>
    </div>
  );
}
