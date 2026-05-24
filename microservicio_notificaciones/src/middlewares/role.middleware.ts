// Middleware de roles: limita rutas que solo deben usar administradores.
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

// Solo admin: permite continuar unicamente si el usuario autenticado tiene rol admin.
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
