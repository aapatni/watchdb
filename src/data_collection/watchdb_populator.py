import argparse
import json
import logging
import os
from supabase import create_client, Client
from jsonschema.exceptions import ValidationError
from dotenv import load_dotenv
from schema_validator import validate_schema
from openai import OpenAI
from postgrest.exceptions import APIError
load_dotenv()

# Configure logging
logging.basicConfig(filename="app.log", level=logging.INFO)

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_WATCHDB_URL")
key: str = os.environ.get("SUPABASE_WATCHDB_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

def process_queue(num_requests):
    openai_key = os.environ.get("OPENAI_API_CHRONO_KEY")
    client = OpenAI(api_key=openai_key)

    with open("src/data_collection/query_schema.json") as f:
        output_schema_str = f.read()

    try:
        queue_data = supabase.table("queued_posts").select("*").eq("processed", False).limit(num_requests).execute()

        # if queue_data.error:
        #     raise Exception(queue_data.error.message)
        queue_data = queue_data.data

    except Exception as e:
        logging.error(f"Failed to fetch data from Supabase: {str(e)}")
        return

    for item in queue_data:
        try:
            relevant_data = json.dumps(
                {
                    "author_id": item['author_id'],
                    "title": item['title'],
                    "comments": item['comments'],
                    "url": item['url'],
                }
            )  
            prompt = f"Given the data: {relevant_data}, construct a JSON object that adheres to the specified output schema. Output schema: {output_schema_str}"
            response = client.chat.completions.create(
                model="gpt-3.5-turbo-0125",
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that outputs valid JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
            )
            response_json = json.loads(response.choices[0].message.content)
            logging.info(f"Response JSON: {response_json}")
            validated_response = validate_schema(response_json)
            # print("validated response: ", validated_response, type(validated_response))
            validated_response['Timestamp']=item['created_at']
            # validated_response['processed'] = True  # Mark as processed
            # validated_response['post_id'] = item['id']  # Assuming 'id' is the correct field

            # Insert or update the watch data in Supabase
            response = supabase.table("watches").insert(validated_response).execute()

            # Mark the original post as processed
            response = supabase.table("queued_posts").update({"processed": True}).eq("post_id", item['post_id']).execute()


        except json.JSONDecodeError as json_err:
            logging.error(f"Error in parsing the JSON outputted by OpenAI:\n\t {json_err}")
        except ValidationError as e:
            logging.error(
                f"Schema Validation failed, likely missing some data:\n\tjson:{response_json}\n\terr:{e}"
            )
        except APIError as api_err:
            if api_err.code == '23505':
                response = supabase.table("queued_posts").update({"processed": True}).eq("post_id", item['post_id']).execute()
                print("Duplicate entry, skipping.")
            else:
                print("API Error: ", api_err)
        except Exception as e:
            logging.error(f"Unknown Exception: {e}")
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
