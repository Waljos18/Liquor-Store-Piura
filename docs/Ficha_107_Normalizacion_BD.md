# FICHA 107 — NORMALIZACIÓN DE BASE DE DATOS
### Sistema POS/ERP — Licorería Chilalo, Piura

---

## 1. HISTORIAL DEL DOCUMENTO

| Versión | Fecha | Modificado por | Observaciones |
|---------|-------|----------------|---------------|
| 1.0 | 04/03/2025 | IDAT | Creación inicial del documento |
| 1.1 | 17/03/2026 | Equipo Chilalo | Actualización con esquema completo (V1–V18) |

---

## 2. INFORMACIÓN DEL DOCUMENTO

| Campo | Detalle |
|-------|---------|
| **Proyecto** | Sistema POS/ERP — Licorería Chilalo |
| **Versión** | 1.1 |
| **Fecha de actualización** | 17/03/2026 |
| **Preparado por** | Equipo de Desarrollo Chilalo |
| **Stack de BD** | PostgreSQL 15 |
| **ORM** | Spring Data JPA / Hibernate |

---

## 2.1 Situación Actual

La **Licorería Chilalo** ubicada en Piura requiere un sistema integral de Punto de Venta (POS) y ERP para gestionar:

- Ventas al mostrador con emisión de boleta/factura electrónica (SUNAT)
- Control de inventario con stock mínimo y alertas de vencimiento
- Compras a proveedores con recepción parcial de mercadería
- Devoluciones de productos con restauración automática de stock
- Crédito/fiado con cuentas por cobrar y pagos parciales
- Apertura y cierre formal de caja diaria
- Gastos operativos categorizados
- Control de mermas (deterioro, rotura, vencimiento, robo)
- Programa de fidelización con acumulación y canje de puntos
- Autenticación segura con recuperación de contraseña por email

**Problema previo a normalizar:**
Un documento de venta sin normalizar podría tener la siguiente forma plana:

```
VENTA_PLANA(
  num_venta, fecha,
  nombre_vendedor, email_vendedor, rol_vendedor,        ← datos del vendedor
  nombre_cliente, doc_cliente, tipo_doc, tel_cliente,   ← datos del cliente
  cod_prod1, nombre_prod1, categ_prod1, precio1, cant1, ← ítem repetitivo
  cod_prod2, nombre_prod2, categ_prod2, precio2, cant2, ← ítem repetitivo
  ...
  subtotal, descuento, impuesto, total, forma_pago
)
```

Esta estructura presenta redundancia de datos, grupos repetitivos y dependencias parciales/transitivas que deben eliminarse mediante el proceso de normalización.

---

## 3. NORMALIZACIÓN

### 3.1 Primera Forma Normal — 1FN
*(Incluye eliminación de los grupos repetitivos)*

**Regla:** Cada celda debe contener un único valor atómico; no deben existir grupos repetitivos ni columnas multivaluadas.

**Acción aplicada:** Se extrae la lista de ítems de la venta a una tabla separada, eliminando las columnas repetidas `(cod_prodN, nombre_prodN, cantN, precioN)`.

```
VENTA_1FN(
  num_venta, fecha,
  nombre_vendedor, email_vendedor, rol_vendedor,
  nombre_cliente, doc_cliente, tipo_doc, tel_cliente,
  subtotal, descuento, impuesto, total, forma_pago
)

DETALLE_VENTA_1FN(
  num_venta,      ← parte de la clave compuesta
  cod_producto,   ← parte de la clave compuesta
  nombre_producto, nombre_categoria,
  precio_venta, cantidad, subtotal_item
)
```

**Resultado:** Se eliminan los grupos repetitivos. La clave de `DETALLE_VENTA_1FN` es compuesta: **(num_venta, cod_producto)**.

---

### 3.2 Segunda Forma Normal — 2FN
*(Asegura que todas las columnas que no son llave sean completamente dependientes de la llave primaria)*

**Regla:** Aplica sólo a tablas con clave compuesta. Cada atributo no clave debe depender de **toda** la clave, no de una parte de ella.

**Problema detectado en `DETALLE_VENTA_1FN`:**

