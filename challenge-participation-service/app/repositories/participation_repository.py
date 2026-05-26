from app.db.database import participations_collection
from datetime import datetime, timezone
from bson import ObjectId

collection = participations_collection


# Crear participación
def create_participation(data: dict) -> dict:
    now = datetime.now(timezone.utc)

    data["joined_at"] = now
    data["status"] = "active"

    result = collection.insert_one(data)
    data["_id"] = result.inserted_id

    return data


# Buscar participación por usuario y reto
def find_by_user_and_challenge(user_id: str, challenge_id: str):

    participation = collection.find_one({
        "user_id": user_id,
        "challenge_id": challenge_id
    })

    return participation


# Obtener participaciones de un usuario
def find_by_user(user_id: str):

    participations = collection.find({
        "user_id": user_id
    })

    return list(participations)


# Obtener participaciones de un reto
def find_by_challenge(challenge_id: str):

    participations = collection.find({
        "challenge_id": challenge_id
    })

    return list(participations)


# Actualizar status
def update_status(participation_id: str, new_status: str):
    collection.update_one(
        {"_id": ObjectId(participation_id)},
        {"$set": {"status": new_status}}
    )

    return collection.find_one({"_id": ObjectId(participation_id)})

# Marcar participación como completada
def complete_participation(participation_id: str, earned_points: int):

    now = datetime.now(timezone.utc)

    collection.update_one(
        {"_id": ObjectId(participation_id)},
        {
            "$set": {
                "status": "completed",
                "earned_points": earned_points,
                "rewarded_at": now
            }
        }
    )

    return collection.find_one({
        "_id": ObjectId(participation_id)
    })

# Obtener resumen de recompensas del usuario
def get_rewards_summary(user_id: str):

    participations = list(collection.find({
        "user_id": user_id,
        "status": "completed"
    }))

    total_points = sum(
        participation.get("earned_points", 0)
        for participation in participations
    )

    return {
        "total_points": total_points,
        "completed_challenges": len(participations)
    }