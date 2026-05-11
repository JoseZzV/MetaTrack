from app.usecases.output.challenge_repository_output import ChallengeRepositoryOutput
from app.frameworks.database.mongo import challenges_collection
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime, timezone

class ChallengeGateway(ChallengeRepositoryOutput):

    def create_challenge(self, data: dict):

        now = datetime.now(timezone.utc)

        data["created_at"] = now

        data["updated_at"] = now

        data["status"] = "active"

        result = challenges_collection.insert_one(data)

        data["_id"] = result.inserted_id

        return data

    def get_challenge_by_id(self, challenge_id: str):

        return challenges_collection.find_one({
            "_id": ObjectId(challenge_id)
        })

    def update_challenge(
        self,
        challenge_id: str,
        update_data: dict
    ):

        update_data["updated_at"] = datetime.now(
            timezone.utc
        )

        return challenges_collection.find_one_and_update(
            {
                "_id": ObjectId(challenge_id)
            },
            {
                "$set": update_data
            },
            return_document=ReturnDocument.AFTER
        )