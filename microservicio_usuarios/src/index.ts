// Arranque del servidor: carga variables de entorno e importa la app.
import dotenv from 'dotenv';

import app from './app.js';

import {
  crearAdminInicial,
} from './database/seedAdmin.js';

dotenv.config();

// Puerto del servicio: usa el valor del entorno o el puerto local por defecto.
const PORT =
  process.env.PORT || 3001;

// Inicio del microservicio: levanta Express y asegura un administrador inicial.
app.listen(PORT, async () => {

  console.log(
    `MS Usuarios corriendo en puerto ${PORT}`
  );

  await crearAdminInicial();

});
