from app.adapters.gateways.challenge_gateway import ChallengeGateway

class CreateChallengeInteractor:

    def __init__(self):

        self.challenge_gateway = ChallengeGateway()

    def execute(self, data: dict):

        if data["start_date"] >= data["end_date"]:

            raise ValueError(
                "La fecha de inicio debe ser menor que la fecha de fin"
            )

        created = self.challenge_gateway.create_challenge(
            data
        )

        created["id"] = str(created["_id"])

        del created["_id"]

        return created