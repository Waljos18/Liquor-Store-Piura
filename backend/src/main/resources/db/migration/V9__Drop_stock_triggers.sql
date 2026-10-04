-- V9: Eliminar triggers que duplican la lógica de stock/movimientos
-- Los servicios Java (VentaService, CompraService) ya manejan correctamente
-- las actualizaciones de stock y creación de movimientos de inventario.
-- Los triggers en V2 causan doble conteo y movimientos duplicados.

DROP TRIGGER IF EXISTS trigger_actualizar_stock_venta ON detalle_ventas;
DROP FUNCTION IF EXISTS actualizar_stock_venta();

DROP TRIGGER IF EXISTS trigger_actualizar_stock_compra ON detalle_compras;
DROP FUNCTION IF EXISTS actualizar_stock_compra();
