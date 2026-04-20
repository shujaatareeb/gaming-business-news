import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { topics, tweets } from "@/lib/mock-data";
import { categoryColors, SITE_NAME, SITE_URL } from "@/lib/constants";
import { NewsArticleSchema, BreadcrumbSchema } from "@/app/components/json-ld";
import { ArticleBody, TranslatedTitle } from "@/app/components/article-body";

export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const topic = topics.find((t) => t.id === id);
  if (!topic) return {};

  return {
    title: `${topic.title} | ${SITE_NAME}`,
    description: topic.summary,
    alternates: { canonical: `${SITE_URL}/story/${topic.id}` },
    openGraph: {
      title: topic.title,
      description: topic.summary,
      url: `${SITE_URL}/story/${topic.id}`,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: topic.published,
      images: [{ url: topic.image, width: 800, height: 450, alt: topic.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.summary,
      images: [topic.image],
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = topics.find((t) => t.id === id);
  if (!topic) notFound();

  const tweet = tweets.find((t) => t.topicId === topic.id);
  const related = topics.filter((t) => t.id !== topic.id && t.category === topic.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <NewsArticleSchema topic={topic} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: topic.category, url: "/" },
        { name: topic.title, url: `/story/${topic.id}` },
      ]} />
      {/* Nav */}
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/">
            <span className="font-editorial text-2xl font-bold tracking-tight text-foreground">
              GAMEPULSE
            </span>
          </Link>
          <Link href="/" className="text-[13px] text-muted hover:text-foreground transition">
            Back to news
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 py-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article */}
          <article className="lg:col-span-2">
            {/* Hero image */}
            <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-6 bg-surface-alt">
              <Image
                src={topic.image}
                alt={topic.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>

            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}
            >
              {topic.category}
            </span>

            <TranslatedTitle text={topic.title} />

            <div className="flex items-center gap-3 text-xs text-muted-light mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-[10px] font-bold text-surface">
                  GP
                </div>
                <div>
                  <span className="font-semibold text-foreground block text-[13px] leading-tight">GamePulse Editorial</span>
                  <span className="text-[11px]">Gaming Business Intelligence</span>
                </div>
              </div>
              <span className="text-border-strong">|</span>
              <time dateTime={topic.published}>
                {new Date(topic.published).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="border-b border-border mb-8" />

            <ArticleBody body={topic.body} />

            {/* Tweet card */}
            {tweet && (
              <div className="mt-8 border border-border rounded-lg bg-surface p-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">
                  Our Take on X
                </div>
                <blockquote className="text-[15px] leading-relaxed text-foreground/85 italic mb-4">
                  &ldquo;{tweet.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-5 text-xs text-muted">
                  <span>{tweet.impressions.toLocaleString()} views</span>
                  <span>{tweet.likes} likes</span>
                  <span>{tweet.retweets} reposts</span>
                  <a
                    href={tweet.tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline ml-auto"
                  >
                    View on X
                  </a>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside>
            {related.length > 0 && (
              <div className="sticky top-20">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    Related Stories
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-5">
                  {related.map((t) => (
                    <article key={t.id}>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[t.category] || "text-accent"}`}
                      >
                        {t.category}
                      </span>
                      <h3 className="text-sm font-bold leading-snug mt-1 mb-1">
                        <Link
                          href={`/story/${t.id}`}
                          className="hover:underline decoration-1 underline-offset-2"
                        >
                          {t.title}
                        </Link>
                      </h3>
                      <span className="text-[11px] text-muted-light">{t.source}</span>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
