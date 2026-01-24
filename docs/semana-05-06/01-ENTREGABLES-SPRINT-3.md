# Semana 5-6: Sprint 3 - Módulos Principales e IA Básica

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Fase:** 2 - Desarrollo Backend  
**Fecha:** Enero 2025

---

## 1. Objetivos del Sprint

- Módulo de ventas (lógica de negocio completa)
- Módulo de inventario (control de stock y movimientos)
- Sistema de promociones y packs
- Gestión de proveedores y compras
- Integración de IA: Modelos básicos de recomendaciones
- Envío y consulta de comprobantes SUNAT (OSE)
- Manejo de errores y reintentos

---

## 2. Estructura del Backend (Actualizada)

```
backend/
├── src/main/java/com/licoreria/
│   ├── config/           # Security, JWT, CORS, OpenAPI, DataInitializer
│   ├── controller/       # Auth, Usuarios, Categorías, Productos, Clientes, 
│   │                      #   Ventas, Inventario, Promociones, Proveedores, 
│   │                      #   Facturación, IA
│   ├── dto/              # DTOs y ApiResponse
│   ├── entity/           # Usuario, Categoria, Producto, Cliente, Venta, 
│   │                      #   DetalleVenta, ComprobanteElectronico, 
│   │                      #   MovimientoInventario, Promocion, Pack, 
│   │                      #   Proveedor, Compra, DetalleCompra
│   ├── exception/        # GlobalExceptionHandler
│   ├── repository/       # JPA repositories
│   ├── security/         # JwtUtil, JwtAuthFilter
│   ├── service/          # Auth, Usuario, Categoria, Producto, Cliente, 
│   │                      #   Venta, Inventario, Promocion, Proveedor, 
│   │                      #   Facturación, IA
│   └── ai/               # Servicios de IA (integración Python)
│       ├── RecommendationService
│       ├── DemandPredictionService
│       └── PythonIntegrationService
├── src/main/resources/
│   ├── application*.properties
│   └── db/migration/     # Flyway V4, V5, V6, V7
└── pom.xml
```

---

## 3. Entregables

### 3.1 Módulo de Ventas

#### 3.1.1 Endpoints de Ventas

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/ventas` | GET | Listar ventas con filtros (fechaDesde, fechaHasta, usuarioId, clienteId, estado) y paginación. |
| `/api/v1/ventas/{id}` | GET | Obtener venta por ID con detalles. |
| `/api/v1/ventas` | POST | Crear nueva venta. Valida stock, aplica promociones, calcula totales. |
| `/api/v1/ventas/{id}/anular` | PUT | Anular venta (solo ADMIN, con motivo). Restaura stock. |
| `/api/v1/ventas/{id}/comprobante` | GET | Obtener comprobante asociado a la venta. |
| `/api/v1/ventas/resumen` | GET | Resumen de ventas (total, cantidad, por día/semana/mes). |

#### 3.1.2 DTO de Creación de Venta

```json
{
  "clienteId": 1,
  "items": [
    {
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 15.50
    }
  ],
  "descuento": 0.00,
  "formaPago": "EFECTIVO",
  "observaciones": "Venta rápida"
}
```

#### 3.1.3 Funcionalidades

- **Validación de stock:** Verifica disponibilidad antes de crear la venta
- **Aplicación automática de promociones:** Detecta y aplica promociones activas
- **Cálculo automático:** Subtotal, descuentos, IGV (18%), total
- **Actualización de inventario:** Reduce stock automáticamente
- **Registro de movimientos:** Crea movimientos de inventario tipo "VENTA"
- **Múltiples formas de pago:** EFECTIVO, TARJETA, TRANSFERENCIA, YAPE, PLIN
- **Anulación controlada:** Solo ADMIN puede anular, restaura stock

---

### 3.2 Módulo de Inventario

#### 3.2.1 Endpoints de Inventario

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/inventario/movimientos` | GET | Listar movimientos de inventario con filtros (productoId, tipo, fechaDesde, fechaHasta) y paginación. |
| `/api/v1/inventario/movimientos` | POST | Crear movimiento manual (ENTRADA, SALIDA, AJUSTE). |
| `/api/v1/inventario/alertas/stock-bajo` | GET | Listar productos con stock bajo (stock < stockMinimo). |
| `/api/v1/inventario/alertas/vencimiento` | GET | Listar productos próximos a vencer (próximos 30 días). |
| `/api/v1/inventario/productos/{id}/historial` | GET | Historial de movimientos de un producto. |
| `/api/v1/inventario/ajustar` | POST | Ajuste de inventario (diferencia entre físico y sistema). |
| `/api/v1/inventario/reporte` | GET | Reporte de inventario (valor total, productos activos, rotación). |

