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

router.post(
  '/login',
  login
);

router.post('/validate-token', validarTokenCentralizado);

router.post(
  '/usuarios',
  validarToken,
  soloAdmin,
  registrarUsuario
);

router.get(
  '/usuarios',
  validarToken,
  soloAdmin,
  listarUsuarios
);

router.get(
  '/usuarios/:id',
  validarToken,
  obtenerUsuario
);

export default router;