import json

from jsonschema import validate
from jsonschema.exceptions import ValidationError

def filter_invalid_entries(data, schema):
    """
    Removes entries from the data that do not match the schema's type requirements.
    
    :param data: The JSON object to filter.
    :param schema: The schema defining the expected types.
    :return: A new dictionary with only the valid entries according to the schema.
    """
    valid_data = {}
    for key in schema.get("properties", {}).keys():
        required = schema.get("properties", {}).get(key, {}).get("required", False)
        if required:
            valid_data[key] = ""

    for key, value in data.items():
        expected_type = schema.get("properties", {}).get(key, {}).get("type", None)
        if expected_type:
            try:
                if expected_type == "number":
                    if value == None:
                        continue
                    valid_data[key] = float(value) if '.' in str(value) else int(value)
                elif expected_type == "string":
                    if value == None:
                        continue
                    valid_data[key] = str(value)
                else:
                    raise ValueError(f"Unsupported type {expected_type} for key {key}")
            except (ValueError, TypeError):
                print(f"Error converting {key} with value {value} to {expected_type}, skipping...")
                continue
    required_fields_empty = all(valid_data[key] in [None, ""] for key in valid_data if schema.get("properties", {}).get(key, {}).get("required", True))
    if required_fields_empty:
        print("reqfieldemp", json.dumps(valid_data, indent=4))

        raise ValueError("All required fields are either None or empty string.")
    return valid_data



def validate_schema(data: dict):
    # This code validates the schema of the provided JSON data
    # and drops any entries that do not match the schema, effectively
    # filtering out incorrect data.

    # Load the schema
    with open('src/data_collection/watch_schema.json', 'r') as file:
        schema = json.load(file)
    
    # print("BEFORE FILTERING", json.dumps(data, indent=4))
    json_data = filter_invalid_entries(data, schema)
    # print("AFTER FILTERING", json.dumps(json_data, indent=4))


    # Validate the JSON, on failure throw exception
    validate(instance=json_data, schema=schema)
    return json_data  
