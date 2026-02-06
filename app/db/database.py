import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener URI desde .env
MONGO_URI = os.getenv("MONGO_URI")

# Crear cliente de MongoDB
client = MongoClient(MONGO_URI)

# Seleccionar base de datos
db = client["skillquest_identity"]

# Colección de usuarios
users_collection = db["users"]
