# Presentación: Diagrama de Base de Datos — Sistema de Gestión de Licorería

Guía para explicar el diagrama entidad-relación en una presentación.

---

## Diapositiva 1: Título

**Diagrama de Base de Datos: Sistema de Gestión de Licorería**

*Muestra el diagrama completo y presenta el tema.*

---

## Diapositiva 2: Introducción al Diagrama ER

**¿Qué representa este diagrama?**

- La **estructura** de la base de datos: cómo se guardan y relacionan los datos del sistema.
- Las **entidades principales** (tablas) y sus **relaciones** (claves foráneas).
- Sirve para entender el sistema de un vistazo y es la base para el desarrollo y la operación del negocio.

**Mensaje clave:** *“Con este modelo sabemos qué datos guardamos, dónde y cómo se conectan entre sí.”*

---

## Diapositiva 3: Entidades centrales — Productos e inventario

### Tabla `productos`
- **Rol:** Datos de todos los artículos que se venden.
- **Campos importantes:** `id`, `codigo_barras`, `nombre`, `marca`, `precio_compra`, `precio_venta`, `stock_actual`, `stock_minimo`, `stock_maximo`, `fecha_vencimiento`, `imagen`, `activo`, fechas de creación y actualización.
- **Relación:** Pertenece a una **categoría** y tiene **movimientos de inventario**.

### Tabla `categorias`
- **Rol:** Clasificar productos (ej. cervezas, licores, vinos).
- **Campos:** `id`, `nombre`, `descripcion`, `activa`.

### Tabla `movimientos_inventario`
- **Rol:** Registrar cada cambio de stock (entradas, salidas, ajustes).
- **Campos:** `producto_id`, `tipo_movimiento`, `cantidad`, `motivo`, `usuario_id`, `venta_id`, `compra_id`, `fecha`.
- **Importancia:** Da **trazabilidad** y control del inventario.

**Mensaje clave:** *“Productos, categorías y movimientos son el núcleo del inventario.”*

---

## Diapositiva 4: Gestión de ventas

### Tabla `ventas`
- **Rol:** Cada operación de venta (cabecera de la venta).
- **Campos:** `numero_venta`, `fecha`, `usuario_id`, `cliente_id`, `subtotal`, `descuento`, `impuesto`, `total`, `forma_pago`, `estado`, `observaciones`.
- **Relaciones:** Con **clientes**, **usuarios**, **detalle_ventas**, **venta_pagos** y **comprobantes_electronicos**.

### Tabla `detalle_ventas`
- **Rol:** Líneas de la venta: qué productos, cuántos y a qué precio.
- **Campos:** `venta_id`, `producto_id`, `cantidad`, `precio_unitario`, `descuento`, `subtotal`, `pack_id` (si aplica).

### Tabla `venta_pagos`
- **Rol:** Pagos de cada venta (permite varios medios de pago por venta).
- **Campos:** `venta_id`, `metodo_pago`, `monto`, `referencia`.

### Tabla `comprobantes_electronicos`
- **Rol:** Facturas/boletas electrónicas y estado ante SUNAT.
- **Campos:** `venta_id`, `tipo_comprobante`, `serie`, `numero`, `xml_enviado`, `pdf_generado`, `estado_sunat`, fechas de emisión y envío.

**Mensaje clave:** *“Ventas, su detalle, pagos y comprobantes cubren todo el flujo de venta y facturación.”*

---

## Diapositiva 5: Clientes y usuarios del sistema

### Tabla `clientes`
- **Rol:** Datos de los clientes (para ventas y fidelización).
- **Campos:** `tipo_documento`, `numero_documento`, `nombre`, `telefono`, `email`, `puntos_fidelizacion`, fechas.
- **Relación:** Un cliente puede tener muchas **ventas**.

### Tabla `usuarios`
- **Rol:** Empleados y administradores que usan el sistema.
- **Campos:** `username`, `email`, `password`, `nombre`, `rol` (vendedor, administrador, etc.), `activo`, fechas.
- **Relación:** Un usuario puede registrar **ventas**, **compras** y **movimientos de inventario**.

