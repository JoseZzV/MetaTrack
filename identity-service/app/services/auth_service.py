from app.repositories.user_repository import create_user, get_user_by_email
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user_schema import UserRegister, UserLogin
from fastapi import HTTPException, status


#  Registro de usuario
def register_user(user: UserRegister):
    # 1. Verificar si el email ya existe
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise ValueError("El correo electrónico ya está registrado")

    # 2. Verificar que las contraseñas coincidan
    if user.password != user.confirm_password:
        raise ValueError("Las contraseñas no coinciden")
    
    print("LEN CHAR:", len(user.password))
    print("LEN BYTES:", len(user.password.encode("utf-8")))
    # 3. Hashear contraseña
    password = user.password[:72] 
    hashed_password = hash_password(password)

    # 4. Preparar datos para guardar
    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
    }

    # 5. Guardar en DB
    new_user = create_user(user_data)

    return {"message": "Usuario registrado correctamente", "user_id": new_user["_id"]}


# Login de usuario 
def login_user(user: UserLogin):
    # 1. Buscar usuario por email
    db_user = get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas"
        )

    # 2. Verificar contraseña
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas"
        )

    # 3. Crear token JWT
    token = create_access_token({
        "sub": db_user["_id"],
        "email": db_user["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
