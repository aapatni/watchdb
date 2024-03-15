import argparse
import json
import logging
import os
from datetime import datetime

import praw
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()
# Configure logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)


def main(time_filter, post_limit, comments_limit):
    # Reddit API Credentials
    client_id = os.environ.get("REDDIT_APP_ID")
    client_secret = os.environ.get("REDDIT_APP_KEY")

    # Supabase Credentials
    supabase_url = os.environ.get("SUPABASE_WATCHDB_URL")
    supabase_key = os.environ.get("SUPABASE_WATCHDB_SERVICE_ROLE_KEY")

    logging.info(f"Reddit client_id: {client_id}")
    logging.info(f"Reddit client_secret: {client_secret}")

    # Initialize PRAW with credentials
    user_agent = "User-Agent:chrono-codex-server:v1 (by /u/ChronoCrawler)"
    reddit = praw.Reddit(
        client_id=client_id, client_secret=client_secret, user_agent=user_agent
    )
    logging.info("PRAW Reddit client initialized successfully.")

    # Initialize Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    logging.info("Supabase client initialized successfully.")

    subreddit = reddit.subreddit("watchexchange")
    logging.info(f"Subreddit set to: {subreddit.display_name}")

    # Fetch the top posts from the subreddit
    top_posts = subreddit.top(time_filter=time_filter, limit=post_limit)
    logging.info(
        f"Fetched top posts with time_filter={time_filter} and post_limit={post_limit}"
    )

    # Push the data collected to Supabase
    for post in top_posts:
        comments = ""
        post.comment_sort = "top"
        post.comments.replace_more(limit=0)
        for comment in post.comments.list():
            if comment.author and comment.author.name == post.author.name:
                comments += f"{comment.author.name}: {comment.body}"
                break

        post.comments.replace_more(limit=comments_limit)

        max_iter = min(len(post.comments), comments_limit)
        for i in range(max_iter):
            if (
                post.comments[i].author
                and post.comments[i].author.name
                and post.comments[i].body
            ):
                comments += (
                    f" | {post.comments[i].author.name}: {post.comments[i].body}"
                )
        # comments = " | ".join(
        #     [
        #         f"{comment.author.name}: {comment.body}"
        #         for comment in post.comments.list()
        #         if comment.author and comment.author.name and comment.body
        #     ]
        # )
        logging.info(f"Collected comments for post ID: {post.id}")
        logging.info(f"comments: {len(comments)}{comments}")

        post_data = {
            "post_id": post.id,
            "created_at": datetime.utcfromtimestamp(post.created_utc).strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "author_id": post.author.name,
            "title": post.title,
            "url": post.url,
            "comments": comments,
            "processed": False,
        }

        try:
            data, error = supabase.table("queued_posts").insert(post_data).execute()
            logging.info(f"Data inserted successfully for post ID: {post.id}")
        except Exception as e:
            if hasattr(e, "args") and len(e.args) > 0:
                error_message = e.args[0]
                if (
                    "23505" in error_message
                ):  # Check if the error message contains the unique constraint violation code
                    logging.warning(
                        f"Duplicate entry for post ID: {post.id}, skipping."
                    )
                else:
                    logging.error(f"Error inserting data: {error_message}")
            else:
                logging.error(f"Error inserting data with unknown format: {e}")


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
