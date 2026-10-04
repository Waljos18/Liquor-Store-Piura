-- V16: Gestión de mermas
CREATE TABLE mermas (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT REFERENCES productos(id) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    motivo VARCHAR(50) NOT NULL CHECK (motivo IN ('VENCIMIENTO', 'ROTURA', 'DETERIORO', 'ROBO', 'DIFERENCIA_INVENTARIO', 'OTRO')),
    descripcion TEXT,
    valor_perdida DECIMAL(10,2) NOT NULL DEFAULT 0,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES usuarios(id) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_mermas_producto ON mermas(producto_id);
CREATE INDEX idx_mermas_fecha ON mermas(fecha);
CREATE INDEX idx_mermas_motivo ON mermas(motivo);
CREATE INDEX idx_mermas_usuario ON mermas(usuario_id);
