import Link from 'next/link';

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold text-ink">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label="Route Intelligence Logo"
        className="text-brand shrink-0"
      >
        <path
          d="M4 17L9 12L14 15L18 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="17" r="2" fill="white" stroke="currentColor" strokeWidth="2" />
        <circle cx="9" cy="12" r="1.5" fill="currentColor" opacity="0.9" />
        <circle cx="14" cy="15" r="1.5" fill="currentColor" opacity="0.9" />
        <path
          d="M18 3.5C16.34 3.5 15 4.84 15 6.5C15 8.83 18 12 18 12C18 12 21 8.83 21 6.5C21 4.84 19.66 3.5 18 3.5Z"
          fill="currentColor"
        />
        <circle cx="18" cy="6.5" r="0.9" fill="white" />
      </svg>
      <span>
        Route<span className="text-brand">Intelligence</span>
      </span>
    </Link>
  );
}