| Columna | Depende de `num_venta` | Depende de `cod_producto` | Depende de la clave completa |
|---------|------------------------|--------------------------|------------------------------|
| nombre_producto | ✗ | ✓ | ✗ — dependencia parcial |
| nombre_categoria | ✗ | ✓ | ✗ — dependencia parcial |
| precio_venta | ✗ | ✓ | ✗ — dependencia parcial |
| cantidad | ✓ | ✓ | ✓ — depende de ambas |
| subtotal_item | ✓ | ✓ | ✓ — depende de ambas |

**Acción aplicada:** Los atributos con dependencia parcial de `cod_producto` se extraen a la tabla `PRODUCTO_2FN`.

```
VENTA_2FN(
  num_venta, fecha,
  nombre_vendedor, email_vendedor, rol_vendedor,
  nombre_cliente, doc_cliente, tipo_doc, tel_cliente,
  subtotal, descuento, impuesto, total, forma_pago
)

DETALLE_VENTA_2FN(
  num_venta (FK),
  cod_producto (FK),
  cantidad, precio_unitario, subtotal_item
)

PRODUCTO_2FN(
  cod_producto (PK),
  nombre_producto, nombre_categoria, precio_venta
)
```

**Resultado:** Se eliminan las dependencias parciales. `DETALLE_VENTA_2FN` solo contiene atributos que dependen de la clave compuesta completa.

---

### 3.3 Tercera Forma Normal — 3FN
*(Elimina cualquier dependencia transitiva)*

**Regla:** Un atributo no clave no debe depender de otro atributo no clave. Es decir: **PK → atributo_no_clave → otro_atributo_no_clave** está prohibido.

**Dependencias transitivas detectadas:**

En `VENTA_2FN`:
- `num_venta → nombre_vendedor → email_vendedor, rol_vendedor`
  → Los datos del vendedor dependen del vendedor, no de la venta.
- `num_venta → doc_cliente → nombre_cliente, tipo_doc, tel_cliente`
  → Los datos del cliente dependen del cliente, no de la venta.

En `PRODUCTO_2FN`:
- `cod_producto → nombre_categoria → descripcion_categoria`
  → Los datos de la categoría dependen de la categoría, no del producto.

**Acción aplicada:** Se extraen las dependencias transitivas en tablas propias.

```
USUARIO(
  id_usuario (PK), username, email, password,
  nombre, rol, activo
)

CLIENTE(
  id_cliente (PK), tipo_documento, numero_documento,
  nombre, telefono, email, puntos_fidelizacion
)

CATEGORIA(
  id_categoria (PK), nombre, descripcion, activa
)

PRODUCTO(
  id_producto (PK), codigo_barras, nombre, marca,
  id_categoria (FK→CATEGORIA),
  precio_compra, precio_venta, stock_actual,
  stock_minimo, fecha_vencimiento, activo
)

VENTA(
  id_venta (PK), numero_venta, fecha,
  id_usuario (FK→USUARIO), id_cliente (FK→CLIENTE),
  subtotal, descuento, impuesto, total,
  forma_pago, estado, observaciones
)

DETALLE_VENTA(
  id_detalle (PK),
  id_venta (FK→VENTA), id_producto (FK→PRODUCTO),
  cantidad, precio_unitario, descuento, subtotal
)
```

**Resultado:** El esquema está en 3FN. Cada atributo no clave depende únicamente de la llave primaria de su tabla.

**Tablas finales del sistema completo en 3FN:** `USUARIOS, CATEGORIAS, PRODUCTOS, CLIENTES, VENTAS, DETALLE_VENTAS, VENTA_PAGOS, COMPROBANTES_ELECTRONICOS, PROVEEDORES, COMPRAS, DETALLE_COMPRAS, MOVIMIENTOS_INVENTARIO, PACKS, PACK_PRODUCTOS, PROMOCIONES, PROMOCION_PRODUCTOS, DEVOLUCIONES, DETALLE_DEVOLUCIONES, CUENTAS_POR_COBRAR, PAGOS_CUENTA, APERTURAS_CAJA, GASTOS, MERMAS, CONFIG_FIDELIZACION, PUNTOS_MOVIMIENTOS, PASSWORD_RESET_TOKENS`

---

## 4. DIAGRAMA CONCEPTUAL (Modelo Entidad–Relación)

