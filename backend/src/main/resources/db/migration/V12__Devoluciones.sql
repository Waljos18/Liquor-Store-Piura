-- V12: Módulo de devoluciones de ventas

CREATE TABLE devoluciones (
    id BIGSERIAL PRIMARY KEY,
    numero_devolucion VARCHAR(20) UNIQUE NOT NULL,
    venta_id BIGINT REFERENCES ventas(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES usuarios(id) NOT NULL,
    motivo VARCHAR(50) NOT NULL CHECK (motivo IN ('PRODUCTO_DEFECTUOSO', 'PRODUCTO_INCORRECTO', 'CAMBIO_PRODUCTO', 'OTRO')),
    estado VARCHAR(20) DEFAULT 'COMPLETADA' CHECK (estado IN ('COMPLETADA', 'ANULADA')),
    observaciones TEXT,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_devoluciones (
    id BIGSERIAL PRIMARY KEY,
    devolucion_id BIGINT REFERENCES devoluciones(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_devoluciones_venta ON devoluciones(venta_id);
CREATE INDEX idx_devoluciones_fecha ON devoluciones(fecha);
CREATE INDEX idx_devoluciones_usuario ON devoluciones(usuario_id);
CREATE INDEX idx_detalle_devoluciones_devolucion ON detalle_devoluciones(devolucion_id);
CREATE INDEX idx_detalle_devoluciones_producto ON detalle_devoluciones(producto_id);
