# ESPECIFICACIÓN DE APIs (OpenAPI/Swagger)
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** 1.0  
**Fecha:** Enero 2025  
**Semana:** 2

---

## 1. INFORMACIÓN GENERAL

### 1.1 Base URL
```
Producción: https://api.licoreria-piura.com/api/v1
Desarrollo: http://localhost:8080/api/v1
```

### 1.2 Autenticación
Todas las APIs (excepto login) requieren autenticación mediante JWT Bearer Token.

**Header requerido:**
```
Authorization: Bearer {access_token}
```

### 1.3 Formato de Respuesta
Todas las respuestas siguen el formato estándar:

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje de error",
    "details": { ... }
  }
}
```

---

## 2. ENDPOINTS DE AUTENTICACIÓN

### 2.1 POST /auth/login
Autenticación de usuario.

**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@licoreria.local",
      "nombre": "Administrador",
      "rol": "ADMIN"
    }
  }
}
```

### 2.2 POST /auth/refresh
Renovar token de acceso.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 2.3 POST /auth/logout
Cerrar sesión.

**Response 200:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

## 3. ENDPOINTS DE PRODUCTOS

### 3.1 GET /productos
Obtener lista de productos (con paginación y filtros).

**Query Parameters:**
- `page` (int, default: 0): Número de página
- `size` (int, default: 20): Tamaño de página
- `search` (string, optional): Búsqueda por nombre o código
- `categoriaId` (long, optional): Filtrar por categoría
- `activo` (boolean, optional): Filtrar por estado activo
- `stockBajo` (boolean, optional): Solo productos con stock bajo

**Response 200:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "codigoBarras": "7790310123456",
        "nombre": "Cerveza Pilsen",
        "marca": "Backus",
        "categoria": {
          "id": 1,
          "nombre": "Cervezas"
        },
        "precioCompra": 3.50,
        "precioVenta": 4.00,
        "stockActual": 20,
        "stockMinimo": 15,
        "stockMaximo": 100,
        "fechaVencimiento": null,
        "imagen": "/images/productos/1.jpg",
        "activo": true
      }
    ],
    "totalElements": 245,
    "totalPages": 13,
    "currentPage": 0,
    "size": 20
  }
}
```

### 3.2 GET /productos/{id}
Obtener producto por ID.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "codigoBarras": "7790310123456",
    "nombre": "Cerveza Pilsen",
    ...
  }
}
```

### 3.3 POST /productos
Crear nuevo producto.

**Request:**
```json
{
  "codigoBarras": "7790310123456",
  "nombre": "Cerveza Pilsen",
  "marca": "Backus",
  "categoriaId": 1,
  "precioCompra": 3.50,
  "precioVenta": 4.00,
  "stockInicial": 20,
  "stockMinimo": 15,
  "stockMaximo": 100,
  "fechaVencimiento": null
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    ...
  },
  "message": "Producto creado exitosamente"
}
```

### 3.4 PUT /productos/{id}
Actualizar producto.

**Request:** (mismo formato que POST)

**Response 200:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Producto actualizado exitosamente"
}
```

### 3.5 DELETE /productos/{id}
Eliminar producto (eliminación lógica).

**Response 200:**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

### 3.6 GET /productos/buscar
Búsqueda rápida de productos (para POS).

**Query Parameters:**
- `q` (string, required): Término de búsqueda (código o nombre)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigoBarras": "7790310123456",
      "nombre": "Cerveza Pilsen",
      "precioVenta": 4.00,
      "stockActual": 20,
      "imagen": "/images/productos/1.jpg"
    }
  ]
}
```

---

## 4. ENDPOINTS DE VENTAS

### 4.1 POST /ventas
Crear nueva venta.

**Request:**
```json
{
  "clienteId": 1,
  "detalles": [
    {
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 4.00
    },
    {
      "productoId": 5,
      "cantidad": 1,
      "precioUnitario": 45.00
    }
  ],
  "descuento": 0,
  "formaPago": "EFECTIVO",
  "montoRecibido": 60.00
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "numeroVenta": "VENT-20250115-0001",
    "fecha": "2025-01-15T10:30:00",
    "subtotal": 53.00,
    "descuento": 0,
    "impuesto": 9.54,
    "total": 62.54,
    "vuelto": 0,
    "comprobante": {
      "id": 456,
      "serie": "B001",
      "numero": "000001",
      "estadoSunat": "PENDIENTE"
    }
  },
  "message": "Venta registrada exitosamente"
}
```

