from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class RetoTipo(str, Enum):
    academico = "academico"
    deporte = "deporte"
    salud = "salud"
    productividad = "productividad"
    personal = "personal"


class RetoStatus(str, Enum):
    active = "active"
    finished = "finished"
    cancelled = "cancelled"

# Base compartida
class RetoBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    type: RetoTipo = RetoTipo.personal
    rules: Optional[str] = None
    start_date: datetime
    end_date: datetime
    points: int = Field(default=0, ge=0)


# Crear reto
class RetoCreate(RetoBase):
    pass

# Actualizar reto
class RetoUpdate(BaseModel):
    title: Optional[str] = Field(
        None,
        min_length=3,
        max_length=100
    )

    description: Optional[str] = None
    type: Optional[RetoTipo] = None
    rules: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: RetoStatus = RetoStatus.active

# Respuesta API
class RetoResponse(RetoBase):
    id: str

    creator_user_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    model_config = {
        "from_attributes": True
    }