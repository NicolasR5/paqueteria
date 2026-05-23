import pool from '../database/db.js';

export const crearUsuario = async (
  id: string,
  nombre_completo: string,
  usuario: string,
  password: string,
  rol: string
) => {

  const [result] = await pool.query(
    `
    INSERT INTO usuarios (
      id,
      nombre_completo,
      usuario,
      password,
      rol
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      id,
      nombre_completo,
      usuario,
      password,
      rol,
    ]
  );

  return result;

};

export const obtenerUsuarios = async () => {

  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre_completo,
      usuario,
      rol
    FROM usuarios
    `
  );

  return rows;

};

export const buscarUsuarioPorUsuario = async (
  usuario: string
) => {

  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM usuarios
    WHERE usuario = ?
    `,
    [usuario]
  );

  return rows[0];

};

export const obtenerUsuarioPorId = async (
  id: string
) => {

  const [rows]: any = await pool.query(
    `
    SELECT
      id,
      nombre_completo,
      usuario,
      rol
    FROM usuarios
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];

};