from fastapi import FastAPI
from app.routes import reto_routes

app = FastAPI(title="Challenge Service")

app.include_router(reto_routes.router)