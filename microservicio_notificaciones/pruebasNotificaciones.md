# PRUEBAS POSTMAN - MICROSERVICIO NOTIFICACIONES

--------------------------------------------------
1. REGISTRAR NOTIFICACION DE PAQUETE CREADO
--------------------------------------------------

Este endpoint permite registrar una notificacion cuando se crea un paquete.

Normalmente lo usaria el microservicio de paquetes cuando un cliente crea un paquete.

Metodo:
POST

URL:
http://localhost:3003/api/notificaciones

Headers:
Content-Type: application/json

Body:
{
  "paquete_id": "UUID_DEL_PAQUETE",
  "usuario_dueno": "UUID_DEL_CLIENTE",
  "estado": "creado"
}

Respuesta esperada:
{
  "mensaje": "Notificacion creada correctamente",
  "id": "uuid-generado"
}



--------------------------------------------------
2. REGISTRAR NOTIFICACION DE PAQUETE EN TRANSITO
--------------------------------------------------

Este endpoint permite registrar una notificacion cuando el admin cambia el estado del paquete.

Metodo:
POST

URL:
http://localhost:3003/api/notificaciones

Headers:
Content-Type: application/json

Body:
{
  "paquete_id": "UUID_DEL_PAQUETE",
  "usuario_dueno": "UUID_DEL_CLIENTE",
  "estado": "en_transito"
}

Respuesta esperada:
{
  "mensaje": "Notificacion creada correctamente",
  "id": "uuid-generado"
}



--------------------------------------------------
3. REGISTRAR NOTIFICACION DE PAQUETE ENTREGADO
--------------------------------------------------

Metodo:
POST

URL:
http://localhost:3003/api/notificaciones

Headers:
Content-Type: application/json

Body:
{
  "paquete_id": "UUID_DEL_PAQUETE",
  "usuario_dueno": "UUID_DEL_CLIENTE",
  "estado": "entregado"
}

Respuesta esperada:
{
  "mensaje": "Notificacion creada correctamente",
  "id": "uuid-generado"
}



--------------------------------------------------
4. REGISTRAR NOTIFICACION DE PAQUETE DEVUELTO
--------------------------------------------------

Metodo:
POST

URL:
http://localhost:3003/api/notificaciones

Headers:
Content-Type: application/json

Body:
{
  "paquete_id": "UUID_DEL_PAQUETE",
  "usuario_dueno": "UUID_DEL_CLIENTE",
  "estado": "devuelto"
}

Respuesta esperada:
{
  "mensaje": "Notificacion creada correctamente",
  "id": "uuid-generado"
}



--------------------------------------------------
5. LISTAR MIS NOTIFICACIONES
--------------------------------------------------

Este endpoint devuelve unicamente las notificaciones del usuario autenticado.

Cada cliente solo puede ver SUS propias notificaciones.

Metodo:
GET

URL:
http://localhost:3003/api/mis-notificaciones

Headers:
Authorization: Bearer TOKEN_CLIENTE

Respuesta esperada:
[
  {
    "id": "uuid-notificacion",
    "paquete_id": "uuid-paquete",
    "usuario_dueno": "uuid-cliente",
    "estado": "entregado",
    "fecha_hora": "2026-05-23T05:00:00.000Z"
  },
  {
    "id": "uuid-notificacion",
    "paquete_id": "uuid-paquete",
    "usuario_dueno": "uuid-cliente",
    "estado": "en_transito",
    "fecha_hora": "2026-05-23T04:50:00.000Z"
  }
]



--------------------------------------------------
6. LISTAR TODAS LAS NOTIFICACIONES COMO ADMIN
--------------------------------------------------

Este endpoint permite que un administrador consulte todas las notificaciones del sistema.

Metodo:
GET

URL:
http://localhost:3003/api/notificaciones

Headers:
Authorization: Bearer TOKEN_ADMIN

Respuesta esperada:
[
  {
    "id": "uuid-notificacion",
    "paquete_id": "uuid-paquete",
    "usuario_dueno": "uuid-cliente",
    "estado": "creado",
    "fecha_hora": "2026-05-23T04:40:00.000Z"
  }
]



--------------------------------------------------
7. LISTAR NOTIFICACIONES DE UN PAQUETE COMO ADMIN
--------------------------------------------------

Este endpoint permite consultar el historial de notificaciones de un paquete especifico.

Metodo:
GET

URL:
http://localhost:3003/api/notificaciones/paquetes/UUID_DEL_PAQUETE

Headers:
Authorization: Bearer TOKEN_ADMIN

