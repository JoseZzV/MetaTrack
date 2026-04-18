from app.db.database import progress_collection
from datetime import datetime, timezone
from bson import ObjectId

collection = progress_collection


# Crear progreso
def create_progress(data: dict) -> dict:
    now = datetime.now(timezone.utc)

    data["created_at"] = now

    result = collection.insert_one(data)
    data["_id"] = result.inserted_id

    return data


# Buscar progreso por usuario, reto y fecha (para evitar duplicados)
def find_by_user_challenge_date(user_id: str, challenge_id: str, progress_date):

    progress = collection.find_one({
        "user_id": user_id,
        "challenge_id": challenge_id,
        "progress_date": progress_date
    })

    return progress


# Obtener progreso de un usuario en un reto
def find_by_user_and_challenge(user_id: str, challenge_id: str):

    progress_list = collection.find({
        "user_id": user_id,
        "challenge_id": challenge_id
    })

    return list(progress_list)