```
┌──────────────┐        ┌──────────────┐        ┌────────────────────┐
│   USUARIOS   │        │   CLIENTES   │        │     CATEGORIAS     │
│──────────────│        │──────────────│        │────────────────────│
│ id (PK)      │        │ id (PK)      │        │ id (PK)            │
│ username     │        │ tipo_doc     │        │ nombre             │
│ email        │        │ num_doc      │        │ descripcion        │
│ nombre       │        │ nombre       │        │ activa             │
│ rol          │        │ telefono     │        └─────────┬──────────┘
│ activo       │        │ puntos_fidel │                  │ 1
└──────┬───────┘        └──────┬───────┘                  │
       │ 1                     │ 1                        │ N
       │ N                     │ N               ┌────────┴───────────┐
       └──────────┬────────────┘                 │      PRODUCTOS     │
                  │                              │────────────────────│
           ┌──────┴──────┐                       │ id (PK)            │
           │    VENTAS   │                       │ codigo_barras      │
           │─────────────│                       │ nombre             │
           │ id (PK)     │                       │ marca              │
           │ num_venta   │                       │ precio_compra      │
           │ fecha       ├──────────N────────────┤ precio_venta       │
           │ subtotal    │  DETALLE_VENTAS        │ stock_actual       │
           │ descuento   │                       │ stock_minimo       │
           │ impuesto    │                       │ fecha_vencimiento  │
           │ total       │                       └───────┬────────────┘
           │ forma_pago  │                               │ N
           │ estado      │                               │
           └──────┬──────┘               ┌──────────────┴─────────────┐
                  │ 1                    │   MOVIMIENTOS_INVENTARIO   │
                  │ N                    │────────────────────────────│
           ┌──────┴──────────────┐       │ id (PK)                    │
           │ COMPROBANTES_ELEC.  │       │ producto_id (FK)           │
           │─────────────────────│       │ tipo_movimiento            │
           │ id (PK)             │       │ cantidad                   │
           │ venta_id (FK)       │       │ motivo                     │
           │ tipo_comprobante    │       │ usuario_id (FK)            │
           │ serie               │       │ venta_id (FK)              │
           │ numero              │       │ compra_id (FK)             │
           │ estado_sunat        │       │ fecha                      │
           └─────────────────────┘       └────────────────────────────┘

┌─────────────┐    ┌────────────────┐    ┌──────────────────┐
│ PROVEEDORES │    │    COMPRAS     │    │  DETALLE_COMPRAS │
│─────────────│    │────────────────│    │──────────────────│
│ id (PK)     │1─N │ id (PK)        │1─N │ id (PK)          │
│ razon_social│────│ num_compra     │────│ compra_id (FK)   │
│ ruc         │    │ proveedor_id   │    │ producto_id (FK) │
│ telefono    │    │ usuario_id     │    │ cantidad         │
│ email       │    │ total          │    │ precio_unitario  │
│ activo      │    │ estado         │    │ cantidad_recibida│
└─────────────┘    └────────────────┘    └──────────────────┘

┌──────────────────┐   ┌───────────────────┐   ┌────────────────────┐
│  DEVOLUCIONES    │   │ CUENTAS_POR_COBRAR│   │   APERTURAS_CAJA   │
│──────────────────│   │───────────────────│   │────────────────────│
│ id (PK)          │   │ id (PK)           │   │ id (PK)            │
│ num_devolucion   │   │ venta_id (FK,UNIQ)│   │ fecha              │
│ venta_id (FK)    │   │ cliente_id (FK)   │   │ hora_apertura      │
│ usuario_id (FK)  │   │ monto_total       │   │ hora_cierre        │
│ motivo           │   │ monto_pagado      │   │ monto_inicial      │
│ total            │   │ saldo_pendiente   │   │ monto_real         │
│ estado           │   │ estado            │   │ sobrante_faltante  │
└────────┬─────────┘   └────────┬──────────┘   │ usuario_apertura   │
         │ 1                    │ 1            │ usuario_cierre     │
         │ N                    │ N            │ estado             │
┌────────┴──────────┐  ┌────────┴───────────┐  └────────────────────┘
│ DETALLE_DEVOLUC.  │  │    PAGOS_CUENTA    │
│───────────────────│  │────────────────────│
│ id (PK)           │  │ id (PK)            │
│ devolucion_id(FK) │  │ cuenta_id (FK)     │
│ producto_id (FK)  │  │ monto              │
│ cantidad          │  │ usuario_id (FK)    │
│ precio_unitario   │  │ forma_pago         │
│ subtotal          │  │ fecha              │
└───────────────────┘  └────────────────────┘
```

