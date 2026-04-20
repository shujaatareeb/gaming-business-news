import Link from "next/link";
import Image from "next/image";
import { topics, tweets } from "@/lib/mock-data";
import { categoryColors } from "@/lib/constants";
import { buildTweetMap, readTime } from "@/lib/utils";
import { Newsletter } from "./components/newsletter";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { SectionLabel } from "./components/section-label";
import { TweetFeed } from "./components/tweet-feed";

const tweetMap = buildTweetMap(tweets);

// Group topics by category
const categories = Array.from(new Set(topics.map((t) => t.category)));
const topicsByCategory: Record<string, typeof topics> = {};
for (const cat of categories) {
  topicsByCategory[cat] = topics.filter((t) => t.category === cat);
}

// Featured = first 3 stories
const featured = topics.slice(0, 3);
// Latest = next batch
const latest = topics.slice(3, 10);
// Categories with enough articles to show
const displayCategories = categories.filter((c) => (topicsByCategory[c]?.length || 0) >= 2);

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-5 py-8">

        {/* ═══ FEATURED ═══ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Featured</h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Hero card */}
            <Link href={`/story/${featured[0].id}`} className="group relative rounded-xl overflow-hidden bg-surface-alt aspect-[4/3] lg:aspect-auto">
              <Image
                src={featured[0].image}
                alt={featured[0].title}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  {featured[0].category}
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight mt-1.5 mb-2 group-hover:underline decoration-1 underline-offset-4">
                  {featured[0].title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>{featured[0].source}</span>
                  <span>&middot;</span>
                  <span>{readTime(featured[0].body || featured[0].summary)}</span>
                </div>
              </div>
            </Link>

            {/* Secondary featured */}
            <div className="flex flex-col gap-6">
              {featured.slice(1, 3).map((topic) => (
                <Link
                  key={topic.id}
                  href={`/story/${topic.id}`}
                  className="group flex gap-4 flex-1 rounded-xl border border-border bg-surface p-4 hover:bg-surface-alt transition"
                >
                  <div className="relative w-32 sm:w-40 h-full min-h-[100px] rounded-lg overflow-hidden bg-surface-alt shrink-0">
                    <Image
                      src={topic.image}
                      alt={topic.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="160px"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0 py-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                      {topic.category}
                    </span>
                    <h3 className="font-editorial text-lg font-bold leading-snug mt-1 mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-muted line-clamp-2 mb-2">{topic.summary}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-light mt-auto">
                      <span>{topic.source}</span>
                      <span>&middot;</span>
                      <span>{readTime(topic.body || topic.summary)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">

          {/* LEFT */}
          <div className="min-w-0 space-y-10">

            {/* Latest stories */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Latest</h2>
                <div className="flex-1 h-px bg-border" />
                <Link href="#" className="text-[11px] text-muted hover:text-foreground transition">View all</Link>
              </div>
              <div className="space-y-4">
                {latest.map((topic, i) => (
                  <Link
                    key={topic.id}
                    href={`/story/${topic.id}`}
                    className="group flex gap-4 rounded-xl border border-border bg-surface p-4 hover:bg-surface-alt transition animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-surface-alt shrink-0">
                      <Image
                        src={topic.image}
                        alt={topic.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                          {topic.category}
                        </span>
                        <span className="text-[10px] text-muted-light">&middot;</span>
                        <span className="text-[10px] text-muted-light">{readTime(topic.body || topic.summary)}</span>
                      </div>
                      <h3 className="text-[15px] font-bold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-muted mt-1 line-clamp-1">{topic.source}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Category sections */}
            {displayCategories.slice(0, 4).map((cat) => {
              const catTopics = topicsByCategory[cat].slice(0, 4);
              if (catTopics.length < 2) return null;
              return (
                <section key={cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className={`text-xs font-bold uppercase tracking-widest ${categoryColors[cat] || "text-foreground"}`}>
                      {cat}
                    </h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {catTopics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/story/${topic.id}`}
                        className="group rounded-xl border border-border bg-surface overflow-hidden hover:bg-surface-alt transition"
                      >
                        <div className="relative w-full aspect-[16/9] bg-surface-alt">
                          <Image
                            src={topic.image}
                            alt={topic.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 400px"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-xs text-muted mt-1.5 line-clamp-2">{topic.summary}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-light mt-3">
                            <span>{topic.source}</span>
                            <span>&middot;</span>
                            <span>{readTime(topic.body || topic.summary)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">

              <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <Newsletter />
              </div>

              {/* Most Read */}
              <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <SectionLabel labelKey="mostRead" />
                <ol className="space-y-4">
                  {topics
                    .filter((t) => tweetMap.has(t.id))
                    .sort((a, b) => (tweetMap.get(b.id)?.impressions || 0) - (tweetMap.get(a.id)?.impressions || 0))
                    .slice(0, 5)
                    .map((topic, i) => (
                      <li key={topic.id} className="flex gap-3 group">
                        <span className="text-2xl font-editorial font-bold text-border-strong leading-none group-hover:text-accent transition-colors">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold leading-snug">
                            <Link href={`/story/${topic.id}`} className="hover:text-accent transition-colors">
                              {topic.title}
                            </Link>
                          </h3>
                          <span className="text-[11px] text-muted-light">{readTime(topic.body || topic.summary)}</span>
                        </div>
                      </li>
                    ))}
                </ol>
              </div>

              {/* On X */}
              <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <SectionLabel labelKey="onX" />
                <TweetFeed tweets={tweets.slice(0, 3)} />
              </div>

              {/* Category quick links */}
              <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Topics</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-border hover:bg-surface-alt transition cursor-pointer ${categoryColors[cat] || "text-muted"}`}
                    >
                      {cat}
                      <span className="text-muted-light ml-1.5">{topicsByCategory[cat].length}</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </>
  );
}
