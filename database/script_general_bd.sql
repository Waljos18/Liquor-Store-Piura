-- Script unico general de BD - Licoreria Piura
-- Uso:
--   psql -U postgres -f script_general_bd.sql
--
-- Nota: este archivo es 100% autocontenido (no usa \i externos).

\echo ===== INICIO: CONFIGURACION BASE =====

-- Crear base de datos (si no existe)
SELECT 'CREATE DATABASE licoreria_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'licoreria_db')\gexec

-- Crear usuario aplicacion (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'licoreria_user') THEN
        CREATE ROLE licoreria_user LOGIN PASSWORD 'licoreria_pass';
    END IF;
END $$;

\connect licoreria_db

GRANT ALL PRIVILEGES ON DATABASE licoreria_db TO licoreria_user;
GRANT ALL ON SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO licoreria_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO licoreria_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO licoreria_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO licoreria_user;

\echo ===== FIN: CONFIGURACION BASE =====
\echo ===== INICIO: MIGRACIONES =====

-- =========================
-- V1__Initial_schema.sql
-- =========================
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'VENDEDOR')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_username ON usuarios(username);

CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_categorias_nombre ON categorias(nombre);

CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    categoria_id BIGINT REFERENCES categorias(id),
    precio_compra DECIMAL(10,2),
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    stock_maximo INTEGER,
    fecha_vencimiento DATE,
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_stock ON productos(stock_actual);

CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    tipo_documento VARCHAR(10) NOT NULL CHECK (tipo_documento IN ('DNI', 'RUC', 'CE')),
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    puntos_fidelizacion INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_clientes_documento ON clientes(numero_documento);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);

CREATE TABLE ventas (
    id BIGSERIAL PRIMARY KEY,
    numero_venta VARCHAR(20) UNIQUE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES usuarios(id) NOT NULL,
    cliente_id BIGINT REFERENCES clientes(id),
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuesto DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    forma_pago VARCHAR(20) NOT NULL CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'MIXTO')),
    estado VARCHAR(20) DEFAULT 'COMPLETADA' CHECK (estado IN ('COMPLETADA', 'ANULADA', 'PENDIENTE')),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_numero ON ventas(numero_venta);

CREATE TABLE detalle_ventas (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL
);
CREATE INDEX idx_detalle_ventas_venta ON detalle_ventas(venta_id);
CREATE INDEX idx_detalle_ventas_producto ON detalle_ventas(producto_id);