#### 3.2.2 Tipos de Movimiento

- **ENTRADA:** Compra de proveedor, ajuste positivo
- **SALIDA:** Venta, ajuste negativo, pérdida
- **AJUSTE:** Corrección de inventario físico
- **TRANSFERENCIA:** Movimiento entre ubicaciones (futuro)

#### 3.2.3 Funcionalidades

- **Actualización automática:** Stock se actualiza con cada venta/compra
- **Alertas proactivas:** Notificaciones de stock bajo y vencimientos
- **Trazabilidad:** Historial completo de movimientos
- **Validaciones:** No permite salidas si no hay stock suficiente
- **Reportes:** Valor de inventario, rotación, productos sin movimiento

---

### 3.3 Sistema de Promociones y Packs

#### 3.3.1 Endpoints de Promociones

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/promociones` | GET | Listar promociones activas (query `soloActivas`). |
| `/api/v1/promociones/{id}` | GET | Obtener promoción por ID. |
| `/api/v1/promociones` | POST | Crear promoción. |
| `/api/v1/promociones/{id}` | PUT | Actualizar promoción. |
| `/api/v1/promociones/{id}` | DELETE | Desactivar promoción. |
| `/api/v1/promociones/{id}/aplicar` | POST | Aplicar promoción a una venta (validación). |
| `/api/v1/promociones/productos/{productoId}` | GET | Promociones activas para un producto. |

#### 3.3.2 Endpoints de Packs

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/packs` | GET | Listar packs activos. |
| `/api/v1/packs/{id}` | GET | Obtener pack por ID con productos. |
| `/api/v1/packs` | POST | Crear pack (nombre, precio, productos con cantidades). |
| `/api/v1/packs/{id}` | PUT | Actualizar pack. |
| `/api/v1/packs/{id}` | DELETE | Desactivar pack. |
| `/api/v1/packs/{id}/calcular-precio` | GET | Calcular precio sugerido del pack. |

#### 3.3.3 Tipos de Promoción

- **DESCUENTO_PORCENTAJE:** Descuento del X% sobre el precio
- **DESCUENTO_MONTO:** Descuento fijo en soles
- **2X1, 3X2, etc.:** Promociones de cantidad
- **PACK:** Pack de productos con precio especial
- **CATEGORIA:** Descuento aplicado a toda una categoría
- **VOLUMEN:** Descuento por comprar X unidades

#### 3.3.4 Funcionalidades

- **Aplicación automática:** El sistema detecta promociones aplicables en la venta
- **Validación de fechas:** Solo aplica promociones dentro de rango de fechas
- **Cálculo de descuentos:** Calcula automáticamente el mejor descuento
- **Packs inteligentes:** Permite crear packs con múltiples productos
- **Historial:** Registra qué promociones se aplicaron en cada venta

---

### 3.4 Gestión de Proveedores y Compras

#### 3.4.1 Endpoints de Proveedores

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/proveedores` | GET | Listar proveedores con búsqueda y paginación. |
| `/api/v1/proveedores/{id}` | GET | Obtener proveedor por ID. |
| `/api/v1/proveedores` | POST | Crear proveedor. |
| `/api/v1/proveedores/{id}` | PUT | Actualizar proveedor. |
| `/api/v1/proveedores/{id}` | DELETE | Eliminar proveedor (solo si no tiene compras). |

#### 3.4.2 Endpoints de Compras

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/compras` | GET | Listar compras con filtros (proveedorId, fechaDesde, fechaHasta) y paginación. |
| `/api/v1/compras/{id}` | GET | Obtener compra por ID con detalles. |
| `/api/v1/compras` | POST | Registrar compra. Actualiza stock y precios. |
| `/api/v1/compras/{id}/anular` | PUT | Anular compra (solo ADMIN). Restaura stock. |
| `/api/v1/compras/reporte` | GET | Reporte de compras (total, cantidad, por proveedor). |

#### 3.4.3 DTO de Compra

```json
{
  "proveedorId": 1,
  "fechaCompra": "2025-01-20",
  "items": [
    {
      "productoId": 1,
      "cantidad": 24,
      "precioUnitario": 12.00
    }
  ],
  "total": 288.00,
  "observaciones": "Compra mensual"
}
```

#### 3.4.4 Funcionalidades

