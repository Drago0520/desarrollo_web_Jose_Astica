import re

def validate_name(name: str) -> bool:
    if not name:
        return False
    pattern = r'^[A-Za-zÁÉÍÓÚáéíóúñÑ\s-]+$'
    return re.match(pattern, name) is not None

def validate_email(email: str) -> bool:
    if not email:
        return False
    if len(email) <= 15:
        return False
    pattern = r'^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone_number(phone_number: str) -> bool:
    if not phone_number:
        return False
    pattern = r'^\+\d{3}\.\d{8}$'
    return re.match(pattern, phone_number) is not None

def validate_cantidad(cantidad) -> bool:
    if cantidad is None:
        return False
    try:
        c = int(cantidad)
        return c > 0
    except ValueError:
        return False

def validate_edad(edad) -> bool:
    if edad is None:
        return False
    try:
        e = int(edad)
        return e >= 0
    except ValueError:
        return False

def validate_files(files) -> bool:
    if not files:
        return False
    if not (1 <= len(files) <= 5):
        return False
    for f in files:
        if not (f.mimetype.startswith("image") or f.mimetype == "application/pdf"):
            return False
    return True

def validate_select(value: str) -> bool:
    return bool(value and value.strip())

def validate_form(form: dict, files) -> dict:
    invalid_inputs = []

    if not validate_name(form.get('nombre')):
        invalid_inputs.append("Nombre")
    if not validate_email(form.get('email')):
        invalid_inputs.append("Email")
    if not validate_cantidad(form.get('cantidad')):
        invalid_inputs.append("Cantidad")
    if not validate_edad(form.get('edad')):
        invalid_inputs.append("Edad")
    if not validate_files(files):
        invalid_inputs.append("Fotos")
    if not validate_select(form.get('comuna_id')):
        invalid_inputs.append("Comuna")
    if not validate_select(form.get('tipo')):
        invalid_inputs.append("Tipo (gato o perro)")
    if not validate_select(form.get('unidad')):
        invalid_inputs.append("Unidad (años o meses)")

    is_valid = len(invalid_inputs) == 0

    return {
        "is_valid": is_valid,
        "invalid_inputs": invalid_inputs,
        "message": (
            "Hemos recibido la información de adopción, muchas gracias y suerte!"
            if is_valid
            else "Los siguientes campos son inválidos:"
        )
    }
