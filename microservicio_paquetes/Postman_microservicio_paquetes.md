# Postman_microservicio_paquetes

## Base URL

- `{{baseUrl}} = http://localhost:3002/api`

---

## Colección de pruebas

### 1. Crear paquete

- Method: `POST`
- URL: `{{baseUrl}}/paquetes`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "descripcion": "Paquete de prueba"
}
```
- Tests:
  - Status 201
  - Response contiene `mensaje` y `id`

### 2. Listar mis paquetes

- Method: `GET`
- URL: `{{baseUrl}}/mis-paquetes`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Tests:
  - Status 200
  - Respuesta es un arreglo

### 3. Cambiar estado de paquete (admin)

- Method: `PUT`
- URL: `{{baseUrl}}/paquetes/{{paquete_id}}/estado`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "estado": "entregado"
}
```
- Tests:
  - Status 200
  - Mensaje de actualización correcto

### 4. Validación de token inválido

- Method: `GET`
- URL: `{{baseUrl}}/mis-paquetes`
- Headers:
  - `Authorization: Bearer {{invalid_token}}`
- Tests:
  - Status 401
  - Mensaje `Token inválido`

---

## Variables sugeridas

- `baseUrl`: `http://localhost:3002/api`
- `auth_token`: token obtenido desde `microservicio_usuarios`
- `invalid_token`: `Bearer eyJ...tokeninvalido...`
- `paquete_id`: id del paquete creado durante las pruebas
