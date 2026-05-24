// Importaciones: tipos de Express, generador de IDs y funciones del modelo de paquetes.
import type {
  Request,
  Response,
} from 'express';

import { v4 as uuidv4 } from 'uuid';

import {
  crearPaquete,
  obtenerPaquetesUsuario,
  obtenerPaquetePorId,
  actualizarEstadoPaquete,
} from '../models/paquetes.model.js';

// Estados permitidos: lista los valores validos que puede tener un paquete.
const ESTADOS_VALIDOS = [
  'creado',
  'en_transito',
  'entregado',
  'devuelto',
];

// Utilidades de validacion: limpia y verifica que el estado recibido sea permitido.
const normalizarEstado = (
  estado: unknown
) => {

  if (typeof estado !== 'string') {
    return null;
  }

  const estadoNormalizado = estado
    .trim()
    .toLowerCase()
    .replace(' ', '_')
    .replace('á', 'a');

  return ESTADOS_VALIDOS.includes(estadoNormalizado)
    ? estadoNormalizado
    : null;

};

// Comunicacion con notificaciones: crea un registro cada vez que el paquete cambia de estado.
const registrarNotificacion = async (
  paquete_id: string,
  usuario_dueno: string,
  estado: string
) => {

  const respuesta = await fetch(
    'http://localhost:3003/api/notificaciones',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paquete_id,
        usuario_dueno,
        estado,
      }),
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      'No se pudo crear la notificacion'
    );
  }

};

// Crear paquete: registra un paquete para el usuario autenticado y genera su primera notificacion.
export const registrarPaquete = async (
  req: Request,
  res: Response
) => {

  try {

    const { descripcion } = req.body;

    const usuario = (req as any).usuario;

    // CONSULTA HTTP A MS USUARIOS
    const respuesta = await fetch(
      `http://localhost:3001/api/usuarios/${usuario.id}`,
      {
        method: 'GET',
        headers: {
          Authorization:
            req.headers.authorization as string,
        },
      }
    );

    // VALIDAR RESPUESTA
    if (!respuesta.ok) {

      return res.status(404).json({
        mensaje: 'Usuario no válido',
      });

    }

    const usuarioValidado =
      await respuesta.json();

    // CREAR PAQUETE
    const id = uuidv4();


    await crearPaquete(
      id,
      descripcion,
      usuario.id,
      'creado'
    );

    await registrarNotificacion(
      id,
      usuarioValidado.id,
      'creado'
    );

    res.status(201).json({
      mensaje: 'Paquete creado correctamente',
      id,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error interno',
      error,
    });

  }

};

// Listar mis paquetes: devuelve solamente los paquetes asociados al usuario autenticado.
export const listarMisPaquetes = async (
  req: Request,
  res: Response
) => {

  try {

    const usuario =
      (req as any).usuario;

    const paquetes =
      await obtenerPaquetesUsuario(
        usuario.id
      );

    res.json(paquetes);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

// Cambiar estado: valida el nuevo estado, actualiza el paquete y registra la notificacion.
export const cambiarEstado = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        mensaje: 'ID de paquete inválido',
      });
    }

    const estado =
      normalizarEstado(req.body.estado);

    if (!estado) {
      return res.status(400).json({
        mensaje: 'Estado invalido',
        estados_validos: ESTADOS_VALIDOS,
      });
    }

    const paquete =
      await obtenerPaquetePorId(id);

    if (!paquete) {
      return res.status(404).json({
        mensaje: 'Paquete no encontrado',
      });
    }

    await actualizarEstadoPaquete(
      id,
      estado
    );

    await registrarNotificacion(
      id,
      paquete.usuario_dueno,
      estado
    );

    res.json({
      mensaje: 'Estado actualizado',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};
