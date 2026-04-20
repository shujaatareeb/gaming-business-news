"use client";

import { useLang } from "./lang-provider";
import { getTranslation } from "@/lib/translations";

export function TranslatedTitle({ text, topicId }: { text: string; topicId: string }) {
  const { lang } = useLang();
  const idx = parseInt(topicId) - 1;
  const tr = lang !== "en" ? getTranslation(lang, idx) : null;

  return (
    <h1 className="hl hl-xl" style={{ margin: "10px 0 14px" }}>
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
    <div>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={i === 0 ? "drop-cap" : ""}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 18,
            lineHeight: 1.6,
            color: "var(--color-foreground)",
            margin: "0 0 20px",
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
