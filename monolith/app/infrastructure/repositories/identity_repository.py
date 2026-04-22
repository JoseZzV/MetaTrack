from app.infrastructure.db.database import db
from typing import Optional, Dict
from datetime import datetime
from bson import ObjectId

users_collection = db["users"]

# Crear usuario 
def create_user(user_data: Dict) -> Dict:
    user_data["created_at"] = datetime.utcnow()
    user_data["active"] = True

    result = users_collection.insert_one(user_data)

    user_data["_id"] = str(result.inserted_id)
    return user_data


# Buscar por email 
def get_user_by_email(email: str) -> Optional[Dict]:
    user = users_collection.find_one({"email": email})

    if user:
        user["_id"] = str(user["_id"])

    return user

def get_user_by_id(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if user:
        user["_id"] = str(user["_id"])

    return user

