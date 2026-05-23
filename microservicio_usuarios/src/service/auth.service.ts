import jwt from 'jsonwebtoken';

export const generarToken = (
  usuario: any
) => {

  return jwt.sign(
    {
      id: usuario.id,
      usuario: usuario.usuario,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1d',
    }
  );

};

export const verificarToken = (token: string) => {

  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );

};