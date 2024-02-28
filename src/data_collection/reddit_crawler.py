import argparse
import json
import logging
import os
import time
from datetime import datetime

import praw
from crud import create_queued_post
from database import SessionLocal
from models import QueuedPost
from postgrest.exceptions import APIError

# Configure logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)


def main(time_filter, post_limit, comments_limit):
    # Reddit API Credentials
    client_id = os.environ.get("REDDIT_APP_ID")
    client_secret = os.environ.get("REDDIT_APP_KEY")

    logging.info(f"Reddit client_id: {client_id}")
    logging.info(f"Reddit client_secret: {client_secret}")

    # Initialize PRAW with credentials
    user_agent = "User-Agent:chrono-codex-server:v1 (by /u/ChronoCrawler)"
    reddit = praw.Reddit(
        client_id=client_id, client_secret=client_secret, user_agent=user_agent
    )
    logging.info("PRAW Reddit client initialized successfully.")

    subreddit = reddit.subreddit("watchexchange")
    logging.info(f"Subreddit set to: {subreddit.display_name}")

    # Fetch the top posts from the subreddit
    top_posts = subreddit.top(time_filter=time_filter, limit=post_limit)
    logging.info(
        f"Fetched top posts with time_filter={time_filter} and post_limit={post_limit}"
    )

    # Push the data collected to Supabase
    for post in top_posts:
        post.comments.replace_more(limit=comments_limit)  # Load all comments
        comments = " | ".join(
            [
                f"{comment.author.name}: {comment.body}"
                for comment in post.comments.list()
            ]
        )
        logging.debug(f"Collected comments for post ID: {post.id}")

        post_data = QueuedPost(
            post_id=post.id,
            created_at=datetime.utcfromtimestamp(post.created_utc).strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            author_id=post.author.name,
            title=post.title,
            url=post.url,
            comments=comments,
        )

        try:
            with SessionLocal() as session:
                create_queued_post(session, post_data)
            logging.info(f"Data inserted successfully for post ID: {post.id}")
        except APIError as api_error:
            logging.error(f"API Error: {api_error}")
            if api_error.code == "23505":
                logging.warning(f"Duplicate entry ({post.id}), skipping")
            else:
                raise api_error


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Reddit WatchExchange Crawler")
    parser.add_argument("--time_filter", help="Time filter for posts", default="hour")
    parser.add_argument(
        "--post_limit", help="Limit of posts to fetch", type=int, default=10
    )
    parser.add_argument(
        "--comments_limit",
        help="Limit of comments to fetch for each post",
        type=int,
        default=25,
    )

    args = parser.parse_args()

    main(args.time_filter, args.post_limit, args.comments_limit)
