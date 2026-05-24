import pool from '../database/db.js';

export type EstadoPaquete =
  | 'creado'
  | 'en_transito'
  | 'entregado'
  | 'devuelto';

export const ESTADOS_VALIDOS: EstadoPaquete[] = [
  'creado',
  'en_transito',
  'entregado',
  'devuelto',
];

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
