# MODELO DE DATOS Y ESQUEMA DE BASE DE DATOS
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** 1.0  
**Fecha:** Enero 2025  
**Semana:** 2

---

## 1. DIAGRAMA ENTIDAD-RELACIÓN (ERD)

### 1.1 Modelo Conceptual

```
┌──────────────┐
│   Usuario    │
├──────────────┤
│ id (PK)      │
│ username     │
│ email        │
│ password     │
│ nombre       │
│ rol          │
│ activo       │
│ fecha_creacion│
└──────┬───────┘
       │
       │ 1
       │
       │ *
       ▼
┌──────────────┐
│    Venta     │
├──────────────┤
│ id (PK)      │
│ numero_venta │
│ fecha        │
│ usuario_id (FK)│
│ cliente_id (FK)│
│ subtotal     │
│ descuento    │
│ impuesto     │
│ total        │
│ forma_pago   │
│ estado       │
└──────┬───────┘
       │
       │ 1
       │
       │ *
       ▼
┌──────────────┐      ┌──────────────┐
│DetalleVenta  │──────│  Producto    │
├──────────────┤      ├──────────────┤
│ id (PK)      │      │ id (PK)      │
│ venta_id (FK)│      │ codigo_barras│
│ producto_id (FK)│   │ nombre       │
│ cantidad     │      │ marca        │
│ precio_unitario│    │ categoria_id (FK)│
│ descuento    │      │ precio_compra│
│ subtotal     │      │ precio_venta │
└──────────────┘      │ stock_actual │
                      │ stock_minimo │
                      │ stock_maximo │
                      │ fecha_vencimiento│
                      │ imagen       │
                      │ activo       │
                      └──────┬───────┘
                             │
                             │ *
                             │
                             │ 1
                             ▼
                      ┌──────────────┐
                      │  Categoria   │
                      ├──────────────┤
                      │ id (PK)      │
                      │ nombre       │
                      │ descripcion  │
                      │ activa       │
                      └──────────────┘

┌──────────────┐
│   Cliente    │
├──────────────┤
│ id (PK)      │
│ tipo_documento│
│ numero_documento│
│ nombre      │
│ telefono     │
│ email        │
│ puntos_fidelizacion│
│ fecha_creacion│
└──────┬───────┘
       │
       │ 1
       │
       │ *
       ▼
┌──────────────┐
│    Venta     │
└──────────────┘

┌──────────────┐
│    Venta     │──────┐
└──────┬───────┘      │
       │              │
       │ 1            │ 1
       │              │
       │ *            │
       ▼              ▼
┌──────────────────────────────┐
│ ComprobanteElectronico       │
├──────────────────────────────┤
│ id (PK)                      │
│ venta_id (FK)                │
│ tipo_comprobante             │
│ serie                        │
│ numero                       │
│ xml_enviado                  │
│ pdf_generado                 │
│ estado_sunat                 │
│ fecha_emision                │
│ fecha_envio                  │
└──────────────────────────────┘

┌──────────────┐
│  Producto    │──────┐
└──────┬───────┘      │
       │              │
       │ *            │ *
       │              │
       ▼              ▼
┌──────────────────────────────┐
│ PromocionProducto            │
├──────────────────────────────┤
│ id (PK)                      │
│ promocion_id (FK)            │
│ producto_id (FK)             │
│ cantidad_minima              │
│ cantidad_gratis              │
└──────┬───────────────────────┘
       │
       │ *
       │
       │ 1
       ▼
┌──────────────┐
│  Promocion   │
├──────────────┤
│ id (PK)      │
│ nombre       │
│ tipo         │
│ descuento_porcentaje│
│ descuento_monto│
│ fecha_inicio │
│ fecha_fin    │
│ activa       │
└──────────────┘

┌──────────────┐
│  Producto    │──────┐
└──────┬───────┘      │
       │              │
       │ *            │ *
       │              │
       ▼              ▼
┌──────────────────────────────┐
│ PackProducto                 │
├──────────────────────────────┤
│ id (PK)                      │
│ pack_id (FK)                 │
│ producto_id (FK)             │
│ cantidad                     │
└──────┬───────────────────────┘
       │
       │ *
       │
       │ 1
       ▼
┌──────────────┐
│    Pack      │
├──────────────┤
│ id (PK)      │
│ nombre       │
│ precio_pack  │
│ activo       │
└──────────────┘

┌──────────────┐
│  Producto    │
└──────┬───────┘
       │
       │ 1
       │
       │ *
       ▼
┌──────────────────────────────┐
│ MovimientoInventario         │
├──────────────────────────────┤
│ id (PK)                      │
│ producto_id (FK)             │
│ tipo_movimiento              │
│ cantidad                     │
│ motivo                       │
│ usuario_id (FK)              │
│ fecha                        │
└──────────────────────────────┘

┌──────────────┐
│  Proveedor   │
├──────────────┤
│ id (PK)      │
│ razon_social │
│ ruc          │
│ direccion    │
│ telefono     │
│ email        │
└──────┬───────┘
       │
       │ 1
       │
       │ *
       ▼
┌──────────────┐      ┌──────────────┐
│   Compra     │──────│  Producto    │
├──────────────┤      └──────────────┘
│ id (PK)      │
│ proveedor_id (FK)│
│ fecha        │
│ total        │
│ usuario_id (FK)│
└──────┬───────┘
       │
       │ 1
       │
       │ *
       ▼
┌──────────────────────────────┐
│ DetalleCompra                │
├──────────────────────────────┤
│ id (PK)                      │
│ compra_id (FK)              │
│ producto_id (FK)            │
│ cantidad                    │
│ precio_unitario             │
│ subtotal                    │
└──────────────────────────────┘
```

