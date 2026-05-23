import dotenv from 'dotenv';
import app from './app.js';

import { crearAdminInicial } from './database/seedAdmin.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {

  console.log(`Servidor corriendo en puerto ${PORT}`);

  await crearAdminInicial();

});