---

## 5. DIAGRAMA FÍSICO (Modelo Relacional)

```
USUARIOS                         CLIENTES
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
username      VARCHAR(50) UNIQUE  tipo_documento   VARCHAR(10)
email         VARCHAR(100) UNIQ   numero_documento VARCHAR(20) UNIQUE
password      VARCHAR(255)        nombre           VARCHAR(200)
nombre        VARCHAR(100)        telefono         VARCHAR(20)
rol           VARCHAR(20)         email            VARCHAR(100)
activo        BOOLEAN             puntos_fidelizacion INTEGER
fecha_creacion TIMESTAMP           fecha_creacion   TIMESTAMP

CATEGORIAS                       PRODUCTOS
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
nombre        VARCHAR(100) UNIQ  codigo_barras    VARCHAR(50)  UNIQUE
descripcion   TEXT               nombre           VARCHAR(200)
activa        BOOLEAN            marca            VARCHAR(100)
fecha_creacion TIMESTAMP          categoria_id     BIGINT       FK→CATEGORIAS
                                 precio_compra    DECIMAL(10,2)
                                 precio_venta     DECIMAL(10,2)
                                 stock_actual     INTEGER
                                 stock_minimo     INTEGER
                                 stock_maximo     INTEGER
                                 fecha_vencimiento DATE
                                 imagen           VARCHAR(255)
                                 activo           BOOLEAN
                                 fecha_creacion   TIMESTAMP
                                 fecha_actualizacion TIMESTAMP

VENTAS                           DETALLE_VENTAS
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
numero_venta  VARCHAR(20) UNIQ   venta_id         BIGINT   FK→VENTAS
fecha         TIMESTAMP          producto_id      BIGINT   FK→PRODUCTOS
usuario_id    BIGINT     FK→USU  pack_id          BIGINT   FK→PACKS
cliente_id    BIGINT     FK→CLI  cantidad         INTEGER
subtotal      DECIMAL(10,2)      precio_unitario  DECIMAL(10,2)
descuento     DECIMAL(10,2)      descuento        DECIMAL(10,2)
impuesto      DECIMAL(10,2)      subtotal         DECIMAL(10,2)
total         DECIMAL(10,2)
forma_pago    VARCHAR(20)        VENTA_PAGOS
estado        VARCHAR(20)        ──────────────────────────────────
observaciones TEXT               id               BIGSERIAL  PK
fecha_creacion TIMESTAMP          venta_id         BIGINT   FK→VENTAS
                                 metodo_pago      VARCHAR(20)
COMPROBANTES_ELECTRONICOS        monto            DECIMAL(10,2)
─────────────────────────────    referencia       VARCHAR(100)
id            BIGSERIAL  PK
venta_id      BIGINT  FK→VENTAS  PROVEEDORES
tipo_comprobante VARCHAR(10)     ──────────────────────────────────
serie         VARCHAR(10)        id               BIGSERIAL  PK
numero        VARCHAR(20)        razon_social     VARCHAR(200)
xml_enviado   TEXT               ruc              VARCHAR(20)  UNIQUE
pdf_generado  BYTEA              direccion        TEXT
estado_sunat  VARCHAR(20)        telefono         VARCHAR(20)
fecha_emision TIMESTAMP          email            VARCHAR(100)
UNIQUE (serie, numero)           activo           BOOLEAN
                                 fecha_creacion   TIMESTAMP

COMPRAS                          DETALLE_COMPRAS
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
numero_compra VARCHAR(20) UNIQ   compra_id        BIGINT FK→COMPRAS
proveedor_id  BIGINT FK→PROVEED  producto_id      BIGINT FK→PRODUCTOS
fecha         TIMESTAMP          cantidad         INTEGER
total         DECIMAL(10,2)      precio_unitario  DECIMAL(10,2)
usuario_id    BIGINT FK→USUARIOS  subtotal         DECIMAL(10,2)
estado        VARCHAR(20)        cantidad_recibida INTEGER
observaciones TEXT
fecha_recepcion TIMESTAMP

MOVIMIENTOS_INVENTARIO           PROMOCIONES
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
producto_id   BIGINT FK→PRODUCT  nombre           VARCHAR(200)
tipo_movimiento VARCHAR(20)      tipo             VARCHAR(20)
cantidad      INTEGER            descuento_porcentaje DECIMAL(5,2)
motivo        VARCHAR(200)       descuento_monto  DECIMAL(10,2)
usuario_id    BIGINT FK→USUARIOS  fecha_inicio     TIMESTAMP
venta_id      BIGINT FK→VENTAS   fecha_fin        TIMESTAMP
compra_id     BIGINT FK→COMPRAS  activa           BOOLEAN
fecha         TIMESTAMP          fecha_creacion   TIMESTAMP

PROMOCION_PRODUCTOS              PACKS
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
promocion_id  BIGINT FK→PROMOCI  nombre           VARCHAR(200)
producto_id   BIGINT FK→PRODUCT  precio_pack      DECIMAL(10,2)
cantidad_minima INTEGER          activo           BOOLEAN
cantidad_gratis INTEGER          fecha_creacion   TIMESTAMP

PACK_PRODUCTOS                   DEVOLUCIONES
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
pack_id       BIGINT FK→PACKS    numero_devolucion VARCHAR(20) UNIQUE
producto_id   BIGINT FK→PRODUCT  venta_id         BIGINT FK→VENTAS
cantidad      INTEGER            usuario_id       BIGINT FK→USUARIOS
                                 motivo           VARCHAR(50)
DETALLE_DEVOLUCIONES             estado           VARCHAR(20)
─────────────────────────────    observaciones    TEXT
id            BIGSERIAL  PK      total            DECIMAL(10,2)
devolucion_id BIGINT FK→DEVOLUC  fecha_creacion   TIMESTAMP
producto_id   BIGINT FK→PRODUCT
cantidad      INTEGER
precio_unitario DECIMAL(10,2)    CUENTAS_POR_COBRAR
subtotal      DECIMAL(10,2)      ──────────────────────────────────
                                 id               BIGSERIAL  PK
PAGOS_CUENTA                     venta_id         BIGINT FK→VENTAS (UNIQUE)
─────────────────────────────    cliente_id       BIGINT FK→CLIENTES
id            BIGSERIAL  PK      monto_total      DECIMAL(10,2)
cuenta_id     BIGINT FK→CUENTAS  monto_pagado     DECIMAL(10,2)
monto         DECIMAL(10,2)      saldo_pendiente  DECIMAL(10,2)
fecha         TIMESTAMP          estado           VARCHAR(20)
usuario_id    BIGINT FK→USUARIOS  fecha_vencimiento DATE
forma_pago    VARCHAR(20)        fecha_creacion   TIMESTAMP
observaciones TEXT

APERTURAS_CAJA                   GASTOS
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
fecha         DATE               descripcion      VARCHAR(255)
hora_apertura TIMESTAMP          categoria        VARCHAR(50)
hora_cierre   TIMESTAMP          monto            DECIMAL(10,2)
monto_inicial DECIMAL(10,2)      fecha            DATE
monto_cierre  DECIMAL(10,2)      comprobante      VARCHAR(100)
monto_real    DECIMAL(10,2)      observaciones    TEXT
sobrante_faltante DECIMAL(10,2)  usuario_id       BIGINT FK→USUARIOS
usuario_apertura_id BIGINT FK    fecha_creacion   TIMESTAMP
usuario_cierre_id   BIGINT FK
estado        VARCHAR(20)        MERMAS
                                 ──────────────────────────────────
CONFIG_FIDELIZACION              id               BIGSERIAL  PK
─────────────────────────────    producto_id      BIGINT FK→PRODUCTOS
id            BIGSERIAL  PK      cantidad         INTEGER
soles_por_punto DECIMAL(10,2)    motivo           VARCHAR(50)
puntos_sol_descuento DECIMAL     descripcion      TEXT
max_puntos_canje INTEGER         valor_perdida    DECIMAL(10,2)
min_compra_canje DECIMAL(10,2)   fecha            TIMESTAMP
activo        BOOLEAN            usuario_id       BIGINT FK→USUARIOS
fecha_actualizacion TIMESTAMP    fecha_creacion   TIMESTAMP

PUNTOS_MOVIMIENTOS               PASSWORD_RESET_TOKENS
─────────────────────────────    ──────────────────────────────────
id            BIGSERIAL  PK      id               BIGSERIAL  PK
cliente_id    BIGINT FK→CLIENTES  token            VARCHAR(255) UNIQUE
tipo          VARCHAR(20)        usuario_id       BIGINT FK→USUARIOS
cantidad      INTEGER            expira_en        TIMESTAMP
saldo_despues INTEGER            usado            BOOLEAN
venta_id      BIGINT FK→VENTAS   creado_en        TIMESTAMP
motivo        VARCHAR(200)
usuario_id    BIGINT FK→USUARIOS
fecha         TIMESTAMP
```

