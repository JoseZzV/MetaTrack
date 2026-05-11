from app.adapters.gateways.user_gateway import UserGateway
from app.core.security import verify_password, create_access_token
from fastapi import HTTPException, status

class LoginUserInteractor:

    def __init__(self):

        self.user_gateway = UserGateway()

    def execute(self, user):

        db_user = self.user_gateway.get_user_by_email(
            user.email
        )

        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )

        if not verify_password(
            user.password,
            db_user["password"]
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )

        token = create_access_token({
            "sub": str(db_user["_id"]),
            "email": db_user["email"],
            "name": db_user["name"]
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }