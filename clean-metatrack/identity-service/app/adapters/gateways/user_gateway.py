from app.usecases.output.user_repository_output import UserRepositoryOutput
from app.frameworks.database.mongo import users_collection
from datetime import datetime

class UserGateway(UserRepositoryOutput):

    def create_user(self, user_data: dict):

        user_data["created_at"] = datetime.utcnow()

        result = users_collection.insert_one(user_data)

        user_data["_id"] = str(result.inserted_id)

        return user_data

    def get_user_by_email(self, email: str):

        user = users_collection.find_one({
            "email": email
        })

        if user:
            user["_id"] = str(user["_id"])

        return user