- **Actualización automática de stock:** Incrementa stock al registrar compra
- **Actualización de precios:** Opción de actualizar precio de compra/venta
- **Registro de movimientos:** Crea movimientos tipo "ENTRADA"
- **Historial de compras:** Registro completo de compras por proveedor
- **Validaciones:** No permite compras con productos inexistentes

---

### 3.5 Integración SUNAT (Envío y Consulta)

#### 3.5.1 Endpoints de Envío SUNAT

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/facturacion/comprobantes/{id}/enviar` | POST | Enviar comprobante a SUNAT vía OSE. |
| `/api/v1/facturacion/comprobantes/{id}/consultar` | GET | Consultar estado del comprobante en SUNAT. |
| `/api/v1/facturacion/comprobantes/{id}/reintentar` | POST | Reintentar envío fallido. |
| `/api/v1/facturacion/comprobantes/pendientes` | GET | Listar comprobantes pendientes de envío. |
| `/api/v1/facturacion/comprobantes/errores` | GET | Listar comprobantes con errores de envío. |

#### 3.5.2 Estados del Comprobante

- **PENDIENTE:** Generado pero no enviado
- **ENVIADO:** Enviado a SUNAT, esperando respuesta
- **ACEPTADO:** Aceptado por SUNAT
- **RECHAZADO:** Rechazado por SUNAT (con motivo)
- **ERROR:** Error en el envío (conexión, formato, etc.)

#### 3.5.3 Funcionalidades

- **Envío asíncrono:** Envío en segundo plano para no bloquear la venta
- **Reintentos automáticos:** Reintenta envíos fallidos (configurable: 3 intentos)
- **Manejo de errores:** Captura y registra errores de SUNAT
- **Consulta de estado:** Permite consultar estado de comprobantes enviados
- **Logs detallados:** Registra todos los intentos de envío y respuestas
- **Ambiente de pruebas:** Soporte para ambiente de pruebas de SUNAT

---

### 3.6 Integración de IA Básica

#### 3.6.1 Endpoints de Recomendaciones

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/ia/recomendaciones/productos/{productoId}` | GET | Obtener productos recomendados basados en producto actual (filtrado colaborativo básico). |
| `/api/v1/ia/recomendaciones/cliente/{clienteId}` | GET | Recomendaciones personalizadas para un cliente basadas en historial. |
| `/api/v1/ia/recomendaciones/venta` | POST | Recomendaciones durante una venta (productos complementarios). |
| `/api/v1/ia/prediccion/demanda/{productoId}` | GET | Predicción de demanda para un producto (próximos 7 días). |
| `/api/v1/ia/alertas/reposicion` | GET | Alertas inteligentes de productos que necesitan reposición. |
| `/api/v1/ia/sugerencias/promociones` | GET | Sugerencias de promociones basadas en patrones de venta. |

#### 3.6.2 Modelos de IA Implementados

**1. Recomendaciones de Productos (Filtrado Colaborativo Básico)**
- Analiza productos frecuentemente comprados juntos
- Basado en historial de ventas
- Algoritmo: "Productos que compraron X también compraron Y"

**2. Predicción de Demanda (Series Temporales Simplificado)**
- Predice demanda para próximos 7 días
- Basado en historial de ventas del producto
- Considera tendencias y estacionalidad básica

**3. Alertas de Reposición Inteligente**
- Identifica productos que necesitan reposición
- Considera velocidad de venta y tiempo de entrega
- Sugiere cantidad a comprar

**4. Sugerencias de Promociones**
- Analiza productos de baja rotación
- Sugiere promociones para productos estancados
- Identifica productos frecuentemente comprados juntos para packs

#### 3.6.3 Integración Python en Spring Boot

- **Servicio Python:** Scripts Python ejecutados desde Spring Boot
- **Comunicación:** JSON vía stdin/stdout o API REST interna
- **Modelos:** Modelos entrenados guardados en formato pickle/joblib
- **Cache:** Resultados cacheados en Redis para mejorar rendimiento
- **Fallback:** Si IA falla, sistema continúa funcionando sin recomendaciones

---

## 4. Migraciones de Base de Datos (Flyway)

### V4: Tablas de Ventas y Detalles
```sql
CREATE TABLE ventas (
    id BIGSERIAL PRIMARY KEY,
    numero_venta VARCHAR(20) UNIQUE NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    cliente_id BIGINT REFERENCES clientes(id),
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuesto DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    forma_pago VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'COMPLETADA',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_venta (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT NOT NULL REFERENCES ventas(id),
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL
);
```

