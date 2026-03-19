import os

class Config:
    API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
    DEBUG = os.getenv("DEBUG", "False") == "True"
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")