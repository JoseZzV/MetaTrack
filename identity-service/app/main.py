from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router

app = FastAPI(
    title="MetaTrack identity service",
    description ="Microservicio para autenticación y gestión de usuarios",
    version="1.0.0"
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Identity Service funcionando"
    }
