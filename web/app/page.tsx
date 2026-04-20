import Link from "next/link";
import Image from "next/image";
import { topics, tweets, stocks } from "@/lib/mock-data";
import { buildTweetMap, topicReadTime } from "@/lib/utils";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { NewsletterBlock } from "./components/newsletter";
import { TText } from "./components/translated-topic";

const tweetMap = buildTweetMap(tweets);
const categories = Array.from(new Set(topics.map((t) => t.category)));

const BRIEFING = [
  { time: "08:02", head: "Capcom Q4 beats consensus by 14% on Pragmata launch" },
  { time: "07:55", head: "Nintendo: Switch 2 LTD sell-through crosses 9.1M" },
  { time: "07:40", head: "Embracer restructures for the fourth time in 18 months" },
  { time: "07:22", head: "Sony reshuffles PlayStation Studios leadership" },
  { time: "07:04", head: "Tencent ups stake in Ubisoft special-purpose vehicle" },
];

const MARKETS = [
  { label: "Gaming 50", val: "2,184.22", chg: 0.42 },
  { label: "AAA Publishers", val: "987.10", chg: -0.18 },
  { label: "Mobile & F2P", val: "612.55", chg: 1.24 },
  { label: "Hardware", val: "441.08", chg: -0.61 },
  { label: "Esports Orgs", val: "288.30", chg: 0.77 },
];

const fmtChg = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

