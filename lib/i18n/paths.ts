import { type Locale, defaultLocale, isLocale } from './config';

export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    const rest = segments.slice(1);
    return {
      locale: first,
      path: rest.length ? `/${rest.join('/')}` : '/',
    };
  }

  return { locale: defaultLocale, path: pathname || '/' };
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const { path } = stripLocale(pathname);
  return localizePath(path, targetLocale);
}
