"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { topics, tweets, stocks } from "@/lib/mock-data";
import { categoryColors } from "@/lib/constants";
import { buildTweetMap } from "@/lib/utils";
import { useLang } from "./lang-provider";

const tweetMap = buildTweetMap(tweets);

const trendingTopics = [...topics]
  .filter((t) => tweetMap.has(t.id))
  .sort((a, b) => (tweetMap.get(b.id)?.impressions || 0) - (tweetMap.get(a.id)?.impressions || 0))
  .slice(0, 5);

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLang();

  // Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const topicResults = topics
      .filter((t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q))
      .slice(0, 5)
      .map((t) => ({ type: "story" as const, id: t.id, title: t.title, subtitle: t.source, category: t.category, href: `/story/${t.id}` }));

    const stockResults = stocks
      .filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((s) => ({ type: "stock" as const, id: s.ticker, title: s.name, subtitle: `${s.ticker} · $${s.price.toFixed(2)}`, category: "", href: `/stocks/${s.ticker.toLowerCase()}` }));

    return [...topicResults, ...stockResults];
  }, [query]);

  const displayItems = query.trim()
    ? results
    : trendingTopics.map((t) => ({ type: "story" as const, id: t.id, title: t.title, subtitle: t.source, category: t.category, href: `/story/${t.id}` }));

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, displayItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && displayItems[selectedIndex]) {
      e.preventDefault();
      navigate(displayItems[selectedIndex].href);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 text-xs text-muted hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>{t("search")}</span>
        <kbd className="hidden md:inline text-[10px] text-muted-light bg-surface-alt border border-border px-1.5 py-0.5 rounded font-mono">
          {"\u2318"}K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[100]" onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101]">
        <div className="bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-5 border-b border-border">
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-12 text-sm bg-transparent focus:outline-none placeholder:text-muted-light"
            />
            <kbd className="text-[10px] text-muted-light border border-border px-1.5 py-0.5 rounded font-mono">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {!query.trim() && (
              <div className="px-5 pt-3 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{t("trending")}</span>
              </div>
            )}
            {query.trim() && results.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted">
                {t("noResults")} &ldquo;{query}&rdquo;
              </div>
            )}
            {displayItems.map((item, i) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => navigate(item.href)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full text-left px-5 py-3 flex items-center gap-3 transition ${
                  i === selectedIndex ? "bg-surface-alt" : ""
                }`}
              >
                <div className="w-6 h-6 rounded bg-surface-alt border border-border flex items-center justify-center shrink-0">
                  {item.type === "stock" ? (
                    <span className="text-[9px] font-bold text-muted">$</span>
                  ) : (
                    <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-light">
                    {item.category && (
                      <span className={`font-semibold uppercase tracking-wider ${categoryColors[item.category] || ""}`}>
                        {item.category}
                      </span>
                    )}
                    {item.category && <span>&middot;</span>}
                    <span>{item.subtitle}</span>
                  </div>
                </div>
                {i === selectedIndex && (
                  <kbd className="text-[10px] text-muted-light border border-border px-1.5 py-0.5 rounded font-mono shrink-0">
                    Enter
                  </kbd>
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 border-t border-border flex items-center gap-4 text-[10px] text-muted-light">
            <span className="flex items-center gap-1">
              <kbd className="border border-border px-1 py-0.5 rounded font-mono">↑↓</kbd> {t("navigate")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border border-border px-1 py-0.5 rounded font-mono">↵</kbd> {t("open")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border border-border px-1 py-0.5 rounded font-mono">esc</kbd> {t("close")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
