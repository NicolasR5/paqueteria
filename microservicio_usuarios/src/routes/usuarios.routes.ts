// Rutas de usuarios: conecta endpoints HTTP con controladores y middlewares.
import { Router } from 'express';

import {
  registrarUsuario,
  listarUsuarios,
  login,
  obtenerUsuario,
  validarTokenCentralizado,
} from '../controllers/usuarios.controller.js';

import {
  validarToken,
} from '../middlewares/auth.middleware.js';

import {
  soloAdmin,
} from '../middlewares/role.middleware.js';

const router = Router();

// Login: autentica al usuario y devuelve su token.
router.post(
  '/login',
  login
);

// Validacion centralizada: endpoint usado por otros microservicios para validar JWT.
router.post('/validate-token', validarTokenCentralizado);

// Crear usuario: solo usuarios administradores pueden registrar nuevos usuarios.
router.post(
  '/usuarios',
  validarToken,
  soloAdmin,
  registrarUsuario
);

// Listar usuarios: solo administradores pueden ver el listado completo.
router.get(
  '/usuarios',
  validarToken,
  soloAdmin,
  listarUsuarios
);

// Obtener usuario: devuelve la informacion de un usuario por ID.
router.get(
  '/usuarios/:id',
  validarToken,
  obtenerUsuario
);

export default router;
