"""Post tweets to Twitter/X using the v2 API."""

import tweepy

from src.config import (
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET,
)

_client = tweepy.Client(
    consumer_key=TWITTER_API_KEY,
    consumer_secret=TWITTER_API_SECRET,
    access_token=TWITTER_ACCESS_TOKEN,
    access_token_secret=TWITTER_ACCESS_SECRET,
)


def post_tweet(tweet_text: str) -> dict:
    """Post a tweet to Twitter/X.

    Args:
        tweet_text: The tweet content (max 280 chars).

    Returns:
        Dict with tweet id and text on success, or error info on failure.
    """
    try:
        response = _client.create_tweet(text=tweet_text)
        tweet_id = response.data["id"]
        return {
            "success": True,
            "tweet_id": tweet_id,
            "text": tweet_text,
            "url": f"https://x.com/i/status/{tweet_id}",
        }
    except tweepy.TweepyException as e:
        return {
            "success": False,
            "error": str(e),
            "text": tweet_text,
        }
