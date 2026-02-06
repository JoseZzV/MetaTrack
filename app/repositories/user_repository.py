from app.db.database import users_collection
from typing import Optional, Dict
from datetime import datetime


# Crear usuario 
def create_user(user_data: Dict) -> Dict:
    """
    Inserta un nuevo usuario en MongoDB
    """
    user_data["created_at"] = datetime.utcnow()
    user_data["active"] = True

    result = users_collection.insert_one(user_data)

    user_data["_id"] = str(result.inserted_id)
    return user_data


# Buscar por email 
def get_user_by_email(email: str) -> Optional[Dict]:
    """
    Retorna un usuario por su correo electrónico
    """
    user = users_collection.find_one({"email": email})

    if user:
        user["_id"] = str(user["_id"])

    return user
