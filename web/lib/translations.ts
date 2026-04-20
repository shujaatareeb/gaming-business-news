import type { LangCode } from "./i18n";

interface TopicTranslation {
  title: string;
  summary: string;
  body?: string;
}

// Pre-generated translations keyed by language code then article index
const data: Partial<Record<LangCode, Record<number, TopicTranslation>>> = {};

export function getTranslation(lang: LangCode, articleIndex: number): TopicTranslation | null {
  return data[lang]?.[articleIndex] || null;
}

export function setTranslations(lang: LangCode, translations: Record<number, TopicTranslation>) {
  data[lang] = translations;
}
