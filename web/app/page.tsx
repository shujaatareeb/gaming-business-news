import Link from "next/link";
import Image from "next/image";
import { topics, tweets } from "@/lib/mock-data";
import { categoryColors } from "@/lib/constants";
import { buildTweetMap, topicReadTime } from "@/lib/utils";
import { Newsletter } from "./components/newsletter";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { SectionLabel } from "./components/section-label";
import { TweetFeed } from "./components/tweet-feed";

const tweetMap = buildTweetMap(tweets);

const categories = Array.from(new Set(topics.map((t) => t.category)));
const topicsByCategory: Record<string, typeof topics> = {};
for (const cat of categories) {
  topicsByCategory[cat] = topics.filter((t) => t.category === cat);
}

const featured = topics.slice(0, 5);
const latest = topics.slice(5, 15);
const displayCategories = categories.filter((c) => (topicsByCategory[c]?.length || 0) >= 2).slice(0, 4);

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-5 py-8">

        {/* ═══ FEATURED ═══ */}
        <section className="border-b border-border pb-8 mb-8">
          <div className="grid lg:grid-cols-[1fr_1px_320px] gap-0">

            {/* Lead story */}
            <article className="pr-8">
              <Link href={`/story/${featured[0].id}`} className="block relative w-full aspect-[16/10] overflow-hidden mb-4 bg-surface-alt">
                <Image
                  src={featured[0].image}
                  alt={featured[0].title}
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-500"
                  sizes="700px"
                  priority
                />
              </Link>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[featured[0].category] || "text-accent"}`}>
                {featured[0].category}
              </span>
              <h2 className="font-editorial text-[1.75rem] sm:text-[2.2rem] leading-[1.15] font-bold mt-1 mb-3">
                <Link href={`/story/${featured[0].id}`} className="hover:text-accent transition-colors">
                  {featured[0].title}
                </Link>
              </h2>
              <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
                {featured[0].summary}
              </p>
              <div className="text-[11px] text-muted-light">
                {topicReadTime(featured[0])}
              </div>
            </article>

            {/* Divider */}
            <div className="hidden lg:block bg-border" />

            {/* Secondary stories */}
            <div className="hidden lg:flex flex-col pl-8 divide-y divide-border">
              {featured.slice(1, 5).map((topic) => (
                <article key={topic.id} className="py-4 first:pt-0 last:pb-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                    {topic.category}
                  </span>
                  <h3 className="text-[15px] font-bold leading-snug mt-0.5 mb-1">
                    <Link href={`/story/${topic.id}`} className="hover:text-accent transition-colors">
                      {topic.title}
                    </Link>
                  </h3>
                  <div className="text-[11px] text-muted-light">
                    {topicReadTime(topic)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid lg:grid-cols-[1fr_1px_320px] gap-0">

          {/* LEFT */}
          <div className="min-w-0 pr-8 space-y-10">

            {/* Latest */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Latest</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="divide-y divide-border">
                {latest.map((topic) => (
                  <article key={topic.id} className="flex gap-5 py-5 first:pt-0">
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                        {topic.category}
                      </span>
                      <h3 className="text-[17px] font-bold leading-snug mt-0.5 mb-1.5">
                        <Link href={`/story/${topic.id}`} className="hover:text-accent transition-colors">
                          {topic.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-2">
                        {topic.summary}
                      </p>
                      <div className="text-[11px] text-muted-light">
                        {topicReadTime(topic)}
                      </div>
                    </div>
                    <Link href={`/story/${topic.id}`} className="hidden sm:block relative w-[180px] h-[120px] bg-surface-alt shrink-0 overflow-hidden">
                      <Image
                        src={topic.image}
                        alt={topic.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="180px"
                      />
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            {/* Category sections */}
            {displayCategories.map((cat) => {
              const catTopics = topicsByCategory[cat].slice(0, 5);
              const lead = catTopics[0];
              const rest = catTopics.slice(1);
              return (
                <section key={cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className={`text-xs font-bold uppercase tracking-widest ${categoryColors[cat] || "text-foreground"}`}>
                      {cat}
                    </h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="flex gap-0">
                    {/* Category lead */}
                    <article className="flex-1 min-w-0 pr-6">
                      <Link href={`/story/${lead.id}`} className="block relative w-full aspect-[16/10] overflow-hidden mb-3 bg-surface-alt">
                        <Image src={lead.image} alt={lead.title} fill className="object-cover hover:scale-[1.02] transition-transform duration-500" sizes="400px" />
                      </Link>
                      <h3 className="text-lg font-bold leading-snug mb-1.5">
                        <Link href={`/story/${lead.id}`} className="hover:text-accent transition-colors">
                          {lead.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted line-clamp-2 mb-2">{lead.summary}</p>
                      <div className="text-[11px] text-muted-light">{topicReadTime(lead)}</div>
                    </article>

                    {/* Divider */}
                    <div className="hidden sm:block w-px bg-border shrink-0" />

                    {/* Category list */}
                    <div className="hidden sm:flex flex-col flex-1 divide-y divide-border pl-6">
                      {rest.map((topic) => (
                        <article key={topic.id} className="py-3 first:pt-0 last:pb-0">
                          <h3 className="text-[15px] font-bold leading-snug mb-1">
                            <Link href={`/story/${topic.id}`} className="hover:text-accent transition-colors">
                              {topic.title}
                            </Link>
                          </h3>
                          <div className="text-[11px] text-muted-light">
                            {topicReadTime(topic)}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Divider */}
          <div className="hidden lg:block bg-border" />

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block pl-8">
            <div className="sticky top-20 space-y-8">

              <Newsletter />

              <div>
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
                          <span className="text-[11px] text-muted-light">{topicReadTime(topic)}</span>
                        </div>
                      </li>
                    ))}
                </ol>
              </div>

              <div>
                <SectionLabel labelKey="onX" />
                <TweetFeed tweets={tweets.slice(0, 3)} />
              </div>

            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </>
  );
}
