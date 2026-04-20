"""Fetch gaming business news from RSS feeds, rewrite as original articles, update mock-data.ts."""

import feedparser
import requests
import re
import json
import os
from bs4 import BeautifulSoup
from datetime import datetime, timezone, timedelta
from time import mktime
from openai import OpenAI

client = OpenAI()

FEEDS = [
    "https://www.gamesindustry.biz/feed",
    "https://www.gamedeveloper.com/rss.xml",
    "https://www.videogameschronicle.com/feed",
    "https://kotaku.com/rss",
    "https://www.ign.com/articles?feed=ign-all",
    "https://mobilegamer.biz/feed/",
    "https://esportsinsider.com/feed",
    "https://dotesports.com/feed",
    "https://www.dexerto.com/feed",
    "https://www.theverge.com/games/rss/index.xml",
    "https://www.reuters.com/technology/rss",
    "https://feeds.bloomberg.com/technology/news.rss",
    "https://newzoo.com/feed",
    "https://nikopartners.com/feed",
    "https://sensortower.com/blog/feed",
]

KEYWORDS = [
    "acquisition", "revenue", "layoff", "funding", "ipo", "earnings",
    "merger", "partnership", "investment", "valuation", "market",
    "sales", "profit", "loss", "publisher", "deal", "esport",
    "expansion", "shutdown", "billion", "million", "ceo", "executive",
    "regulation", "antitrust", "subscription", "restructuring",
    "settlement", "lawsuit", "union", "ai tools", "agentic",
    "layoffs", "closes", "bought", "sold", "raise", "competitive",
    "studio", "growth", "decline", "stock", "quarterly", "annual",
    "forecast", "report", "results", "sponsor", "team", "org",
    "streaming", "broadcast", "prize", "franchise", "league",
    "tournament", "console", "hardware", "mobile", "free-to-play",
    "live service", "gamepass", "platform", "developer", "indie",
]

CATEGORIES = {
    "layoff": "Strategy", "restructuring": "Strategy", "shutdown": "Strategy",
    "union": "Strategy", "closes": "Strategy", "settlement": "Strategy",
    "lawsuit": "Strategy",
    "acquisition": "M&A", "merger": "M&A", "bought": "M&A", "deal": "M&A",
    "revenue": "Earnings", "earnings": "Earnings", "profit": "Earnings",
    "quarterly": "Earnings",
    "funding": "Funding", "investment": "Funding", "raise": "Funding",
    "ipo": "Funding",
    "esport": "Esports", "tournament": "Esports", "competitive": "Esports",
    "league": "Esports",
    "hardware": "Hardware", "console": "Hardware", "switch": "Hardware",
    "subscription": "Subscriptions", "gamepass": "Subscriptions",
    "mobile": "Mobile", "free-to-play": "Mobile",
}

SYSTEM = """You are a senior gaming business journalist at GamePulse. Write original articles.

AP STYLE: Spell out one-nine, numerals 10+. Numerals for money. "said" not "stated." Lede under 35 words. Short paragraphs (1-3 sentences). Sentence case.

NEVER USE: delve, realm, tapestry, landscape, leverage, utilize, robust, seamless, comprehensive, cutting-edge, holistic, synergy, paradigm, empower, innovative, transformative. No "It's important to note," "In today's X," "Moving forward," "At the end of the day." No throat-clearing. No corporate buzzwords. No "Not just X—it's Y."

VOICE: Direct. Specific. Numbers and names. Delete words that add no meaning. No source publication references. Body paragraphs only, no headline."""

MAX_ARTICLES = 50


def scrape(url):
    try:
        r = requests.get(url, timeout=12, headers={"User-Agent": "Mozilla/5.0"})
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        for t in soup(["script", "style", "nav", "footer", "header", "aside", "iframe", "figure"]):
            t.decompose()
        a = soup.find("article") or soup.find("main") or soup.find("body")
        return a.get_text(separator="\n", strip=True)[:3500] if a else ""
    except Exception:
        return ""


def get_image(entry, summary):
    for f in ("media_content", "media_thumbnail"):
        m = getattr(entry, f, [])
        if m:
            return m[0].get("url", "")
    enc = entry.get("enclosures", [])
    if enc:
        return enc[0].get("href", "")
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', summary)
    return imgs[0] if imgs else ""


def categorize(text):
    t = text.lower()
    for kw, cat in CATEGORIES.items():
        if kw in t:
            return cat
    return "Strategy"


