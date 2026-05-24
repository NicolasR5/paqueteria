// Conexion a base de datos: reutiliza el pool configurado para ejecutar consultas.
import pool from '../database/db.js';

// Crear paquete: inserta un paquete nuevo con su usuario dueno y estado inicial.
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

// Obtener paquetes de usuario: lista los paquetes asociados a un dueno especifico.
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

// Obtener paquete por ID: busca un paquete concreto para validar o actualizarlo.
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

// Actualizar estado: modifica el estado actual de un paquete existente.
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