---

## 6. DICCIONARIO DE DATOS

### 6.1 Lista de Tablas

| ITEM | NOMBRE DE LA TABLA | DESCRIPCIÓN |
|------|--------------------|-------------|
| 1 | USUARIOS | Almacena los datos de los trabajadores del sistema (administradores y vendedores) |
| 2 | CATEGORIAS | Clasifica los productos por tipo (Cervezas, Vinos, Licores, etc.) |
| 3 | PRODUCTOS | Registra el catálogo de productos con precios, stock e información de vencimiento |
| 4 | CLIENTES | Almacena datos de clientes con soporte DNI/RUC/CE y puntos de fidelización |
| 5 | VENTAS | Registra la cabecera de cada transacción de venta realizada en el POS |
| 6 | DETALLE_VENTAS | Almacena los ítems individuales (productos o packs) de cada venta |
| 7 | COMPROBANTES_ELECTRONICOS | Gestiona los comprobantes electrónicos (boleta/factura) enviados a SUNAT |
| 8 | PROVEEDORES | Registra los datos de los proveedores de mercadería |
| 9 | COMPRAS | Registra las órdenes de compra a proveedores con su estado de recepción |
| 10 | DETALLE_COMPRAS | Almacena los productos solicitados en cada orden de compra |
| 11 | MOVIMIENTOS_INVENTARIO | Audita cada entrada, salida o ajuste de stock de los productos |

