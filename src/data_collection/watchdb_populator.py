import argparse
import json
import os

from crud import create_watch
from databse import SessionLocal
from jsonschema.exceptions import ValidationError
from models import Watch
from openai import OpenAI
from postgrest.exceptions import APIError
from schema_validator import validate_schema
from supabase import Client, create_client


def handle_exception(e, context=""):
    print(f"{context}: {str(e)}")


def process_queue(num_requests):
    supabase_url: str = os.environ.get("SUPABASE_WATCHDB_URL")
    supabase_key: str = os.environ.get("SUPABASE_WATCHDB_SERVICE_ROLE_KEY")
    openai_key = os.environ.get("OPENAI_API_CHRONO_KEY")

    # Supabase setup
    supabase: Client = create_client(supabase_url, supabase_key)

    # Set the API key for OpenAI
    client = OpenAI(api_key=openai_key)

    with open("src/data_collection/query_schema.json") as f:
        output_schema_str = f.read()

    # Fetch data from Supabase queue
    try:
        queue_data = (
            supabase.table("rqueue")
            .select("*")
            .eq("processed", False)
            .limit(num_requests)
            .execute()
        )
    except Exception as e:
        print(f"Failed to fetch data from Supabase (rqueue): {str(e)}")
        return

    for item in queue_data.data:
        try:
            relevant_data = {
                key: item[key] for key in ["author_id", "title", "url", "comments"]
            }
            item_json = json.dumps(relevant_data)
            prompt = f"Given the data: {item_json}, construct a JSON object that adheres to the specified output schema. Output schema: {output_schema_str}"
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
            validated_response = validate_schema(response_json)
            watch = Watch()

            supabase.table("watches").insert([validated_response]).execute()
            supabase.table("rqueue").update({"processed": True}).eq(
                "post_id", item["post_id"]
            ).execute()
        except json.JSONDecodeError as json_err:
            print(f"Error in parsing the JSON outputted by OpenAI:\n\t {e}")
        except ValidationError as e:
            print(
                f"Schema Validation failed, likely missing some data:\n\tjson:{response_json}\n\terr:{e}"
            )
        except APIError as api_error:
            if api_error.code == "23505":
                # there's a duplicate, so let's mark this watch as processed (TODO: let's solve the duplication issue properly)
                supabase.table("rqueue").update({"processed": True}).eq(
                    "post_id", item["post_id"]
                ).execute()
            if "rqueue" in str(api_error):
                print(f"Failed to write processed flag to supabase: {str(api_error)}")
            elif "watches" in str(api_error):
                print(f"Failed to write watch data to supabase: {str(api_error)}")
        except Exception as e:
            print(f"Unkown Exception: {e}")
            raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Process queue items and format them using OpenAI"
    )
    parser.add_argument(
        "--num_requests",
        type=int,
        required=True,
        default=5,
        help="Max number of requests to process from the queue",
    )

    args = parser.parse_args()

    process_queue(args.num_requests)
