from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ParticipationCreate(BaseModel):
    challenge_id: str


class ParticipationResponse(BaseModel):
    id: str
    challenge_id: str
    user_id: str
    joined_at: datetime
    status: str

    earned_points: int = 0
    rewarded_at: Optional[datetime] = None

class RewardsSummaryResponse(BaseModel):
    total_points: int
    completed_challenges: int
    badges: list[str]