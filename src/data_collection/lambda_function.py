import argparse
import json
import logging
import os
from datetime import datetime

import praw
from crud import (
    create_queued_post,
    create_watch,
    get_queued_posts,
    mark_post_as_processed,
)
from database import SessionLocal
from dotenv import load_dotenv
from jsonschema.exceptions import ValidationError
from models import QueuedPost, Watch
from openai import OpenAI
from postgrest.exceptions import APIError
from schema_validator import validate_schema

logging.basicConfig(filename="app.log", level=logging.INFO)
load_dotenv()


def reddit_crawler(time_filter, post_limit, comments_limit):
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
                if comment.author and comment.author.name and comment.body
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


def process_queue(num_requests):
    openai_key = os.environ.get("OPENAI_API_CHRONO_KEY")
    client = OpenAI(api_key=openai_key)

    with open("query_schema.json") as f:
        output_schema_str = f.read()

    try:
        with SessionLocal() as session:
            queue_data = get_queued_posts(session, num_requests)

    except Exception as e:
        logging.error(f"Failed to fetch data from Supabase (rqueue): {str(e)}")
        return

    for item in queue_data:
        try:
            relevant_data = item.get_relevant_data()
            prompt = f"Given the data: {relevant_data}, construct a JSON object that adheres to the specified output schema. Output schema: {output_schema_str}"
            response = client.chat.completions.create(
                model="gpt-3.5-turbo-0125",
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that outputs valid JSON.>",
                    },
                    {"role": "user", "content": prompt},
                ],
            )
            response_json = json.loads(response.choices[0].message.content)
            logging.info(f"Response JSON: {response_json}")
            validated_response = validate_schema(response_json)
            watch = Watch(
                Brand=validated_response.get("Brand", "Unknown"),
                Reference_Number=validated_response.get("Reference Number", "None"),
                Timestamp=item.created_at,
                Model=validated_response.get("Model", None),
                Case_Material=validated_response.get("Case Material", None),
                Case_Diameter=validated_response.get("Case Diameter", None),
                Case_Thickness=validated_response.get("Case Thickness", None),
                Lug_Width=validated_response.get("Lug Width", None),
                Lug_to_Lug=validated_response.get("Lug-to-Lug", None),
                Dial_Color=validated_response.get("Dial Color", None),
                Crystal_Type=validated_response.get("Crystal Type", None),
                Water_Resistance=validated_response.get("Water Resistance", None),
                Movement=validated_response.get("Movement", None),
                Caliber=validated_response.get("Caliber", None),
                Movement_Type=validated_response.get("Movement Type", None),
                Power_Reserve=validated_response.get("Power Reserve", None),
                Bracelet_Strap_Material=validated_response.get(
                    "Bracelet/Strap Material", None
                ),
                Clasp_Type=validated_response.get("Clasp Type", None),
                Product_Weight=validated_response.get("Product Weight", None),
                Features=validated_response.get("Features", None),
                Price=validated_response.get("Price", None),
                Availability=validated_response.get("Availability", None),
                Photo_URL=validated_response.get("Photo URL", None),
                Merchant_Name=validated_response.get("Merchant Name", None),
                Product_URL=validated_response.get("Product URL", None),
            )
            with SessionLocal() as session:
                create_watch(session, watch)
                mark_post_as_processed(session, item.post_id)
        except json.JSONDecodeError as json_err:
            logging.error(
                f"Error in parsing the JSON outputted by OpenAI:\n\t {json_err}"
            )
        except ValidationError as e:
            logging.error(
                f"Schema Validation failed, likely missing some data:\n\tjson:{response_json}\n\terr:{e}"
            )
        except Exception as e:
            logging.error(f"Unknown Exception: {e}")
            raise


def lambda_handler(event, context):
    reddit_crawler("hour", 25, 10)
    process_queue(30)
    return {"statusCode": 200, "body": json.dumps("Hello from Lambda!")}


lambda_handler(None, None)
