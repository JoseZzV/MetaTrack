from app.adapters.gateways.user_gateway import UserGateway
from app.core.security import hash_password

class RegisterUserInteractor:

    def __init__(self):

        self.user_gateway = UserGateway()

    def execute(self, user):

        existing_user = self.user_gateway.get_user_by_email(
            user.email
        )

        if existing_user:
            raise ValueError(
                "El correo electrónico ya está registrado"
            )

        if user.password != user.confirm_password:
            raise ValueError(
                "Las contraseñas no coinciden"
            )

        hashed_password = hash_password(
            user.password[:72]
        )

        user_data = {
            "name": user.name,
            "email": user.email,
            "password": hashed_password
        }

        new_user = self.user_gateway.create_user(
            user_data
        )

        return {
            "message": "Usuario registrado correctamente",
            "user_id": new_user["_id"]
        }