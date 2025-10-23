-- Active: 1759198081155@@127.0.0.1@3306@tarea2
-- Crear usuario
CREATE USER 'dbadmin'@'localhost' IDENTIFIED BY 'dbadmin';

CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';
FLUSH PRIVILEGES;