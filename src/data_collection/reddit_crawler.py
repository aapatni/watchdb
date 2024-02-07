import praw
import os
import json
import time
import argparse

from supabase import create_client, Client

def main(time_filter, post_limit, comments_limit):
    # Supabase setup
    url: str = os.environ.get('SUPABASE_WATCHDB_URL')
    key: str = os.environ.get('SUPABASE_WATCHDB_SERVICE_ROLE_KEY')
    supabase: Client = create_client(url, key)

    # Reddit API Credentials
    client_id = os.environ.get('REDDIT_APP_ID')
    client_secret = os.environ.get('REDDIT_APP_KEY')
    user_agent = 'User-Agent:chrono-codex-server:v1 (by /u/ChronoCrawler)'

    # Initialize PRAW with your credentials
    reddit = praw.Reddit(client_id=client_id,
                        client_secret=client_secret,
                        user_agent=user_agent)

    # The subreddit you want to scrape
    subreddit = reddit.subreddit('watchexchange')

    # Fetch the top posts from the subreddit
    top_posts = subreddit.top(time_filter=time_filter, limit=post_limit)

    # Push the data collected to Supabase
    for post in top_posts:
        post.comments.replace_more(limit=comments_limit)  # Load all comments
        comments = ' | '.join([f"{comment.author.name}: {comment.body}" for comment in post.comments.list()])

        post_data = {
            'post_id': post.id,
            'author_id': post.author.name,
            'title': post.title,
            'url': post.url,
            'comments': comments
        }
        
        try:
            # Attempt to insert post_data into your Supabase table
            data_insert_response = supabase.table('rqueue').insert(post_data).execute()
        except Exception as e:
            if 'duplicate key value violates unique constraint "rqueue_pkey"' in str(e):
                print(f"Skipping insertion for post_id={post_data['post_id']} as it already exists.")
            else:
                raise

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Reddit Crawler for Subreddit Posts")
    parser.add_argument("--time_filter", help="Time filter for posts", default="hour")
    parser.add_argument("--post_limit", help="Limit of posts to fetch", type=int, default=10)
    parser.add_argument("--comments_limit", help="Limit of comments to fetch for each post", type=int, default=25)
    
    args = parser.parse_args()
    
    main(args.time_filter, args.post_limit, args.comments_limit)

