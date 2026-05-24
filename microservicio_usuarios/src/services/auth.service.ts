// Servicio de autenticacion: genera y verifica tokens JWT para usuarios.
import jwt from 'jsonwebtoken';

// Generar token: firma los datos principales del usuario con expiracion de un dia.
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
      expiresIn: '1d', //Expira en 1 día
    }
  );

};

// Verificar token: confirma firma y expiracion, devolviendo los datos decodificados.
export const verificarToken = (
  token: string
) => {

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return {
      valido: true,
      datos: decoded,
    };

  } catch (error) {

    return {
      valido: false,
      datos: null,
      error: (error as Error).message,
    };

  }

};