def main():
    cutoff = datetime.now(timezone.utc) - timedelta(days=60)
    stories = []

    for url in FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:80]:
                title = entry.get("title", "")
                summary = entry.get("summary", "")
                link = entry.get("link", "")
                pub_date = None
                for field in ("published_parsed", "updated_parsed"):
                    p = getattr(entry, field, None)
                    if p:
                        try:
                            pub_date = datetime.fromtimestamp(mktime(p), tz=timezone.utc)
                        except (ValueError, OverflowError):
                            pass
                        break
                if pub_date and pub_date < cutoff:
                    continue
                text = f"{title} {summary}".lower()
                if not any(kw in text for kw in KEYWORDS):
                    continue
                image = get_image(entry, summary)
                clean = re.sub(r"<[^>]+>", "", summary).strip()[:300]
                stories.append({
                    "title": title, "summary": clean, "link": link,
                    "image": image, "category": categorize(f"{title} {clean}"),
                    "published": pub_date.isoformat() if pub_date else None,
                })
        except Exception as e:
            print(f"Feed error {url}: {e}")

    # Deduplicate
    seen = set()
    unique = []
    for s in stories:
        key = s["title"][:40].lower()
        if key not in seen:
            seen.add(key)
            unique.append(s)
    stories = sorted(unique, key=lambda x: x.get("published") or "", reverse=True)[:MAX_ARTICLES]
    print(f"Found {len(stories)} stories. Rewriting...")

    for i, story in enumerate(stories):
        print(f"[{i + 1}/{len(stories)}] {story['title'][:55]}...")
        source_text = scrape(story["link"])
        try:
            resp = client.chat.completions.create(
                model="gpt-4o-mini", max_tokens=1800,
                messages=[
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": f"Write 4-5 paragraph article:\n\nHEADLINE: {story['title']}\nSUMMARY: {story['summary']}\nSOURCE:\n{source_text if source_text else '[Use headline/summary]'}"},
                ],
            )
            story["body"] = resp.choices[0].message.content.strip()
        except Exception as e:
            print(f"  Body failed: {e}")
            story["body"] = story["summary"]
        try:
            resp2 = client.chat.completions.create(
                model="gpt-4o-mini", max_tokens=60,
                messages=[
                    {"role": "system", "content": "AP Style headline. Sentence case. Present tense. Under 10 words. No period. Return ONLY the headline."},
                    {"role": "user", "content": f"Rewrite: {story['title']}"},
                ],
            )
            story["title"] = resp2.choices[0].message.content.strip().strip("\"'").rstrip(".")
        except Exception:
            pass
        try:
            resp3 = client.chat.completions.create(
                model="gpt-4o-mini", max_tokens=100,
                messages=[
                    {"role": "system", "content": "Two sentences. Direct, factual. No AI words. No source refs."},
                    {"role": "user", "content": f"Summarize:\n{story['body'][:500]}"},
                ],
            )
            story["summary"] = resp3.choices[0].message.content.strip()
        except Exception:
            pass
        if "link" in story:
            del story["link"]

    # Update mock-data.ts
    ts_path = os.path.join(os.path.dirname(__file__), "..", "web", "lib", "mock-data.ts")
    with open(ts_path) as f:
        ts = f.read()

    start = ts.index("export const topics: Topic[] = [")
    end = ts.index("];\n\nexport const tweets") + 2

    lines = ["export const topics: Topic[] = [\n"]
    for i, art in enumerate(stories):
        img = art["image"] if art.get("image") else f"https://picsum.photos/seed/gp-{i}/800/450"
        body = json.dumps(art.get("body", art["summary"]))[1:-1]
        title = json.dumps(art["title"])[1:-1]
        summary = json.dumps(art["summary"])[1:-1]
        status = "tweeted" if i < 20 else "researched" if i < 35 else "discovered"
        lines.append(f'''  {{
    id: "{i + 1}",
    title: "{title}",
    source: "GamePulse Editorial",
    link: "/story/{i + 1}",
    published: "{art['published']}",
    status: "{status}",
    category: "{art['category']}",
    image: "{img}",
    summary: "{summary}",
    body: "{body}",
  }},
''')
    lines.append("];")
    new_ts = ts[:start] + "".join(lines) + ts[end:]

    with open(ts_path, "w") as f:
        f.write(new_ts)
    print(f"Updated mock-data.ts with {len(stories)} articles")


if __name__ == "__main__":
    main()
