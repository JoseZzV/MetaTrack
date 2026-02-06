from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserRegister, UserLogin, MessageResponse
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])


#Registro 
@router.post("/register", response_model=MessageResponse, status_code=201)
def register(user: UserRegister):
    try:
        result = register_user(user)
        return {"message": result["message"]}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


#Login
@router.post("/login")
def login(user: UserLogin):
    try:
        return login_user(user)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
