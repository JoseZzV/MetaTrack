from pydantic import BaseModel
from datetime import datetime

class CreateChallengeInput(BaseModel):

    title: str

    description: str

    start_date: datetime

    end_date: datetime