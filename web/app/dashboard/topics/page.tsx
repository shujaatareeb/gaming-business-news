import { topics } from "@/lib/mock-data";
import { categoryColors } from "@/lib/constants";

const statusStyles: Record<string, { dot: string; text: string }> = {
  discovered: { dot: "bg-blue-500", text: "text-blue-600" },
  researched: { dot: "bg-status-partial", text: "text-status-partial" },
  tweeted: { dot: "bg-status-success", text: "text-status-success" },
  skipped: { dot: "bg-muted-light", text: "text-muted" },
};

export default function TopicsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold">Topics</h1>
        <p className="text-sm text-muted mt-0.5">
          {topics.length} stories discovered in the last 24 hours
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-alt">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Story</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted w-28">Category</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted w-24">Source</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted w-28">Status</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted w-32">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topics.map((topic) => {
              const style = statusStyles[topic.status];
              return (
                <tr key={topic.id} className="hover:bg-surface-alt/50 transition">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium leading-snug">{topic.title}</div>
                    <div className="text-xs text-muted mt-1 line-clamp-1">{topic.summary}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${categoryColors[topic.category] || ""}`}>
                      {topic.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">{topic.source}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-medium capitalize ${style.text}`}>
                        {topic.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted tabular-nums">
                    {new Date(topic.published).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
