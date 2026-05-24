# 📋 Guía de Implementación: JWT Centralizado en Microservicios

Esta guía te ayudará a implementar la **validación centralizada de tokens JWT** en tu proyecto de microservicios.

---

## 📑 Tabla de Contenidos

1. [Cambios Realizados](#cambios-realizados)
2. [Paso a Paso](#paso-a-paso)
3. [Archivos a Crear/Modificar](#archivos-a-crearmodificar)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Pruebas](#pruebas)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🔄 Cambios Realizados

### Resumen Ejecutivo

### Estado actual aplicado en el proyecto

En el estado actual del repositorio:

- **Usuarios** expone `POST /api/validate-token`.
- **Paquetes** ya valida tokens consultando a Usuarios mediante `src/utils/tokenValidator.ts`.
- **Notificaciones** fue actualizado para usar el mismo esquema de Paquetes.
- La variable de entorno usada por Paquetes y Notificaciones es:

```env
USERS_SERVICE_URL=http://localhost:3001
```

> Nota: `JWT_SECRET` puede seguir existiendo en Paquetes y Notificaciones por compatibilidad, pero ya no se usa para validar tokens localmente en esos servicios.

**Antes:** Cada microservicio validaba JWT localmente (3 copias del mismo código).  
**Después:** Solo **Usuarios** valida JWT. Los otros microservicios consultan a Usuarios.

### Ventajas

✅ Una única fuente de verdad para tokens  
✅ Sin duplicación de código  
✅ Cambios centralizados en un solo lugar  
✅ Menor consumo de memoria  
✅ Escalable a más microservicios  

---

## 📝 Paso a Paso

### **Paso 1: Actualizar Microservicio Usuarios**

#### 1.1 Modificar `src/service/auth.service.ts`

Agrega la función `validarTokenCentralizado()`:

```typescript
// Función existente - NO CAMBIAR
export const generarToken = (usuario: any) => {
  return jwt.sign(
    {
      id: usuario.id,
      usuario: usuario.usuario,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1d',
    }
  );
};

// NUEVA FUNCIÓN - AGREGAR
export const validarTokenCentralizado = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return {
      valido: true,
      datos: decoded,
    };
  } catch (error) {
    return {
      valido: false,
      datos: null,
      error: (error as Error).message,
    };
  }
};
```

#### 1.2 Modificar `src/controllers/usuarios.controller.ts`

Actualiza el import:

```typescript
import { generarToken, validarTokenCentralizado } from '../service/auth.service.js';
```

Agrega el nuevo controlador al final del archivo:

```typescript
export const validarToken = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        valido: false,
        mensaje: 'Token requerido',
      });
    }

    const resultado = validarTokenCentralizado(token);

    if (!resultado.valido) {
      return res.status(401).json({
        valido: false,
        mensaje: 'Token inválido',
      });
    }

    res.json({
      valido: true,
      usuario: resultado.datos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      valido: false,
      error: (error as Error).message,
    });
  }
};
```

#### 1.3 Modificar `src/routes/usuarios.routes.ts`

Actualiza el import:

```typescript
import {
  registrarUsuario,
  listarUsuarios,
  login,
  obtenerUsuario,
  validarToken,  // AGREGAR ESTA LÍNEA
} from '../controllers/usuarios.controller.js';
```

Agrega la nueva ruta después de `/login`:

```typescript
router.post(
  '/validate-token',
  validarToken
);
```

**Resultado:** Tu archivo routes tendrá algo así:

```typescript
router.post('/login', login);
router.post('/validate-token', validarToken);  // Nueva ruta
router.post('/usuarios', validarToken, soloAdmin, registrarUsuario);
// ... resto de rutas
```

---

### **Paso 2: Actualizar Microservicio Paquetes**

#### 2.1 Crear `src/utils/tokenValidator.ts`

Crea este archivo con el siguiente contenido:

```typescript
export const validarTokenConServidorUsuarios = async (
  token: string
) => {
  try {
    const usuariosServiceUrl =
      process.env.USERS_SERVICE_URL ||
      'http://localhost:3001';

    const response = await fetch(
      `${usuariosServiceUrl}/api/validate-token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        valido: false,
        usuario: null,
      };
    }

    const data = await response.json();

    if (!data?.valido || !data?.usuario || !data.usuario.id) {
      return {
        valido: false,
        usuario: null,
      };
    }

    return {
      valido: true,
      usuario: data.usuario,
    };
  } catch (error) {
    console.error('Error validando token con usuarios:', error);
    return {
      valido: false,
      usuario: null,
    };
  }
};
```

#### 2.2 Reemplazar `src/middlewares/auth.middleware.ts`

Reemplaza TODO el contenido del archivo con:

```typescript
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { validarTokenConServidorUsuarios } from '../utils/tokenValidator.js';

