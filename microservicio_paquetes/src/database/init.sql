CREATE DATABASE ms_paquetes;

USE ms_paquetes;

CREATE TABLE paquetes (
    id CHAR(36) PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    usuario_dueno CHAR(36) NOT NULL,
    estado ENUM(
        'creado',
        'en_transito',
        'entregado',
        'devuelto'
    ) NOT NULL
);