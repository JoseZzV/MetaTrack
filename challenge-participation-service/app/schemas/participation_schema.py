from pydantic import BaseModel
from datetime import datetime


class ParticipationCreate(BaseModel):
    challenge_id: str


class ParticipationResponse(BaseModel):
    id: str
    challenge_id: str
    user_id: str
    joined_at: datetime
    status: str