---

## 2. ESQUEMA DE BASE DE DATOS (PostgreSQL)

### 2.1 Tabla: usuarios

```sql
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
```

### 2.2 Tabla: categorias

```sql
CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categorias_nombre ON categorias(nombre);
```

### 2.3 Tabla: productos

```sql
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
```

### 2.4 Tabla: clientes

```sql
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
```

### 2.5 Tabla: ventas

```sql
CREATE TABLE ventas (
    id BIGSERIAL PRIMARY KEY,
    numero_venta VARCHAR(20) UNIQUE NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT REFERENCES usuarios(id) NOT NULL,
    cliente_id BIGINT REFERENCES clientes(id),
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuesto DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    forma_pago VARCHAR(20) NOT NULL CHECK (forma_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'MIXTO')),
    estado VARCHAR(20) DEFAULT 'COMPLETADA' CHECK (estado IN ('COMPLETADA', 'ANULADA', 'PENDIENTE')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_numero ON ventas(numero_venta);
```

### 2.6 Tabla: detalle_ventas

```sql
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
```

### 2.7 Tabla: comprobantes_electronicos

```sql
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
```

### 2.8 Tabla: promociones

```sql
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
```

### 2.9 Tabla: promocion_productos

```sql
CREATE TABLE promocion_productos (
    id BIGSERIAL PRIMARY KEY,
    promocion_id BIGINT REFERENCES promociones(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad_minima INTEGER DEFAULT 1,
    cantidad_gratis INTEGER DEFAULT 0
);

CREATE INDEX idx_promo_prod_promocion ON promocion_productos(promocion_id);
CREATE INDEX idx_promo_prod_producto ON promocion_productos(producto_id);
```

### 2.10 Tabla: packs

```sql
CREATE TABLE packs (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio_pack DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.11 Tabla: pack_productos

```sql
CREATE TABLE pack_productos (
    id BIGSERIAL PRIMARY KEY,
    pack_id BIGINT REFERENCES packs(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0)
);

