import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { topics, tweets } from "@/lib/mock-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { topicReadTime } from "@/lib/utils";
import { NewsArticleSchema, BreadcrumbSchema } from "@/app/components/json-ld";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { ArticleBody, TranslatedTitle } from "@/app/components/article-body";
import { TText } from "@/app/components/translated-topic";

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
    openGraph: { title: topic.title, description: topic.summary, url: `${SITE_URL}/story/${topic.id}`, siteName: SITE_NAME, type: "article", publishedTime: topic.published, images: [{ url: topic.image, width: 800, height: 450, alt: topic.title }] },
    twitter: { card: "summary_large_image", title: topic.title, description: topic.summary, images: [topic.image] },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = topics.find((t) => t.id === id);
  if (!topic) notFound();

  const tweet = tweets.find((t) => t.topicId === topic.id);
  const related = topics.filter((t) => t.id !== topic.id && t.category === topic.category).slice(0, 4);
  const authorInitials = "GP";

  return (
    <>
      <Header />
      <NewsArticleSchema topic={topic} />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: topic.category, url: "/" }, { name: topic.title, url: `/story/${topic.id}` }]} />

      <div className="max-w-[1360px] mx-auto px-5">
        {/* Back bar */}
        <div className="flex justify-between items-center py-3.5 border-t-2 border-b border-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
          <Link href="/" className="text-foreground hover:text-accent transition-colors">← Back to home</Link>
          <span style={{ color: "var(--color-muted)" }}>
            {topic.category.toUpperCase()} · {new Date(topic.published).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()} · {topicReadTime(topic)}
          </span>
        </div>

        {/* 3-column story layout */}
        <div className="grid grid-cols-[220px_minmax(0,720px)_260px] gap-12 justify-center py-8">

          {/* Left rail */}
          <aside style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.04em" }}>
            <div className="py-3.5">
              <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-foreground mb-1.5">Share</label>
              <div className="flex flex-col gap-1.5 mt-1">
                {["Twitter / X", "LinkedIn", "Copy link", "Email"].map((s) => (
                  <a key={s} href="#" className="flex justify-between items-center py-1.5 text-[11px] text-foreground tracking-[0.08em] uppercase font-semibold border-b border-dashed border-border-strong hover:text-accent transition-colors">
                    {s} <span>↗</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="py-3.5 border-t border-border">
              <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-foreground mb-1.5">Read time</label>
              <div className="font-editorial text-[22px] font-bold text-foreground tracking-tight">{topicReadTime(topic)}</div>
            </div>
            <div className="py-3.5 border-t border-border">
              <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-foreground mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[10px] px-2 py-0.5 border border-border-strong text-foreground tracking-[0.06em] uppercase font-semibold">{topic.category}</span>
              </div>
            </div>
          </aside>

          {/* Body */}
          <article>
            <span className="kicker">{topic.category}</span>
            <TranslatedTitle text={topic.title} topicId={topic.id} />

            {/* Story dek */}
            <p className="font-editorial italic font-medium text-[22px] leading-[1.3] mb-5 tracking-tight" style={{ color: "var(--color-ink-2)" }}>
              <TText topicId={topic.id} field="summary" fallback={topic.summary} />
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3.5 pb-3.5 border-b border-foreground mb-5" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center font-editorial font-bold text-sm" style={{ background: "var(--color-surface-band)", color: "var(--color-foreground)" }}>
                {authorInitials}
              </span>
              <span>By <strong className="text-foreground">GamePulse Editorial</strong></span>
              <span>·</span>
              <time dateTime={topic.published}>
                {new Date(topic.published).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
              </time>
            </div>

            {/* Hero image */}
            {topic.image && (
              <>
                <div className="relative w-full aspect-[16/9] overflow-hidden mb-2.5">
                  <Image src={topic.image} alt={topic.title} fill className="object-cover" sizes="720px" priority />
                </div>
                <div className="pb-4 mb-6 border-b border-border" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)" }}>
                  Photo: GamePulse illustration
                </div>
              </>
            )}

            {/* Article body */}
            <ArticleBody body={topic.body} topicId={topic.id} />

            {/* Tweet card */}
            {tweet && (
              <blockquote className="my-7 py-3 px-5 border-l-[3px] border-accent font-editorial italic text-[22px] leading-[1.35]">
                &ldquo;{tweet.text}&rdquo;
                <cite className="block mt-2.5 not-italic" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  — GamePulse on X · {tweet.likes} likes
                </cite>
              </blockquote>
            )}
          </article>

          {/* Right rail */}
          <aside style={{ fontFamily: "var(--font-sans)" }}>
            {/* Related */}
            <div className="pt-3.5 border-t-[3px] border-foreground">
              <h4 className="text-[10px] font-bold tracking-[0.18em] uppercase text-foreground mb-2.5">More {topic.category}</h4>
              {related.map((r) => (
                <article key={r.id} className="py-2.5 border-b border-border cursor-pointer hover:[&_h5]:text-accent">
                  <span className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "var(--color-muted)" }}>{topicReadTime(r)}</span>
                  <h5 className="font-editorial font-semibold text-sm leading-[1.22] text-foreground my-1 transition-colors">
                    <Link href={`/story/${r.id}`}><TText topicId={r.id} field="title" fallback={r.title} /></Link>
                  </h5>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
