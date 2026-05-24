CREATE DATABASE ms_notificaciones;

USE ms_notificaciones;

CREATE TABLE notificaciones (
    id CHAR(36) PRIMARY KEY,
    paquete_id CHAR(36) NOT NULL,
    usuario_dueno CHAR(36) NOT NULL,
    estado ENUM(
        'creado',
        'en_transito',
        'entregado',
        'devuelto'
    ) NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
