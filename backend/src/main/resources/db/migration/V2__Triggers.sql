-- Triggers: número de venta, actualización de stock en venta/compra

CREATE OR REPLACE FUNCTION generar_numero_venta()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_numero VARCHAR(20);
    contador INTEGER;
BEGIN
    IF NEW.numero_venta IS NOT NULL AND NEW.numero_venta != '' THEN
        RETURN NEW;
    END IF;
    SELECT COALESCE(MAX(CAST(NULLIF(TRIM(SUBSTRING(numero_venta FROM 14)), '') AS INTEGER)), 0) + 1
    INTO contador
    FROM ventas
    WHERE DATE(fecha) = CURRENT_DATE;
    nuevo_numero := 'VENT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(contador::TEXT, 4, '0');
    NEW.numero_venta := nuevo_numero;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        nuevo_numero := 'VENT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-0001';
        NEW.numero_venta := nuevo_numero;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generar_numero_venta
BEFORE INSERT ON ventas
FOR EACH ROW
EXECUTE FUNCTION generar_numero_venta();

CREATE OR REPLACE FUNCTION actualizar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos
    SET stock_actual = stock_actual - NEW.cantidad,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = NEW.producto_id;
    INSERT INTO movimientos_inventario (producto_id, tipo_movimiento, cantidad, motivo, usuario_id)
    SELECT NEW.producto_id, 'SALIDA', NEW.cantidad, 'Venta #' || NEW.venta_id,
           (SELECT usuario_id FROM ventas WHERE id = NEW.venta_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock_venta
AFTER INSERT ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_venta();

CREATE OR REPLACE FUNCTION actualizar_stock_compra()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos
    SET stock_actual = stock_actual + NEW.cantidad,
        precio_compra = NEW.precio_unitario,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = NEW.producto_id;
    INSERT INTO movimientos_inventario (producto_id, tipo_movimiento, cantidad, motivo, usuario_id)
    SELECT NEW.producto_id, 'ENTRADA', NEW.cantidad, 'Compra #' || NEW.compra_id,
           (SELECT usuario_id FROM compras WHERE id = NEW.compra_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock_compra
AFTER INSERT ON detalle_compras
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_compra();
