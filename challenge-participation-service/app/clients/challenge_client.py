import os
import requests
from dotenv import load_dotenv

load_dotenv()

CHALLENGE_SERVICE_URL = os.getenv("CHALLENGE_SERVICE_URL")
if not CHALLENGE_SERVICE_URL:
    raise ValueError("CHALLENGE_SERVICE_URL no está definido en el .env")



def get_challenge_by_id(challenge_id: str):
    
    url = f"{CHALLENGE_SERVICE_URL}/retos/{challenge_id}"

    try:
        response = requests.get(url)

        if response.status_code == 200:
            return response.json()

        return None

    except requests.exceptions.RequestException:
        return None