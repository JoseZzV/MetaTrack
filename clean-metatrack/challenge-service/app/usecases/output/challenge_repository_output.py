from abc import ABC, abstractmethod

class ChallengeRepositoryOutput(ABC):

    @abstractmethod
    def create_challenge(self, data: dict):
        pass

    @abstractmethod
    def get_challenge_by_id(self, challenge_id: str):
        pass

    @abstractmethod
    def update_challenge(
        self,
        challenge_id: str,
        update_data: dict
    ):
        pass