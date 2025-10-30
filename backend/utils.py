import re
import hashlib
import json
import os
import sqlite3
from dotenv import load_dotenv

load_dotenv()

DATABASE_FILE = os.getenv("DATABASE_FILE")

def validar_password(password):
    if len(password) < 8:
        return "La contraseña debe tener al menos 8 caracteres."
    if not re.search(r'[A-Z]', password):
        return "La contraseña debe contener al menos una letra mayúscula."
    if not re.search(r'[a-z]', password):
        return "La contraseña debe contener al menos una letra minúscula."
    if not re.search(r'\d', password):
        return "La contraseña debe contener al menos un número."
    if not re.search(r'[!@#$%^&+\-_.:?]', password):
        return "La contraseña debe contener al menos un carácter especial (!@#$%^&+\-_.:?)."
    return True  # Si la contraseña pasa todas las validaciones

#tuplas de usuarios
def cargar_usuarios():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    if not os.path.exists(DATABASE_FILE):
        return ()
    else:
        cursor.execute("SELECT * FROM usuarios")
        return cursor.fetchall()