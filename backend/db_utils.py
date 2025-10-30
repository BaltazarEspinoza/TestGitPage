import sqlite3, json
import hashlib
import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_FILE = os.getenv("DATABASE_FILE")
def init_db():
    crearTablaUsuarios()
    crearTablaProductos()
    migracionProductos()
    

def get_producto_por_id(id_producto):
    conn = sqlite3.connect(DATABASE_FILE)
    
    # Esta línea es clave: hace que la BD devuelva los datos 
    # como un diccionario, para que puedas usar 'producto.titulo' en el HTML.
    conn.row_factory = sqlite3.Row 
    
    cursor = conn.cursor()
    
    # Usamos '?' para una consulta segura (evita inyección SQL)
    cursor.execute("SELECT * FROM productos WHERE id = ?", (id_producto,))
    
    producto = cursor.fetchone() # .fetchone() obtiene solo un resultado
    
    conn.close()
    
    return producto # Devuelve el producto (o None si no se encontró)

#-------------------FUNCIONES TABLA USUARIOS-------------------
def crearTablaUsuarios():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    try:
        cursor.execute(

            """
            CREATE TABLE IF NOT EXISTS usuarios(
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                contrasena TEXT NOT NULL
            )
            """
        )
        
        conn.commit()
    #no se alcanza esta condición, quizás es innecesaria por el checkeo con NOT EXISTS
    except sqlite3.OperationalError:
        print("TABLA YA EXISTE!!")

    conn.close()

def crearTablaProductos():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    #referenciando formas en productos.json
    
    try:
        cursor.execute(

            """
            CREATE TABLE IF NOT EXISTS productos(
                id TEXT PRIMARY KEY,
                titulo TEXT NOT NULL,
                artista TEXT NOT NULL,
                imagen TEXT NOT NULL,
                categoria_nombre TEXT NOT NULL,
                categoria_id TEXT NOT NULL,
                precio INTEGER NOT NULL,
                status TEXT,
                genero TEXT,
                stock INTEGER NOT NULL,
                spotify TEXT 
            )
            """
        )
        
        conn.commit()

    except sqlite3.OperationalError:
        print("TABLA YA EXISTE!!")

    conn.close()

def insertarUsuario(nombre, email, pass_hash):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    canExecute = True
    
    #crear tupla de usuarios para checkear
    cursor.execute("SELECT * FROM usuarios")
    contenido = cursor.fetchall()

    # content es una lista de tuplas: cada tupla es (nombre, email, pass_hash)
    for usuario in contenido:
        if nombre == usuario[0] or email == usuario[1] or pass_hash == usuario[2]:
            print("USUARIO EXISTE!")
            canExecute = False
            break

    if canExecute:
        instruccion = f"""
        INSERT INTO usuarios VALUES
        ('{nombre}', '{email}', '{pass_hash}')
        """
        cursor.execute(instruccion)
        conn.commit()
    conn.close()

def leerUsuario(email):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    instruccion: str = f"SELECT * FROM usuarios WHERE email='{email}';"

    #se puede usar LIKE en lugar de =, si queremos una precisión menor de input.
    cursor.execute(instruccion)
    datos = cursor.fetchall()

    conn.close()
    return datos

def modificar_usuario(email, new_nombre, new_email, new_pass):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    if new_pass:
        new_pass_hash = hashlib.sha256(new_pass.encode()).hexdigest()
    else:
        new_pass_hash = None

    puedeModificar = True

    cursor.execute("SELECT * FROM usuarios")
    contenido = cursor.fetchall()

    for usuario in contenido:
        # Ignora al usuario actual (el que está editando)
        if usuario[1] == email:
            continue
        if (new_nombre == usuario[0] or
            new_email == usuario[1] or
            new_pass_hash == usuario[2]):
            puedeModificar = False

    if not puedeModificar:
        print("NO PUEDE MODIFICAR, ATRIBUTOS LE PERTENECEN A OTRO USUARIO")
        conn.close()
        return

    if new_pass_hash is not None:
        instruccion = f"""
        UPDATE usuarios SET
        nombre='{new_nombre}', email='{new_email}', contrasena='{new_pass_hash}'
        WHERE email='{email}'
        """
    else:
        instruccion = f"""
        UPDATE usuarios SET
        nombre='{new_nombre}', email='{new_email}'
        WHERE email='{email}'
        """
    cursor.execute(instruccion)
    conn.commit()
    conn.close()

