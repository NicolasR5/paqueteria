import type {
  Request,
  Response,
  NextFunction,
} from 'express';

export const soloAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const usuario = (req as any).usuario;

  if (usuario.rol !== 'admin') {

    return res.status(403).json({
      mensaje: 'Acceso denegado',
    });

  }

  next();

};