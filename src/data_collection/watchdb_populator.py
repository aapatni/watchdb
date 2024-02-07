import argparse
import os
import json
from openai import OpenAI
from supabase import create_client, Client
from schema_validator import validate_schema

def process_queue(supabase_url, supabase_key, openai_key):
    url: str = os.environ.get('SUPABASE_WATCHDB_URL')
    key: str = os.environ.get('SUPABASE_WATCHDB_SERVICE_ROLE_KEY')
    openai_key = os.environ.get('OPENAI_API_CHRONO_KEY')

    # Supabase setup
    supabase: Client = create_client(supabase_url, supabase_key)

    # Set the API key for OpenAI
    client = OpenAI(
        api_key=openai_key
    )

    with open('src/data_collection/query_schema.json') as f:
        output_schema_str = f.read()

    # Fetch data from Supabase queue
    try:
        queue_data = supabase.table('rqueue').select('*').eq('processed', False).limit(1).execute()
        if len(queue_data.data) < 2:  # Fixed to check for non-empty data
            for item in queue_data.data:
                relevant_data = {key: item[key] for key in ["author_id", "title", "url", "comments"]}
                item_json = json.dumps(relevant_data)
                prompt = f"Given the data: {item_json}, construct a JSON object that adheres to the specified output schema. Output schema: {output_schema_str}"
                try:
                    response = client.chat.completions.create( 
                        model="gpt-3.5-turbo-0125", 
                        response_format={ "type": "json_object" },
                        messages=[{"role": "system", "content": "You are a helpful assistant that outputs valid JSON.>"}, 
                                    {"role": "user", "content": prompt}],
                    )
                    try:
                        response_json = json.loads(response.choices[0].message.content)
                    except Exception as e:
                        print("Error in openai response: ", e)

                    try:
                        validated_response = validate_schema(response_json)
                        try:
                            # supabase.table("watches").insert([validated_response]).execute()
                            supabase.table("rqueue").update({"processed": True}).eq("post_id", item["post_id"]).execute()
                        except Exception as e:
                            print(f"Failed to push to supabase (watches): {e}")
                    except Exception as e:
                        print(f"current response could not be validated: {e}")
                    
                except Exception as e:
                    print(f"An OpenAI error occurred: {e}")
            

    except Exception as e:
        print(f"Failed to fetch data from Supabase (rqueue): {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process queue items and format them using OpenAI")
    # parser.add_argument("--supabase_url", required=True, help="Supabase project URL")
    # parser.add_argument("--supabase_key", required=True, help="Supabase service role key")
    # parser.add_argument("--openai_key", required=True, help="OpenAI API key")

    args = parser.parse_args()

    process_queue(args.supabase_url, args.supabase_key, args.openai_key)
