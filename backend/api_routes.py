from flask import Blueprint, render_template, request, redirect, flash, url_for, session, jsonify
import json, os, hashlib, sqlite3
from utils import validar_password, cargar_usuarios
import db_utils
from dotenv import load_dotenv
load_dotenv()

api_bp = Blueprint('api', __name__)

DATABASE_FILE = os.getenv("DATABASE_FILE")

#TODO: Reemplazar instancias de cursor.execute con funciones db_utils a futuro, si es posible

@api_bp.route('/api/productos', methods=['GET'])
def get_productos():

    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos")
    rows = cursor.fetchall()
    conn.close()

    productos = []
    for row in rows:
        # Convierte la fila a dict
        p = dict(row)
        
        # Reconstruye la estructura original
        producto = {
            "id": p["id"],
            "titulo": p["titulo"],
            "artista": p["artista"],
            "imagen": p["imagen"],
            "categoria": {
                "nombre": p["categoria_nombre"],
                "id": p["categoria_id"]
            },
            "precio": p["precio"],
            "status": p["status"],
            "genero": [g.strip() for g in p["genero"].split(",")] if p["genero"] else [],
            "stock": p["stock"],
            "spotify": p["spotify"]
        }

        productos.append(producto)

    return jsonify(productos)

@api_bp.route('/api/productos', methods=['POST'])
def crear_producto():
    data = request.json
    id = data.get("id")
    titulo = data.get("titulo")
    artista = data.get("artista")
    imagen = data.get("imagen")
    categoria_nombre = data.get("categoria_nombre")
    categoria_id = data.get("categoria_id")
    precio = data.get("precio")
    status = data.get("status")
    genero = data.get("genero")
    stock = data.get("stock")
    spotify = data.get("spotify")

    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos")
    rows = cursor.fetchall()

    #Revisar si el producto ya existe checkeando ID, si no, insertar a BD
    for row in rows:
        if row["id"] == id:
            return {"error": "El producto ya existe"}, 400

    
    cursor.execute("INSERT INTO productos (id, titulo, artista, imagen, categoria_nombre, categoria_id, precio, status, genero, stock, spotify) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   (id, titulo, artista, imagen, categoria_nombre, categoria_id, precio, status, genero, stock, spotify))
    conn.commit()
    conn.close()

    return {"message": "Producto creado exitosamente"}, 201

@api_bp.route('/api/productos/<id>', methods=['DELETE'])
def eliminar_producto(id):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM productos WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return {"message": "Producto eliminado exitosamente"}, 200

@api_bp.route('/api/productos', methods=['PUT'])
def actualizar_producto():
    data = request.json
    id = data.get("id")
    titulo = data.get("titulo")
    artista = data.get("artista")
    imagen = data.get("imagen")
    categoria_nombre = data.get("categoria_nombre")
    categoria_id = data.get("categoria_id")
    precio = data.get("precio")
    status = data.get("status")
    genero = data.get("genero")
    stock = data.get("stock")
    spotify = data.get("spotify")

    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("UPDATE productos SET titulo = ?, artista = ?, imagen = ?, categoria_nombre = ?, categoria_id = ?, precio = ?, status = ?, genero = ?, stock = ?, spotify = ? WHERE id = ?",
                   (titulo, artista, imagen, categoria_nombre, categoria_id, precio, status, genero, stock, spotify, id))
    conn.commit()
    conn.close()

    return {"message": "Producto actualizado exitosamente"}, 200

#No se usa para nada aún, pero podría servir en el futuro
@api_bp.route('/api/usuarios')
def get_usuarios():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios")
    rows = cursor.fetchall()
    conn.close()

    usuarios = []

    for row in rows:
        u = dict(row)
        
        usuario = {
            "nombre": u["nombre"],
            "email": u["email"],
            "pass_hash": u["contrasena"],
        }

        usuarios.append(usuario)

    return jsonify(usuarios)

@api_bp.route('/productos/<id>', methods=['GET'])
def api_producto_detalle(id):
    producto_row = db_utils.get_producto_por_id(id)

    if producto_row is None:
        return jsonify({"error": "Producto no encontrado"}), 404

    producto = {
        "id": producto_row["id"],
        "titulo": producto_row["titulo"],
        "artista": producto_row["artista"],
        "imagen": producto_row["imagen"],
        "categoria": {
            "nombre": producto_row["categoria_nombre"],
            "id": producto_row["categoria_id"]
        },
        "precio": producto_row["precio"],
        "status": producto_row["status"],
        "genero": [g.strip() for g in producto_row["genero"].split(",")] if producto_row["genero"] else [],
        "stock": producto_row["stock"],
        "spotify": producto_row["spotify"]
    }

    return jsonify(producto), 200