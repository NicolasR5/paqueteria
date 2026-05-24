// Conexion MySQL: carga configuracion y crea el pool compartido del servicio.
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Variables requeridas: datos necesarios para conectarse a la base de datos.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error('Faltan variables de entorno de la base de datos');
}

// Pool de conexiones: permite reutilizar conexiones para las consultas.
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export default pool;
