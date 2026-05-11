from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UpdateChallengeInput(BaseModel):

    title: Optional[str] = None

    description: Optional[str] = None

    start_date: Optional[datetime] = None

    end_date: Optional[datetime] = None