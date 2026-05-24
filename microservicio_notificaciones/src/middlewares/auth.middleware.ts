// Middleware de autenticacion: valida tokens usando el microservicio de usuarios.
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { validarTokenConServidorUsuarios } from '../utils/tokenValidator.js';

// Validar token: extrae el Bearer token, lo consulta y guarda el usuario en la request.
export const validarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const token =
      req.headers.authorization?.split(' ')[1];

    if (!token) {

      return res.status(401).json({
        mensaje: 'Token requerido',
      });

    }

    const resultado = await validarTokenConServidorUsuarios(token);

    if (!resultado.valido || !resultado.usuario || !resultado.usuario.id) {
      return res.status(401).json({
        mensaje: 'Token invalido o usuario no encontrado',
      });
    }

    (req as any).usuario = resultado.usuario;

    next();

  } catch (error) {

    console.error('Error validating token with users service', error);

    return res.status(500).json({
      mensaje: 'Error validando token',
    });

  }

};
