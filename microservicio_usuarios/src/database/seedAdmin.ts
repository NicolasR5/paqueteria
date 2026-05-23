import bcrypt from 'bcryptjs';

import { v4 as uuidv4 } from 'uuid';

import pool from './db.js';

export const crearAdminInicial = async () => {

  try {

    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM usuarios
      WHERE rol = ?
      `,
      ['admin']
    );

    if (rows.length > 0) {

      console.log('Admin ya existe');

      return;

    }

    const passwordHash =
      await bcrypt.hash(
        process.env.ADMIN_PASSWORD as string,
        10
      );

    await pool.query(
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
        uuidv4(),
        process.env.ADMIN_NAME,
        process.env.ADMIN_USERNAME,
        passwordHash,
        'admin',
      ]
    );

    console.log(
      'Admin creado automáticamente'
    );

  } catch (error) {

    console.error(error);

  }

};