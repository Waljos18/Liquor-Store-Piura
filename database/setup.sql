-- Crear base de datos y usuario para Licorería Piura (Sprint 2)
-- Ejecutar como superusuario: psql -U postgres -f setup.sql

CREATE DATABASE licoreria_db;

\c licoreria_db

CREATE USER licoreria_user WITH PASSWORD 'licoreria_pass';

GRANT ALL PRIVILEGES ON DATABASE licoreria_db TO licoreria_user;
GRANT ALL ON SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO licoreria_user;

-- Para Flyway
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO licoreria_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO licoreria_user;
