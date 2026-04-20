"use client";

import { useLang } from "./lang-provider";
import { getTranslation } from "@/lib/translations";

export function TranslatedTitle({ text, topicId }: { text: string; topicId: string }) {
  const { lang } = useLang();
  const idx = parseInt(topicId) - 1;
  const tr = lang !== "en" ? getTranslation(lang, idx) : null;

  return (
    <h1 className="font-editorial text-3xl sm:text-4xl font-bold leading-tight mt-2 mb-5">
      {tr?.title || text}
    </h1>
  );
}

export function ArticleBody({ body, topicId }: { body: string; topicId: string }) {
  const { lang } = useLang();
  const idx = parseInt(topicId) - 1;
  const tr = lang !== "en" ? getTranslation(lang, idx) : null;
  const displayBody = tr?.body || body;
  const paragraphs = displayBody.split("\n\n");

  return (
    <div className="prose max-w-none">
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
