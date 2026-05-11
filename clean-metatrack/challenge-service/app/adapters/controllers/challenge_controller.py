from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.usecases.input.create_challenge_input import CreateChallengeInput
from app.usecases.input.update_challenge_input import UpdateChallengeInput
from app.usecases.interactor.create_challenge_interactor import CreateChallengeInteractor
from app.usecases.interactor.update_challenge_interactor import UpdateChallengeInteractor

router = APIRouter(
    prefix="/challenges",
    tags=["Challenges"]
)

@router.post("/")
def create_challenge(
    challenge: CreateChallengeInput,
    user_data: dict = Depends(get_current_user)
):

    try:

        interactor = CreateChallengeInteractor()

        return interactor.execute({
            **challenge.model_dump(),
            "creator_user_id": user_data["sub"]
        })

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.patch("/{challenge_id}")
def update_challenge(
    challenge_id: str,
    challenge: UpdateChallengeInput,
    user_data: dict = Depends(get_current_user)
):

    try:

        interactor = UpdateChallengeInteractor()

        return interactor.execute(
            challenge_id,
            challenge.model_dump(exclude_unset=True),
            user_data["sub"]
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )