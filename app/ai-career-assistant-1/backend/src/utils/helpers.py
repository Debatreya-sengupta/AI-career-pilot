def format_response(data):
    # Function to format the response data
    return {"status": "success", "data": data}

def handle_error(error_message):
    # Function to handle errors and return a standardized error response
    return {"status": "error", "message": error_message}

def validate_input(data, schema):
    # Function to validate input data against a given schema
    from pydantic import ValidationError

    try:
        schema(**data)
        return True
    except ValidationError as e:
        return handle_error(str(e))