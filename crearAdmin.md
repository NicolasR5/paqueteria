# CREAR USUARIO ADMINISTRADOR INICIAL

Como la ruta para crear usuarios está protegida y solo un admin puede usarla, primero debes crear un administrador manualmente en MySQL.

--------------------------------------------------
PASO 1 — GENERAR PASSWORD ENCRIPTADA
--------------------------------------------------

Crea un archivo llamado:

hash.js

Con este contenido:

import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash('123456', 10);

console.log(hash);

--------------------------------------------------
PASO 2 — EJECUTAR EL ARCHIVO
--------------------------------------------------

Ejecuta:

node hash.js

Obtendrás algo parecido a esto:

$2a$10$ABCDEF123456789...

COPIA ESE HASH.

--------------------------------------------------
PASO 3 — INSERTAR ADMIN EN MYSQL
--------------------------------------------------

Abre MySQL y ejecuta:

USE ms_usuarios;

INSERT INTO usuarios (
    id,
    nombre_completo,
    usuario,
    password,
    rol
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Administrador',
    'admin',
    '$2a$10$ABCDEF123456789...',
    'admin'
);

IMPORTANTE:
Reemplaza:
$2a$10$ABCDEF123456789...

por el hash REAL generado en el paso anterior.

--------------------------------------------------
PASO 4 — HACER LOGIN ADMIN
--------------------------------------------------

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

--------------------------------------------------
RESPUESTA ESPERADA
--------------------------------------------------

{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Administrador",
    "rol": "admin"
  }
}

--------------------------------------------------
PASO 5 — COPIAR TOKEN
--------------------------------------------------

Copia el token porque lo usarás para:

- crear usuarios
- listar usuarios
- probar permisos
- acceder a rutas protegidas