import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stocks, topics, tweets } from "@/lib/mock-data";
import { companyProfiles, getStockStats, getOHLCData, tickerKeywords } from "@/lib/stock-data";
import { categoryColors, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getTimeAgo } from "@/lib/utils";
import { StockChart } from "@/app/components/stock-chart";

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

  // Peer comparison — same sector or nearby in the list
  const peers = stocks.filter((s) => s.ticker !== stock.ticker).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="font-editorial text-2xl font-bold tracking-tight text-foreground">
              GAMEPULSE
            </Link>
            <span className="text-muted-light">/</span>
            <span className="text-muted">Markets</span>
            <span className="text-muted-light">/</span>
            <span className="font-semibold">{stock.ticker}</span>
          </div>
          <Link href="/" className="text-[13px] text-muted hover:text-foreground transition">
            Back to news
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 py-8">
        {/* Price header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{stock.name}</h1>
            <span className="text-sm font-mono text-muted bg-surface-alt border border-border px-2.5 py-0.5 rounded">
              {stock.ticker}
            </span>
            {profile && (
              <span className="text-xs text-muted bg-surface-alt border border-border px-2 py-0.5 rounded">
                {profile.sector}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-4 mt-3">
            <span className="text-5xl font-bold tabular-nums tracking-tight">
              ${stock.price.toFixed(2)}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-semibold tabular-nums ${isPositive ? "text-status-success" : "text-accent"}`}>
                {isPositive ? "+" : ""}{stock.change.toFixed(2)}
              </span>
              <span className={`text-sm font-bold tabular-nums px-2 py-0.5 rounded ${isPositive ? "bg-status-success/15 text-status-success" : "bg-accent/15 text-accent"}`}>
                {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-light mt-2">
            As of market close &middot; USD &middot; {profile?.website}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Chart */}
            <StockChart
              ticker={stock.ticker}
              currentPrice={stock.price}
              change={stock.change}
              allData={chartDataByPeriod}
            />

            {/* Key Statistics */}
            <div className="border border-border rounded-lg bg-surface">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">Key Statistics</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {[
                  { label: "Previous Close", value: `$${stats.prevClose}` },
                  { label: "Open", value: `$${stats.open}` },
                  { label: "Day High", value: `$${stats.high}` },
                  { label: "Day Low", value: `$${stats.low}` },
                  { label: "Volume", value: stats.volume },
                  { label: "Avg Volume", value: stats.avgVolume },
                  { label: "Market Cap", value: stats.marketCap },
                  { label: "P/E Ratio", value: stats.peRatio },
                  { label: "EPS", value: `$${stats.eps}` },
                  { label: "Dividend Yield", value: stats.dividend },
                  { label: "Beta", value: stats.beta },
                  { label: "52W High", value: `$${stats.week52High}` },
                  { label: "52W Low", value: `$${stats.week52Low}` },
                  { label: "Analyst Rating", value: stats.avgAnalystRating },
                  { label: "Price Target", value: `$${stats.targetPrice}` },
                  { label: "Target Upside", value: `${(((parseFloat(stats.targetPrice) - stock.price) / stock.price) * 100).toFixed(1)}%` },
                ].map((stat, i) => (
                  <div key={stat.label} className={`px-5 py-3.5 border-b border-border ${i % 4 !== 3 ? "border-r" : ""}`}>
                    <div className="text-[10px] text-muted uppercase tracking-wider">{stat.label}</div>
                    <div className="text-sm font-semibold tabular-nums mt-0.5">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company profile */}
            {profile && (
              <div className="border border-border rounded-lg bg-surface">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">About {stock.name}</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted leading-relaxed mb-5">{profile.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-border">
                    {[
                      { label: "CEO", value: profile.ceo },
                      { label: "Headquarters", value: profile.hq },
                      { label: "Founded", value: profile.founded },
                      { label: "Employees", value: profile.employees },
                      { label: "Sector", value: profile.sector },
                      { label: "Website", value: profile.website },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-[10px] text-muted uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm font-medium mt-0.5">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  {profile.keyFranchises.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-border">
                      <div className="text-[10px] text-muted uppercase tracking-wider mb-2">Key Franchises</div>
                      <div className="flex flex-wrap gap-2">
                        {profile.keyFranchises.map((f) => (
                          <span key={f} className="text-xs bg-surface-alt border border-border px-2.5 py-1 rounded-full">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related News */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                  {stock.name} in the News
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              {relatedTopics.length > 0 ? (
                <div className="divide-y divide-border border border-border rounded-lg bg-surface">
                  {relatedTopics.map((topic) => (
                    <Link key={topic.id} href={`/story/${topic.id}`} className="block p-5 hover:bg-surface-alt transition">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${categoryColors[topic.category] || "text-accent"}`}>
                          {topic.category}
                        </span>
                        <span className="text-[10px] text-muted-light">&middot;</span>
                        <span className="text-[10px] text-muted">{topic.source}</span>
                        <span className="text-[10px] text-muted-light">&middot;</span>
                        <time className="text-[10px] text-muted-light">{getTimeAgo(new Date(topic.published))}</time>
                      </div>
                      <h3 className="font-editorial text-lg font-bold leading-snug mb-1.5">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed line-clamp-2">{topic.summary}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border border-border rounded-lg bg-surface p-8 text-center">
                  <p className="text-sm text-muted">No recent news stories for {stock.name}.</p>
                  <p className="text-xs text-muted-light mt-1">Check back when new stories are published.</p>
                </div>
              )}
            </div>

            {/* Our takes on X */}
            {relatedTweets.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    Our Takes on X
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-3">
                  {relatedTweets.map((tweet) => (
                    <div key={tweet.id} className="border border-border rounded-lg bg-surface p-5">
                      <p className="text-[15px] leading-relaxed text-foreground/90 mb-3">
                        {tweet.text}
                      </p>
                      <div className="flex items-center gap-5 text-xs text-muted pt-3 border-t border-border">
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

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Peer comparison */}
            <div className="border border-border rounded-lg bg-surface">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Peer Comparison
                </h2>
              </div>
              <div className="divide-y divide-border">
                {peers.map((s) => (
                  <Link
                    key={s.ticker}
                    href={`/stocks/${s.ticker.toLowerCase()}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-alt transition"
                  >
                    <div>
                      <div className="text-sm font-bold">{s.ticker}</div>
                      <div className="text-[11px] text-muted">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium tabular-nums">${s.price.toFixed(2)}</div>
                      <div className={`text-[11px] font-semibold tabular-nums ${s.change >= 0 ? "text-status-success" : "text-accent"}`}>
                        {s.change >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* All gaming stocks */}
            <div className="border border-border rounded-lg bg-surface">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  All Gaming Stocks
                </h2>
              </div>
              <div className="divide-y divide-border">
                {stocks
                  .filter((s) => s.ticker !== stock.ticker && !peers.find((p) => p.ticker === s.ticker))
                  .map((s) => (
                    <Link
                      key={s.ticker}
                      href={`/stocks/${s.ticker.toLowerCase()}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-surface-alt transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{s.ticker}</span>
                        <span className="text-[11px] text-muted">{s.name}</span>
                      </div>
                      <span className={`text-[11px] font-semibold tabular-nums ${s.change >= 0 ? "text-status-success" : "text-accent"}`}>
                        {s.change >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
