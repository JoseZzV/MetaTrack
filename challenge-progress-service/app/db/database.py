import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URI:
    raise ValueError("MONGO_URI no está definido en el .env")

if not DB_NAME:
    raise ValueError("DB_NAME no está definido en el .env")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Colección de progreso
progress_collection = db["progress"]

# Índice único por usuario + reto + fecha
progress_collection.create_index(
    [("user_id", 1), ("challenge_id", 1), ("progress_date", 1)],
    unique=True,
    name="unique_user_challenge_date"
)