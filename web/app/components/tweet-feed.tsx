"use client";

import type { Tweet } from "@/lib/mock-data";
import { useLang } from "./lang-provider";
import { useTranslatedTopics } from "./translated-text";

export function TweetFeed({ tweets }: { tweets: Tweet[] }) {
  const { t } = useLang();
  const { translations, loading } = useTranslatedTopics(
    tweets.map((tw) => ({ title: tw.text, summary: "" }))
  );

  return (
    <div className="space-y-4">
      {tweets.map((tweet, i) => (
        <blockquote key={tweet.id} className="border-l-2 border-border pl-4 py-1 hover:border-accent transition-colors">
          <p className={`text-[13px] text-foreground/85 leading-relaxed line-clamp-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
            {translations[i]?.title || tweet.text}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-light">
            <span>{tweet.likes} {t("likes")}</span>
            <span>&middot;</span>
            <a href={tweet.tweetUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {t("view")}
            </a>
          </div>
        </blockquote>
      ))}
    </div>
  );
}
