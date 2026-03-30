from fastapi import HTTPException

from app.repositories import participation_repository
from app.clients.challenge_client import get_challenge_by_id

def _format_participation(participation: dict) -> dict:
    participation["id"] = str(participation["_id"])
    del participation["_id"]
    return participation

def join_challenge_service(challenge_id: str, user_id: str):

    #1. verificar que el reto existe
    challenge = get_challenge_by_id(challenge_id)

    if not challenge:
        raise HTTPException(
            status_code=404,
            detail="Challenge no encontrado"
        )

    # 2. verificar si el usuario ya participa
    existing = participation_repository.find_by_user_and_challenge(
        user_id,
        challenge_id
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya participa en este reto"
        )

    # 3. crear participación
    participation_data = {
        "challenge_id": challenge_id,
        "user_id": user_id
    }

    created = participation_repository.create_participation(
        participation_data
    )

    return _format_participation(created)

def get_participations_by_user_service(user_id: str):

    participations = participation_repository.find_by_user(user_id)

    return [_format_participation(p) for p in participations]

def get_participants_by_challenge_service(challenge_id: str):

    participations = participation_repository.find_by_challenge(challenge_id)

    return [_format_participation(p) for p in participations]

def abandon_challenge_service(challenge_id: str, user_id: str):

    # 1. Buscar participación
    participation = participation_repository.find_by_user_and_challenge(
        user_id,
        challenge_id
    )

    if not participation:
        raise HTTPException(
            status_code=404,
            detail="No estás participando en este reto"
        )

    # 2. Validar estado
    if participation["status"] == "abandoned":
        raise HTTPException(
            status_code=400,
            detail="Ya abandonaste este reto"
        )

    if participation["status"] == "completed":
        raise HTTPException(
            status_code=400,
            detail="El reto ya fue completado"
        )

    # 3. Actualizar estado
    updated = participation_repository.update_status(
        str(participation["_id"]),
        "abandoned"
    )

    return _format_participation(updated)