export const validarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        mensaje: 'Token requerido',
      });
    }

    const resultado = await validarTokenConServidorUsuarios(token);

    if (!resultado.valido) {
      return res.status(401).json({
        mensaje: 'Token inválido',
      });
    }

    (req as any).usuario = resultado.usuario;
    next();
  } catch (error) {
    console.error('Error validating token with users service', error);
    return res.status(500).json({
      mensaje: 'Error validando token',
    });
  }
};
```

> **Cambios clave:** La función ahora es `async` y llama a `validarTokenConServidorUsuarios()`.

---

### **Paso 3: Actualizar Microservicio Notificaciones**

Este paso deja Notificaciones alineado con Paquetes: las rutas protegidas consultan a Usuarios para validar el token y ya no verifican el JWT localmente con `jsonwebtoken`.

#### 3.1 Crear `src/utils/tokenValidator.ts`

Crea este archivo (EXACTAMENTE IGUAL al de paquetes):

```typescript
export const validarTokenConServidorUsuarios = async (
  token: string
) => {
  try {
    const usuariosServiceUrl =
      process.env.USERS_SERVICE_URL ||
      'http://localhost:3001';

    const response = await fetch(
      `${usuariosServiceUrl}/api/validate-token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        valido: false,
        usuario: null,
      };
    }

    const data = await response.json();

    if (!data?.valido || !data?.usuario || !data.usuario.id) {
      return {
        valido: false,
        usuario: null,
      };
    }

    return {
      valido: true,
      usuario: data.usuario,
    };
  } catch (error) {
    console.error('Error validando token con usuarios:', error);
    return {
      valido: false,
      usuario: null,
    };
  }
};
```

#### 3.2 Reemplazar `src/middlewares/auth.middleware.ts`

Reemplaza TODO el contenido del archivo con:

```typescript
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { validarTokenConServidorUsuarios } from '../utils/tokenValidator.js';

export const validarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        mensaje: 'Token requerido',
      });
    }

    const resultado = await validarTokenConServidorUsuarios(token);

    if (!resultado.valido || !resultado.usuario || !resultado.usuario.id) {
      return res.status(401).json({
        mensaje: 'Token inválido',
      });
    }

    (req as any).usuario = resultado.usuario;
    next();
  } catch (error) {
    console.error('Error validating token with users service', error);
    return res.status(500).json({
      mensaje: 'Error validando token',
    });
  }
};
```

---

## 🗂️ Archivos a Crear/Modificar

### Resumen Rápido

| Archivo | Microservicio | Acción |
|---------|---------------|--------|
| `src/service/auth.service.ts` | Usuarios | ✏️ Modificar - Agregar función |
| `src/controllers/usuarios.controller.ts` | Usuarios | ✏️ Modificar - Agregar controlador |
| `src/routes/usuarios.routes.ts` | Usuarios | ✏️ Modificar - Agregar ruta |
| `src/utils/tokenValidator.ts` | Paquetes | ✨ Crear nuevo |
| `src/middlewares/auth.middleware.ts` | Paquetes | ✏️ Reemplazar completo |
| `.env` | Paquetes | ✏️ Modificar - Agregar variable |
| `src/utils/tokenValidator.ts` | Notificaciones | ✨ Crear nuevo |
| `src/middlewares/auth.middleware.ts` | Notificaciones | ✏️ Reemplazar completo |
| `.env` | Notificaciones | ✏️ Modificar - Agregar variable |

---

## ⚙️ Configuración de Variables de Entorno

### Microservicio Usuarios (`.env`)

**NO CAMBIOS REQUERIDOS** - Mantén tu configuración actual:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=ms_usuarios
JWT_SECRET=llavesupersecreta
ADMIN_USERNAME=admin
ADMIN_PASSWORD=123456
ADMIN_NAME=Administrador
```

### Microservicio Paquetes (`.env`)

Agrega esta línea:

```env
PORT=3002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=ms_paquetes
JWT_SECRET=llavesupersecreta  # (Opcional - ya no se usa localmente)
USERS_SERVICE_URL=http://localhost:3001
```

### Microservicio Notificaciones (`.env`)

Agrega esta línea:

```env
PORT=3003
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=ms_notificaciones
JWT_SECRET=llavesupersecreta  # (Opcional - ya no se usa localmente)
USERS_SERVICE_URL=http://localhost:3001
```

### 🌐 Para Entornos de Producción

Cambia `localhost` por tu dominio real:

```env
USERS_SERVICE_URL=https://usuarios.tudominio.com:3001
```

---

## 🧪 Pruebas

### Prueba 1: Verificar que Usuarios funciona

```bash
# 1. Inicia el servidor de usuarios
cd microservicio_usuarios
npm start

# 2. En otra terminal, login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"123456"}'

# Deberías obtener un token
```

### Prueba 2: Validar token en Usuarios

```bash
# Usa el token obtenido en Prueba 1
curl -X POST http://localhost:3001/api/validate-token \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -H "Content-Type: application/json"

# Respuesta esperada: { "valido": true, "usuario": { ... } }
```

### Prueba 3: Validar token desde Paquetes

```bash
# 1. Inicia paquetes (en otra terminal)
cd microservicio_paquetes
npm start

# 2. Intenta crear un paquete
curl -X POST http://localhost:3002/api/paquetes \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "numero_seguimiento": "PKG-001",
    "destinatario": "Juan",
    "direccion": "Calle 1",
    "peso": 2.5,
    "estado": "pendiente",
    "descripcion": "Prueba"
  }'

# Debería funcionar si el token es válido
```

### Prueba 4: Token inválido

```bash
curl -X POST http://localhost:3002/api/paquetes \
  -H "Authorization: Bearer TOKEN_FALSO" \
  -H "Content-Type: application/json" \
  -d '{ ... }'

# Respuesta esperada: { "mensaje": "Token inválido" } (401)
```

### ✅ Checklist de Pruebas

- [ ] Login en usuarios retorna token
- [ ] Validar token válido retorna `valido: true`
- [ ] Validar token inválido retorna `valido: false`
- [ ] Crear paquete con token válido funciona
- [ ] Crear paquete con token inválido retorna 401
- [ ] Crear notificación sin token funciona (es público)
- [ ] Listar notificaciones con token válido funciona
- [ ] Listar notificaciones sin token retorna 401

---

## 🔧 Solución de Problemas

### Problema: "Token inválido" en paquetes/notificaciones

**Causa:** El middleware no puede conectar con usuarios.

**Solución:**
1. Verifica que usuarios esté corriendo en puerto 3001
2. Verifica que `USERS_SERVICE_URL` está correcto en `.env`
3. Revisa la consola de usuarios por errores

```bash
# Prueba conectar directamente
curl http://localhost:3001/api/validate-token \
  -H "Authorization: Bearer <TOKEN>"
```

### Problema: "USERS_SERVICE_URL is undefined"

**Causa:** Variable de entorno no cargada.

**Solución:**
1. Agrega `USERS_SERVICE_URL` al `.env`
2. Reinicia el servidor
3. Verifica que el `.env` está en la raíz del microservicio

### Problema: CORS Error

**Causa:** El navegador rechaza solicitudes entre dominios.

**Solución:** (Si ocurre, agrega CORS a usuarios)

```typescript
// En usuarios/src/app.ts
import cors from 'cors';
app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3003'],
}));
```

### Problema: "Cannot find module 'tokenValidator'"

**Causa:** El archivo no existe o la ruta es incorrecta.

**Solución:**
1. Verifica que creaste `src/utils/tokenValidator.ts`
2. Compila TypeScript: `npm run build`
3. Asegúrate de usar extensión `.js` en imports si está compilado

```typescript
// Correcto en desarrollo (TypeScript)
import { validarTokenConServidorUsuarios } from '../utils/tokenValidator.js';

