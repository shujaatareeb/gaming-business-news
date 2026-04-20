"use client";

import { useLang } from "./lang-provider";
import { getTranslation } from "@/lib/translations";

/**
 * Hook to get translated topic content from pre-generated static translations.
 * Falls back to English (original) when translation unavailable.
 */
export function useTranslatedTopics(topics: { id?: string; title: string; summary: string; body?: string }[]) {
  const { lang } = useLang();

  if (lang === "en") {
    return {
      translations: topics.map((t) => ({ title: t.title, summary: t.summary, body: t.body })),
      loading: false,
    };
  }

  const translations = topics.map((t) => {
    const idx = t.id ? parseInt(t.id) - 1 : -1;
    const tr = idx >= 0 ? getTranslation(lang, idx) : null;
    return {
      title: tr?.title || t.title,
      summary: tr?.summary || t.summary,
      body: tr?.body || t.body,
    };
  });

  return { translations, loading: false };
}