### 4.2 GET /ventas
Obtener lista de ventas.

**Query Parameters:**
- `page`, `size`: Paginación
- `fechaInicio` (date): Fecha inicio
- `fechaFin` (date): Fecha fin
- `usuarioId` (long): Filtrar por vendedor
- `clienteId` (long): Filtrar por cliente

**Response 200:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 123,
        "numeroVenta": "VENT-20250115-0001",
        "fecha": "2025-01-15T10:30:00",
        "vendedor": {
          "id": 1,
          "nombre": "Administrador"
        },
        "cliente": {
          "id": 1,
          "nombre": "Juan Pérez"
        },
        "total": 62.54,
        "formaPago": "EFECTIVO",
        "estado": "COMPLETADA"
      }
    ],
    "totalElements": 125,
    ...
  }
}
```

### 4.3 GET /ventas/{id}
Obtener venta por ID con detalles.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "numeroVenta": "VENT-20250115-0001",
    "fecha": "2025-01-15T10:30:00",
    "detalles": [
      {
        "id": 1,
        "producto": {
          "id": 1,
          "nombre": "Cerveza Pilsen"
        },
        "cantidad": 2,
        "precioUnitario": 4.00,
        "subtotal": 8.00
      }
    ],
    "subtotal": 53.00,
    "total": 62.54,
    ...
  }
}
```

### 4.4 POST /ventas/{id}/anular
Anular venta.

**Request:**
```json
{
  "motivo": "Error en la venta"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Venta anulada exitosamente"
}
```

---

## 5. ENDPOINTS DE INVENTARIO

### 5.1 GET /inventario/stock-bajo
Obtener productos con stock bajo.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Cerveza Pilsen",
      "stockActual": 5,
      "stockMinimo": 15,
      "faltante": 10
    }
  ]
}
```

### 5.2 GET /inventario/proximos-vencer
Obtener productos próximos a vencer.

**Query Parameters:**
- `dias` (int, default: 7): Días de anticipación

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Cerveza Pilsen",
      "stockActual": 20,
      "fechaVencimiento": "2025-01-20",
      "diasRestantes": 5
    }
  ]
}
```

### 5.3 POST /inventario/ajustes
Registrar ajuste de inventario.

**Request:**
```json
{
  "productoId": 1,
  "tipoMovimiento": "ENTRADA",
  "cantidad": 10,
  "motivo": "Ajuste de inventario"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "producto": { ... },
    "tipoMovimiento": "ENTRADA",
    "cantidad": 10,
    "fecha": "2025-01-15T10:30:00"
  },
  "message": "Ajuste registrado exitosamente"
}
```

### 5.4 GET /inventario/movimientos
Obtener historial de movimientos.

**Query Parameters:**
- `page`, `size`: Paginación
- `productoId` (long): Filtrar por producto
- `tipoMovimiento` (string): ENTRADA, SALIDA, AJUSTE
- `fechaInicio`, `fechaFin`: Rango de fechas

---

## 6. ENDPOINTS DE FACTURACIÓN

### 6.1 POST /facturacion/emitir-boleta
Emitir boleta electrónica.

**Request:**
```json
{
  "ventaId": 123,
  "cliente": {
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "nombre": "Juan Pérez"
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "serie": "B001",
    "numero": "000001",
    "estadoSunat": "ACEPTADO",
    "xmlUrl": "/comprobantes/456.xml",
    "pdfUrl": "/comprobantes/456.pdf"
  },
  "message": "Boleta emitida exitosamente"
}
```

### 6.2 POST /facturacion/emitir-factura
Emitir factura electrónica.

**Request:**
```json
{
  "ventaId": 123,
  "cliente": {
    "tipoDocumento": "RUC",
    "numeroDocumento": "20100070970",
    "razonSocial": "EMPRESA SAC"
  }
}
```

### 6.3 GET /facturacion/comprobantes/{id}
Obtener comprobante por ID.