---

### 6.2 Descripción de las Tablas

#### 6.2.1 USUARIOS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del usuario | BIGSERIAL | 8 bytes | PK |
| 2 | username | Nombre de usuario para inicio de sesión | VARCHAR | 50 | UK |
| 3 | email | Correo electrónico del usuario | VARCHAR | 100 | UK |
| 4 | password | Contraseña encriptada (BCrypt) | VARCHAR | 255 | — |
| 5 | nombre | Nombre completo del trabajador | VARCHAR | 100 | — |
| 6 | rol | Rol en el sistema: ADMIN o VENDEDOR | VARCHAR | 20 | — |
| 7 | activo | Indica si el usuario está habilitado | BOOLEAN | 1 bit | — |
| 8 | fecha_creacion | Fecha y hora de creación del registro | TIMESTAMP | — | — |
| 9 | fecha_actualizacion | Fecha y hora de última modificación | TIMESTAMP | — | — |

---

#### 6.2.2 CATEGORIAS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único de la categoría | BIGSERIAL | 8 bytes | PK |
| 2 | nombre | Nombre de la categoría (ej. Cervezas) | VARCHAR | 100 | UK |
| 3 | descripcion | Descripción detallada de la categoría | TEXT | — | — |
| 4 | activa | Indica si la categoría está habilitada | BOOLEAN | 1 bit | — |
| 5 | fecha_creacion | Fecha y hora de creación del registro | TIMESTAMP | — | — |

---

#### 6.2.3 PRODUCTOS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del producto | BIGSERIAL | 8 bytes | PK |
| 2 | codigo_barras | Código de barras EAN/UPC del producto | VARCHAR | 50 | UK |
| 3 | nombre | Nombre comercial del producto | VARCHAR | 200 | — |
| 4 | marca | Marca del producto | VARCHAR | 100 | — |
| 5 | categoria_id | Referencia a la categoría del producto | BIGINT | 8 bytes | FK→CATEGORIAS |
| 6 | precio_compra | Precio de adquisición al proveedor | DECIMAL | 10,2 | — |
| 7 | precio_venta | Precio de venta al público | DECIMAL | 10,2 | — |
| 8 | stock_actual | Cantidad disponible en almacén | INTEGER | 4 bytes | — |
| 9 | stock_minimo | Nivel mínimo de alerta de reposición | INTEGER | 4 bytes | — |
| 10 | stock_maximo | Nivel máximo de almacenamiento | INTEGER | 4 bytes | — |
| 11 | fecha_vencimiento | Fecha de vencimiento del producto | DATE | — | — |
| 12 | activo | Indica si el producto está disponible | BOOLEAN | 1 bit | — |

