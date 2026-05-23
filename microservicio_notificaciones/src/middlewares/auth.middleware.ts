import type {
  Request,
  Response,
  NextFunction,
} from 'express';

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ||
  'http://localhost:3001/api';

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

    const respuesta = await fetch(
      `${AUTH_SERVICE_URL}/auth/validar-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      }
    );

    const datos = await respuesta.json() as {
      valido?: boolean;
      usuario?: unknown;
      mensaje?: string;
    };

    if (!respuesta.ok || !datos.valido || !datos.usuario) {

      return res.status(401).json({
        mensaje: datos.mensaje || 'Token invalido',
      });

    }

    (req as any).usuario = datos.usuario;

    next();

  } catch (error) {

    return res.status(503).json({
      mensaje: 'No se pudo validar el token',
    });

  }

};