CREATE TABLE comprobantes_electronicos (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT REFERENCES ventas(id),
    tipo_comprobante VARCHAR(10) NOT NULL CHECK (tipo_comprobante IN ('BOLETA', 'FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO')),
    serie VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    xml_enviado TEXT,
    pdf_generado BYTEA,
    estado_sunat VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado_sunat IN ('PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'ERROR')),
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_envio TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(serie, numero)
);
CREATE INDEX idx_comprobantes_venta ON comprobantes_electronicos(venta_id);
CREATE INDEX idx_comprobantes_estado ON comprobantes_electronicos(estado_sunat);
CREATE INDEX idx_comprobantes_fecha ON comprobantes_electronicos(fecha_emision);

CREATE TABLE proveedores (
    id BIGSERIAL PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    ruc VARCHAR(20) UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_proveedores_ruc ON proveedores(ruc);

CREATE TABLE compras (
    id BIGSERIAL PRIMARY KEY,
    numero_compra VARCHAR(20) UNIQUE NOT NULL,
    proveedor_id BIGINT REFERENCES proveedores(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    usuario_id BIGINT REFERENCES usuarios(id),
    estado VARCHAR(20) DEFAULT 'COMPLETADA' NOT NULL,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_compras_fecha ON compras(fecha);
CREATE INDEX idx_compras_proveedor ON compras(proveedor_id);
CREATE INDEX idx_compras_numero ON compras(numero_compra);

CREATE TABLE detalle_compras (
    id BIGSERIAL PRIMARY KEY,
    compra_id BIGINT REFERENCES compras(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);
CREATE INDEX idx_detalle_compras_compra ON detalle_compras(compra_id);
CREATE INDEX idx_detalle_compras_producto ON detalle_compras(producto_id);

CREATE TABLE movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT REFERENCES productos(id),
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    cantidad INTEGER NOT NULL,
    motivo VARCHAR(200),
    usuario_id BIGINT REFERENCES usuarios(id),
    venta_id BIGINT REFERENCES ventas(id),
    compra_id BIGINT REFERENCES compras(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(tipo_movimiento);
CREATE INDEX idx_movimientos_venta ON movimientos_inventario(venta_id);
CREATE INDEX idx_movimientos_compra ON movimientos_inventario(compra_id);

CREATE TABLE promociones (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('PORCENTAJE', 'MONTO_FIJO', 'CANTIDAD', 'CATEGORIA')),
    descuento_porcentaje DECIMAL(5,2),
    descuento_monto DECIMAL(10,2),
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_promociones_fechas ON promociones(fecha_inicio, fecha_fin);
CREATE INDEX idx_promociones_activa ON promociones(activa);

CREATE TABLE promocion_productos (
    id BIGSERIAL PRIMARY KEY,
    promocion_id BIGINT REFERENCES promociones(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad_minima INTEGER DEFAULT 1,
    cantidad_gratis INTEGER DEFAULT 0
);
CREATE INDEX idx_promo_prod_promocion ON promocion_productos(promocion_id);
CREATE INDEX idx_promo_prod_producto ON promocion_productos(producto_id);

CREATE TABLE packs (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio_pack DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pack_productos (
    id BIGSERIAL PRIMARY KEY,
    pack_id BIGINT REFERENCES packs(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0)
);
CREATE INDEX idx_pack_prod_pack ON pack_productos(pack_id);
CREATE INDEX idx_pack_prod_producto ON pack_productos(producto_id);

-- =========================
-- V2__Triggers.sql
-- =========================
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

-- =========================
-- V3__Seed_data.sql
-- =========================
INSERT INTO categorias (nombre, descripcion) VALUES
('Cervezas', 'Cervezas nacionales e importadas'),
('Vinos', 'Vinos tintos, blancos y espumantes'),
('Licores', 'Licores diversos'),
('Whiskies', 'Whiskies nacionales e importados'),
('Ron', 'Ron nacional e importado'),
('Pisco', 'Pisco peruano'),
('Vodka', 'Vodka nacional e importado'),
('Snacks', 'Snacks y aperitivos')
ON CONFLICT (nombre) DO NOTHING;

-- =========================
-- V4__Detalle_venta_pack.sql
-- =========================
ALTER TABLE detalle_ventas ADD COLUMN IF NOT EXISTS pack_id BIGINT REFERENCES packs(id);
CREATE INDEX IF NOT EXISTS idx_detalle_ventas_pack ON detalle_ventas(pack_id);

-- =========================
-- V5__Forma_pago_Yape_Plin_venta_pagos.sql
-- =========================
ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_forma_pago_check;
ALTER TABLE ventas ADD CONSTRAINT ventas_forma_pago_check
    CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'MIXTO'));

CREATE TABLE venta_pagos (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN')),
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    referencia VARCHAR(100),
    CONSTRAINT fk_venta_pagos_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE
);

CREATE INDEX idx_venta_pagos_venta ON venta_pagos(venta_id);

-- =========================
-- V6__Fix_promociones_tipo_constraint.sql
-- =========================
UPDATE promociones SET tipo = 'DESCUENTO_PORCENTAJE' WHERE tipo = 'PORCENTAJE';
UPDATE promociones SET tipo = 'DESCUENTO_MONTO'      WHERE tipo = 'MONTO_FIJO';

ALTER TABLE promociones DROP CONSTRAINT IF EXISTS promociones_tipo_check;
ALTER TABLE promociones ADD CONSTRAINT promociones_tipo_check
    CHECK (tipo IN ('DESCUENTO_PORCENTAJE', 'DESCUENTO_MONTO', 'CANTIDAD', 'CATEGORIA', 'VOLUMEN'));

-- =========================
-- V7__Fix_promociones_tipo_robust.sql
-- =========================
DO $$
DECLARE
    v_constraint TEXT;
BEGIN
    FOR v_constraint IN
        SELECT c.conname
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_attribute a ON a.attrelid = t.oid
            AND a.attnum = ANY(c.conkey)
        WHERE t.relname  = 'promociones'
          AND a.attname  = 'tipo'
          AND c.contype  = 'c'
    LOOP
        EXECUTE 'ALTER TABLE promociones DROP CONSTRAINT ' || quote_ident(v_constraint);
    END LOOP;
END;
$$;

ALTER TABLE promociones ADD CONSTRAINT promociones_tipo_check
    CHECK (tipo IN ('DESCUENTO_PORCENTAJE', 'DESCUENTO_MONTO', 'CANTIDAD', 'CATEGORIA', 'VOLUMEN'));

-- =========================
-- V8__Stock_minimo_categorias.sql
-- =========================
UPDATE productos p
SET stock_minimo = CASE
    WHEN c.nombre ILIKE '%vino%'                              THEN 2
    WHEN c.nombre ILIKE '%pisco%'                             THEN 2
    WHEN c.nombre ILIKE '%champagne%'
      OR c.nombre ILIKE '%espumante%'                         THEN 1
    WHEN c.nombre ILIKE '%tequila%'                           THEN 1
    WHEN c.nombre ILIKE '%whisky%'
      OR c.nombre ILIKE '%whiski%'
      OR c.nombre ILIKE '%whisk%'                             THEN 1
    WHEN c.nombre ILIKE '%ron%'                               THEN 2
    WHEN c.nombre ILIKE '%vodka%'                             THEN 1
    WHEN c.nombre ILIKE '%agua%'                              THEN 5
    WHEN c.nombre ILIKE '%piqueo%'
      OR c.nombre ILIKE '%snack%'                             THEN 3
    WHEN c.nombre ILIKE '%otro%'                              THEN 4
    ELSE p.stock_minimo
END
FROM categorias c
WHERE p.categoria_id = c.id;

-- =========================
-- V9__Drop_stock_triggers.sql
-- =========================
DROP TRIGGER IF EXISTS trigger_actualizar_stock_venta ON detalle_ventas;
DROP FUNCTION IF EXISTS actualizar_stock_venta();

DROP TRIGGER IF EXISTS trigger_actualizar_stock_compra ON detalle_compras;
DROP FUNCTION IF EXISTS actualizar_stock_compra();

-- =========================
-- V10__Categoria_cigarros.sql
-- =========================
INSERT INTO categorias (nombre, descripcion, activa)
VALUES ('Cigarros', 'Cigarros por unidad y cajetilla', true)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO productos (nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, activo, categoria_id)
SELECT nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, true,
       (SELECT id FROM categorias WHERE nombre = 'Cigarros')
FROM (VALUES
  ('Cigarro Golden Verde x20 (unidad)',    'Golden',   0.15, 0.50, 194, 20),
  ('Cigarro Hamilton Verde x20 (unidad)',  'Hamilton', 0.15, 0.50, 240, 20),
  ('Cigarro Golden Rojo x20 (unidad)',     'Golden',   0.15, 0.50, 120, 20),
  ('Cigarro Carnival x20 (unidad)',        'Carnival', 0.30, 0.80, 174, 20),
  ('Cigarro L&M Azul x20 (unidad)',        'L&M',      4.00, 10.00, 38,  5),
  ('Cigarro Pall Mall Mora x20 (unidad)',  'Pall Mall',0.60, 1.00, 195, 20),
  ('Cigarro Pall Mall Verde x20 (unidad)', 'Pall Mall',0.60, 1.00, 200, 20),
  ('Cigarro Pall Mall Azul x20 (unidad)',  'Pall Mall',0.59, 1.00, 108, 20),
  ('Cigarro Sunrise Mix x20 (unidad)',     'Sunrise',  NULL, 1.00,  38, 20),
  ('Cigarro Lucky Mora x20 (unidad)',      'Lucky',    0.89, 1.50, 164, 20),
  ('Cigarro Lucky Naranja x20 (unidad)',   'Lucky',    0.89, 1.50,  75, 20),
  ('Cigarro Lucky Azul x20 (unidad)',      'Lucky',    0.89, 1.50,  91, 20),
  ('Cigarro Lucky Fresa x10 (unidad)',     'Lucky',    1.00, 1.50,  70, 10),
  ('Cigarro Lucky Sandia x10 (unidad)',    'Lucky',    1.00, 1.50,  38, 10),
  ('Cigarro Marlboro Mora x10 (unidad)',   'Marlboro', 1.00, 1.20, 285, 10),
  ('Cigarro Marlboro Sandia x20 (unidad)', 'Marlboro', 0.89, 1.20, 243, 20),
  ('Cigarro Marlboro Canela x20 (unidad)', 'Marlboro', 0.89, 1.20, 177, 20),
  ('Cigarro Marlboro Rojo x20 (unidad)',   'Marlboro', 0.89, 1.20, 212, 20),
  ('Cigarro Kent Blue (unidad)',           'Kent',     NULL, 1.50,   8,  5),
  ('Cigarro Kent Fresh (unidad)',          'Kent',     NULL, 1.50,  21,  5)
) AS t(nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo);

INSERT INTO productos (nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, activo, categoria_id)
SELECT nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, true,
       (SELECT id FROM categorias WHERE nombre = 'Cigarros')
FROM (VALUES
  ('Cigarro Golden Verde x20 (cajetilla)',    'Golden',    3.00,  6.00, 0, 2),
  ('Cigarro Hamilton Verde x20 (cajetilla)',  'Hamilton',  3.00, 10.00, 0, 2),
  ('Cigarro Golden Rojo x20 (cajetilla)',     'Golden',    3.00,  6.00, 0, 2),
  ('Cigarro Carnival x20 (cajetilla)',        'Carnival',  4.00, 10.00, 0, 2),
  ('Cigarro L&M Azul x20 (cajetilla)',        'L&M',       3.50, 14.00, 0, 2),
  ('Cigarro Pall Mall Mora x20 (cajetilla)',  'Pall Mall', 12.00, 16.00, 0, 2),
  ('Cigarro Pall Mall Verde x20 (cajetilla)', 'Pall Mall', 12.00, 16.00, 0, 2),
  ('Cigarro Pall Mall Azul x20 (cajetilla)',  'Pall Mall', 11.80, 16.00, 0, 2),
  ('Cigarro Sunrise Mix x20 (cajetilla)',     'Sunrise',   12.00, 16.00, 0, 2),
  ('Cigarro Lucky Mora x20 (cajetilla)',      'Lucky',     17.86, 24.00, 0, 2),
  ('Cigarro Lucky Naranja x20 (cajetilla)',   'Lucky',     17.86, 24.00, 0, 2),
  ('Cigarro Lucky Azul x20 (cajetilla)',      'Lucky',     17.86, 24.00, 0, 2),
  ('Cigarro Lucky Mora x10 (cajetilla)',      'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Fresa x10 (cajetilla)',     'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Sandia x10 (cajetilla)',    'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Naranja x10 (cajetilla)',   'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Azul x10 (cajetilla)',      'Lucky',      9.96, 13.00, 4, 2),
  ('Cigarro Marlboro Mora x10 (cajetilla)',   'Marlboro',   9.96, 10.00, 0, 2),
  ('Cigarro Marlboro Sandia x20 (cajetilla)', 'Marlboro',  17.85, 20.00, 0, 2),
  ('Cigarro Marlboro Canela x20 (cajetilla)', 'Marlboro',  17.85, 20.00, 0, 2),
  ('Cigarro Marlboro Rojo x20 (cajetilla)',   'Marlboro',  17.85, 20.00, 0, 2)
) AS t(nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo);

-- =========================
-- V11__Compras_pendiente_recibida.sql
-- =========================
ALTER TABLE compras DROP CONSTRAINT IF EXISTS compras_estado_check;
ALTER TABLE compras ADD CONSTRAINT compras_estado_check
    CHECK (estado IN ('PENDIENTE', 'RECIBIDA', 'COMPLETADA', 'ANULADA'));

ALTER TABLE compras ADD COLUMN IF NOT EXISTS fecha_recepcion TIMESTAMP;
ALTER TABLE detalle_compras ADD COLUMN IF NOT EXISTS cantidad_recibida INTEGER DEFAULT 0;

UPDATE detalle_compras dc
SET cantidad_recibida = dc.cantidad
FROM compras c
WHERE dc.compra_id = c.id AND c.estado = 'COMPLETADA';

UPDATE compras SET fecha_recepcion = fecha_creacion WHERE estado = 'COMPLETADA';

-- =========================
-- V12__Devoluciones.sql
-- =========================
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

-- =========================
-- V13__Credito_fiado.sql
-- =========================
ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_forma_pago_check;
ALTER TABLE ventas ADD CONSTRAINT ventas_forma_pago_check
    CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'MIXTO', 'CREDITO'));

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

-- =========================
-- V14__Apertura_caja.sql
-- =========================
CREATE TABLE aperturas_caja (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_apertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hora_cierre TIMESTAMP,
    monto_inicial DECIMAL(10,2) NOT NULL DEFAULT 0,
    monto_cierre DECIMAL(10,2),
    monto_real DECIMAL(10,2),
    sobrante_faltante DECIMAL(10,2),
    usuario_apertura_id BIGINT REFERENCES usuarios(id) NOT NULL,
    usuario_cierre_id BIGINT REFERENCES usuarios(id),
    estado VARCHAR(20) DEFAULT 'ABIERTA' CHECK (estado IN ('ABIERTA', 'CERRADA')),
    observaciones TEXT,
    observaciones_cierre TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_apertura_fecha_abierta ON aperturas_caja(fecha) WHERE estado = 'ABIERTA';
CREATE INDEX idx_apertura_fecha ON aperturas_caja(fecha);
CREATE INDEX idx_apertura_usuario ON aperturas_caja(usuario_apertura_id);

-- =========================
-- V15__Gastos.sql
-- =========================
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

-- =========================
-- V16__Mermas.sql
-- =========================
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

-- =========================
-- V17__Fidelizacion.sql
-- =========================
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

-- =========================
-- V18__Password_reset_tokens.sql
-- =========================
CREATE TABLE password_reset_tokens (
    id          BIGSERIAL PRIMARY KEY,
    token       VARCHAR(255) UNIQUE NOT NULL,
    usuario_id  BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expira_en   TIMESTAMP NOT NULL,
    usado       BOOLEAN DEFAULT FALSE,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prt_token      ON password_reset_tokens(token);
CREATE INDEX idx_prt_usuario_id ON password_reset_tokens(usuario_id);

\echo ===== FIN: MIGRACIONES =====
\echo Script completado.