### 6.4 GET /facturacion/comprobantes/{id}/pdf
Descargar PDF del comprobante.

---

## 7. ENDPOINTS DE PROMOCIONES

### 7.1 GET /promociones
Obtener lista de promociones activas.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Pack Fiesta",
      "tipo": "PACK",
      "precioPack": 25.00,
      "productos": [
        {
          "producto": { ... },
          "cantidad": 6
        }
      ],
      "activa": true
    }
  ]
}
```

### 7.2 POST /promociones
Crear nueva promoción.

**Request:**
```json
{
  "nombre": "2x1 en Cervezas",
  "tipo": "CANTIDAD",
  "fechaInicio": "2025-01-15T00:00:00",
  "fechaFin": "2025-01-31T23:59:59",
  "productos": [
    {
      "productoId": 1,
      "cantidadMinima": 2,
      "cantidadGratis": 1
    }
  ]
}
```

### 7.3 GET /promociones/aplicables
Obtener promociones aplicables para productos en carrito.

**Request Body:**
```json
{
  "productos": [
    {
      "productoId": 1,
      "cantidad": 2
    }
  ]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "2x1 en Cervezas",
      "descuento": 4.00,
      "aplicable": true
    }
  ]
}
```

---

## 8. ENDPOINTS DE REPORTES

### 8.1 GET /reportes/ventas
Reporte de ventas.

**Query Parameters:**
- `fechaInicio`, `fechaFin`: Rango de fechas
- `agrupacion` (string): DIA, SEMANA, MES

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalVentas": 8500.00,
    "totalTransacciones": 125,
    "ticketPromedio": 68.00,
    "ventasPorDia": [
      {
        "fecha": "2025-01-15",
        "total": 1250.00,
        "transacciones": 18
      }
    ]
  }
}
```

### 8.2 GET /reportes/productos-mas-vendidos
Top productos más vendidos.

**Query Parameters:**
- `fechaInicio`, `fechaFin`
- `limite` (int, default: 10)

### 8.3 GET /reportes/inventario
Reporte de inventario.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "valorTotalInventario": 125000.00,
    "productosActivos": 245,
    "productosStockBajo": 12,
    "productosProximosVencer": 3
  }
}
```

---

## 9. ENDPOINTS DE INTELIGENCIA ARTIFICIAL

### 9.1 POST /ia/recomendaciones
Obtener recomendaciones de productos.

**Request:**
```json
{
  "productoId": 1,
  "clienteId": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "recomendaciones": [
      {
        "producto": { ... },
        "confianza": 0.85,
        "razon": "Productos frecuentemente comprados juntos"
      }
    ]
  }
}
```

### 9.2 GET /ia/prediccion-demanda
Predicción de demanda de productos.

**Query Parameters:**
- `dias` (int, default: 7): Días a predecir

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "producto": { ... },
      "prediccionVentas": 45,
      "probabilidadAgotamiento": 0.75,
      "diasHastaAgotamiento": 3,
      "sugerenciaCompra": 50
    }
  ]
}
```

### 9.3 GET /ia/sugerencias-promociones
Sugerencias de promociones basadas en IA.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "sugerencias": [
      {
        "tipo": "PACK",
        "nombre": "Pack Fiesta",
        "productos": [ ... ],
        "precioSugerido": 25.00,
        "confianza": 0.82,
        "razon": "Productos frecuentemente comprados juntos"
      }
    ]
  }
}
```

---

## 10. CÓDIGOS DE ERROR

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: código duplicado) |
| 422 | Unprocessable Entity - Error de validación |
| 500 | Internal Server Error - Error del servidor |

---

## 11. EJEMPLOS DE USO

### 11.1 Flujo Completo de Venta

```javascript
// 1. Buscar producto
GET /api/v1/productos/buscar?q=7790310123456

// 2. Agregar al carrito (cliente)
// 3. Verificar promociones aplicables
POST /api/v1/promociones/aplicables
Body: { "productos": [...] }

// 4. Crear venta
POST /api/v1/ventas
Body: { ... }

// 5. Emitir boleta
POST /api/v1/facturacion/emitir-boleta
Body: { "ventaId": 123, ... }
```

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha de creación:** Enero 2025  
**Versión:** 1.0
