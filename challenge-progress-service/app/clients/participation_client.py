import os
import requests
from dotenv import load_dotenv

load_dotenv()

PARTICIPATION_SERVICE_URL = os.getenv("PARTICIPATION_SERVICE_URL")
if not PARTICIPATION_SERVICE_URL:
    raise ValueError("PARTICIPATION_SERVICE_URL no está definido en el .env")


def get_my_participation_by_challenge(token: str, challenge_id: str):
    
    url = f"{PARTICIPATION_SERVICE_URL}/participations/{challenge_id}/me"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            return response.json()

        return None

    except requests.exceptions.RequestException:
        return None