from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="MetaTrack identity service",
    description ="Microservicio para autenticación y gestión de usuarios",
    version="1.0.0"
)

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Identity Service funcionando"
    }

