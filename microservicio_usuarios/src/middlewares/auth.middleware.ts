// Middleware de autenticacion: valida el JWT antes de permitir acceso a rutas protegidas.
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { verificarToken } from '../services/auth.service.js';

// Validar token: extrae el Bearer token, lo verifica y guarda el usuario en la request.
export const validarToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        mensaje: 'Token requerido',
      });
    }

    const decoded = verificarToken(token);

    if (!decoded.valido || !decoded.datos) {
      return res.status(401).json({
        mensaje: 'Token invÃ¡lido',
      });
    }

    (req as any).usuario = decoded.datos;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido',
    });
  }

};
