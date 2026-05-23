import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import {
  crearUsuario,
  obtenerUsuarios,
  buscarUsuarioPorUsername,
} from '../models/usuarios.model.js';

import { generarToken } from '../service/auth.service.js';

export const registrarUsuario = async (
  req: Request,
  res: Response
) => {
  try {
    const { nombre_completo, usuario, password, rol } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const id = uuidv4();

    await crearUsuario(
      id,
      nombre_completo,
      usuario,
      passwordHash,
      rol
    );

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const listarUsuarios = async (
  _req: Request,
  res: Response
) => {
  try {
    const usuarios = await obtenerUsuarios();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { usuario, password } = req.body;

    const usuarioDB =
      await buscarUsuarioPorUsername(usuario);

    if (!usuarioDB) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuarioDB.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: 'Contraseña incorrecta',
      });
    }

    const token = generarToken(usuarioDB);

    res.json({
      token,
      usuario: {
        id: usuarioDB.id,
        nombre: usuarioDB.nombre_completo,
        rol: usuarioDB.rol,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};