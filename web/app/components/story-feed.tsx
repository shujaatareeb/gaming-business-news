"use client";

import Link from "next/link";
import Image from "next/image";
import { type Topic, type Tweet } from "@/lib/mock-data";
import { categoryColors } from "@/lib/constants";
import { readTime } from "@/lib/utils";
import { useTranslatedTopics } from "./translated-text";
import { SectionLabel } from "./section-label";

export function LeadStory({ topic }: { topic: Topic }) {
  const { translations, loading } = useTranslatedTopics([topic]);
  const t = translations[0];

  return (
    <article className="pb-8 mb-8 border-b border-border animate-fade-in">
      <Link href={`/story/${topic.id}`} className="block relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-5 bg-surface-alt">
        <Image
          src={topic.image}
          alt={topic.title}
          fill
          className="object-cover hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
      </Link>
      <span className={`text-[11px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
        {topic.category}
      </span>
      <h2 className={`font-editorial text-[2rem] sm:text-[2.5rem] leading-[1.1] font-bold mt-2 mb-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
        <Link href={`/story/${topic.id}`} className="hover:underline decoration-1 underline-offset-4 transition-colors">
          {t.title}
        </Link>
      </h2>
      <p className={`text-[15px] text-muted leading-relaxed mb-4 max-w-2xl transition-opacity ${loading ? "opacity-60" : ""}`}>
        {t.summary}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-light">
        <span className="font-medium text-muted">{topic.source}</span>
        <span>&middot;</span>
        <span>{readTime(topic.body || topic.summary)}</span>
      </div>
    </article>
  );
}

export function StoryList({ topics }: { topics: Topic[] }) {
  const { translations, loading } = useTranslatedTopics(topics);

  return (
    <div>
      <SectionLabel labelKey="latest" />
      <div className="divide-y divide-border">
        {topics.map((topic, i) => {
          const t = translations[i];
          return (
            <article key={topic.id} className="py-5 first:pt-0 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex gap-5">
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                    {topic.category}
                  </span>
                  <h3 className={`font-editorial text-xl font-bold leading-snug mt-1 mb-2 transition-opacity ${loading ? "opacity-60" : ""}`}>
                    <Link href={`/story/${topic.id}`} className="hover:text-accent transition-colors decoration-1 underline-offset-2">
                      {t.title}
                    </Link>
                  </h3>
                  <p className={`text-sm text-muted leading-relaxed line-clamp-2 mb-2 transition-opacity ${loading ? "opacity-60" : ""}`}>
                    {t.summary}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-light">
                    <span className="font-medium text-muted">{topic.source}</span>
                    <span>&middot;</span>
                    <span>{readTime(topic.body || topic.summary)}</span>
                  </div>
                </div>

                <Link href={`/story/${topic.id}`} className="hidden sm:block relative w-40 h-24 rounded-lg overflow-hidden bg-surface-alt shrink-0 group">
                  <Image
                    src={topic.image}
                    alt={topic.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="160px"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function TrendingList({ topics }: { topics: Topic[] }) {
  const { translations, loading } = useTranslatedTopics(topics);

  return (
    <ol className="space-y-4">
      {topics.map((topic, i) => {
        const t = translations[i];
        return (
          <li key={topic.id} className="flex gap-3 group">
            <span className="text-2xl font-editorial font-bold text-border-strong leading-none transition-colors group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className={`text-sm font-bold leading-snug transition-opacity ${loading ? "opacity-60" : ""}`}>
                <Link href={`/story/${topic.id}`} className="hover:text-accent transition-colors">
                  {t.title}
                </Link>
              </h3>
              <span className="text-[11px] text-muted-light">{topic.source}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
