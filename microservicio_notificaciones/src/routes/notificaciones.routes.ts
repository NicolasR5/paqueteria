// Rutas de notificaciones: conecta endpoints HTTP con controladores y middlewares.
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

// Crear notificacion: registra cambios de estado enviados por el servicio de paquetes.
router.post(
  '/notificaciones',
  registrarNotificacion
);

// Mis notificaciones: requiere token valido y filtra por el usuario autenticado.
router.get(
  '/mis-notificaciones',
  validarToken,
  listarMisNotificaciones
);

// Listar todas: requiere token valido y rol admin.
router.get(
  '/notificaciones',
  validarToken,
  soloAdmin,
  listarNotificaciones
);

// Listar por paquete: requiere token valido y rol admin para consultar historial.
router.get(
  '/notificaciones/paquetes/:id',
  validarToken,
  soloAdmin,
  listarNotificacionesPaquete
);

export default router;