export default function Home() {
  const main = topics[0];
  const subs = topics.slice(1, 5);
  const latestPool = topics.slice(5, 13);
  const displayCats = categories.filter((c) => topics.filter((t) => t.category === c).length >= 2).slice(0, 3);

  const mostRead = topics
    .filter((t) => tweetMap.has(t.id))
    .sort((a, b) => (tweetMap.get(b.id)?.impressions || 0) - (tweetMap.get(a.id)?.impressions || 0))
    .slice(0, 5);

  return (
    <>
      <Header />
      <main className="max-w-[1360px] mx-auto px-5">

        {/* ═══ LEAD BLOCK ═══ */}
        <section className="grid grid-cols-[1fr_360px_300px] gap-0 py-7 border-b-2 border-foreground">
          {/* Main story */}
          <article className="pr-7 border-r border-border">
            {main.image && (
              <Link href={`/story/${main.id}`} className="block relative w-full aspect-[16/9] overflow-hidden mb-4">
                <Image src={main.image} alt={main.title} fill className="object-cover" style={{ filter: "contrast(1.02) saturate(0.95)" }} sizes="700px" priority />
              </Link>
            )}
            <span className="kicker">{main.category}</span>
            <h1 className="hl hl-xxl cursor-pointer hover:text-accent transition-colors" style={{ margin: "10px 0 12px" }}>
              <Link href={`/story/${main.id}`}><TText topicId={main.id} field="title" fallback={main.title} /></Link>
            </h1>
            <p className="dek"><TText topicId={main.id} field="summary" fallback={main.summary} /></p>
            <div className="byline mt-3.5">
              By <strong>GamePulse Editorial</strong> · <span className="font-bold tracking-[0.12em]">{new Date(main.published).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}</span> · {topicReadTime(main)}
            </div>
          </article>

          {/* Sub stories */}
          <div className="px-5 border-r border-border flex flex-col gap-4">
            {subs.map((s, i) => (
              <article key={s.id} className={`${i < subs.length - 1 ? "pb-4 border-b border-border" : ""}`}>
                <span className="kicker">{s.category}</span>
                <h3 className="font-editorial font-bold text-[17px] leading-[1.2] mt-1.5 mb-1 hover:text-accent transition-colors">
                  <Link href={`/story/${s.id}`}><TText topicId={s.id} field="title" fallback={s.title} /></Link>
                </h3>
                <div className="byline" style={{ fontSize: 10 }}>{topicReadTime(s)}</div>
              </article>
            ))}
          </div>

          {/* Right rail */}
          <div className="pl-5">
            <h4
              className="mb-2.5 pb-2 border-b-2 border-foreground"
              style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              Live Briefing
            </h4>
            <ul className="list-none p-0 m-0">
              {BRIEFING.map((b, i) => (
                <li key={i} className="grid grid-cols-[48px_1fr] gap-2.5 py-2.5 border-b border-border text-[13.5px] leading-[1.35]">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-muted)", paddingTop: 2 }}>{b.time}</span>
                  <span className="font-editorial font-semibold text-foreground">{b.head}</span>
                </li>
              ))}
            </ul>

            {/* Indices */}
            <div className="mt-5 p-3.5 border border-border" style={{ background: "var(--color-surface-alt)" }}>
              <h4 style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 10px" }}>
                GP Indices
              </h4>
              {MARKETS.map((m) => (
                <div key={m.label} className="flex justify-between items-baseline py-1.5 border-b border-dashed border-border-strong" style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
                  <span style={{ color: "var(--color-ink-2)" }}>{m.label}</span>
                  <span>
                    <span className="font-medium" style={{ fontFamily: "var(--font-mono)" }}>{m.val}</span>
                    <span className={`ml-2 text-[11px] ${m.chg >= 0 ? "text-up" : "text-down"}`} style={{ fontFamily: "var(--font-mono)" }}>{fmtChg(m.chg)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ LATEST GRID ═══ */}
        <div className="flex items-baseline justify-between py-5 border-b border-foreground">
          <h2 className="font-editorial font-bold italic text-[28px] tracking-tight m-0">Latest</h2>
        </div>
        <div className="grid grid-cols-4 gap-0 border-b-2 border-foreground">
          {latestPool.map((s, i) => (
            <article
              key={s.id}
              className={`p-5 border-r border-b border-border flex flex-col min-h-[260px] cursor-pointer hover:bg-surface-alt transition ${i % 4 === 3 ? "border-r-0" : ""}`}
            >
              {s.image && (
                <Link href={`/story/${s.id}`} className="block relative w-full aspect-[16/10] overflow-hidden mb-3" style={{ background: "var(--color-surface-band)" }}>
                  <Image src={s.image} alt={s.title} fill className="object-cover" sizes="300px" />
                </Link>
              )}
              <span className="kicker mb-2.5">{s.category}</span>
              <h3 className="font-editorial font-bold text-[19px] leading-[1.18] text-foreground mb-2 tracking-tight hover:text-accent transition-colors">
                <Link href={`/story/${s.id}`}><TText topicId={s.id} field="title" fallback={s.title} /></Link>
              </h3>
              <p className="text-[13px] leading-[1.45] line-clamp-3 m-0 mb-3" style={{ color: "var(--color-ink-2)" }}><TText topicId={s.id} field="summary" fallback={s.summary} /></p>
              <div className="mt-auto flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: "10.5px", letterSpacing: "0.08em", color: "var(--color-muted)", textTransform: "uppercase" }}>
                <span>{topicReadTime(s)}</span>
              </div>
            </article>
          ))}
        </div>

        {/* ═══ CATEGORY SECTIONS ═══ */}
        {displayCats.map((cat) => {
          const items = topics.filter((t) => t.category === cat);
          if (items.length < 2) return null;
          const [feat, ...rest] = items;
          const col2 = rest.slice(0, 3);
          const col3 = rest.slice(3, 6);

          return (
            <section key={cat} className="pt-9">
              <div className="flex items-baseline justify-between pb-2 mb-4" style={{ borderBottom: "3px double var(--color-foreground)" }}>
                <h2 className="font-editorial font-bold italic text-2xl tracking-tight m-0">{cat}</h2>
                <a href="#" style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-muted)" }} className="hover:text-accent transition-colors">
                  All {cat} →
                </a>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-7">
                {/* Feature */}
                <article>
                  {feat.image && (
                    <Link href={`/story/${feat.id}`} className="block relative w-full aspect-[16/9] overflow-hidden mb-3">
                      <Image src={feat.image} alt={feat.title} fill className="object-cover" sizes="500px" />
                    </Link>
                  )}
                  <span className="kicker">{feat.category}</span>
                  <h3 className="hl hl-lg my-2 hover:text-accent transition-colors">
                    <Link href={`/story/${feat.id}`}><TText topicId={feat.id} field="title" fallback={feat.title} /></Link>
                  </h3>
                  <p className="dek text-[13.5px]"><TText topicId={feat.id} field="summary" fallback={feat.summary} /></p>
                  <div className="byline mt-2">By <strong>GamePulse Editorial</strong> · {topicReadTime(feat)}</div>
                </article>

                {/* List columns */}
                {[col2, col3].map((col, ci) => (
                  <div key={ci} className="flex flex-col border-t border-border">
                    {col.map((s) => (
                      <article key={s.id} className="py-3.5 border-b border-border cursor-pointer hover:[&_h3]:text-accent">
                        <span className="kicker" style={{ color: "var(--color-muted)" }}>
                          {new Date(s.published).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
                        </span>
                        <h3 className="font-editorial font-bold text-base leading-[1.22] my-1 transition-colors">
                          <Link href={`/story/${s.id}`}><TText topicId={s.id} field="title" fallback={s.title} /></Link>
                        </h3>
                        <div className="flex justify-between" style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          <span>{topicReadTime(s)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* ═══ BOTTOM GRID: Newsletter + Most Read + X ═══ */}
        <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-0 mt-12 border-t-2 border-b-2 border-foreground">
          {/* Newsletter */}
          <NewsletterBlock />

          {/* Most Read */}
          <section className="p-6 border-r border-border">
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 14px" }}>
              Most Read · 24h
            </h3>
            <ol className="list-none p-0 m-0" style={{ counterReset: "mr" }}>
              {mostRead.map((s) => (
                <li
                  key={s.id}
                  className="grid grid-cols-[34px_1fr] gap-2.5 py-2.5 border-b border-border items-baseline cursor-pointer hover:[&_h4]:text-accent"
                  style={{ counterIncrement: "mr" }}
                >
                  <span className="font-editorial italic font-bold text-[22px] leading-none text-accent"
                    style={{ content: "counter(mr)" }}>
                    {String(mostRead.indexOf(s) + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-editorial font-semibold text-sm leading-[1.25] m-0 transition-colors">
                      <Link href={`/story/${s.id}`}><TText topicId={s.id} field="title" fallback={s.title} /></Link>
                    </h4>
                    <div className="mt-1" style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--color-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {s.category} · {topicReadTime(s)}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* X Feed */}
          <section className="p-6">
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 14px" }}>
              On X · Industry Pulse
            </h3>
            {tweets.slice(0, 3).map((tw) => (
              <div key={tw.id} className="py-3 border-b border-border text-[13.5px] leading-[1.4]" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="block mb-1" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.06em" }}>@gamepulse</span>
                <span>{tw.text}</span>
                <span className="block mt-1.5" style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--color-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {tw.likes} likes · <a href={tw.tweetUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">View ↗</a>
                </span>
              </div>
            ))}
          </section>
        </div>

      </main>
      <Footer />
    </>
  );
}
