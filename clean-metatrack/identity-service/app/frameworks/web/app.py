from fastapi import FastAPI
from app.adapters.controllers.auth_controller import router

app = FastAPI(
    title="Identity Service Clean Architecture"
)

app.include_router(router)