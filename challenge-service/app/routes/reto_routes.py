from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.reto import RetoCreate, RetoUpdate
from app.services import reto_service
from app.core.auth import get_current_user
from app.schemas.reto import RetoResponse


router = APIRouter(prefix="/retos", tags=["Retos"])


# Crear reto
@router.post("/", response_model=RetoResponse, status_code=201)
def create_reto(
    reto: RetoCreate,
    user_data: dict = Depends(get_current_user)
):
    try:
        creator_user_id = user_data["sub"]

        created = reto_service.create_reto_service({
            **reto.model_dump(),
            "creator_user_id": creator_user_id
        })

        return created

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Obtener todos los retos
@router.get("/", response_model=List[RetoResponse])
def get_retos():
    return reto_service.get_retos_service()


# Obtener reto por ID
@router.get("/{reto_id}", response_model=RetoResponse)
def get_reto_by_id(reto_id: str):
    try:
        return reto_service.get_reto_by_id_service(reto_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    
@router.patch("/{reto_id}", response_model=RetoResponse)
def update_reto(
    reto_id: str,
    reto: RetoUpdate,
    user_data: dict = Depends(get_current_user)
):
    try:
        user_id = user_data["sub"]

        return reto_service.update_reto_service(
            reto_id,
            reto.model_dump(exclude_unset=True),
            user_id
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{reto_id}", status_code=204)
def delete_reto(
    reto_id: str,
    user_data: dict = Depends(get_current_user)
):
    try:
        user_id = user_data["sub"]
        reto_service.delete_reto_service(reto_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))