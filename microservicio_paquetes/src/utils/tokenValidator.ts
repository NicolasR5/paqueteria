export const validarTokenConServidorUsuarios = async (
  token: string
) => {
  try {
    const usuariosServiceUrl =
      process.env.USERS_SERVICE_URL || 'http://localhost:3001';

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

    if (!response.ok) {
      return {
        valido: false,
        usuario: null,
      };
    }

    const data = await response.json();

    if (!data?.valido || !data?.usuario || !data.usuario.id) {
      return {
        valido: false,
        usuario: null,
      };
    }

    return {
      valido: true,
      usuario: data.usuario,
    };
  } catch (error) {
    console.error('Error validando token con usuarios:', error);
    return {
      valido: false,
      usuario: null,
    };
  }
};
