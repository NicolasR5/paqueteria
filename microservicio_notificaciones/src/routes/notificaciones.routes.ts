import { Router } from 'express';

import {
  listarMisNotificaciones,
  listarNotificaciones,
  listarNotificacionesPaquete,
  registrarNotificacion,
} from '../controllers/notificaciones.controller.js';

import {
  validarToken,
} from '../middlewares/auth.middleware.js';

import {
  soloAdmin,
} from '../middlewares/role.middleware.js';

const router = Router();

router.post(
  '/notificaciones',
  registrarNotificacion
);

router.get(
  '/mis-notificaciones',
  validarToken,
  listarMisNotificaciones
);

router.get(
  '/notificaciones',
  validarToken,
  soloAdmin,
  listarNotificaciones
);

router.get(
  '/notificaciones/paquetes/:id',
  validarToken,
  soloAdmin,
  listarNotificacionesPaquete
);

export default router;
