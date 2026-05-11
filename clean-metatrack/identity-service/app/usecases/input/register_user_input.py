from pydantic import BaseModel, EmailStr, Field

class RegisterUserInput(BaseModel):

    name: str = Field(..., min_length=2)

    email: EmailStr

    password: str = Field(..., min_length=6)

    confirm_password: str = Field(..., min_length=6)