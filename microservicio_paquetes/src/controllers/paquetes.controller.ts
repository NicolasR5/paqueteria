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