### V5: Tablas de Inventario
```sql
CREATE TABLE movimiento_inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    tipo_movimiento VARCHAR(20) NOT NULL,
    cantidad INTEGER NOT NULL,
    motivo VARCHAR(100),
    usuario_id BIGINT REFERENCES usuarios(id),
    venta_id BIGINT REFERENCES ventas(id),
    compra_id BIGINT REFERENCES compras(id),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movimiento_producto ON movimiento_inventario(producto_id);
CREATE INDEX idx_movimiento_fecha ON movimiento_inventario(fecha);
```

### V6: Tablas de Promociones y Packs
```sql
CREATE TABLE promociones (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    descuento_porcentaje DECIMAL(5,2),
    descuento_monto DECIMAL(10,2),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promocion_producto (
    id BIGSERIAL PRIMARY KEY,
    promocion_id BIGINT NOT NULL REFERENCES promociones(id),
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    cantidad_minima INTEGER,
    cantidad_gratis INTEGER
);

CREATE TABLE packs (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_pack DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pack_producto (
    id BIGSERIAL PRIMARY KEY,
    pack_id BIGINT NOT NULL REFERENCES packs(id),
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL
);
```

### V7: Tablas de Proveedores y Compras
```sql
CREATE TABLE proveedores (
    id BIGSERIAL PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    ruc VARCHAR(11) UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compras (
    id BIGSERIAL PRIMARY KEY,
    numero_compra VARCHAR(20) UNIQUE NOT NULL,
    proveedor_id BIGINT NOT NULL REFERENCES proveedores(id),
    fecha_compra DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'COMPLETADA',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_compra (
    id BIGSERIAL PRIMARY KEY,
    compra_id BIGINT NOT NULL REFERENCES compras(id),
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);
```

---

## 5. Cómo ejecutar

### 5.1 Base de datos

Las migraciones se ejecutan automáticamente al iniciar la aplicación.

Para verificar migraciones:
```bash
psql -U licoreria_user -d licoreria_db -c "SELECT * FROM flyway_schema_history ORDER BY installed_rank;"
```

### 5.2 Backend

```bash
cd backend
./mvnw spring-boot:run
```

- API: `http://localhost:8080`  
- Swagger UI: `http://localhost:8080/swagger-ui.html`  
- API Docs: `http://localhost:8080/v3/api-docs`

### 5.3 Configuración de IA (Python)

1. Instalar dependencias Python:
```bash
cd backend/src/main/resources/ai
pip install -r requirements.txt
```

2. Entrenar modelos iniciales (opcional):
```bash
python train_models.py
```

3. Verificar que Spring Boot puede ejecutar scripts Python:
```bash
python --version  # Debe estar en PATH
```

### 5.4 Configuración SUNAT (OSE)

1. Configurar credenciales OSE en `application.properties`:
```properties
sunat.ose.url=https://ose.sunat.gob.pe
sunat.ose.usuario=tu_usuario
sunat.ose.password=tu_password
sunat.ose.ambiente=produccion  # o "pruebas"
```

2. Para ambiente de pruebas, usar:
```properties
sunat.ose.ambiente=pruebas
sunat.ose.url=https://ose.sunat.gob.pe/ol-ti-itcpfogem/billService
```

### 5.5 Probar flujo completo

1. **Login:**
   ```bash
   POST /api/v1/auth/login
   Body: {"username":"admin","password":"Admin123!"}
   ```

2. **Registrar compra (actualiza inventario):**
   ```bash
   POST /api/v1/compras
   Body: {
     "proveedorId": 1,
     "items": [{"productoId": 1, "cantidad": 10, "precioUnitario": 12.00}]
   }
   ```

3. **Crear venta:**
   ```bash
   POST /api/v1/ventas
   Body: {
     "clienteId": 1,
     "items": [{"productoId": 1, "cantidad": 2, "precioUnitario": 15.50}],
     "formaPago": "EFECTIVO"
   }
   ```

4. **Emitir comprobante:**
   ```bash
   POST /api/v1/facturacion/emitir-boleta
   Body: {"ventaId": 1, "clienteDni": "12345678", "clienteNombre": "Juan Pérez"}
   ```

5. **Enviar a SUNAT:**
   ```bash
   POST /api/v1/facturacion/comprobantes/1/enviar
   ```

6. **Consultar recomendaciones de IA:**
   ```bash
   GET /api/v1/ia/recomendaciones/productos/1
   ```

---

## 6. Próximos pasos (Sprint 4)

- Desarrollo frontend web (React)
- Interfaces principales (Dashboard, Productos, Inventario)
- Interfaz de punto de venta (web)
- Integración con APIs del backend

---

**Documento preparado por:** Equipo de Desarrollo  
**Versión:** 1.0
