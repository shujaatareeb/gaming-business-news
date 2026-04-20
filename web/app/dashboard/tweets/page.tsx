import { tweets, topics } from "@/lib/mock-data";
import { categoryColors } from "@/lib/constants";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function TweetsPage() {
  const totalImpressions = tweets.reduce((sum, t) => sum + t.impressions, 0);
  const totalLikes = tweets.reduce((sum, t) => sum + t.likes, 0);
  const totalReposts = tweets.reduce((sum, t) => sum + t.retweets, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold">Tweets</h1>
        <p className="text-sm text-muted mt-0.5">
          {tweets.length} posts published &middot; {totalImpressions.toLocaleString()} total impressions
        </p>
      </div>

      {/* Summary bar */}
      <div className="bg-surface border border-border rounded-lg px-6 py-4 mb-6 flex items-center gap-10">
        <Metric label="Impressions" value={totalImpressions.toLocaleString()} />
        <Metric label="Likes" value={totalLikes.toLocaleString()} />
        <Metric label="Reposts" value={totalReposts.toLocaleString()} />
        <Metric
          label="Avg Engagement"
          value={`${(((totalLikes + totalReposts) / totalImpressions) * 100).toFixed(1)}%`}
        />
      </div>

      {/* Tweet list */}
      <div className="space-y-4">
        {tweets.map((tweet) => {
          const topic = topics.find((t) => t.id === tweet.topicId);
          const engagement = (
            ((tweet.likes + tweet.retweets + tweet.replies) / tweet.impressions) * 100
          ).toFixed(1);

          return (
            <article
              key={tweet.id}
              className="bg-surface border border-border rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${categoryColors[topic?.category || ""] || "text-accent"}`}>
                    {topic?.category}
                  </span>
                  <span className="text-[11px] text-muted-light">&middot;</span>
                  <span className="text-[11px] text-muted">{topic?.source}</span>
                  <span className="text-[11px] text-muted-light">&middot;</span>
                  <time className="text-[11px] text-muted-light">
                    {new Date(tweet.postedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <a
                  href={tweet.tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted hover:text-foreground transition"
                >
                  View on X &rarr;
                </a>
              </div>

              <p className="text-[15px] leading-relaxed mb-5">{tweet.text}</p>

              <div className="flex items-center gap-8 pt-4 border-t border-border">
                <Metric label="Impressions" value={tweet.impressions.toLocaleString()} />
                <Metric label="Likes" value={String(tweet.likes)} />
                <Metric label="Reposts" value={String(tweet.retweets)} />
                <Metric label="Replies" value={String(tweet.replies)} />
                <Metric label="Engagement" value={`${engagement}%`} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
