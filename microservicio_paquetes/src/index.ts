// Arranque del servidor: carga variables de entorno e importa la app.
import dotenv from 'dotenv';

import app from './app.js';

dotenv.config();

// Puerto del servicio: usa el valor del entorno o el puerto local por defecto.
const PORT =
  process.env.PORT || 3002;

// Inicio del microservicio: levanta Express para atender rutas de paquetes.
app.listen(PORT, () => {

  console.log(
    `MS Paquetes corriendo en puerto ${PORT}`
  );

});
