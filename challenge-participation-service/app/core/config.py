import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

CHALLENGE_SERVICE_URL = os.getenv(
    "CHALLENGE_SERVICE_URL",
    "http://localhost:8001"
)