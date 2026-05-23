# PRUEBAS POSTMAN — MICROSERVICIO PAQUETES

--------------------------------------------------
1. CREAR PAQUETE
--------------------------------------------------

Este endpoint permite que un cliente autenticado cree un paquete.

Cuando el paquete se crea:
- se genera un UUID
- el estado inicia en "creado"
- el paquete queda asociado al usuario autenticado

Método:
POST

URL:
http://localhost:3002/api/paquetes

Headers:
Authorization: Bearer TOKEN_CLIENTE
Content-Type: application/json

Body:
{
  "descripcion": "Laptop Asus Rog"
}

Respuesta esperada:
{
  "mensaje": "Paquete creado correctamente",
  "id": "uuid-generado"
}



--------------------------------------------------
2. CREAR OTRO PAQUETE
--------------------------------------------------

Sirve para validar múltiples paquetes asociados al mismo usuario.

Método:
POST

URL:
http://localhost:3002/api/paquetes

Headers:
Authorization: Bearer TOKEN_CLIENTE
Content-Type: application/json

Body:
{
  "descripcion": "iPhone 15 Pro Max"
}

Respuesta esperada:
{
  "mensaje": "Paquete creado correctamente",
  "id": "uuid-generado"
}



--------------------------------------------------
3. LISTAR MIS PAQUETES
--------------------------------------------------

Este endpoint devuelve únicamente los paquetes del usuario autenticado.

Cada cliente solo puede ver SUS propios paquetes.

Método:
GET

URL:
http://localhost:3002/api/mis-paquetes

Headers:
Authorization: Bearer TOKEN_CLIENTE

Respuesta esperada:
[
  {
    "id": "uuid-paquete",
    "descripcion": "Laptop Asus Rog",
    "usuario_dueno": "uuid-usuario",
    "estado": "creado"
  },
  {
    "id": "uuid-paquete",
    "descripcion": "iPhone 15 Pro Max",
    "usuario_dueno": "uuid-usuario",
    "estado": "creado"
  }
]



--------------------------------------------------
4. PROBAR LISTADO SIN TOKEN
--------------------------------------------------

Esta prueba valida que no se pueda acceder a rutas protegidas sin JWT.

Método:
GET

URL:
http://localhost:3002/api/mis-paquetes

NO enviar headers.

Respuesta esperada:
{
  "mensaje": "Token requerido"
}



--------------------------------------------------
5. PROBAR TOKEN INVÁLIDO
--------------------------------------------------

Esta prueba valida que el middleware JWT detecte tokens incorrectos.

Método:
GET

URL:
http://localhost:3002/api/mis-paquetes

Headers:
Authorization: Bearer 123456

Respuesta esperada:
{
  "mensaje": "Token inválido"
}



--------------------------------------------------
6. CAMBIAR ESTADO DEL PAQUETE
--------------------------------------------------

Este endpoint permite que un ADMIN cambie el estado de un paquete.

Estados válidos:
- creado
- en_transito
- entregado
- devuelto

Método:
PUT

URL:
http://localhost:3002/api/paquetes/UUID_DEL_PAQUETE/estado

Headers:
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

Body:
{
  "estado": "en_transito"
}

Respuesta esperada:
{
  "mensaje": "Estado actualizado"
}



--------------------------------------------------
7. CAMBIAR ESTADO A ENTREGADO
--------------------------------------------------

Método:
PUT

URL:
http://localhost:3002/api/paquetes/UUID_DEL_PAQUETE/estado

Headers:
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

Body:
{
  "estado": "entregado"
}

Respuesta esperada:
{
  "mensaje": "Estado actualizado"
}



--------------------------------------------------
8. CLIENTE INTENTA CAMBIAR ESTADO
--------------------------------------------------

Esta prueba valida los permisos por rol.

Un cliente NO puede cambiar estados.

Método:
PUT

URL:
http://localhost:3002/api/paquetes/UUID_DEL_PAQUETE/estado

Headers:
Authorization: Bearer TOKEN_CLIENTE
Content-Type: application/json

Body:
{
  "estado": "devuelto"
}

Respuesta esperada:
{
  "mensaje": "Acceso denegado"
}



--------------------------------------------------
9. VALIDAR CAMBIO DE ESTADO
--------------------------------------------------

Después de actualizar el estado, vuelve a consultar:

Método:
GET

URL:
http://localhost:3002/api/mis-paquetes

Headers:
Authorization: Bearer TOKEN_CLIENTE

Respuesta esperada:
[
  {
    "id": "uuid-paquete",
    "descripcion": "Laptop Asus Rog",
    "usuario_dueno": "uuid-usuario",
    "estado": "entregado"
  }
]



--------------------------------------------------
10. VALIDAR UUID
--------------------------------------------------

Todos los IDs deben verse así:

550e8400-e29b-41d4-a716-446655440000

NO así:
1
2
3



--------------------------------------------------
11. PROBAR CREAR PAQUETE SIN TOKEN
--------------------------------------------------

Método:
POST

URL:
http://localhost:3002/api/paquetes

Headers:
Content-Type: application/json

Body:
{
  "descripcion": "PlayStation 5"
}

Respuesta esperada:
{
  "mensaje": "Token requerido"
}



--------------------------------------------------
12. PROBAR BODY VACÍO
--------------------------------------------------

Método:
POST

URL:
http://localhost:3002/api/paquetes

Headers:
Authorization: Bearer TOKEN_CLIENTE
Content-Type: application/json

Body:
{
}

Respuesta esperada:
Debe generar error o validación.



--------------------------------------------------
13. FLUJO COMPLETO DEL SISTEMA
--------------------------------------------------

1. Login admin
2. Login cliente
3. Cliente crea paquete
4. Cliente crea otro paquete
5. Cliente consulta sus paquetes
6. Admin cambia estado
7. Cliente consulta nuevamente
8. Validar permisos
9. Validar JWT
10. Validar UUID



--------------------------------------------------
14. QUÉ YA TIENES TERMINADO
--------------------------------------------------

Con esto ya tienes:

✅ JWT compartido entre microservicios
✅ Roles
✅ CRUD básico paquetes
✅ Protección de rutas
✅ UUID
✅ Arquitectura distribuida
✅ Separación por responsabilidades
✅ Cliente solo ve sus paquetes
✅ Admin controla estados



--------------------------------------------------
15. SIGUIENTE MICROSERVICIO
--------------------------------------------------

Ahora el siguiente paso lógico es:

MICROSERVICIO NOTIFICACIONES

Porque:
- cada creación de paquete debe generar notificación
- cada cambio de estado debe generar notificación
- el cliente debe consultar historial de notificaciones