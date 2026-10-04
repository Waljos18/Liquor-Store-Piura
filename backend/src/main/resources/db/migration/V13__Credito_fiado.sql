-- V13: Ventas a crédito / fiado

-- Agregar CREDITO como forma de pago en ventas
ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_forma_pago_check;
ALTER TABLE ventas ADD CONSTRAINT ventas_forma_pago_check
    CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'MIXTO', 'CREDITO'));

-- Tabla de cuentas por cobrar (una por venta a crédito)
CREATE TABLE cuentas_por_cobrar (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT REFERENCES ventas(id) UNIQUE,
    cliente_id BIGINT REFERENCES clientes(id) NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    monto_pagado DECIMAL(10,2) DEFAULT 0,
    saldo_pendiente DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'VENCIDO')),
    fecha_vencimiento DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historial de pagos parciales o totales de una deuda
CREATE TABLE pagos_cuenta (
    id BIGSERIAL PRIMARY KEY,
    cuenta_id BIGINT REFERENCES cuentas_por_cobrar(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES usuarios(id) NOT NULL,
    forma_pago VARCHAR(20) NOT NULL CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN')),
    observaciones TEXT
);

CREATE INDEX idx_cuentas_cobrar_cliente ON cuentas_por_cobrar(cliente_id);
CREATE INDEX idx_cuentas_cobrar_estado ON cuentas_por_cobrar(estado);
CREATE INDEX idx_cuentas_cobrar_venta ON cuentas_por_cobrar(venta_id);
CREATE INDEX idx_pagos_cuenta_cuenta ON pagos_cuenta(cuenta_id);
