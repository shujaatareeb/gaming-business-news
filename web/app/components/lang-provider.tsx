"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { type LangCode, LANGUAGES, t } from "@/lib/i18n";

interface LangContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: Parameters<typeof t>[1]) => string;
  isRTL: boolean;
  translateContent: (texts: string[]) => Promise<string[]>;
  contentCache: Map<string, string>;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => t("en", key),
  isRTL: false,
  translateContent: async (texts) => texts,
  contentCache: new Map(),
});

export function useLang() {
  return useContext(LangContext);
}

function detectLocale(): LangCode {
  if (typeof navigator === "undefined") return "en";
  const browserLang = navigator.language?.toLowerCase() || "";
  const code = browserLang.split("-")[0];
  const supported = LANGUAGES.find((l) => l.code === code);
  return supported ? supported.code : "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");
  const contentCacheRef = useRef(new Map<string, string>());
  const pendingRef = useRef<AbortController | null>(null);

  // Auto-detect locale on mount
  useEffect(() => {
    const detected = detectLocale();
    if (detected !== "en") {
      setLangState(detected);
      document.documentElement.dir = detected === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    // Clear content cache on language change
    contentCacheRef.current = new Map();
  }, []);

  const translate = useCallback(
    (key: Parameters<typeof t>[1]) => t(lang, key),
    [lang]
  );

  const translateContent = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (lang === "en") return texts;

      // Check what's already cached
      const results: string[] = new Array(texts.length);
      const uncached: { index: number; text: string }[] = [];

      for (let i = 0; i < texts.length; i++) {
        const key = `${lang}:${texts[i]}`;
        if (contentCacheRef.current.has(key)) {
          results[i] = contentCacheRef.current.get(key)!;
        } else {
          results[i] = texts[i]; // fallback to original
          uncached.push({ index: i, text: texts[i] });
        }
      }

      if (uncached.length === 0) return results;

      // Cancel previous request
      if (pendingRef.current) pendingRef.current.abort();
      const controller = new AbortController();
      pendingRef.current = controller;

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            texts: uncached.map((u) => u.text),
            targetLang: lang,
          }),
          signal: controller.signal,
        });

        if (!res.ok) return results;
        const data = await res.json();

        if (data.translations) {
          for (let i = 0; i < uncached.length; i++) {
            if (data.translations[i]) {
              results[uncached[i].index] = data.translations[i];
              const key = `${lang}:${uncached[i].text}`;
              contentCacheRef.current.set(key, data.translations[i]);
            }
          }
        }

        return results;
      } catch {
        return results;
      }
    },
    [lang]
  );

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang,
        t: translate,
        isRTL: lang === "ar",
        translateContent,
        contentCache: contentCacheRef.current,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 transition"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-[160px] py-1 animate-fade-in">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 transition ${
                  l.code === lang
                    ? "bg-surface-alt text-foreground font-medium"
                    : "text-muted hover:bg-surface-alt hover:text-foreground"
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
