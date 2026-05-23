import type {
  Request,
  Response,
  NextFunction,
} from 'express';

export const validarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Token requerido' });
    }

    const usersUrl = process.env.USERS_SERVICE_URL || 'http://localhost:3000';

    const resp = await fetch(`${usersUrl}/auth/validate`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }

    const data = await resp.json();

    (req as any).usuario = data.usuario;

    next();

  } catch (error) {

    console.error('Error validating token with users service', error);

    return res.status(500).json({ mensaje: 'Error validando token' });

  }

};