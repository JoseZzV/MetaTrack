from fastapi import HTTPException

from app.repositories import participation_repository
from app.clients.challenge_client import get_challenge_by_id
from app.clients.progress_client import has_progress_by_challenge


def _format_participation(participation: dict) -> dict:
    participation["id"] = str(participation["_id"])
    del participation["_id"]
    return participation


def join_challenge_service(challenge_id: str, user_id: str):

    # 1. verificar que el reto existe
    challenge = get_challenge_by_id(challenge_id)
    

    if not challenge:
        raise HTTPException(
            status_code=404,
            detail="Challenge no encontrado"
        )
    
    if challenge["status"] == "finished":
        raise HTTPException(
        status_code=400,
        detail="Este reto ya no está disponible"
    )
    

    # 2. verificar si el usuario ya participa
    existing = participation_repository.find_by_user_and_challenge(
        user_id,
        challenge_id
    )

    if existing:
        if existing["status"] == "active":
            raise HTTPException(
                status_code=400,
                detail="El usuario ya participa en este reto"
            )

        if existing["status"] == "abandoned":
            updated = participation_repository.update_status(
                str(existing["_id"]),
                "active"
            )
            return _format_participation(updated)

        if existing["status"] == "completed":
            raise HTTPException(
                status_code=400,
                detail="Ya completaste este reto"
            )

    # 3. crear participación si no existe
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

def complete_challenge_service(
    challenge_id: str,
    user_id: str,
    token: str
):

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

    # 2. Validar estado actual
    if participation["status"] == "abandoned":
        raise HTTPException(
            status_code=400,
            detail="No puedes completar un reto abandonado"
        )

    if participation["status"] == "completed":
        raise HTTPException(
            status_code=400,
            detail="Ya completaste este reto"
        )

    # 3. Obtener reto
    challenge = get_challenge_by_id(challenge_id)

    if not challenge:
        raise HTTPException(
            status_code=404,
            detail="Challenge no encontrado"
        )

    # 4. Validar que el reto haya finalizado
    if challenge["status"] != "finished":
        raise HTTPException(
            status_code=400,
            detail="El reto aún no ha finalizado"
        )

    # 5. Validar progreso registrado
    progress_response = has_progress_by_challenge(
        token,
        challenge_id
    )

    if not progress_response:
        raise HTTPException(
            status_code=400,
            detail="No fue posible validar el progreso"
        )

    if not progress_response["has_progress"]:
        raise HTTPException(
            status_code=400,
            detail="Debes registrar progreso antes de completar el reto"
        )

    # 6. Asignar puntos y completar
    completed = participation_repository.complete_participation(
        str(participation["_id"]),
        challenge["points"]
    )

    return _format_participation(completed)

def get_participation_by_user_and_challenge_service(user_id: str, challenge_id: str):

    participation = participation_repository.find_by_user_and_challenge(
        user_id,
        challenge_id
    )

    if not participation:
        raise HTTPException(
            status_code=404,
            detail="No estás participando en este reto"
        )

    return _format_participation(participation)

def get_rewards_summary_service(user_id: str):

    return participation_repository.get_rewards_summary(user_id)