**Mensaje clave:** *“Clientes y usuarios son quienes interactúan con el sistema; el modelo los vincula a ventas y operaciones.”*

---

## Diapositiva 6: Compras y proveedores

### Tabla `compras`
- **Rol:** Cabecera de cada compra a proveedores.
- **Campos:** `numero_compra`, `proveedor_id`, `fecha`, `total`, `usuario_id`, `estado`, `observaciones`.

### Tabla `detalle_compras`
- **Rol:** Líneas de la compra: productos, cantidades y precios.
- **Campos:** `compra_id`, `producto_id`, `cantidad`, `precio_unitario`, `subtotal`.

### Tabla `proveedores`
- **Rol:** Datos de las empresas que suministran productos.
- **Campos:** `razon_social`, `ruc`, `direccion`, `telefono`, `email`, `activo`.

**Mensaje clave:** *“Compras, su detalle y proveedores permiten controlar entradas de mercadería y costos.”*

---

## Diapositiva 7: Promociones y packs

### Tabla `promociones`
- **Rol:** Ofertas y descuentos (porcentaje o monto).
- **Campos:** `nombre`, `tipo`, `descuento_porcentaje`, `descuento_monto`, `fecha_inicio`, `fecha_fin`, `activa`.
- **Relación:** Se vincula a productos vía **promocion_productos**.

### Tabla `promocion_productos`
- **Rol:** Qué productos tienen cada promoción y condiciones (ej. cantidad mínima, “cantidad gratis” en 2x1).
- **Campos:** `promocion_id`, `producto_id`, `cantidad_minima`, `cantidad_gratis`.

### Tabla `packs`
- **Rol:** Conjuntos de productos vendidos como un solo paquete a precio especial.
- **Campos:** `nombre`, `precio_pack`, `activo`.

### Tabla `pack_productos`
- **Rol:** Productos que forman cada pack y en qué cantidad.
- **Campos:** `pack_id`, `producto_id`, `cantidad`.

**Mensaje clave:** *“Promociones y packs permiten ofertas flexibles sin duplicar datos de productos.”*

---

## Diapositiva 8: Componente técnico — Flyway

### Tabla `flyway_schema_history`
- **Rol:** Usada por **Flyway** para controlar versiones del esquema de la base de datos.
- **No es dato de negocio:** solo metadatos de migraciones (qué scripts se ejecutaron y cuándo).
- **Importancia:** Permite evolucionar la BD de forma ordenada y reproducible.

**Mensaje clave:** *“Flyway nos ayuda a mantener la base de datos actualizada y consistente entre entornos.”*

---

## Diapositiva 9: Resumen y beneficios

**Resumen del diseño:**

| Área              | Tablas principales                          |
|-------------------|---------------------------------------------|
| Inventario        | productos, categorias, movimientos_inventario |
| Ventas            | ventas, detalle_ventas, venta_pagos, comprobantes_electronicos |
| Personas          | clientes, usuarios                          |
| Compras           | compras, detalle_compras, proveedores       |
| Marketing         | promociones, promocion_productos, packs, pack_productos |

**Beneficios:**
- Estructura **clara y escalable** para todas las operaciones de la licorería.
- Soporta **trazabilidad** (inventario, ventas, compras).
- Facilita **reportes** y toma de decisiones.
- Base sólida para **crecimiento** del negocio.

**Cierre:** *“Este diagrama es la columna vertebral del sistema: define qué guardamos y cómo se relaciona todo.”*

---

## Consejos para la presentación

1. **Orden sugerido:** Título → Introducción → Productos/Inventario → Ventas → Clientes/Usuarios → Compras → Promociones/Packs → Flyway → Resumen.
2. En cada bloque, mostrar primero la parte del diagrama que corresponde (si tienes el diagrama por secciones).
3. Destacar **una o dos relaciones** por diapositiva (por ejemplo: “ventas → detalle_ventas” o “productos → movimientos_inventario”).
4. Si el tiempo es corto, puedes unir en una sola diapositiva: Clientes y usuarios, y en otra: Compras y proveedores.
