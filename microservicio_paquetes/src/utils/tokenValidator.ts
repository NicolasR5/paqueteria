// Validador centralizado: consulta al microservicio de usuarios para confirmar JWT.
export const validarTokenConServidorUsuarios = async (
  token: string
) => {
  try {
    // URL del servicio de usuarios: permite configurar otro host por entorno.
    const usuariosServiceUrl =
      process.env.USERS_SERVICE_URL || 'http://localhost:3001';

    // Solicitud de validacion: envia el token al endpoint centralizado.
    const response = await fetch(
      `${usuariosServiceUrl}/api/validate-token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Respuesta no exitosa: trata el token como invalido.
    if (!response.ok) {
      return {
        valido: false,
        usuario: null,
      };
    }

    const data = await response.json();

    // Datos requeridos: confirma que exista usuario e identificador.
    if (!data?.valido || !data?.usuario || !data.usuario.id) {
      return {
        valido: false,
        usuario: null,
      };
    }

    // Token valido: retorna el usuario recibido desde el servicio de usuarios.
    return {
      valido: true,
      usuario: data.usuario,
    };
  } catch (error) {
    // Fallo de comunicacion: no bloquea el servidor, pero rechaza la autenticacion.
    console.error('Error validando token con usuarios:', error);
    return {
      valido: false,
      usuario: null,
    };
  }
};
