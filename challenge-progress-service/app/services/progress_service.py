from fastapi import HTTPException
from datetime import date, datetime, timezone
from app.repositories import progress_repository
from app.clients.participation_client import get_my_participation_by_challenge
from app.clients.participation_client import get_my_participations
from app.clients.challenge_client import get_challenge_by_id


def _format_progress(progress: dict) -> dict:
    progress["id"] = str(progress["_id"])
    del progress["_id"]
    return progress


# Crear progreso
def create_progress_service(data, user_id: str, token: str):

    # 1. validar inscripción en el reto
    participation = get_my_participation_by_challenge(
        token,
        data.challenge_id
    )

    if not participation:
        raise HTTPException(
            status_code=400,
            detail="Debes estar inscrito en el reto"
        )

    # 2. definir fecha
    raw_date = data.progress_date or date.today()

    progress_date = datetime.combine(
        raw_date,
        datetime.min.time()
    ).replace(tzinfo=timezone.utc)

    # 3. evitar duplicado en el mismo día
    existing = progress_repository.find_by_user_challenge_date(
        user_id,
        data.challenge_id,
        progress_date
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Ya registraste progreso en esta fecha"
        )

    # 4. crear progreso
    progress_data = {
        "challenge_id": data.challenge_id,
        "user_id": user_id,
        "progress_date": progress_date,
        "description": data.description
    }

    created = progress_repository.create_progress(progress_data)

    return _format_progress(created)


# Obtener progreso del usuario en un reto
def get_progress_by_user_and_challenge_service(user_id: str, challenge_id: str):

    progress_list = progress_repository.find_by_user_and_challenge(
        user_id,
        challenge_id
    )

    return [_format_progress(p) for p in progress_list]

# Obtener resumen del progreso del usuario
def get_profile_progress_summary_service(user_id: str, token: str):

    # 1. obtener progreso reciente
    progress_list = progress_repository.find_recent_by_user(user_id)

    recent_progress = [
        _format_progress(progress)
        for progress in progress_list[:5]
    ]

    # 2. obtener participaciones
    participations = get_my_participations(token)

    active_challenges = 0
    completed_challenges = 0

    # 3. contar retos activos y completados
    if participations:

        for participation in participations:

            challenge = get_challenge_by_id(
                participation["challenge_id"]
            )

            if not challenge:
                continue

            if challenge["status"] == "active":
                active_challenges += 1

            if challenge["status"] == "finished":
                completed_challenges += 1

    # 4. respuesta sin progreso
    if not recent_progress:

        return {
            "recent_progress": [],
            "active_challenges": active_challenges,
            "completed_challenges": completed_challenges,
            "message": "Aún no has registrado progreso"
        }

    # 5. respuesta normal
    return {
        "recent_progress": recent_progress,
        "active_challenges": active_challenges,
        "completed_challenges": completed_challenges,
        "message": None
    }