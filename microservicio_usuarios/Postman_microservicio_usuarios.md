# Postman_microservicio_usuarios

## Base URL

- `{{baseUrl}} = http://localhost:3001/api`

---

## Colección de pruebas

### 1. Login de usuario

- Method: `POST`
- URL: `{{baseUrl}}/login`
- Body (JSON):
```json
{
  "usuario": "admin",
  "password": "123456"
}
```
- Tests:
  - Status 200
  - Response contains `token`
  - Guardar `token` en variable de entorno `auth_token`

### 2. Validar token centralizado

- Method: `POST`
- URL: `{{baseUrl}}/validate-token`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Tests:
  - Status 200
  - Response body contiene `valido: true`
  - Response body contiene `usuario`

### 3. Crear nuevo usuario (admin)

- Method: `POST`
- URL: `{{baseUrl}}/usuarios`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Body (JSON):
```json
{
  "nombre_completo": "Usuario Prueba",
  "usuario": "usuarioPrueba",
  "password": "pass1234",
  "rol": "cliente"
}
```
- Tests:
  - Status 201
  - Mensaje de éxito

### 4. Listar usuarios (admin)

- Method: `GET`
- URL: `{{baseUrl}}/usuarios`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Tests:
  - Status 200
  - El cuerpo es un arreglo

### 5. Obtener usuario por id

- Method: `GET`
- URL: `{{baseUrl}}/usuarios/{{usuario_id}}`
- Headers:
  - `Authorization: Bearer {{auth_token}}`
- Tests:
  - Status 200
  - El cuerpo contiene el usuario solicitado

---

## Variables sugeridas de entorno

- `baseUrl`: `http://localhost:3001/api`
- `auth_token`: token JWT generado en el login
- `usuario_id`: id del usuario creado o existente
