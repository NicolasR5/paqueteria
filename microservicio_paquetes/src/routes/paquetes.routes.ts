// Rutas de paquetes: conecta endpoints HTTP con controladores y middlewares.
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

// Crear paquete: requiere token valido y registra el paquete del usuario autenticado.
router.post(
  '/paquetes',
  validarToken,
  registrarPaquete
);

// Mis paquetes: requiere token valido y devuelve solo los paquetes del usuario.
router.get(
  '/mis-paquetes',
  validarToken,
  listarMisPaquetes
);

// Cambiar estado: requiere token valido y rol admin para actualizar un paquete.
router.put(
  '/paquetes/:id/estado',
  validarToken,
  soloAdmin,
  cambiarEstado
);

export default router;
