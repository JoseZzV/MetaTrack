from bson import ObjectId
from app.repositories import reto_repository


# Helper para convertir ObjectId a str
def _format_reto(reto: dict) -> dict:
    reto["id"] = str(reto["_id"])
    del reto["_id"]
    return reto


# Crear reto
def create_reto_service(data: dict) -> dict:

    # Validación de fechas
    if data["start_date"] >= data["end_date"]:
        raise ValueError("La fecha de inicio debe ser menor que la fecha de fin")

    created_reto = reto_repository.create_reto(data)

    return _format_reto(created_reto)


# Obtener todos los retos
def get_retos_service() -> list:
    retos = reto_repository.get_retos()
    return [_format_reto(r) for r in retos]


# Obtener reto por ID
def get_reto_by_id_service(reto_id: str) -> dict:

    if not ObjectId.is_valid(reto_id):
        raise ValueError("ID inválido")

    reto = reto_repository.get_reto_by_id(reto_id)

    if not reto:
        raise ValueError("Reto no encontrado")

    return _format_reto(reto)


# Actualizar reto
def update_reto_service(
    reto_id: str,
    update_data: dict,
    user_id: str
) -> dict:

    if not ObjectId.is_valid(reto_id):
        raise ValueError("ID inválido")

    # Bloquear campos sensibles
    forbidden_fields = {"creator_user_id", "created_at", "_id", "is_deleted"}
    for field in forbidden_fields:
        update_data.pop(field, None)

    # Obtener reto actual
    current_reto = reto_repository.get_reto_by_id(reto_id)
    if not current_reto:
        raise ValueError("Reto no encontrado")

    # Validar ownership
    if current_reto["creator_user_id"] != user_id:
        raise ValueError("No tienes permiso para modificar este reto")

    # Validación coherente de fechas
    start_date = update_data.get("start_date", current_reto["start_date"])
    end_date = update_data.get("end_date", current_reto["end_date"])

    if start_date >= end_date:
        raise ValueError("La fecha de inicio debe ser menor que la fecha de fin")

    updated_reto = reto_repository.update_reto(reto_id, update_data)

    return _format_reto(updated_reto)


# Eliminar reto (borrado lógico)
def delete_reto_service(
    reto_id: str,
    user_id: str
) -> bool:

    if not ObjectId.is_valid(reto_id):
        raise ValueError("ID inválido")

    current_reto = reto_repository.get_reto_by_id(reto_id)
    if not current_reto:
        raise ValueError("Reto no encontrado")

    # 🔐 Validar ownership
    if current_reto["creator_user_id"] != user_id:
        raise ValueError("No tienes permiso para eliminar este reto")

    deleted = reto_repository.delete_reto(reto_id)

    if not deleted:
        raise ValueError("Reto no encontrado")

    return True