Respuesta esperada:
[
  {
    "id": "uuid-notificacion",
    "paquete_id": "uuid-paquete",
    "usuario_dueno": "uuid-cliente",
    "estado": "entregado",
    "fecha_hora": "2026-05-23T05:00:00.000Z"
  },
  {
    "id": "uuid-notificacion",
    "paquete_id": "uuid-paquete",
    "usuario_dueno": "uuid-cliente",
    "estado": "creado",
    "fecha_hora": "2026-05-23T04:40:00.000Z"
  }
]



--------------------------------------------------
8. PROBAR MIS NOTIFICACIONES SIN TOKEN
--------------------------------------------------

Esta prueba valida que no se pueda consultar una ruta protegida sin JWT.

Metodo:
GET

URL:
http://localhost:3003/api/mis-notificaciones

NO enviar headers.

Respuesta esperada:
{
  "mensaje": "Token requerido"
}



--------------------------------------------------
9. PROBAR TOKEN INVALIDO
--------------------------------------------------

Esta prueba valida que el middleware JWT detecte tokens incorrectos.

Metodo:
GET

URL:
http://localhost:3003/api/mis-notificaciones

Headers:
Authorization: Bearer 123456

Respuesta esperada:
{
  "mensaje": "Token invalido"
}



--------------------------------------------------
10. CLIENTE INTENTA LISTAR TODAS LAS NOTIFICACIONES
--------------------------------------------------

Esta prueba valida los permisos por rol.

Un cliente NO puede listar todas las notificaciones del sistema.

Metodo:
GET

URL:
http://localhost:3003/api/notificaciones

Headers:
Authorization: Bearer TOKEN_CLIENTE

Respuesta esperada:
{
  "mensaje": "Acceso denegado"
}



--------------------------------------------------
11. CLIENTE INTENTA LISTAR NOTIFICACIONES DE UN PAQUETE
--------------------------------------------------

Esta prueba valida que solo un admin pueda consultar notificaciones por paquete.

Metodo:
GET

URL:
http://localhost:3003/api/notificaciones/paquetes/UUID_DEL_PAQUETE

Headers:
Authorization: Bearer TOKEN_CLIENTE

Respuesta esperada:
{
  "mensaje": "Acceso denegado"
}



--------------------------------------------------
12. PROBAR BODY INCOMPLETO
--------------------------------------------------

Esta prueba valida que paquete_id y usuario_dueno sean obligatorios.

Metodo:
POST

URL:
http://localhost:3003/api/notificaciones

Headers:
Content-Type: application/json

Body:
{
  "paquete_id": "UUID_DEL_PAQUETE",
  "estado": "creado"
}

Respuesta esperada:
{
  "mensaje": "paquete_id y usuario_dueno son requeridos"
}



--------------------------------------------------
13. PROBAR ESTADO INVALIDO
--------------------------------------------------

Esta prueba valida que solo se acepten estados permitidos.

Estados validos:
- creado
- en_transito
- entregado
- devuelto

Metodo:
POST

URL:
http://localhost:3003/api/notificaciones

Headers:
Content-Type: application/json

Body:
{
  "paquete_id": "UUID_DEL_PAQUETE",
  "usuario_dueno": "UUID_DEL_CLIENTE",
  "estado": "cancelado"
}

Respuesta esperada:
{
  "mensaje": "Estado invalido",
  "estados_validos": [
    "creado",
    "en_transito",
    "entregado",
    "devuelto"
  ]
}



--------------------------------------------------
14. VALIDAR UUID
--------------------------------------------------

Todos los IDs deben verse asi:

550e8400-e29b-41d4-a716-446655440000

NO asi:
1
2
3



--------------------------------------------------
15. FLUJO COMPLETO DEL SISTEMA
--------------------------------------------------

1. Login admin en microservicio usuarios
2. Login cliente en microservicio usuarios
3. Cliente crea paquete en microservicio paquetes
4. Registrar notificacion con estado "creado"
5. Admin cambia paquete a "en_transito"
6. Registrar notificacion con estado "en_transito"
7. Admin cambia paquete a "entregado"
8. Registrar notificacion con estado "entregado"
9. Cliente consulta /api/mis-notificaciones
10. Admin consulta /api/notificaciones
11. Admin consulta /api/notificaciones/paquetes/UUID_DEL_PAQUETE
12. Validar permisos
13. Validar JWT
14. Validar UUID



--------------------------------------------------
16. QUE YA TIENES TERMINADO
--------------------------------------------------

Con esto ya tienes:

- Registro de notificaciones
- Historial de notificaciones por cliente
- Historial de notificaciones por paquete
- Consulta global para administradores
- Proteccion de rutas con JWT
- Permisos por rol
- Estados de paquete controlados
- UUID
- Fecha y hora automatica