CREATE INDEX idx_pack_prod_pack ON pack_productos(pack_id);
CREATE INDEX idx_pack_prod_producto ON pack_productos(producto_id);
```

### 2.12 Tabla: proveedores

```sql
CREATE TABLE proveedores (
    id BIGSERIAL PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    ruc VARCHAR(20) UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proveedores_ruc ON proveedores(ruc);
```

### 2.13 Tabla: compras

```sql
CREATE TABLE compras (
    id BIGSERIAL PRIMARY KEY,
    proveedor_id BIGINT REFERENCES proveedores(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    usuario_id BIGINT REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_compras_fecha ON compras(fecha);
CREATE INDEX idx_compras_proveedor ON compras(proveedor_id);
```

### 2.14 Tabla: detalle_compras

```sql
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
```

### 2.15 Tabla: movimientos_inventario

```sql
CREATE TABLE movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT REFERENCES productos(id),
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    cantidad INTEGER NOT NULL,
    motivo VARCHAR(200),
    usuario_id BIGINT REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(tipo_movimiento);
```

---

## 3. TRIGGERS Y FUNCIONES

### 3.1 Trigger: Actualizar Stock al Vender

```sql
CREATE OR REPLACE FUNCTION actualizar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos
    SET stock_actual = stock_actual - NEW.cantidad,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = NEW.producto_id;
    
    -- Registrar movimiento de inventario
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
```

### 3.2 Trigger: Actualizar Stock al Comprar

```sql
CREATE OR REPLACE FUNCTION actualizar_stock_compra()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos
    SET stock_actual = stock_actual + NEW.cantidad,
        precio_compra = NEW.precio_unitario,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = NEW.producto_id;
    
    -- Registrar movimiento de inventario
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
```

### 3.3 Trigger: Generar Número de Venta

```sql
CREATE OR REPLACE FUNCTION generar_numero_venta()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_numero VARCHAR(20);
    contador INTEGER;
BEGIN
    -- Formato: VENT-YYYYMMDD-XXXX
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_venta FROM 14) AS INTEGER)), 0) + 1
    INTO contador
    FROM ventas
    WHERE DATE(fecha) = CURRENT_DATE;
    
    nuevo_numero := 'VENT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(contador::TEXT, 4, '0');
    NEW.numero_venta := nuevo_numero;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generar_numero_venta
BEFORE INSERT ON ventas
FOR EACH ROW
WHEN (NEW.numero_venta IS NULL)
EXECUTE FUNCTION generar_numero_venta();
```

---

## 4. DATOS INICIALES (SEED DATA)

### 4.1 Usuarios Iniciales

```sql
INSERT INTO usuarios (username, email, password, nombre, rol) VALUES
('admin', 'admin@licoreria.local', '$2a$10$...', 'Administrador', 'ADMIN'),
('vendedor', 'vendedor@licoreria.local', '$2a$10$...', 'Vendedor', 'VENDEDOR');
```

### 4.2 Categorías Iniciales

```sql
INSERT INTO categorias (nombre, descripcion) VALUES
('Cervezas', 'Cervezas nacionales e importadas'),
('Vinos', 'Vinos tintos, blancos y espumantes'),
('Licores', 'Licores diversos'),
('Whiskies', 'Whiskies nacionales e importados'),
('Ron', 'Ron nacional e importado'),
('Pisco', 'Pisco peruano'),
('Vodka', 'Vodka nacional e importado'),
('Snacks', 'Snacks y aperitivos');
```

---

## 5. ÍNDICES ADICIONALES PARA OPTIMIZACIÓN

```sql
-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_ventas_fecha_usuario ON ventas(fecha, usuario_id);
CREATE INDEX idx_productos_activo_stock ON productos(activo, stock_actual);
CREATE INDEX idx_comprobantes_serie_numero ON comprobantes_electronicos(serie, numero);
```

---

## 6. VISTAS ÚTILES

### 6.1 Vista: Productos con Stock Bajo

```sql
CREATE VIEW v_productos_stock_bajo AS
SELECT 
    p.id,
    p.codigo_barras,
    p.nombre,
    p.marca,
    c.nombre AS categoria,
    p.stock_actual,
    p.stock_minimo,
    (p.stock_minimo - p.stock_actual) AS faltante
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE p.activo = TRUE 
  AND p.stock_actual <= p.stock_minimo
ORDER BY faltante DESC;
```

### 6.2 Vista: Ventas del Día

```sql
CREATE VIEW v_ventas_dia AS
SELECT 
    v.id,
    v.numero_venta,
    v.fecha,
    u.nombre AS vendedor,
    c.nombre AS cliente,
    v.total,
    v.forma_pago,
    COUNT(dv.id) AS cantidad_productos
FROM ventas v
LEFT JOIN usuarios u ON v.usuario_id = u.id
LEFT JOIN clientes c ON v.cliente_id = c.id
LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
WHERE DATE(v.fecha) = CURRENT_DATE
  AND v.estado = 'COMPLETADA'
GROUP BY v.id, v.numero_venta, v.fecha, u.nombre, c.nombre, v.total, v.forma_pago;
```

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha de creación:** Enero 2025  
**Versión:** 1.0
