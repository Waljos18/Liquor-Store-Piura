-- V14: Apertura y cierre formal de caja
-- Horarios: Lun-Jue 9:00-23:30 | Vie-Sáb 9:00-03:00 | Dom 10:00-22:00

CREATE TABLE aperturas_caja (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_apertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hora_cierre TIMESTAMP,
    monto_inicial DECIMAL(10,2) NOT NULL DEFAULT 0,
    monto_cierre DECIMAL(10,2),
    monto_real DECIMAL(10,2),          -- lo que el cajero cuenta físicamente al cerrar
    sobrante_faltante DECIMAL(10,2),   -- monto_real - (monto_inicial + ingresos del día)
    usuario_apertura_id BIGINT REFERENCES usuarios(id) NOT NULL,
    usuario_cierre_id BIGINT REFERENCES usuarios(id),
    estado VARCHAR(20) DEFAULT 'ABIERTA' CHECK (estado IN ('ABIERTA', 'CERRADA')),
    observaciones TEXT,
    observaciones_cierre TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Solo puede haber una apertura ABIERTA por día
CREATE UNIQUE INDEX idx_apertura_fecha_abierta ON aperturas_caja(fecha) WHERE estado = 'ABIERTA';
CREATE INDEX idx_apertura_fecha ON aperturas_caja(fecha);
CREATE INDEX idx_apertura_usuario ON aperturas_caja(usuario_apertura_id);
