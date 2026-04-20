"use client";

import { useEffect, useState } from "react";
import { useLang } from "./lang-provider";

/**
 * Renders text that auto-translates when the language changes.
 * Shows original text immediately, then swaps in translation once ready.
 */
export function TranslatedText({
  text,
  as: Tag = "span",
  className,
}: {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  className?: string;
}) {
  const { lang, translateContent } = useLang();
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lang === "en") {
      setTranslated(text);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translateContent([text]).then((results) => {
      if (!cancelled && results[0]) {
        setTranslated(results[0]);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [lang, text, translateContent]);

  return (
    <Tag className={`${className || ""} ${loading && lang !== "en" ? "opacity-70" : ""} transition-opacity`}>
      {translated}
    </Tag>
  );
}

/**
 * Translates a batch of story cards (more efficient — single API call).
 */
export function useTranslatedTopics(topics: { title: string; summary: string }[]) {
  const { lang, translateContent } = useLang();
  const [translations, setTranslations] = useState<{ title: string; summary: string }[]>(topics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lang === "en") {
      setTranslations(topics);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Batch all titles and summaries into one API call
    const allTexts = topics.flatMap((t) => [t.title, t.summary]);

    translateContent(allTexts).then((results) => {
      if (cancelled) return;
      const translated = topics.map((_, i) => ({
        title: results[i * 2] || topics[i].title,
        summary: results[i * 2 + 1] || topics[i].summary,
      }));
      setTranslations(translated);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [lang, translateContent]); // intentionally omit topics to avoid infinite loop

  return { translations, loading };
}
