"""Generate tweets from researched gaming business topics using Claude."""

from src.client import client
from src.config import CLAUDE_MODEL


def write_tweet(researched_topic: dict) -> dict:
    """Generate a tweet from a researched topic.

    Args:
        researched_topic: Dict with keys: title, summary, link, source, research.

    Returns:
        Dict with original data plus 'tweet' key containing the tweet text.
    """
    prompt = f"""You are a sharp gaming business news commentator on Twitter/X. Write a tweet about this story.

HEADLINE: {researched_topic['title']}
SOURCE: {researched_topic['source']}
LINK: {researched_topic['link']}

RESEARCH BRIEF:
{researched_topic['research']}

RULES:
- Max 280 characters (this is critical — count carefully)
- Lead with the news, then add a sharp take or insight
- Use plain language, no jargon
- No hashtags (they look spammy)
- No emojis unless they genuinely add meaning
- Include the source link at the end
- Sound informed and opinionated, not robotic
- Write like a knowledgeable insider, not a news aggregator

Return ONLY the tweet text, nothing else."""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )

    tweet = response.content[0].text.strip()

    # Safety check: truncate if somehow over 280
    if len(tweet) > 280:
        tweet = tweet[:277] + "..."

    return {**researched_topic, "tweet": tweet}
