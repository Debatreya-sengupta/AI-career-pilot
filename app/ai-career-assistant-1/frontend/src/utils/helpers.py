def format_date(date):
    return date.strftime("%B %d, %Y")

def format_error_message(error):
    return f"Error: {error}"

def validate_file_extension(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def extract_keywords(text):
    # Placeholder for a more complex keyword extraction logic
    return text.split()[:10]  # Return first 10 words as keywords

def clean_text(text):
    return ' '.join(text.split())  # Remove extra whitespace

def generate_unique_id():
    import uuid
    return str(uuid.uuid4())