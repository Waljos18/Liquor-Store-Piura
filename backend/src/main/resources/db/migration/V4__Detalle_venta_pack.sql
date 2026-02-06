-- Soporte de venta por pack: línea de detalle puede ser producto o pack.
-- Inventario siempre en unidades; venta de pack descuenta unidades y cobra precio pack.

ALTER TABLE detalle_ventas ADD COLUMN IF NOT EXISTS pack_id BIGINT REFERENCES packs(id);
CREATE INDEX IF NOT EXISTS idx_detalle_ventas_pack ON detalle_ventas(pack_id);
