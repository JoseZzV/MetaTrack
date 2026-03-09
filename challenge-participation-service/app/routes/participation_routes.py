from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.schemas.participation_schema import ParticipationCreate, ParticipationResponse
from app.services import participation_service
from app.core.auth import get_current_user

router = APIRouter(prefix="/participations", tags=["Participations"])


# Unirse a un reto
@router.post("/", response_model=ParticipationResponse, status_code=201)
def join_challenge(
    participation: ParticipationCreate,
    user_data: dict = Depends(get_current_user)
):
    try:
        user_id = user_data["sub"]

        created = participation_service.join_challenge_service(
            participation.challenge_id,
            user_id
        )

        return created

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Obtener participaciones del usuario
@router.get("/me", response_model=List[ParticipationResponse])
def get_my_participations(
    user_data: dict = Depends(get_current_user)
):
    try:
        user_id = user_data["sub"]
        return participation_service.get_participations_by_user_service(user_id)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Obtener participaciones de un reto
@router.get("/challenge/{challenge_id}", response_model=List[ParticipationResponse])
def get_participants_by_challenge(challenge_id: str):
    try:
        return participation_service.get_participants_by_challenge_service(challenge_id)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))