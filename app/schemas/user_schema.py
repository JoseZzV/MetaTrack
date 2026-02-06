from pydantic import BaseModel, EmailStr, Field


# Registro
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


#Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


# Respuesta básica 
class MessageResponse(BaseModel):
    message: str
