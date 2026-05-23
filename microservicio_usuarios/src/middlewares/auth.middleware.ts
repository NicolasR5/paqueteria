import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  usuario?: JwtPayload | string;
}

export const validarToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        mensaje: 'Token requerido',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    req.usuario = decoded as JwtPayload;

    next();
  } catch (error) {
    res.status(401).json({
      mensaje: 'Token inválido',
    });
  }
};