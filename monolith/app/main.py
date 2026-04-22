from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importar controllers (antes routes)
from app.presentation.controllers import reto_controller
from app.presentation.controllers import identity_controller

app = FastAPI(
    title="MetaTrack Monolith",
    description="Monolito con arquitectura por capas (Identity + Challenges)",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(identity_controller.router)
app.include_router(reto_controller.router)

# Endpoint raíz
@app.get("/")
def root():
    return {
        "message": "MetaTrack Monolith funcionando"
    }