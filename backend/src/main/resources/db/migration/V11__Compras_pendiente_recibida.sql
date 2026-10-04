-- V11: Compras con flujo PENDIENTE -> RECIBIDA y recepción parcial

-- Permitir estado RECIBIDA en compras
ALTER TABLE compras DROP CONSTRAINT IF EXISTS compras_estado_check;
ALTER TABLE compras ADD CONSTRAINT compras_estado_check
    CHECK (estado IN ('PENDIENTE', 'RECIBIDA', 'COMPLETADA', 'ANULADA'));

-- Fecha de recepción de mercadería
ALTER TABLE compras ADD COLUMN IF NOT EXISTS fecha_recepcion TIMESTAMP;

-- Cantidad efectivamente recibida por ítem (para recepción parcial)
ALTER TABLE detalle_compras ADD COLUMN IF NOT EXISTS cantidad_recibida INTEGER DEFAULT 0;

-- Migrar compras COMPLETADAS existentes: asumir que ya fueron recibidas en su totalidad
UPDATE detalle_compras dc
SET cantidad_recibida = dc.cantidad
FROM compras c
WHERE dc.compra_id = c.id AND c.estado = 'COMPLETADA';

UPDATE compras SET fecha_recepcion = fecha_creacion WHERE estado = 'COMPLETADA';
