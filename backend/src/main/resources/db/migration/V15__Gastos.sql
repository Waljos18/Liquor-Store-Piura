-- V15: Módulo de gastos operativos
CREATE TABLE gastos (
    id BIGSERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('SERVICIOS', 'ALQUILER', 'SUELDOS', 'MANTENIMIENTO', 'PROVEEDOR', 'OTROS')),
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    comprobante VARCHAR(100),
    observaciones TEXT,
    usuario_id BIGINT REFERENCES usuarios(id) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_gastos_fecha ON gastos(fecha);
CREATE INDEX idx_gastos_categoria ON gastos(categoria);
CREATE INDEX idx_gastos_usuario ON gastos(usuario_id);
