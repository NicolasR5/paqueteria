import { Router } from 'express';

import {
  registrarUsuario,
  listarUsuarios,
  login,
} from '../controllers/usuarios.controller.js';

import { validarToken } from '../middlewares/auth.middleware.js';
import { soloAdmin } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/login', login);

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

export default router;