//Archivo para crear un hash de contraseña para el usuario admin,
//se ejecuta con node hash.js y se copia el resultado en el 
//archivo .env en la variable ADMIN_PASSWORD_HASH


import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash('123456', 10);

console.log(hash);