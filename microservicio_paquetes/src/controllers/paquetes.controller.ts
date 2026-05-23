import type {
  Request,
  Response,
} from 'express';

import { v4 as uuidv4 } from 'uuid';

import {
  crearPaquete,
  obtenerPaquetesUsuario,
  actualizarEstadoPaquete,
} from '../models/paquetes.model.js';

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

    const { estado } = req.body;

    await actualizarEstadoPaquete(
      id,
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