"""Discover trending gaming business topics from RSS feeds."""

import json
import hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path
from time import mktime

import feedparser

from src.config import (
    RSS_FEEDS,
    BUSINESS_KEYWORDS,
    LOOKBACK_HOURS,
    MAX_TOPICS_PER_RUN,
    POSTED_TOPICS_FILE,
)


def _load_posted_topics() -> set[str]:
    path = Path(POSTED_TOPICS_FILE)
    if not path.exists():
        return set()
    with open(path) as f:
        return set(json.load(f))


def _save_posted_topics(topic_ids: set[str]) -> None:
    # Keep only last 500 to prevent unbounded growth
    recent = list(topic_ids)[-500:]
    with open(POSTED_TOPICS_FILE, "w") as f:
        json.dump(recent, f)


def _topic_id(title: str) -> str:
    return hashlib.md5(title.lower().strip().encode()).hexdigest()


def _is_business_relevant(title: str, summary: str) -> bool:
    text = f"{title} {summary}".lower()
    return any(kw in text for kw in BUSINESS_KEYWORDS)


def _parse_date(entry) -> datetime | None:
    for field in ("published_parsed", "updated_parsed"):
        parsed = getattr(entry, field, None)
        if parsed:
            try:
                return datetime.fromtimestamp(mktime(parsed), tz=timezone.utc)
            except (ValueError, OverflowError):
                continue
    return None


def fetch_topics() -> list[dict]:
    """Fetch and filter gaming business news topics from RSS feeds.

    Returns a list of dicts with keys: id, title, summary, link, source, published.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(hours=LOOKBACK_HOURS)
    posted = _load_posted_topics()
    topics = []

    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
        except Exception:
            continue

        source = feed.feed.get("title", feed_url)

        for entry in feed.entries:
            title = entry.get("title", "")
            summary = entry.get("summary", "")
            link = entry.get("link", "")
            tid = _topic_id(title)

            if tid in posted:
                continue

            pub_date = _parse_date(entry)
            if pub_date and pub_date < cutoff:
                continue

            if not _is_business_relevant(title, summary):
                continue

            topics.append({
                "id": tid,
                "title": title,
                "summary": summary,
                "link": link,
                "source": source,
                "published": pub_date.isoformat() if pub_date else None,
            })

    seen = set()
    unique = []
    for t in topics:
        if t["id"] not in seen:
            seen.add(t["id"])
            unique.append(t)

    # Sort by recency (newest first)
    unique.sort(key=lambda t: t["published"] or "", reverse=True)
    selected = unique[:MAX_TOPICS_PER_RUN]

    # Mark as posted
    new_posted = posted | {t["id"] for t in selected}
    _save_posted_topics(new_posted)

    return selected
