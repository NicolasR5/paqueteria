import pool from '../database/db.js';

export const crearPaquete = async (
  id: string,
  descripcion: string,
  usuario_dueno: string,
  estado: string
) => {

  const [result] = await pool.query(
    `
    INSERT INTO paquetes (
      id,
      descripcion,
      usuario_dueno,
      estado
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      id,
      descripcion,
      usuario_dueno,
      estado,
    ]
  );

  return result;

};

export const obtenerPaquetesUsuario = async (
  usuario_dueno: string
) => {

  const [rows] = await pool.query(
    `
    SELECT *
    FROM paquetes
    WHERE usuario_dueno = ?
    `,
    [usuario_dueno]
  );

  return rows;

};

export const obtenerPaquetePorId = async (
  id: string
) => {

  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM paquetes
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];

};

export const actualizarEstadoPaquete = async (
  id: string,
  estado: string
) => {

  const [result] = await pool.query(
    `
    UPDATE paquetes
    SET estado = ?
    WHERE id = ?
    `,
    [estado, id]
  );

  return result;

};
