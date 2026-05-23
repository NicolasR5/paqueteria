import type { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  usuario?: {
    rol?: string;
  };
}

export const soloAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const usuario = req.usuario;

  if (!usuario || usuario.rol !== 'admin') {
    return res.status(403).json({
      mensaje: 'Acceso denegado',
    });
  }

  next();
};