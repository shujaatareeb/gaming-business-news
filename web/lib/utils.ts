import type { Tweet } from "./mock-data";

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function readTime(text: string): string {
  // Generate a deterministic 3-6 min read time based on content hash
  let hash = 0;
  for (let i = 0; i < Math.min(text.length, 50); i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  const mins = 3 + (Math.abs(hash) % 4); // 3, 4, 5, or 6
  return `${mins} min read`;
}

export function buildTweetMap(tweets: Tweet[]): Map<string, Tweet> {
  const map = new Map<string, Tweet>();
  for (const t of tweets) {
    map.set(t.topicId, t);
  }
  return map;
}
