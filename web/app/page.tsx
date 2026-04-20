import { topics, tweets } from "@/lib/mock-data";
import { buildTweetMap } from "@/lib/utils";
import { Newsletter } from "./components/newsletter";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { SectionLabel } from "./components/section-label";
import { LeadStory, StoryList, TrendingList } from "./components/story-feed";
import { TweetFeed } from "./components/tweet-feed";

const tweetMap = buildTweetMap(tweets);

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
            <LeadStory topic={lead} />
            <StoryList topics={restStories} />
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <Newsletter />
              </div>

              <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <SectionLabel labelKey="mostRead" />
                <TrendingList topics={trendingStories} />
              </div>

              <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
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
