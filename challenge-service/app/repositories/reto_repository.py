from app.db.database import challenges_collection
from datetime import datetime, timezone
from bson import ObjectId
from pymongo import ReturnDocument

collection = challenges_collection

#  Crear reto
def create_reto(data: dict) -> dict:
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    data["status"] = "active"
    data["is_deleted"] = False

    result = collection.insert_one(data)
    data["_id"] = result.inserted_id
    return data


#  Obtener todos los retos activos
def get_retos() -> list:
    retos = collection.find({"is_deleted": False})
    return list(retos)


#  Obtener reto por ID
def get_reto_by_id(reto_id: str) -> dict | None:
    reto = collection.find_one({
        "_id": ObjectId(reto_id),
        "is_deleted": False
    })
    return reto


#  Actualizar reto
def update_reto(reto_id: str, update_data: dict) -> dict | None:

    # Protección defensiva en repository
    forbidden_fields = {"_id", "creator_user_id", "created_at", "is_deleted"}
    for field in forbidden_fields:
        update_data.pop(field, None)

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = collection.find_one_and_update(
        {
            "_id": ObjectId(reto_id),
            "is_deleted": False
        },
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )

    return result


#  Borrado lógico
def delete_reto(reto_id: str) -> bool:
    result = collection.update_one(
        {
            "_id": ObjectId(reto_id),
            "is_deleted": False
        },
        {
            "$set": {
                "is_deleted": True,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    return result.modified_count > 0