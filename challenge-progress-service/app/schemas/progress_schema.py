from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Optional

class ProgressCreate(BaseModel):
    challenge_id: str
    progress_date: Optional[date] = None
    description: str = Field(..., min_length=1)


class ProgressResponse(BaseModel):
    id: str
    challenge_id: str
    user_id: str
    progress_date: datetime
    description: str
    created_at: datetime

class ProgressSummaryResponse(BaseModel):
    recent_progress: List[ProgressResponse]
    active_challenges: int
    completed_challenges: int
    message: Optional[str] = None

class HasProgressResponse(BaseModel):
    has_progress: bool