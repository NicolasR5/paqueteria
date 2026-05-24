import type {
  Request,
  Response,
} from 'express';

import bcrypt from 'bcryptjs';

import { generarToken, verificarToken } from '../services/auth.service.js';

import { v4 as uuidv4 } from 'uuid';

import {
  crearUsuario,
  obtenerUsuarios,
  buscarUsuarioPorUsuario,
  obtenerUsuarioPorId,
} from '../models/usuarios.model.js';

export const registrarUsuario = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      nombre_completo,
      usuario,
      password,
      rol,
    } = req.body;

    const passwordHash =
      await bcrypt.hash(password, 10);

    await crearUsuario(
      uuidv4(),
      nombre_completo,
      usuario,
      passwordHash,
      rol
    );

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

export const listarUsuarios = async (
  req: Request,
  res: Response
) => {

  try {

    const usuarios =
      await obtenerUsuarios();

    res.json(usuarios);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      usuario,
      password,
    } = req.body;

    const usuarioDB =
      await buscarUsuarioPorUsuario(usuario);

    if (!usuarioDB) {

      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });

    }

    const passwordCorrecto =
      await bcrypt.compare(
        password,
        usuarioDB.password
      );

    if (!passwordCorrecto) {

      return res.status(401).json({
        mensaje: 'Password incorrecto',
      });

    }

    const token =
      generarToken(usuarioDB);

    res.json({
      token,
      usuario: {
        id: usuarioDB.id,
        nombre: usuarioDB.nombre_completo,
        rol: usuarioDB.rol,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

export const obtenerUsuario = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        mensaje: 'ID de usuario inválido',
      });
    }

    const usuario =
      await obtenerUsuarioPorId(id);

    if (!usuario) {

      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });

    }

    res.json(usuario);

  } catch (error) {

    console.error(error);

    res.status(500).json(error);

  }

};

export const validarTokenCentralizado = (
  req: Request,
  res: Response
) => {

  try {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        valido: false,
        mensaje: 'Token requerido',
      });
    }

    const decoded = verificarToken(token);

    if (!decoded.valido) {
      return res.status(401).json({
        valido: false,
        mensaje: 'Token inválido',
      });
    }

    return res.json({
      valido: true,
      usuario: decoded.datos,
    });

  } catch (error) {

    return res.status(401).json({
      valido: false,
      mensaje: 'Token inválido',
    });

  }

};