-- V17: Sistema de fidelización
CREATE TABLE config_fidelizacion (
    id BIGSERIAL PRIMARY KEY,
    soles_por_punto DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    puntos_por_sol_descuento DECIMAL(10,2) NOT NULL DEFAULT 20.00,
    max_puntos_canje_por_venta INTEGER NOT NULL DEFAULT 500,
    min_compra_para_canje DECIMAL(10,2) NOT NULL DEFAULT 20.00,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO config_fidelizacion (soles_por_punto, puntos_por_sol_descuento, max_puntos_canje_por_venta, min_compra_para_canje, activo)
VALUES (5.00, 20.00, 500, 20.00, true);

CREATE TABLE puntos_movimientos (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT REFERENCES clientes(id) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ACUMULACION', 'CANJE', 'AJUSTE_MANUAL')),
    cantidad INTEGER NOT NULL,
    saldo_despues INTEGER NOT NULL,
    venta_id BIGINT REFERENCES ventas(id),
    motivo VARCHAR(200),
    usuario_id BIGINT REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_puntos_mov_cliente ON puntos_movimientos(cliente_id);
CREATE INDEX idx_puntos_mov_venta ON puntos_movimientos(venta_id);
CREATE INDEX idx_puntos_mov_fecha ON puntos_movimientos(fecha);
