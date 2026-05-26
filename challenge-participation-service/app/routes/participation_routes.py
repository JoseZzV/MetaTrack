from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List

from app.schemas.participation_schema import ParticipationCreate, ParticipationResponse, RewardsSummaryResponse
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
    

@router.patch("/{challenge_id}/abandon", response_model=ParticipationResponse)
def abandon_challenge(
    challenge_id: str,
    user_data: dict = Depends(get_current_user)
):
    user_id = user_data["sub"]

    return participation_service.abandon_challenge_service(
        challenge_id,
        user_id
    )

@router.patch("/{challenge_id}/complete", response_model=ParticipationResponse)
def complete_challenge(challenge_id: str, request: Request, user_data: dict = Depends(get_current_user)):

    user_id = user_data["sub"]

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="Token requerido"
        )

    token = auth_header.split(" ")[1]

    return participation_service.complete_challenge_service(
        challenge_id,
        user_id,
        token
    )

@router.get("/{challenge_id}/me", response_model=ParticipationResponse)
def get_my_participation_by_challenge(
    challenge_id: str,
    user_data: dict = Depends(get_current_user)
):
    user_id = user_data["sub"]

    return participation_service.get_participation_by_user_and_challenge_service(
        user_id,
        challenge_id
    )

@router.get("/me/rewards", response_model=RewardsSummaryResponse)
def get_rewards_summary(user_data: dict = Depends(get_current_user)):

    user_id = user_data["sub"]

    return participation_service.get_rewards_summary_service(
        user_id
    )