---

#### 6.2.4 CLIENTES

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del cliente | BIGSERIAL | 8 bytes | PK |
| 2 | tipo_documento | Tipo de documento: DNI, RUC o CE | VARCHAR | 10 | — |
| 3 | numero_documento | Número del documento de identidad | VARCHAR | 20 | UK |
| 4 | nombre | Nombre completo o razón social | VARCHAR | 200 | — |
| 5 | telefono | Número de teléfono de contacto | VARCHAR | 20 | — |
| 6 | email | Correo electrónico del cliente | VARCHAR | 100 | — |
| 7 | puntos_fidelizacion | Saldo actual de puntos de fidelización | INTEGER | 4 bytes | — |
| 8 | fecha_creacion | Fecha de registro del cliente | TIMESTAMP | — | — |

---

#### 6.2.5 VENTAS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único de la venta | BIGSERIAL | 8 bytes | PK |
| 2 | numero_venta | Número correlativo legible (VENT-YYYYMMDD-NNNN) | VARCHAR | 20 | UK |
| 3 | fecha | Fecha y hora en que se realizó la venta | TIMESTAMP | — | — |
| 4 | usuario_id | Vendedor que atendió la venta | BIGINT | 8 bytes | FK→USUARIOS |
| 5 | cliente_id | Cliente al que pertenece la venta | BIGINT | 8 bytes | FK→CLIENTES |
| 6 | subtotal | Suma de ítems antes de descuento e impuesto | DECIMAL | 10,2 | — |
| 7 | descuento | Monto total de descuento aplicado | DECIMAL | 10,2 | — |
| 8 | impuesto | IGV (18%) calculado | DECIMAL | 10,2 | — |
| 9 | total | Monto final cobrado al cliente | DECIMAL | 10,2 | — |
| 10 | forma_pago | Método de pago: EFECTIVO, YAPE, PLIN, TARJETA, MIXTO, CREDITO | VARCHAR | 20 | — |
| 11 | estado | Estado de la venta: COMPLETADA, ANULADA, PENDIENTE | VARCHAR | 20 | — |
| 12 | observaciones | Notas adicionales sobre la venta | TEXT | — | — |

---

#### 6.2.6 DETALLE_VENTAS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del detalle | BIGSERIAL | 8 bytes | PK |
| 2 | venta_id | Venta a la que pertenece este ítem | BIGINT | 8 bytes | FK→VENTAS |
| 3 | producto_id | Producto vendido (si es ítem suelto) | BIGINT | 8 bytes | FK→PRODUCTOS |
| 4 | pack_id | Pack vendido (si es combo/pack) | BIGINT | 8 bytes | FK→PACKS |
| 5 | cantidad | Número de unidades vendidas | INTEGER | 4 bytes | — |
| 6 | precio_unitario | Precio por unidad al momento de la venta | DECIMAL | 10,2 | — |
| 7 | descuento | Descuento aplicado a este ítem | DECIMAL | 10,2 | — |
| 8 | subtotal | Importe total del ítem (cant × precio − descuento) | DECIMAL | 10,2 | — |

---

#### 6.2.7 COMPROBANTES_ELECTRONICOS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del comprobante | BIGSERIAL | 8 bytes | PK |
| 2 | venta_id | Venta asociada al comprobante | BIGINT | 8 bytes | FK→VENTAS |
| 3 | tipo_comprobante | Tipo: BOLETA, FACTURA, NOTA_CREDITO, NOTA_DEBITO | VARCHAR | 10 | — |
| 4 | serie | Serie del comprobante (ej. B001, F001) | VARCHAR | 10 | UK (con numero) |
| 5 | numero | Número correlativo del comprobante | VARCHAR | 20 | UK (con serie) |
| 6 | xml_enviado | XML del comprobante enviado a SUNAT | TEXT | — | — |
| 7 | pdf_generado | PDF del comprobante en formato binario | BYTEA | — | — |
| 8 | estado_sunat | Estado en SUNAT: PENDIENTE, ACEPTADO, RECHAZADO, ERROR | VARCHAR | 20 | — |
| 9 | fecha_emision | Fecha y hora de emisión del comprobante | TIMESTAMP | — | — |

