from flask import Blueprint, render_template, request, redirect, flash, url_for, session, jsonify
import json, os, hashlib, sqlite3
from utils import validar_password, cargar_usuarios
import db_utils
from dotenv import load_dotenv
load_dotenv()
routes_bp = Blueprint('routes', __name__)

DATABASE_FILE = os.getenv("DATABASE_FILE")

@routes_bp.route('/delete_account', methods=['POST'])
def delete_account():
    # Elimina la cuenta del usuario actualmente logueado
    user = session.get('user')
    if not user:
        flash('No estás autenticado.', 'warning')
        return redirect(url_for('routes.login'))

    email = user.get('email')
    if not email:
        flash('Error: email de usuario no encontrado.', 'danger')
        return redirect(url_for('routes.home'))

    db_utils.eliminar_usuario(email)
    session.pop('user', None)
    flash('Cuenta eliminada correctamente.', 'success')
    # Redirige a la página de registro o inicio
    return redirect(url_for('routes.register'))

@routes_bp.route('/register', methods=['GET', 'POST'])
def register():
    if 'user' in session:
        flash('Ya tienes una sesión activa. Cierra sesión antes de registrar una nueva cuenta.', 'warning')
        return redirect(url_for('routes.home'))
    
    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirm-password']

        # Validar contraseña y mostrar el error específico si no es válida
        password_validation = validar_password(password)
        if password_validation != True:
            flash(password_validation, 'danger')
            return render_template('register.html')
        
        if password != confirm:
            flash('Las contraseñas no coinciden.', 'danger')
            return render_template('register.html')
        if password:
            password_hash = hashlib.sha256(password.encode()).hexdigest()

        db_utils.insertarUsuario(nombre, email, password_hash)
        flash('Registro exitoso, bienvenido!', 'success')
        session['user'] = {'nombre': nombre, 'email': email}
        return redirect(url_for('routes.home'))
    
    return render_template('register.html')

@routes_bp.route('/login', methods=['GET', 'POST'])
def login():
    if 'user' in session:
        flash('Ya tienes una sesión activa. Cierra sesión antes de registrar una nueva cuenta.', 'warning')
        return redirect(url_for('routes.home'))
    
    if request.method == 'POST':

        email = request.form['email'].strip().lower()
        password = request.form['password']

        usuarios = cargar_usuarios()  # lee desde la base de datos y recupera desde table usuarios

        #u[1] == email, en la tupla
        user = next((u for u in usuarios if u[1].lower() == email), None) 


        if not user:
            flash('Correo no registrado.', 'danger')
            return render_template('login.html')

        # compara hash
        password_hash = hashlib.sha256(password.encode()).hexdigest()

        #user[2] == pass_hash
        if user[2] != password_hash:
            flash('Contraseña incorrecta.', 'danger')
            return render_template('login.html')
    
        # inicia sesión
        session['user'] = {'nombre': user[0], 'email': user[1]}
        flash(f'¡Bienvenido, {user[0]}!', 'success')
        return redirect(url_for('routes.home')) 

    return render_template('login.html')

@routes_bp.route('/profile', methods=['GET', 'POST'])
def profile():
    user = session.get('user')
    if not user:
        flash('No estás autenticado.', 'warning')
        return redirect(url_for('routes.login'))

    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        old_email = user.get('email')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')

        # Validación de nuevas contraseñas si se proporcionan
        if new_password or confirm_password:
            if new_password != confirm_password:
                flash('Las nuevas contraseñas no coinciden.', 'danger')
                return render_template('profile.html', nombre=user['nombre'], email=user['email'])
            password_validation = validar_password(new_password)
            if password_validation != True:
                flash(password_validation, 'danger')
                return render_template('profile.html', nombre=user['nombre'], email=user['email'])

        # Si cambia el email, verificar duplicados
        if email.lower() != old_email.lower():
            usuarios = cargar_usuarios()
            if any(u for u in usuarios if u[1].lower() == email.lower()):
                flash('El correo ya está en uso por otro usuario.', 'danger')
                return render_template('profile.html', nombre=user['nombre'], email=user['email'])
        db_utils.modificar_usuario(old_email, nombre, email, new_password if new_password else None)
        
        # Actualiza la sesión con los nuevos datos
        session['user']['nombre'] = nombre
        session['user']['email'] = email
        flash('Perfil actualizado correctamente.', 'success')
        return redirect(url_for('routes.profile'))

    return render_template('profile.html', nombre=user['nombre'], email=user['email'])

@routes_bp.route('/')
def home():
    user = session.get('user')
    email = user['email'] if user else None # email agregado
    nombre = user['nombre'] if user else None
    return render_template('index.html', nombre=nombre, email=email)  # manda a la pagina principal #Ahora tambien recibe el email


@routes_bp.route('/carrito')
def carrito():
    user = session.get('user')
    if not session.get('user'):
        flash('Debes iniciar sesión para acceder al carrito.', 'warning')
        return render_template(login.html)
    return render_template('carrito.html')

@routes_bp.route('/feedback')
def feedback():
    return render_template('feedback.html')

@routes_bp.route('/admin')
def admin():
    return render_template('admin.html')


@routes_bp.route('/logout')
def logout():
    session.pop('user', None)
    flash('Sesión cerrada correctamente', 'success')
    return redirect(url_for('routes.login'))

# (En tu archivo de rutas, donde está routes_bp)

@routes_bp.route('/producto/<id>')
def producto_detalle(id):
    
    # 1. Busca el producto en la BASE DE DATOS
    producto_row = db_utils.get_producto_por_id(id)
    
    # 2. Si la función devuelve 'None', el producto no existe.
    if producto_row is None:
        print(f"⚠️ No se encontró producto con ID en la DB:", id)
        return render_template('404.html'), 404

    # 3. ¡IMPORTANTE! Convierte el objeto 'Row' a la ESTRUCTURA que espera tu HTML.
    #    (Esta es la misma estructura que usas en tu ruta '/productos')
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

    print(f"🎯 Producto encontrado y procesado:", producto['titulo'])

    user = session.get('user')
    nombre = user['nombre'] if user else None 
    
    # 4. Pasa el nuevo diccionario 'producto' (ya no el 'producto_row')
    return render_template('detalle.html', producto=producto, nombre=nombre)