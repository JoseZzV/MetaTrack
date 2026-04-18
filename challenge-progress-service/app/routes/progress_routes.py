from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List

from app.schemas.progress_schema import ProgressCreate, ProgressResponse
from app.services import progress_service
from app.core.auth import get_current_user


router = APIRouter(prefix="/progress", tags=["Progress"])


# Registrar progreso
@router.post("/", response_model=ProgressResponse, status_code=201)
def create_progress(
    progress: ProgressCreate,
    request: Request,
    user_data: dict = Depends(get_current_user)
):
    try:
        user_id = user_data["sub"]

        # 🔥 EXTRAER TOKEN REAL DEL HEADER
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="Token requerido")

        token = auth_header.split(" ")[1]

        created = progress_service.create_progress_service(
            progress,
            user_id,
            token
        )

        return created

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Obtener progreso del usuario en un reto
@router.get("/challenge/{challenge_id}/me", response_model=List[ProgressResponse])
def get_my_progress_by_challenge(
    challenge_id: str,
    user_data: dict = Depends(get_current_user)
):
    try:
        user_id = user_data["sub"]

        return progress_service.get_progress_by_user_and_challenge_service(
            user_id,
            challenge_id
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))