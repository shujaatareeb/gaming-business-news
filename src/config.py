import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
TWITTER_ACCESS_SECRET = os.getenv("TWITTER_ACCESS_SECRET")

# Claude model
CLAUDE_MODEL = "claude-sonnet-4-20250514"

# RSS feeds for gaming business news
RSS_FEEDS = [
    "https://www.gamesindustry.biz/feed",
    "https://www.videogameschronicle.com/feed",
    "https://www.gamedeveloper.com/rss.xml",
    "https://kotaku.com/rss",
    "https://www.ign.com/articles?feed=ign-all",
    "https://mobilegamer.biz/feed/",
]

# Keywords to filter for business-relevant stories
BUSINESS_KEYWORDS = [
    "acquisition", "revenue", "layoff", "funding", "ipo", "earnings",
    "merger", "partnership", "investment", "valuation", "market",
    "sales", "profit", "loss", "studio", "publisher", "deal",
    "expansion", "shutdown", "billion", "million", "ceo", "executive",
    "stock", "shares", "quarterly", "annual", "growth", "decline",
    "regulation", "antitrust", "subscription", "gamepass", "live service",
]

# How many hours back to look for news
LOOKBACK_HOURS = 24

# Max topics to process per run
MAX_TOPICS_PER_RUN = 3

# File to track already-posted topics
POSTED_TOPICS_FILE = "posted_topics.json"
