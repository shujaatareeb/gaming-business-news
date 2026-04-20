import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { LANGUAGES } from "@/lib/i18n";

let _client: OpenAI | null = null;
function getClient() {
  if (!_client) _client = new OpenAI();
  return _client;
}

// In-memory cache to avoid re-translating the same content
const cache = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const { texts, targetLang } = await req.json();

    if (!texts || !targetLang || targetLang === "en") {
      return NextResponse.json({ translations: texts });
    }

    const langLabel = LANGUAGES.find((l) => l.code === targetLang)?.label || targetLang;

    // Check cache
    const results: string[] = [];
    const toTranslate: { index: number; text: string }[] = [];

    for (let i = 0; i < texts.length; i++) {
      const cacheKey = `${targetLang}:${texts[i]}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        results[i] = cached;
      } else {
        results[i] = "";
        toTranslate.push({ index: i, text: texts[i] });
      }
    }

    if (toTranslate.length === 0) {
      return NextResponse.json({ translations: results });
    }

    // Batch translate
    const numbered = toTranslate.map((t, i) => `[${i}] ${t.text}`).join("\n");

    const response = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate text to ${langLabel}. Keep proper nouns, company names, ticker symbols, and numbers unchanged. Only return the translations with their [number] prefix, nothing else.`,
        },
        {
          role: "user",
          content: numbered,
        },
      ],
    });

    const translated = response.choices[0]?.message?.content || "";
    const lines = translated.split("\n").filter((l) => l.trim());

    for (const line of lines) {
      const match = line.match(/^\[(\d+)\]\s*(.+)/);
      if (match) {
        const idx = parseInt(match[1]);
        const text = match[2].trim();
        if (idx < toTranslate.length) {
          const origIndex = toTranslate[idx].index;
          results[origIndex] = text;
          cache.set(`${targetLang}:${toTranslate[idx].text}`, text);
        }
      }
    }

    // Keep cache bounded
    if (cache.size > 2000) {
      const keys = Array.from(cache.keys());
      for (let i = 0; i < 500; i++) cache.delete(keys[i]);
    }

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
