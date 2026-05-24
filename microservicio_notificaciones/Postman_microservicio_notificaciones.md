# Postman_microservicio_notificaciones

## Base URL

- `{{baseUrl}} = http://localhost:3003/api`

---

## Colección de pruebas

### 1. Registrar notificación (público)

- Method: `POST`
- URL: `{{baseUrl}}/notificaciones`
- Headers:
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "mensaje": "Nueva notificación de seguimiento",
  "paquete_id": "{{paquete_id}}",
  "usuario_id": "{{usuario_id}}"
}
```
- Tests:
  - Status 201 o 200 según implementación
  - Respuesta con data de notificación

### 2. Listar mis notificaciones

- Method: `GET`
- URL: `{{baseUrl}}/mis-notificaciones`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Tests:
  - Status 200
  - Respuesta es un arreglo

### 3. Listar todas las notificaciones (admin)

- Method: `GET`
- URL: `{{baseUrl}}/notificaciones`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Tests:
  - Status 200
  - Respuesta es un arreglo

### 4. Listar notificaciones por paquete (admin)

- Method: `GET`
- URL: `{{baseUrl}}/notificaciones/paquetes/{{paquete_id}}`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Tests:
  - Status 200
  - Respuesta es un arreglo de notificaciones del paquete

### 5. Probar token inválido

- Method: `GET`
- URL: `{{baseUrl}}/mis-notificaciones`
- Headers:
  - `Authorization: Bearer {{invalid_token}}`
- Tests:
  - Status 401
  - Mensaje `Token inválido`

---

## Variables sugeridas

- `baseUrl`: `http://localhost:3003/api`
- `auth_token`: token válido obtenido en `microservicio_usuarios`
- `invalid_token`: token inválido para pruebas negativas
- `paquete_id`: id del paquete usado para filtrar notificaciones
- `usuario_id`: id del usuario que recibe la notificación
