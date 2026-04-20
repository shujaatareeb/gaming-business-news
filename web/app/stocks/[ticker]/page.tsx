import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stocks, topics, tweets } from "@/lib/mock-data";
import { companyProfiles, getStockStats, getOHLCData, tickerKeywords } from "@/lib/stock-data";
import { categoryColors, SITE_NAME, SITE_URL } from "@/lib/constants";
import { topicReadTime } from "@/lib/utils";
import { StockChart } from "@/app/components/stock-chart";
import { Header } from "@/app/components/header";

export function generateStaticParams() {
  return stocks.map((s) => ({ ticker: s.ticker.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const stock = stocks.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase());
  if (!stock) return {};
  const profile = companyProfiles[stock.ticker];
  const title = `${stock.name} (${stock.ticker}) Stock Price & News`;
  const description = `${stock.name} stock at $${stock.price.toFixed(2)} (${stock.change >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%). ${profile?.description.slice(0, 120) || "Gaming stock data, charts, and related news."}`;
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: `${SITE_URL}/stocks/${ticker.toLowerCase()}` },
    openGraph: { title, description, url: `${SITE_URL}/stocks/${ticker.toLowerCase()}`, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function StockPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const stock = stocks.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase());
  if (!stock) notFound();

  const profile = companyProfiles[stock.ticker];
  const stats = getStockStats(stock);
  const isPositive = stock.change >= 0;

  const chartDataByPeriod = {
    "1M": getOHLCData(stock, 30),
    "3M": getOHLCData(stock, 90),
    "6M": getOHLCData(stock, 180),
    "1Y": getOHLCData(stock, 365),
    "5Y": getOHLCData(stock, 1825),
  };

  const keywords = tickerKeywords[stock.ticker] || [];
  const relatedTopics = topics.filter((t) => {
    const text = `${t.title} ${t.summary}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
  const relatedTweets = tweets.filter((tw) => {
    const topic = topics.find((t) => t.id === tw.topicId);
    if (!topic) return false;
    const text = `${topic.title} ${topic.summary}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });

  const peers = stocks.filter((s) => s.ticker !== stock.ticker).slice(0, 5);
  const peerTickers = new Set(peers.map((p) => p.ticker));
  const remainingStocks = stocks.filter((s) => s.ticker !== stock.ticker && !peerTickers.has(s.ticker));
  const targetUpside = (((parseFloat(stats.targetPrice) - stock.price) / stock.price) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1200px] mx-auto px-5 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-foreground transition">Home</Link>
          <span>/</span>
          <span className="text-muted-light">Markets</span>
          <span>/</span>
          <span className="text-foreground font-medium">{stock.ticker}</span>
        </div>

        {/* Hero price section */}
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                {profile?.logo && (
                  <Image
                    src={profile.logo}
                    alt={`${stock.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-lg border border-border"
                  />
                )}
                <h1 className="text-2xl sm:text-3xl font-bold">{stock.name}</h1>
                <span className="text-xs font-mono text-muted bg-surface-alt border border-border px-2 py-0.5 rounded">
                  {stock.ticker}
                </span>
              </div>
              {profile && (
                <p className="text-sm text-muted mt-1">{profile.sector} &middot; {profile.hq}</p>
              )}
            </div>
            <div className="sm:text-right">
              <div className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
                ${stock.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-1 sm:justify-end">
                <span className={`text-lg font-semibold tabular-nums ${isPositive ? "text-status-success" : "text-accent"}`}>
                  {isPositive ? "+" : ""}{stock.change.toFixed(2)}
                </span>
                <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded ${isPositive ? "bg-green-50 text-status-success" : "bg-red-50 text-accent"}`}>
                  {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
              <p className="text-[11px] text-muted-light mt-1">As of market close &middot; USD</p>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-px bg-border rounded-lg overflow-hidden mt-6">
            {[
              { label: "Open", value: `$${stats.open}` },
              { label: "High", value: `$${stats.high}` },
              { label: "Low", value: `$${stats.low}` },
              { label: "Vol", value: stats.volume },
              { label: "Mkt Cap", value: stats.marketCap },
              { label: "P/E", value: stats.peRatio },
              { label: "Target", value: `$${stats.targetPrice}` },
              { label: "Rating", value: stats.avgAnalystRating },
            ].map((s) => (
              <div key={s.label} className="bg-surface px-3 py-2.5 text-center">
                <div className="text-[10px] text-muted-light uppercase tracking-wider">{s.label}</div>
                <div className="text-xs font-semibold tabular-nums mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* ═══ LEFT ═══ */}
          <div className="space-y-6 min-w-0">

            {/* Chart */}
            <StockChart
              ticker={stock.ticker}
              currentPrice={stock.price}
              change={stock.change}
              allData={chartDataByPeriod}
            />

            {/* Detailed stats */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Trading data */}
              <div className="border border-border rounded-xl bg-surface">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">Trading Data</h2>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { label: "Previous Close", value: `$${stats.prevClose}` },
                    { label: "Open", value: `$${stats.open}` },
                    { label: "Day Range", value: `$${stats.low} - $${stats.high}` },
                    { label: "52 Week Range", value: `$${stats.week52Low} - $${stats.week52High}` },
                    { label: "Volume", value: stats.volume },
                    { label: "Avg Volume", value: stats.avgVolume },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-2.5">
                      <span className="text-xs text-muted">{row.label}</span>
                      <span className="text-xs font-semibold tabular-nums">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fundamentals */}
              <div className="border border-border rounded-xl bg-surface">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">Fundamentals</h2>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { label: "Market Cap", value: stats.marketCap },
                    { label: "P/E Ratio", value: stats.peRatio },
                    { label: "EPS", value: `$${stats.eps}` },
                    { label: "Dividend Yield", value: stats.dividend },
                    { label: "Beta", value: stats.beta },
                    { label: "Analyst Target", value: `$${stats.targetPrice} (${Number(targetUpside) >= 0 ? "+" : ""}${targetUpside}%)` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-2.5">
                      <span className="text-xs text-muted">{row.label}</span>
                      <span className="text-xs font-semibold tabular-nums">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            {profile && (
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">About {stock.name}</h2>
                  <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-accent hover:underline">
                    {profile.website}
                  </a>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted leading-relaxed">{profile.description}</p>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-6 pt-5 border-t border-border">
                    {[
                      { label: "CEO", value: profile.ceo },
                      { label: "HQ", value: profile.hq },
                      { label: "Founded", value: profile.founded },
                      { label: "Employees", value: profile.employees },
                      { label: "Sector", value: profile.sector },
                      { label: "Website", value: profile.website },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-[10px] text-muted-light uppercase tracking-wider">{item.label}</div>
                        <div className="text-xs font-medium mt-0.5 truncate">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {profile.keyFranchises.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-border">
                      {profile.keyFranchises.map((f) => (
                        <span key={f} className="text-[11px] bg-surface-alt border border-border px-2.5 py-1 rounded-full text-muted">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related News */}
            {relatedTopics.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    {stock.name} in the News
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-3">
                  {relatedTopics.map((topic) => (
                    <Link key={topic.id} href={`/story/${topic.id}`} className="flex gap-4 border border-border rounded-xl bg-surface p-4 hover:bg-surface-alt transition group">
                      <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-surface-alt shrink-0">
                        <Image src={topic.image} alt={topic.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="112px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                            {topic.category}
                          </span>
                          <span className="text-[10px] text-muted-light">&middot;</span>
                          <span className="text-[10px] text-muted">{topicReadTime(topic)}</span>
                        </div>
                        <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-accent transition">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-muted mt-1 line-clamp-1">{topic.source}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedTopics.length === 0 && (
              <div className="border border-border rounded-xl bg-surface p-10 text-center">
                <div className="text-muted-light text-3xl mb-3">&#128240;</div>
                <p className="text-sm font-medium text-muted">No recent news for {stock.name}</p>
                <p className="text-xs text-muted-light mt-1">We'll surface stories here when they appear in our pipeline.</p>
              </div>
            )}

            {/* Tweets */}
            {relatedTweets.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Our Takes</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-3">
                  {relatedTweets.map((tweet) => (
                    <div key={tweet.id} className="border border-border rounded-xl bg-surface p-5">
                      <p className="text-sm leading-relaxed text-foreground/90 mb-3">{tweet.text}</p>
                      <div className="flex items-center gap-4 text-xs text-muted pt-3 border-t border-border">
                        <span className="tabular-nums">{tweet.impressions.toLocaleString()} views</span>
                        <span className="tabular-nums">{tweet.likes} likes</span>
                        <span className="tabular-nums">{tweet.retweets} reposts</span>
                        <a href={tweet.tweetUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-auto">
                          View on X
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══ RIGHT SIDEBAR ═══ */}
          <aside className="space-y-6">
            <div className="sticky top-20 space-y-6">

              {/* Analyst sentiment */}
              <div className="border border-border rounded-xl bg-surface p-5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted mb-4">Analyst Consensus</h2>
                <div className="text-center mb-4">
                  <div className={`text-2xl font-bold ${stats.avgAnalystRating.includes("Buy") ? "text-status-success" : stats.avgAnalystRating === "Hold" ? "text-status-partial" : "text-accent"}`}>
                    {stats.avgAnalystRating}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Price target: <span className="font-semibold text-foreground">${stats.targetPrice}</span>
                    <span className={`ml-1 ${Number(targetUpside) >= 0 ? "text-status-success" : "text-accent"}`}>
                      ({Number(targetUpside) >= 0 ? "+" : ""}{targetUpside}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-surface-alt rounded-full overflow-hidden flex">
                  <div className="bg-status-success h-full" style={{ width: "60%" }} />
                  <div className="bg-status-partial h-full" style={{ width: "25%" }} />
                  <div className="bg-accent h-full" style={{ width: "15%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted mt-1.5">
                  <span>Buy</span>
                  <span>Hold</span>
                  <span>Sell</span>
                </div>
              </div>

              {/* 52-week range */}
              <div className="border border-border rounded-xl bg-surface p-5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted mb-4">52-Week Range</h2>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span className="tabular-nums">${stats.week52Low}</span>
                  <span className="tabular-nums">${stats.week52High}</span>
                </div>
                <div className="relative h-2 bg-surface-alt rounded-full">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-surface"
                    style={{
                      left: `${Math.min(95, Math.max(5, ((stock.price - parseFloat(stats.week52Low)) / (parseFloat(stats.week52High) - parseFloat(stats.week52Low))) * 100))}%`,
                    }}
                  />
                  <div
                    className="h-full bg-accent/20 rounded-full"
                    style={{
                      width: `${((stock.price - parseFloat(stats.week52Low)) / (parseFloat(stats.week52High) - parseFloat(stats.week52Low))) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs font-semibold">Current: ${stock.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Peers */}
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">Peers</h2>
                </div>
                <div className="divide-y divide-border">
                  {peers.map((s) => (
                    <Link
                      key={s.ticker}
                      href={`/stocks/${s.ticker.toLowerCase()}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-surface-alt transition"
                    >
                      <div>
                        <span className="text-sm font-bold">{s.ticker}</span>
                        <span className="text-[11px] text-muted ml-1.5">{s.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium tabular-nums">${s.price.toFixed(2)}</div>
                        <div className={`text-[11px] font-semibold tabular-nums ${s.change >= 0 ? "text-status-success" : "text-accent"}`}>
                          {s.change >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* More stocks */}
              {remainingStocks.length > 0 && (
                <div className="border border-border rounded-xl bg-surface overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border">
                    <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">More Stocks</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {remainingStocks.map((s) => (
                      <Link
                        key={s.ticker}
                        href={`/stocks/${s.ticker.toLowerCase()}`}
                        className="flex items-center justify-between px-5 py-2.5 hover:bg-surface-alt transition"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{s.ticker}</span>
                          <span className="text-[11px] text-muted">{s.name}</span>
                        </div>
                        <span className={`text-[11px] font-semibold tabular-nums ${s.change >= 0 ? "text-status-success" : "text-accent"}`}>
                          {s.change >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