---

#### 6.2.8 PROVEEDORES

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del proveedor | BIGSERIAL | 8 bytes | PK |
| 2 | razon_social | Razón social o nombre del proveedor | VARCHAR | 200 | — |
| 3 | ruc | RUC del proveedor | VARCHAR | 20 | UK |
| 4 | direccion | Dirección del proveedor | TEXT | — | — |
| 5 | telefono | Teléfono de contacto | VARCHAR | 20 | — |
| 6 | email | Correo electrónico de contacto | VARCHAR | 100 | — |
| 7 | activo | Indica si el proveedor está habilitado | BOOLEAN | 1 bit | — |

---

#### 6.2.9 COMPRAS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único de la compra | BIGSERIAL | 8 bytes | PK |
| 2 | numero_compra | Número correlativo de la orden de compra | VARCHAR | 20 | UK |
| 3 | proveedor_id | Proveedor al que se realizó la compra | BIGINT | 8 bytes | FK→PROVEEDORES |
| 4 | fecha | Fecha y hora de la orden de compra | TIMESTAMP | — | — |
| 5 | total | Monto total de la compra | DECIMAL | 10,2 | — |
| 6 | usuario_id | Usuario que registró la compra | BIGINT | 8 bytes | FK→USUARIOS |
| 7 | estado | Estado: PENDIENTE, RECIBIDA, COMPLETADA, ANULADA | VARCHAR | 20 | — |
| 8 | fecha_recepcion | Fecha en que se recibió la mercadería | TIMESTAMP | — | — |

---

#### 6.2.10 DETALLE_COMPRAS

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del detalle | BIGSERIAL | 8 bytes | PK |
| 2 | compra_id | Compra a la que pertenece este ítem | BIGINT | 8 bytes | FK→COMPRAS |
| 3 | producto_id | Producto solicitado en la compra | BIGINT | 8 bytes | FK→PRODUCTOS |
| 4 | cantidad | Cantidad solicitada al proveedor | INTEGER | 4 bytes | — |
| 5 | precio_unitario | Precio de compra pactado por unidad | DECIMAL | 10,2 | — |
| 6 | subtotal | Importe total del ítem (cant × precio) | DECIMAL | 10,2 | — |
| 7 | cantidad_recibida | Cantidad efectivamente recibida (recepción parcial) | INTEGER | 4 bytes | — |

---

#### 6.2.11 MOVIMIENTOS_INVENTARIO

| Ítem | Abreviación de Campo | Descripción del Campo | Tipo del Campo | Longitud del Campo | Tipo de Llave |
|------|----------------------|-----------------------|----------------|--------------------|---------------|
| 1 | id | Identificador único del movimiento | BIGSERIAL | 8 bytes | PK |
| 2 | producto_id | Producto afectado por el movimiento | BIGINT | 8 bytes | FK→PRODUCTOS |
| 3 | tipo_movimiento | Tipo: ENTRADA, SALIDA o AJUSTE | VARCHAR | 20 | — |
| 4 | cantidad | Cantidad de unidades afectadas | INTEGER | 4 bytes | — |
| 5 | motivo | Razón del movimiento (ej. venta, compra, merma) | VARCHAR | 200 | — |
| 6 | usuario_id | Usuario que registró el movimiento | BIGINT | 8 bytes | FK→USUARIOS |
| 7 | venta_id | Venta origen del movimiento (si aplica) | BIGINT | 8 bytes | FK→VENTAS |
| 8 | compra_id | Compra origen del movimiento (si aplica) | BIGINT | 8 bytes | FK→COMPRAS |
| 9 | fecha | Fecha y hora del movimiento | TIMESTAMP | — | — |

---

*Fin del documento — Ficha 107 Normalización de Base de Datos*
*Licorería Chilalo — Sistema POS/ERP — Piura, Perú*
