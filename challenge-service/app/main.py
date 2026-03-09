from fastapi import FastAPI
from app.routes import reto_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Challenge Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reto_routes.router)