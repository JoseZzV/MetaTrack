import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener URI desde .env
MONGO_URI = os.getenv("MONGO_URI")

# Crear cliente de MongoDB
client = MongoClient(MONGO_URI)

DB_NAME = os.getenv("DB_NAME")
db = client[DB_NAME]

# Colección de usuarios
challenges_collection = db["challenges"]