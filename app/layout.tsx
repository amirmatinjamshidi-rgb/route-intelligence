import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono, Vazirmatn } from 'next/font/google';
import './globals.css';

const ibmPlex = IBM_Plex_Sans({
  variable: '--font-ibm-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
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
      className={`${ibmPlex.variable} ${jetbrains.variable} ${vazirmatn.variable}`}
    >
      <body className="min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