// Si tienes error de compilación, prueba sin .js
import { validarTokenConServidorUsuarios } from '../utils/tokenValidator';
```

### Problema: Los tokens generados antes no funcionan

**Causa:** Cambio en la estructura del token.

**Solución:** Genera nuevos tokens haciendo login nuevamente.

---

## 📚 Resumen de Cambios por Microservicio

### Usuarios
- ✅ Nueva función `validarTokenCentralizado()` en auth.service
- ✅ Nuevo controlador `validarToken()` en usuarios.controller
- ✅ Nueva ruta `POST /api/validate-token`
- ✅ Export de `validarToken` en usuarios.controller

### Paquetes
- ✅ Nuevo archivo `src/utils/tokenValidator.ts`
- ✅ Middleware auth ahora es `async`
- ✅ Usa `validarTokenConServidorUsuarios()` para validar
- ✅ Agrega `USERS_SERVICE_URL` al `.env`

### Notificaciones
- ✅ Nuevo archivo `src/utils/tokenValidator.ts`
- ✅ Middleware auth ahora es `async`
- ✅ Usa `validarTokenConServidorUsuarios()` para validar
- ✅ Agrega `USERS_SERVICE_URL` al `.env`

---

## 🚀 Deploy en Producción

### Pasos

1. **Actualiza las URLs en `.env`:**
   ```env
   USERS_SERVICE_URL=https://usuarios-prod.tudominio.com
   ```

2. **Asegúrate de HTTPS:**
   - Actualiza URLs en tokenValidator.ts si es necesario
   - Configura certificados SSL

3. **Testing en staging:**
   - Prueba con todos los microservicios corriendo
   - Verifica logs de errores

4. **Monitoreo:**
   - Revisa logs de usuarios frecuentemente
   - Si usuarios cae, paquetes/notificaciones no funcionarán

---

## 📞 Soporte

Si tienes dudas o problemas:

1. Revisa la sección de [Solución de Problemas](#solución-de-problemas)
2. Verifica los logs de cada microservicio
3. Usa las pruebas con curl para aislar el problema
4. Asegúrate de que los pasos se siguieron en orden

---

## ✅ Checklist Final

- [ ] Modificaste `auth.service.ts` en usuarios
- [ ] Modificaste `usuarios.controller.ts` en usuarios
- [ ] Modificaste `usuarios.routes.ts` en usuarios
- [ ] Creaste `tokenValidator.ts` en paquetes
- [ ] Reemplazaste `auth.middleware.ts` en paquetes
- [ ] Agregaste `USERS_SERVICE_URL` en `.env` de paquetes
- [ ] Creaste `tokenValidator.ts` en notificaciones
- [ ] Reemplazaste `auth.middleware.ts` en notificaciones
- [ ] Agregaste `USERS_SERVICE_URL` en `.env` de notificaciones
- [ ] Todos los microservicios compilan sin errores
- [ ] Probaste los 4 casos de prueba principales
- [ ] Los logs no muestran errores críticos

---

**¡Listo! Tu arquitectura JWT centralizada está implementada.** 🎉
