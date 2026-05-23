import dotenv from 'dotenv';

import app from './app.js';

dotenv.config();

const PORT =
  process.env.PORT || 3002;

app.listen(PORT, () => {

  console.log(
    `MS Paquetes corriendo en puerto ${PORT}`
  );

});