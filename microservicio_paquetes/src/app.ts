import express from 'express';

import cors from 'cors';

import morgan from 'morgan';

import paquetesRoutes from './routes/paquetes.routes.js';

const app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use('/api', paquetesRoutes);

export default app;