import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';

export const validarToken = (
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    (req as any).usuario = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      mensaje: 'Token invalido',
    });

  }

};
