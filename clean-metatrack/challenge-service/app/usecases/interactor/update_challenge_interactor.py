from app.adapters.gateways.challenge_gateway import ChallengeGateway
from bson import ObjectId

class UpdateChallengeInteractor:

    def __init__(self):

        self.challenge_gateway = ChallengeGateway()

    def execute(
        self,
        challenge_id: str,
        update_data: dict,
        user_id: str
    ):

        if not ObjectId.is_valid(challenge_id):

            raise ValueError("ID inválido")

        current = self.challenge_gateway.get_challenge_by_id(
            challenge_id
        )

        if not current:

            raise ValueError("Reto no encontrado")

        if current["creator_user_id"] != user_id:

            raise ValueError(
                "No tienes permiso para modificar este reto"
            )

        start_date = update_data.get(
            "start_date",
            current["start_date"]
        )

        end_date = update_data.get(
            "end_date",
            current["end_date"]
        )

        if start_date >= end_date:

            raise ValueError(
                "La fecha de inicio debe ser menor que la fecha de fin"
            )

        updated = self.challenge_gateway.update_challenge(
            challenge_id,
            update_data
        )

        updated["id"] = str(updated["_id"])

        del updated["_id"]

        return updated