from fastapi import APIRouter, HTTPException
from app.usecases.input.register_user_input import RegisterUserInput
from app.usecases.input.login_user_input import LoginUserInput
from app.usecases.interactor.register_user_interactor import RegisterUserInteractor
from app.usecases.interactor.login_user_interactor import LoginUserInteractor

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
def register(user: RegisterUserInput):

    try:

        interactor = RegisterUserInteractor()

        return interactor.execute(user)

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/login")
def login(user: LoginUserInput):

    try:

        interactor = LoginUserInteractor()

        return interactor.execute(user)

    except ValueError as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )