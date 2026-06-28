import type { Locale } from '../config';

export interface PageMeta {
  title: string;
  eyebrow: string;
  lead: string;
}

export type PageMetaByLocale = Record<Locale, PageMeta>;
