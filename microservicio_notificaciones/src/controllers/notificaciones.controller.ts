import type {
  Request,
  Response,
} from 'express';

import { randomUUID } from 'crypto';

import {
  ESTADOS_VALIDOS,
  crearNotificacion,
  obtenerNotificaciones,
  obtenerNotificacionesPaquete,
  obtenerNotificacionesUsuario,
  type EstadoPaquete,
} from '../models/notificaciones.model.js';

const normalizarEstado = (
  estado: unknown
): EstadoPaquete | null => {

  if (typeof estado !== 'string') {
    return null;
  }

  const estadoNormalizado = estado
    .trim()
    .toLowerCase()
    .replace(' ', '_')
    .replace('á', 'a');

  if (
    ESTADOS_VALIDOS.includes(
      estadoNormalizado as EstadoPaquete
    )
  ) {
    return estadoNormalizado as EstadoPaquete;
  }

  return null;

};

export const registrarNotificacion = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      paquete_id,
      usuario_dueno,
      estado,
    } = req.body;

    if (!paquete_id || !usuario_dueno) {
      return res.status(400).json({
        mensaje: 'paquete_id y usuario_dueno son requeridos',
      });
    }

    const estadoValido =
      normalizarEstado(estado);

    if (!estadoValido) {
      return res.status(400).json({
        mensaje: 'Estado invalido',
        estados_validos: ESTADOS_VALIDOS,
      });
    }

    const id = randomUUID();

    await crearNotificacion(
      id,
      paquete_id,
      usuario_dueno,
      estadoValido
    );

    res.status(201).json({
      mensaje: 'Notificacion creada correctamente',
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

export const listarMisNotificaciones = async (
  req: Request,
  res: Response
) => {

  try {

    const usuario = (req as any).usuario;

    const notificaciones =
      await obtenerNotificacionesUsuario(
        usuario.id
      );

    res.json(notificaciones);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

export const listarNotificaciones = async (
  req: Request,
  res: Response
) => {

  try {

    const notificaciones =
      await obtenerNotificaciones();

    res.json(notificaciones);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

export const listarNotificacionesPaquete = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        mensaje: 'ID de paquete invalido',
      });
    }

    const notificaciones =
      await obtenerNotificacionesPaquete(id);

    res.json(notificaciones);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};
