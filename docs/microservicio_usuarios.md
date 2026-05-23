Instalar UUID:

npm install uuid
npm install -D @types/uuid

# 1. LOGIN ADMINISTRADOR

Este endpoint sirve para autenticar un usuario en el sistema.
Si las credenciales son correctas, devuelve un JWT que permitirá acceder a las rutas protegidas.

Método:
POST

URL:
http://localhost:3001/api/login

Headers:
Content-Type: application/json

Body:
{
  "usuario": "admin",
  "password": "123456"
}

Respuesta esperada:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Administrador",
    "rol": "admin"
  }
}



# 2. CREAR USUARIO CLIENTE

Este endpoint sirve para que un administrador cree nuevos usuarios dentro del sistema.

Requiere token JWT.

Método:
POST

URL:
http://localhost:3001/api/usuarios

Headers:
Authorization: Bearer TU_TOKEN
Content-Type: application/json

Body:
{
  "nombre_completo": "Juan Perez",
  "usuario": "juan",
  "password": "123456",
  "rol": "cliente"
}

Respuesta esperada:
{
  "mensaje": "Usuario creado correctamente"
}



# 3. CREAR USUARIO ADMINISTRADOR

Este endpoint sirve para registrar otro usuario administrador.

Solo un admin puede hacerlo.

Método:
POST

URL:
http://localhost:3001/api/usuarios

Headers:
Authorization: Bearer TU_TOKEN
Content-Type: application/json

Body:
{
  "nombre_completo": "Maria Admin",
  "usuario": "maria",
  "password": "123456",
  "rol": "admin"
}

Respuesta esperada:
{
  "mensaje": "Usuario creado correctamente"
}



# 4. LISTAR USUARIOS

Este endpoint sirve para obtener todos los usuarios registrados en el sistema.

Solo administradores pueden acceder.

Método:
GET

URL:
http://localhost:3001/api/usuarios

Headers:
Authorization: Bearer TU_TOKEN

Respuesta esperada:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre_completo": "Administrador",
    "usuario": "admin",
    "rol": "admin"
  },
  {
    "id": "8bfe6c7d-c8e1-47a5-9f91-4c9b1d3a9f0f",
    "nombre_completo": "Juan Perez",
    "usuario": "juan",
    "rol": "cliente"
  }
]



# 5. LOGIN CLIENTE

Este endpoint sirve para autenticar un usuario cliente y generar su token JWT.

Método:
POST

URL:
http://localhost:3001/api/login

Headers:
Content-Type: application/json

Body:
{
  "usuario": "juan",
  "password": "123456"
}

Respuesta esperada:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "8bfe6c7d-c8e1-47a5-9f91-4c9b1d3a9f0f",
    "nombre": "Juan Perez",
    "rol": "cliente"
  }
}



# 6. PROBAR ACCESO SIN TOKEN

Esta prueba sirve para validar que las rutas protegidas no puedan ser usadas sin autenticación.

Método:
GET

URL:
http://localhost:3001/api/usuarios

No enviar headers.

Respuesta esperada:
{
  "mensaje": "Token requerido"
}



# 7. PROBAR TOKEN INVÁLIDO

Esta prueba sirve para validar que el middleware JWT detecte tokens incorrectos.

Método:
GET

URL:
http://localhost:3001/api/usuarios

Headers:
Authorization: Bearer 123456

Respuesta esperada:
{
  "mensaje": "Token inválido"
}



# 8. CLIENTE INTENTA ACCEDER A RUTA ADMIN

Esta prueba sirve para validar los permisos por rol.

El cliente NO debe poder listar usuarios.

Método:
GET

URL:
http://localhost:3001/api/usuarios

Headers:
Authorization: Bearer TOKEN_CLIENTE

Respuesta esperada:
{
  "mensaje": "Acceso denegado"
}



# 9. PROBAR USUARIO DUPLICADO

Esta prueba sirve para validar restricciones únicas en la base de datos.

Método:
POST

URL:
http://localhost:3001/api/usuarios

Headers:
Authorization: Bearer TU_TOKEN
Content-Type: application/json

Body:
{
  "nombre_completo": "Juan Perez",
  "usuario": "juan",
  "password": "123456",
  "rol": "cliente"
}

Respuesta esperada:
Duplicate entry



# 10. VALIDAR UUID

Esta prueba sirve para confirmar que el sistema usa UUID y no IDs numéricos.

Resultado esperado:
550e8400-e29b-41d4-a716-446655440000

Incorrecto:
1
2
3



# Flujo recomendado de pruebas

1. Login admin
2. Copiar token
3. Crear cliente
4. Crear admin
5. Listar usuarios
6. Login cliente
7. Validar permisos
8. Validar JWT
9. Validar UUID
10. Validar errores