CREATE DATABASE ms_usuarios;

USE ms_usuarios;

CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'cliente') NOT NULL
);