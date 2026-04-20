"""Gaming Business News Pipeline — discover, research, write, and post."""

import argparse
import json

from src.discover import fetch_topics
from src.research import research_topic
from src.writer import write_tweet
from src.poster import post_tweet


def run_pipeline(dry_run: bool = False, verbose: bool = False) -> None:
    # 1. Discover
    print("📡 Discovering gaming business topics...")
    topics = fetch_topics()

    if not topics:
        print("No new topics found. Exiting.")
        return

    print(f"Found {len(topics)} topic(s):\n")
    for t in topics:
        print(f"  • {t['title']} ({t['source']})")
    print()

    results = []

    for i, topic in enumerate(topics, 1):
        print(f"[{i}/{len(topics)}] Processing: {topic['title']}")

        # 2. Research
        print("  🔍 Researching...")
        researched = research_topic(topic)
        if verbose:
            print(f"  Research:\n{researched['research']}\n")

        # 3. Write
        print("  ✍️  Writing tweet...")
        written = write_tweet(researched)
        print(f"  Tweet: {written['tweet']}\n")

        # 4. Post
        if dry_run:
            print("  ⏭️  Dry run — skipping post.\n")
            results.append({"topic": topic["title"], "tweet": written["tweet"], "posted": False})
        else:
            print("  🚀 Posting to X...")
            result = post_tweet(written["tweet"])
            if result["success"]:
                print(f"  ✅ Posted: {result['url']}\n")
            else:
                print(f"  ❌ Failed: {result['error']}\n")
            results.append({"topic": topic["title"], "tweet": written["tweet"], "posted": result["success"]})

    # Summary
    print("=" * 50)
    print("Pipeline complete!")
    posted_count = sum(1 for r in results if r.get("posted"))
    print(f"  Topics processed: {len(results)}")
    if not dry_run:
        print(f"  Tweets posted: {posted_count}")

    if verbose:
        print("\nFull results:")
        print(json.dumps(results, indent=2))


def main():
    parser = argparse.ArgumentParser(description="Gaming Business News Pipeline")
    parser.add_argument("--dry-run", action="store_true", help="Run without posting to Twitter")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show detailed output")
    args = parser.parse_args()

    run_pipeline(dry_run=args.dry_run, verbose=args.verbose)


if __name__ == "__main__":
    main()
