import { stats, tweets, pipelineRuns, topics } from "@/lib/mock-data";
import { categoryColors, runStatusStyles, SHORT_DATE_FORMAT } from "@/lib/constants";

function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <dt className="text-xs text-muted uppercase tracking-wider font-medium">{label}</dt>
      <dd className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
        {change && (
          <span className="text-xs font-medium text-status-success">{change}</span>
        )}
      </dd>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold">Overview</h1>
        <p className="text-sm text-muted mt-0.5">Pipeline performance at a glance</p>
      </div>

      {/* Stats row */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Tweets Today" value={String(stats.tweetsToday)} change="+2" />
        <StatCard label="Topics Found" value={String(stats.topicsToday)} />
        <StatCard label="Total Impressions" value={`${(stats.totalImpressions / 1000).toFixed(0)}K`} change="+12%" />
        <StatCard label="Engagement Rate" value={`${stats.avgEngagement}%`} />
      </dl>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Recent tweets - wider */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Recent Tweets</h2>
            <a href="/dashboard/tweets" className="text-xs text-muted hover:text-foreground transition">View all</a>
          </div>
          <div className="bg-surface border border-border rounded-lg divide-y divide-border">
            {tweets.slice(0, 4).map((tweet) => {
              const topic = topics.find((t) => t.id === tweet.topicId);
              return (
                <div key={tweet.id} className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{topic?.category}</span>
                    <span className="text-[11px] text-muted-light">&middot; {topic?.source}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 mb-3 line-clamp-2">{tweet.text}</p>
                  <div className="flex items-center gap-5 text-xs text-muted tabular-nums">
                    <span>{tweet.impressions.toLocaleString()} views</span>
                    <span>{tweet.likes} likes</span>
                    <span>{tweet.retweets} reposts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pipeline runs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider">Pipeline Runs</h2>
              <a href="/dashboard/runs" className="text-xs text-muted hover:text-foreground transition">View all</a>
            </div>
            <div className="bg-surface border border-border rounded-lg divide-y divide-border">
              {pipelineRuns.slice(0, 4).map((run) => {
                const style = runStatusStyles[run.status];
                return (
                  <div key={run.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm tabular-nums">
                        {run.topicsFound} topics &rarr; {run.tweetsPosted} tweets
                      </div>
                      <div className="text-xs text-muted-light mt-0.5">
                        {new Date(run.startedAt).toLocaleString("en-US", SHORT_DATE_FORMAT)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-medium capitalize ${style.text}`}>
                        {run.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic breakdown */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Topic Status</h2>
            <div className="bg-surface border border-border rounded-lg p-5">
              {(["tweeted", "researched", "discovered", "skipped"] as const).map((status) => {
                const count = topics.filter((t) => t.status === status).length;
                const total = topics.length;
                const pct = Math.round((count / total) * 100);
                const colors: Record<string, string> = {
                  tweeted: "bg-status-success",
                  researched: "bg-status-partial",
                  discovered: "bg-blue-500",
                  skipped: "bg-muted-light",
                };
                return (
                  <div key={status} className="flex items-center gap-3 mb-3 last:mb-0">
                    <span className="text-xs text-muted capitalize w-20">{status}</span>
                    <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[status]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted tabular-nums w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
