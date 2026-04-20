import Link from "next/link";
import Image from "next/image";
import { topics, tweets } from "@/lib/mock-data";
import { categoryColors } from "@/lib/constants";
import { buildTweetMap, readTime } from "@/lib/utils";
import { Newsletter } from "./components/newsletter";
import { Header } from "./components/header";

const tweetMap = buildTweetMap(tweets);

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border mt-12 bg-surface">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Main footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="font-editorial text-xl font-bold tracking-tight">GAMEPULSE</span>
            <p className="text-xs text-muted leading-relaxed mt-3">
              AI-powered gaming industry business intelligence. The deals, earnings, and market
              shifts that matter — updated three times daily.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Coverage</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><a href="#" className="hover:text-foreground transition">M&A</a></li>
              <li><a href="#" className="hover:text-foreground transition">Earnings</a></li>
              <li><a href="#" className="hover:text-foreground transition">Funding</a></li>
              <li><a href="#" className="hover:text-foreground transition">Hardware</a></li>
              <li><a href="#" className="hover:text-foreground transition">Strategy</a></li>
            </ul>
          </div>

          {/* Markets */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Markets</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="/stocks/ntdoy" className="hover:text-foreground transition">Nintendo</Link></li>
              <li><Link href="/stocks/sony" className="hover:text-foreground transition">Sony</Link></li>
              <li><Link href="/stocks/msft" className="hover:text-foreground transition">Microsoft</Link></li>
              <li><Link href="/stocks/ea" className="hover:text-foreground transition">Electronic Arts</Link></li>
              <li><Link href="/stocks/rblx" className="hover:text-foreground transition">Roblox</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">More</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="/dashboard" className="hover:text-foreground transition">Dashboard</Link></li>
              <li><a href="#" className="hover:text-foreground transition">About</a></li>
              <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">X / Twitter</a></li>
              <li><a href="#" className="hover:text-foreground transition">RSS Feed</a></li>
              <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-light">
          <span>&copy; {new Date().getFullYear()} GamePulse. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  const lead = topics[0];
  const restStories = topics.slice(1);

  const trendingStories = [...topics]
    .filter((t) => tweetMap.has(t.id))
    .sort((a, b) => (tweetMap.get(b.id)?.impressions || 0) - (tweetMap.get(a.id)?.impressions || 0))
    .slice(0, 5);

  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-5 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">

          {/* ════ LEFT COLUMN ════ */}
          <div className="min-w-0">

            {/* Lead story with image */}
            <article className="pb-8 mb-8 border-b border-border">
              <Link href={`/story/${lead.id}`} className="block relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-5 bg-surface-alt">
                <Image
                  src={lead.image}
                  alt={lead.title}
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </Link>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${categoryColors[lead.category] || "text-accent"}`}>
                {lead.category}
              </span>
              <h2 className="font-editorial text-[2rem] sm:text-[2.5rem] leading-[1.1] font-bold mt-2 mb-4">
                <Link href={`/story/${lead.id}`} className="hover:underline decoration-1 underline-offset-4">
                  {lead.title}
                </Link>
              </h2>
              <p className="text-[15px] text-muted leading-relaxed mb-4 max-w-2xl">
                {lead.summary}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-light">
                <span className="font-medium text-muted">{lead.source}</span>
                <span>&middot;</span>
                <span>{readTime(lead.summary)}</span>
              </div>
            </article>

            {/* Story feed */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Latest</h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="divide-y divide-border">
              {restStories.map((topic) => {
                return (
                  <article key={topic.id} className="py-5 first:pt-0">
                    <div className="flex gap-5">
                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                          {topic.category}
                        </span>
                        <h3 className="font-editorial text-xl font-bold leading-snug mt-1 mb-2">
                          <Link href={`/story/${topic.id}`} className="hover:underline decoration-1 underline-offset-2">
                            {topic.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-2">
                          {topic.summary}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-light">
                          <span className="font-medium text-muted">{topic.source}</span>
                          <span>&middot;</span>
                          <span>{readTime(topic.summary)}</span>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <Link href={`/story/${topic.id}`} className="hidden sm:block relative w-40 h-24 rounded overflow-hidden bg-surface-alt shrink-0">
                        <Image
                          src={topic.image}
                          alt={topic.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="160px"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">

              {/* Newsletter */}
              <Newsletter />

              {/* Most Read */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Most Read</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <ol className="space-y-4">
                  {trendingStories.map((topic, i) => (
                    <li key={topic.id} className="flex gap-3">
                      <span className="text-2xl font-editorial font-bold text-border-strong leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold leading-snug">
                          <Link href={`/story/${topic.id}`} className="hover:underline decoration-1 underline-offset-2">
                            {topic.title}
                          </Link>
                        </h3>
                        <span className="text-[11px] text-muted-light">{topic.source}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* On X */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">On X</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-4">
                  {tweets.slice(0, 3).map((tweet) => (
                    <blockquote key={tweet.id} className="border-l-2 border-border pl-4 py-1">
                      <p className="text-[13px] text-foreground/85 leading-relaxed line-clamp-3">
                        {tweet.text}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-light">
                        <span>{tweet.likes} likes</span>
                        <span>&middot;</span>
                        <a href={tweet.tweetUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                          View
                        </a>
                      </div>
                    </blockquote>
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
