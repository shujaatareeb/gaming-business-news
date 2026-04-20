"""Research a gaming business topic using web scraping and Claude."""

import requests
from bs4 import BeautifulSoup

from src.client import client
from src.config import CLAUDE_MODEL


def _scrape_article(url: str) -> str:
    """Extract main text content from a URL."""
    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (compatible; GamingNewsBot/1.0)"
        })
        resp.raise_for_status()
    except requests.RequestException:
        return ""

    soup = BeautifulSoup(resp.text, "html.parser")

    # Remove noise
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "iframe"]):
        tag.decompose()

    # Try common article containers
    article = soup.find("article") or soup.find("main") or soup.find("body")
    if not article:
        return ""

    text = article.get_text(separator="\n", strip=True)
    # Truncate to ~3000 chars to stay within reasonable token limits
    return text[:3000]


def research_topic(topic: dict) -> dict:
    """Research a topic by scraping its source and synthesizing with Claude.

    Args:
        topic: Dict with keys: title, summary, link, source.

    Returns:
        Dict with original topic data plus 'research' key containing
        Claude's analysis.
    """
    article_text = _scrape_article(topic["link"])

    prompt = f"""You are a gaming industry business analyst. Analyze this news story and provide a concise research brief.

HEADLINE: {topic['title']}
SOURCE: {topic['source']}
SUMMARY: {topic['summary']}

FULL ARTICLE TEXT:
{article_text if article_text else '[Could not retrieve full article — work with headline and summary only]'}

Provide:
1. **Key Facts**: The core business facts (numbers, companies, deals involved)
2. **Why It Matters**: Why this matters for the gaming industry (2-3 sentences)
3. **Context**: Any relevant industry context (recent trends, competing moves)
4. **Hot Take**: A sharp, opinionated angle that would resonate on Twitter/X

Keep it concise and factual. Focus on the business angle, not gameplay."""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    research = response.content[0].text

    return {**topic, "research": research}
