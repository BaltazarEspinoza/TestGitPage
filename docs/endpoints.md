# ENDPOINTS DEFINIDOS EN api_routes.py
## /api/productos

### GET: get_productos()

Hace una solicitud en SQL para seleccionar todo desde la tabla productos, y por cada fila, las añade a un diccionario, para luego reconstruir la estructura en una variable que se transformará a JSON con jsonify.

### POST: crear_producto()

En base a un body en json, genera una variable data, de la que se recuperan los diversos elementos para crear un producto, luego, se checkea que el producto exista, y en caso contrario, se añade el producto a la base de datos.

### PUT: actualizar_producto()

De la misma manera que crear_producto, solicita un body en json para usar como dato, para luego actualizar la base de datos en base a la ID recibida como argumento.

## /api/productos/<id>

### DELETE: eliminar_producto(id)

Con la ID proporcionada como argumento al final de la URL, elimina una fila de la base de datos con la ID que coincida con la del argumento.


### /api/usuarios

### GET: get_usuarios()

Mismo funcionamiento de /api/productos, pero haciendo una request desde la tabla usuarios. Implícitamente posee sólo la función de tipo GET.
