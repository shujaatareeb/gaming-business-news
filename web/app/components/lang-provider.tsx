"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type LangCode, LANGUAGES, t } from "@/lib/i18n";

interface LangContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: Parameters<typeof t>[1]) => string;
  isRTL: boolean;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => t("en", key),
  isRTL: false,
});

export function useLang() {
  return useContext(LangContext);
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  }, []);

  const translate = useCallback(
    (key: Parameters<typeof t>[1]) => t(lang, key),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t: translate, isRTL: lang === "ar" }}>
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
          <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
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
