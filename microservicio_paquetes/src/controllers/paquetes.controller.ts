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

const ESTADOS_VALIDOS = [
  'creado',
  'en_transito',
  'entregado',
  'devuelto',
];

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

export const registrarPaquete = async (
  req: Request,
  res: Response
) => {

  try {

    const { descripcion } = req.body;

    const usuario = (req as any).usuario;

    if (!usuario || !usuario.id) {
      return res.status(401).json({
        mensaje: 'Usuario inválido en token',
      });
    }

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
