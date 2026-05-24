import express from 'express';

import cors from 'cors';

import morgan from 'morgan';

import notificacionesRoutes from './routes/notificaciones.routes.js';

const app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use('/api', notificacionesRoutes);

export default app;
