from abc import ABC, abstractmethod

class UserRepositoryOutput(ABC):

    @abstractmethod
    def create_user(self, user_data: dict):
        pass

    @abstractmethod
    def get_user_by_email(self, email: str):
        pass