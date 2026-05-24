// Conexion a base de datos: reutiliza el pool configurado para ejecutar consultas.
import pool from '../database/db.js';

// Tipo de estado: define los valores validos para el estado de un paquete.
export type EstadoPaquete =
  | 'creado'
  | 'en_transito'
  | 'entregado'
  | 'devuelto';

// Estados permitidos: lista centralizada usada para validar entradas.
export const ESTADOS_VALIDOS: EstadoPaquete[] = [
  'creado',
  'en_transito',
  'entregado',
  'devuelto',
];

// Crear notificacion: inserta un registro en el historial de notificaciones.
export const crearNotificacion = async (
  id: string,
  paquete_id: string,
  usuario_dueno: string,
  estado: EstadoPaquete
) => {

  const [result] = await pool.query(
    `
    INSERT INTO notificaciones (
      id,
      paquete_id,
      usuario_dueno,
      estado
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      id,
      paquete_id,
      usuario_dueno,
      estado,
    ]
  );

  return result;

};

// Obtener notificaciones: lista todo el historial ordenado por fecha.
export const obtenerNotificaciones = async () => {

  const [rows] = await pool.query(
    `
    SELECT *
    FROM notificaciones
    ORDER BY fecha_hora DESC
    `
  );

  return rows;

};

// Obtener por usuario: lista notificaciones asociadas a un dueno especifico.
export const obtenerNotificacionesUsuario = async (
  usuario_dueno: string
) => {

  const [rows] = await pool.query(
    `
    SELECT *
    FROM notificaciones
    WHERE usuario_dueno = ?
    ORDER BY fecha_hora DESC
    `,
    [usuario_dueno]
  );

  return rows;

};

// Obtener por paquete: lista notificaciones de un paquete especifico.
export const obtenerNotificacionesPaquete = async (
  paquete_id: string
) => {

  const [rows] = await pool.query(
    `
    SELECT *
    FROM notificaciones
    WHERE paquete_id = ?
    ORDER BY fecha_hora DESC
    `,
    [paquete_id]
  );

  return rows;

};
