import requests
from app.core.config import PROGRESS_SERVICE_URL

if not PROGRESS_SERVICE_URL:
    raise ValueError("PROGRESS_SERVICE_URL no está definido en el .env")


def has_progress_by_challenge(token: str, challenge_id: str):

    url = f"{PROGRESS_SERVICE_URL}/progress/challenge/{challenge_id}/has-progress"

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