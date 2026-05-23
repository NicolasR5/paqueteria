import { Router } from 'express';

import {
  registrarPaquete,
  listarMisPaquetes,
  cambiarEstado,
} from '../controllers/paquetes.controller.js';

import {
  validarToken,
} from '../middlewares/auth.middleware.js';

import {
  soloAdmin,
} from '../middlewares/role.middleware.js';

const router = Router();

router.post(
  '/paquetes',
  validarToken,
  registrarPaquete
);

router.get(
  '/mis-paquetes',
  validarToken,
  listarMisPaquetes
);

router.put(
  '/paquetes/:id/estado',
  validarToken,
  soloAdmin,
  cambiarEstado
);

export default router;