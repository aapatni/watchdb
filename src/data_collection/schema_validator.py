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
    for key, value in data.items():
        expected_type = schema.get("properties", {}).get(key, {}).get("type", None)
        if expected_type:
            if expected_type == "number" and value is not None:
                print(key,value)
                try:
                    converted_value = int(value)
                except ValueError:
                    try:
                        converted_value = float(value)
                    except ValueError:
                        continue
                valid_data[key] = converted_value
            elif expected_type == "string" and isinstance(value, str):
                valid_data[key] = value
    return valid_data



def validate_schema(data: dict):
    # This code validates the schema of the provided JSON data
    # and drops any entries that do not match the schema, effectively
    # filtering out incorrect data.

    # Load the schema
    with open('watch_schema.json', 'r') as file:
        schema = json.load(file)

    json_data = filter_invalid_entries(data, schema)

    # Validate the JSON, on failure throw exception
    validate(instance=json_data, schema=schema)
    return json_data  
    
