"use client";

import { useEffect, useState } from "react";
import { useLang } from "./lang-provider";

export function TranslatedTitle({ text }: { text: string }) {
  const { lang, translateContent } = useLang();
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lang === "en") { setTranslated(text); return; }
    let cancelled = false;
    setLoading(true);
    translateContent([text]).then((r) => {
      if (!cancelled) { setTranslated(r[0] || text); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [lang, text, translateContent]);

  return (
    <h1 className={`font-editorial text-3xl sm:text-4xl font-bold leading-tight mt-2 mb-5 transition-opacity ${loading ? "opacity-60" : ""}`}>
      {translated}
    </h1>
  );
}

export function ArticleBody({ body }: { body: string }) {
  const { lang, translateContent } = useLang();
  const [paragraphs, setParagraphs] = useState(body.split("\n\n"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const original = body.split("\n\n");
    if (lang === "en") { setParagraphs(original); return; }
    let cancelled = false;
    setLoading(true);
    translateContent(original).then((results) => {
      if (!cancelled) { setParagraphs(results); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [lang, body, translateContent]);

  return (
    <div className={`prose max-w-none transition-opacity ${loading ? "opacity-60" : ""}`}>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`${i === 0 ? "text-[17px] leading-[1.8] text-foreground/90 font-medium" : "text-[15px] leading-[1.8] text-muted"} mb-6`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
