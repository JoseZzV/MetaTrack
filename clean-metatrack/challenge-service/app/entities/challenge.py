from dataclasses import dataclass
from datetime import datetime

@dataclass
class Challenge:

    title: str

    description: str

    start_date: datetime

    end_date: datetime

    creator_user_id: str