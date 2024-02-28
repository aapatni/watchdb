import argparse
import json
import logging  # Added logging module
import os

from crud import create_watch, get_queued_posts, mark_post_as_processed
from database import SessionLocal
from jsonschema.exceptions import ValidationError
from models import Watch
from openai import OpenAI
from schema_validator import validate_schema
from supabase import Client, create_client

# Configure logging
logging.basicConfig(filename="app.log", level=logging.INFO)


def process_queue(num_requests):
    openai_key = os.environ.get("OPENAI_API_CHRONO_KEY")
    client = OpenAI(api_key=openai_key)

    with open("src/data_collection/query_schema.json") as f:
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
            logging.error(f"Error in parsing the JSON outputted by OpenAI:\n\t {e}")
        except ValidationError as e:
            logging.error(
                f"Schema Validation failed, likely missing some data:\n\tjson:{response_json}\n\terr:{e}"
            )
        except Exception as e:
            logging.error(f"Unkown Exception: {e}")
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
