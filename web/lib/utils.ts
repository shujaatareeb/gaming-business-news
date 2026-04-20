import type { Tweet } from "./mock-data";

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function readTime(text: string): string {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export function buildTweetMap(tweets: Tweet[]): Map<string, Tweet> {
  const map = new Map<string, Tweet>();
  for (const t of tweets) {
    map.set(t.topicId, t);
  }
  return map;
}
