// Configuracion de Express: importa dependencias y rutas del microservicio.
import express from 'express';

import cors from 'cors';

import morgan from 'morgan';

import paquetesRoutes from './routes/paquetes.routes.js';

const app = express();

// Middlewares globales: habilitan CORS, logs HTTP y lectura de JSON.
app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

// Rutas principales: agrupa todos los endpoints bajo el prefijo /api.
app.use('/api', paquetesRoutes);

export default app;
