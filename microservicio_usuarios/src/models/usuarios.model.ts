// Conexion a base de datos: reutiliza el pool configurado para ejecutar consultas.
import pool from '../database/db.js';

// Crear usuario: inserta un nuevo registro en la tabla usuarios.
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

// Obtener usuarios: lista datos publicos de todos los usuarios registrados.
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

// Buscar por usuario: obtiene un usuario completo para procesos como login.
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

// Obtener por ID: consulta datos publicos de un usuario especifico.
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
