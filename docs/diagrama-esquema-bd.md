# Diagrama de esquema de base de datos - Licorería Piura

Puedes ver este diagrama en:
- **Cursor/VS Code:** instala la extensión "Mermaid" o "Markdown Preview Mermaid Support" y abre la vista previa (Ctrl+Shift+V).
- **Web:** copia el código en [mermaid.live](https://mermaid.live) y verás el diagrama interactivo.
- **GitHub:** al subir el repo, GitHub renderiza Mermaid en los `.md`.

---

## Diagrama ER (tablas y relaciones)

```mermaid
erDiagram
    usuarios ||--o{ ventas : "realiza"
    usuarios ||--o{ compras : "registra"
    usuarios ||--o{ movimientos_inventario : "registra"

    clientes ||--o{ ventas : "recibe"

    categorias ||--o{ productos : "agrupa"
    productos ||--o{ detalle_ventas : "detalle"
    productos ||--o{ detalle_compras : "detalle"
    productos ||--o{ movimientos_inventario : "movimiento"
    productos ||--o{ promocion_productos : "en promoción"
    productos ||--o{ pack_productos : "en pack"

    ventas ||--o{ detalle_ventas : "tiene"
    ventas ||--o{ comprobantes_electronicos : "comprobante"
    ventas ||--o{ venta_pagos : "pagos"
    ventas ||--o{ movimientos_inventario : "origen"

    packs ||--o{ detalle_ventas : "detalle"
    packs ||--o{ pack_productos : "contiene"

    proveedores ||--o{ compras : "proveedor"
    compras ||--o{ detalle_compras : "tiene"
    compras ||--o{ movimientos_inventario : "origen"

    promociones ||--o{ promocion_productos : "incluye"

    usuarios {
        bigint id PK
        varchar username
        varchar email
        varchar password
        varchar nombre
        varchar rol
        boolean activo
    }

    categorias {
        bigint id PK
        varchar nombre
        text descripcion
        boolean activa
    }

    productos {
        bigint id PK
        varchar codigo_barras
        varchar nombre
        varchar marca
        bigint categoria_id FK
        decimal precio_compra
        decimal precio_venta
        int stock_actual
        int stock_minimo
        boolean activo
    }

    clientes {
        bigint id PK
        varchar tipo_documento
        varchar numero_documento
        varchar nombre
        varchar telefono
        int puntos_fidelizacion
    }

    ventas {
        bigint id PK
        varchar numero_venta
        timestamp fecha
        bigint usuario_id FK
        bigint cliente_id FK
        decimal subtotal
        decimal total
        varchar forma_pago
        varchar estado
    }

    detalle_ventas {
        bigint id PK
        bigint venta_id FK
        bigint producto_id FK
        bigint pack_id FK
        int cantidad
        decimal precio_unitario
        decimal subtotal
    }

    venta_pagos {
        bigint id PK
        bigint venta_id FK
        varchar metodo_pago
        decimal monto
    }

    comprobantes_electronicos {
        bigint id PK
        bigint venta_id FK
        varchar tipo_comprobante
        varchar serie
        varchar numero
        varchar estado_sunat
    }

    proveedores {
        bigint id PK
        varchar razon_social
        varchar ruc
        varchar telefono
    }

    compras {
        bigint id PK
        varchar numero_compra
        bigint proveedor_id FK
        bigint usuario_id FK
        decimal total
        varchar estado
    }

    detalle_compras {
        bigint id PK
        bigint compra_id FK
        bigint producto_id FK
        int cantidad
        decimal precio_unitario
        decimal subtotal
    }

    movimientos_inventario {
        bigint id PK
        bigint producto_id FK
        varchar tipo_movimiento
        int cantidad
        bigint usuario_id FK
        bigint venta_id FK
        bigint compra_id FK
    }

    promociones {
        bigint id PK
        varchar nombre
        varchar tipo
        decimal descuento_porcentaje
        timestamp fecha_inicio
        timestamp fecha_fin
        boolean activa
    }

    promocion_productos {
        bigint id PK
        bigint promocion_id FK
        bigint producto_id FK
        int cantidad_minima
    }

    packs {
        bigint id PK
        varchar nombre
        decimal precio_pack
        boolean activo
    }

    pack_productos {
        bigint id PK
        bigint pack_id FK
        bigint producto_id FK
        int cantidad
    }
```

---

## Vista simplificada (solo tablas y relaciones)

```mermaid
flowchart LR
    subgraph "Usuarios y seguridad"
        usuarios
    end

    subgraph "Catálogo"
        categorias --> productos
        promociones --> promocion_productos
        productos --> promocion_productos
        packs --> pack_productos
        productos --> pack_productos
    end

    subgraph "Ventas"
        usuarios --> ventas
        clientes --> ventas
        ventas --> detalle_ventas
        productos --> detalle_ventas
        packs --> detalle_ventas
        ventas --> venta_pagos
        ventas --> comprobantes_electronicos
    end

    subgraph "Compras e inventario"
        proveedores --> compras
        usuarios --> compras
        compras --> detalle_compras
        productos --> detalle_compras
        productos --> movimientos_inventario
        ventas --> movimientos_inventario
        compras --> movimientos_inventario
    end
```
