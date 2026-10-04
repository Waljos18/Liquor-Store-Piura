-- V18: Tabla para tokens de recuperación de contraseña
CREATE TABLE password_reset_tokens (
    id          BIGSERIAL PRIMARY KEY,
    token       VARCHAR(255) UNIQUE NOT NULL,
    usuario_id  BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expira_en   TIMESTAMP NOT NULL,
    usado       BOOLEAN DEFAULT FALSE,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prt_token      ON password_reset_tokens(token);
CREATE INDEX idx_prt_usuario_id ON password_reset_tokens(usuario_id);
