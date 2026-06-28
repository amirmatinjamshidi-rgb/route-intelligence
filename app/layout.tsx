import type { Metadata } from 'next';
import { Geist, Geist_Mono, Vazirmatn } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic'],
});

export const metadata: Metadata = {
  title: {
    default: 'Route Intelligence',
    template: '%s · Route Intelligence',
  },
  icons: {
    icon: '/favicon.png',
  },
  description:
    'The React DevTools for routing — statically analyze React/Next.js apps and build a complete, typed graph of your routing architecture.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable}`}
    >
      <body className="min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
