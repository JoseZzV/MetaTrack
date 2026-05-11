from fastapi import FastAPI
from app.adapters.controllers.challenge_controller import router

app = FastAPI(
    title="Challenge Service Clean Architecture"
)

app.include_router(router)