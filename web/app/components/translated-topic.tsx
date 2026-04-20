"use client";

import { useLang } from "./lang-provider";
import { getTranslation } from "@/lib/translations";

/**
 * Renders topic title/summary with instant translation swap.
 * Wraps any text that needs to change when language switches.
 */
export function T({ topicId, field }: { topicId: string; field: "title" | "summary" }) {
  const { lang } = useLang();
  if (lang === "en") return null; // Server-rendered English is already there
  const idx = parseInt(topicId) - 1;
  const tr = getTranslation(lang, idx);
  if (!tr) return null;
  return <>{tr[field]}</>;
}

/**
 * Shows either the translated text or the fallback (English).
 */
export function TText({ topicId, field, fallback }: { topicId: string; field: "title" | "summary"; fallback: string }) {
  const { lang } = useLang();
  if (lang === "en") return <>{fallback}</>;
  const idx = parseInt(topicId) - 1;
  const tr = getTranslation(lang, idx);
  return <>{tr?.[field] || fallback}</>;
}