#ELIMINA USUARIO SI EL EMAIL ENTREGADO EXISTE
def eliminar_usuario(email):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    usuarioExiste = False
    cursor.execute("SELECT * FROM usuarios")
    contenido = cursor.fetchall()

    for e in contenido:
        if email == e[1]:
            usuarioExiste = True
            break

    if usuarioExiste:
        instruccion = f"""DELETE FROM usuarios WHERE email='{email}'"""
        cursor.execute(instruccion)
        print(f"USUARIO CON CORREO {email} ELIMINADO CON ÉXITO!")
        conn.commit()
    else:
        print(f"USUARIO CON CORREO {email} NO EXISTE!")
    conn.close()


def insertarProducto(id, titulo, artista, imagen, categoria_nombre, categoria_id, precio, status, genero, stock, spotify):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    canExecute = True
    
    #crear tupla de usuarios para checkear
    cursor.execute("SELECT * FROM productos")
    contenido = cursor.fetchall()

    # content es una lista de tuplas
    for producto in contenido:
        if (id == producto[0] or titulo == producto[1] or artista == producto[2] or 
            imagen == producto[3] or categoria_nombre == producto[4] or 
            categoria_id == producto[5] or precio == producto[6] or 
            status == producto[7] or genero == producto[8] or
            stock == producto[9] or spotify == producto[10]):
            print("PRODUCTO EXISTE!")
            canExecute = False
            break

    if canExecute:
        instruccion = f"""
        INSERT INTO productos VALUES
        ('{id}', '{titulo}', '{artista}', '{imagen}', '{categoria_nombre}', '{categoria_id}', {precio}, '{status}', '{genero}', {stock}, '{spotify}')
        """
        cursor.execute(instruccion)
        conn.commit()
    conn.close()


def modificarProducto(id, new_id, new_titulo, new_artista, new_imagen, new_categoria_nombre, new_categoria_id, new_precio, new_status, new_genero, new_stock, new_spotify):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    puedeModificar = True

    cursor.execute("SELECT * FROM productos")
    contenido = cursor.fetchall()

    for producto in contenido:
        # Ignora al producto actual (el que está editando)
        if producto[0] == id:
            continue
        if (new_id == producto[0] or
            new_titulo == producto[1] or
            new_artista == producto[2] or
            new_imagen == producto[3] or
            new_categoria_nombre == producto[4] or
            new_categoria_id == producto[5] or
            new_precio == producto[6] or
            new_status == producto[7] or
            new_genero == producto[8] or
            new_stock == producto[9] or
            new_spotify == producto[10]):
            puedeModificar = False

    if not puedeModificar:
        print("NO PUEDE MODIFICAR, ATRIBUTOS LE PERTENECEN A OTRO PRODUCTO")
        conn.close()
        return


    instruccion = f"""
    UPDATE productos SET
        id='{new_id}', titulo='{new_titulo}',
        artista='{new_artista}', imagen='{new_imagen}',
        categoria_nombre='{new_categoria_nombre}', categoria_id='{new_categoria_id}',
        precio={new_precio}, status='{new_status}', genero='{new_genero}',
        stock={new_stock}, spotify='{new_spotify}'
    WHERE id='{id}'
    """
    cursor.execute(instruccion)
    conn.commit()
    conn.close()

def eliminarProducto(id):
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    productoExiste = False
    cursor.execute("SELECT * FROM productos")
    contenido = cursor.fetchall()

    for producto in contenido:
        if id == producto[0]:
            productoExiste = True
            break

    if productoExiste:
        instruccion = f"""DELETE FROM productos WHERE id='{id}'"""
        cursor.execute(instruccion)
        print(f"PRODUCTO CON ID {id} ELIMINADO CON ÉXITO!")
        conn.commit()
    else:
        print(f"PRODUCTO CON ID {id} NO EXISTE!")
    conn.close()

def migracionProductos():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    try:
        f = open("../static/json/productos.json", "r", encoding="utf-8")
        contenido = json.load(f)
    except Exception as e:
        print("Error leyendo productos.json:", e)
        conn.close()
        return

    for producto in contenido:
        cursor.execute("""
            INSERT OR REPLACE INTO productos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            producto["id"], producto["titulo"], producto["artista"], producto["imagen"],
            producto["categoria"]["nombre"], producto["categoria"]["id"],
            producto["precio"], producto["status"], ", ".join(producto["genero"]),
            producto["stock"],
            producto.get("spotify") 
        ))

    conn.commit()
    conn.close()