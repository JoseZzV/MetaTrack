from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import participation_routes

app = FastAPI(title="Participation Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participation_routes.router)