"use client";

import { useState } from "react";
import { pipelineRuns } from "@/lib/mock-data";
import { runStatusStyles, SHORT_DATE_FORMAT } from "@/lib/constants";

export default function RunsPage() {
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 3000);
  };

  const totalRuns = pipelineRuns.length;
  const successRate = Math.round(
    (pipelineRuns.filter((r) => r.status === "success").length / totalRuns) * 100
  );
  const totalTweeted = pipelineRuns.reduce((sum, r) => sum + r.tweetsPosted, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Pipeline</h1>
          <p className="text-sm text-muted mt-0.5">
            {totalRuns} runs &middot; {successRate}% success rate &middot; {totalTweeted} tweets posted
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 bg-foreground hover:bg-foreground/90 disabled:opacity-50 text-surface text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          {running ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running...
            </>
          ) : (
            "Run Pipeline"
          )}
        </button>
      </div>

      {/* Schedule info */}
      <div className="bg-surface border border-border rounded-lg px-5 py-4 mb-6 flex items-center gap-3 text-sm">
        <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
        <span className="text-muted">Automated schedule:</span>
        <span className="font-medium">09:00, 14:00, 19:00 UTC daily</span>
        <span className="text-muted-light">&middot;</span>
        <span className="text-muted">via GitHub Actions</span>
      </div>

      {/* Runs table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-alt">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Started</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Duration</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Topics</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Tweeted</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pipelineRuns.map((run) => {
              const start = new Date(run.startedAt);
              const end = new Date(run.completedAt);
              const durationSec = Math.round((end.getTime() - start.getTime()) / 1000);
              const style = runStatusStyles[run.status];

              return (
                <tr key={run.id} className="hover:bg-surface-alt/50 transition">
                  <td className="px-5 py-4 text-sm tabular-nums">
                    {start.toLocaleDateString("en-US", SHORT_DATE_FORMAT)}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted tabular-nums">
                    {durationSec < 60
                      ? `${durationSec}s`
                      : `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`}
                  </td>
                  <td className="px-5 py-4 text-sm tabular-nums">{run.topicsFound}</td>
                  <td className="px-5 py-4 text-sm tabular-nums">{run.tweetsPosted}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-medium capitalize ${style.text}`}>
                        {run.status}
                      </span>
                    </span>
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
