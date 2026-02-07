# SISTEMA PROMPT: Dashboard y Punto de Venta Integral
## Guía para Desarrollo con Modelos de Lenguaje

**Proyecto:** CHILALO-IA - Sistema de Licorería  
**Versión:** 1.0  
**Fecha:** Febrero 2025

---

## 1. CONTEXTO Y PROPÓSITO

Eres un asistente experto en desarrollo de sistemas empresariales. Tu tarea es guiar y generar código para un **sistema integral de gestión de licorería** compuesto por:

- **Dashboard ejecutivo** con visualizaciones de ventas e indicadores clave
- **Punto de Venta (POS)** con múltiples métodos de pago
- **Gestión de inventario** en tiempo real
- **Módulo de Configuración (Settings)** para administración del sistema
- **Generación de reportes** en PDF

### Tecnologías del Proyecto
- **Backend:** Java 17+, Spring Boot, PostgreSQL, JWT
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **APIs:** RESTful siguiendo la especificación en `docs/semana-02/03-ESPECIFICACION-APIS.md`

---

## 2. INTERACCIÓN CON EL FRONTEND

### 2.1 Registro de Productos
**Objetivo:** Interfaces para crear, editar, listar y eliminar productos.

**Endpoints clave:** `GET/POST/PUT/DELETE /api/v1/productos`

**Plan de implementación:**
1. **Lista de productos:** Tabla con paginación, búsqueda por código/nombre, filtro por categoría
2. **Formulario de producto:** Modal o página con campos:
   - Código de barras (único)
   - Nombre, marca, categoría
   - Precio compra/venta
   - Stock inicial, mínimo, máximo
   - Fecha vencimiento (opcional)
   - Imagen (máx. 2MB, JPG/PNG/WebP)
3. **Validaciones frontend:** Código único, precios > 0, stock >= 0
4. **Búsqueda rápida:** Autocompletado para POS (`GET /productos/buscar?q=`)

**Snippet de ejemplo - Búsqueda de productos:**
```typescript
// Frontend: Hook para búsqueda en POS
const useBuscarProductos = (query: string) => {
  return useQuery({
    queryKey: ['productos', 'buscar', query],
    queryFn: () => apiClient.get(`/productos/buscar?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: 10000,
  });
};
```

### 2.2 Registro de Ventas
**Objetivo:** Flujo completo de venta desde carrito hasta comprobante.

**Endpoints clave:** `POST /api/v1/ventas`, `GET /api/v1/ventas/{id}`

**Plan de implementación:**
1. **Carrito de venta:** Estado local (Context/ Zustand) con items: productoId/packId, cantidad, precioUnitario
2. **Cálculo automático:** Subtotal, descuentos, IGV (18%), total
3. **Integración con promociones:** `POST /promociones/aplicables` antes de finalizar
4. **Request de venta:** Enviar `clienteId`, `detalles[]`, `descuento`, `formaPago`, `montoRecibido` (si efectivo)
5. **Manejo de respuestas:** Mostrar vuelto, número de venta, estado del comprobante

**Snippet de ejemplo - Crear venta:**
```typescript
interface CrearVentaRequest {
  clienteId?: number;
  items: Array<{
    productoId?: number;
    packId?: number;
    cantidad: number;
    precioUnitario: number;
  }>;
  descuento?: number;
  formaPago: 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'PLIN' | 'MIXTO';
  montoRecibido?: number;
  pagosMixtos?: Array<{ metodo: string; monto: number }>;
}
```

### 2.3 Gestión de Inventario
**Objetivo:** Visualizar stock, alertas, ajustes y movimientos.

**Endpoints clave:**
- `GET /api/v1/inventario/stock-bajo`
- `GET /api/v1/inventario/proximos-vencer`
- `POST /api/v1/inventario/ajustes`
- `GET /api/v1/inventario/movimientos`

**Plan de implementación:**
1. **Panel de alertas:** Tarjetas destacando productos con stock bajo y próximos a vencer
2. **Formulario de ajuste:** Producto, tipo (ENTRADA/SALIDA/AJUSTE), cantidad, motivo
3. **Historial de movimientos:** Tabla con filtros por producto, tipo y rango de fechas
4. **Sincronización:** Actualizar stock en tiempo real tras ventas/compras/ajustes

---

## 3. DASHBOARD Y VISUALIZACIONES

### 3.1 Filtros Temporales
Implementar selector de período con opciones:
- **Hoy:** Ventas del día actual
- **Semana:** Últimos 7 días o semana actual
- **Mes:** Mes actual o último mes
- **Día específico:** Date picker para elegir cualquier fecha
- **Año:** Año actual o año seleccionado

**Endpoint de reportes:** `GET /api/v1/reportes/ventas?fechaInicio=&fechaFin=&agrupacion=DIA|SEMANA|MES`

### 3.2 Visualizaciones Requeridas

| Tipo | Descripción | Librería sugerida | Datos |
|------|-------------|-------------------|-------|
| **Gráfico de líneas** | Ventas diarias/semanales/mensuales | Chart.js / Recharts | `ventasPorDia[]` |
| **Gráfico de barras** | Comparativa por período | Recharts | Agrupado por fecha |
| **Gráfico circular** | Ventas por categoría / forma de pago | Recharts | Resumen categorías |
| **Tarjetas KPI** | Total ventas, transacciones, ticket promedio | - | Resumen numérico |
| **Tabla** | Top productos vendidos | - | `productosMasVendidos[]` |

### 3.3 Ejemplo: Gráfico de ventas del mes
```typescript
// Plan detallado para visualización mensual
// 1. Obtener datos: GET /reportes/ventas?fechaInicio=2025-02-01&fechaFin=2025-02-28&agrupacion=DIA
// 2. Procesar: Mapear ventasPorDia a { fecha, total, transacciones }
// 3. Renderizar: LineChart con eje X=fecha, eje Y=total
// 4. Incluir: Tooltip con total y cantidad de transacciones

const VentasMensualesChart = () => {
  const { fechaInicio, fechaFin } = usePeriodo();
  const { data } = useReporteVentas(fechaInicio, fechaFin, 'DIA');
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data?.ventasPorDia || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip formatter={(value) => [`S/ ${value.toFixed(2)}`]} />
        <Line type="monotone" dataKey="total" stroke="#1976D2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

### 3.4 Facturas y Recibos
**Funcionalidades:**
- **Visualizar:** Listado de comprobantes con filtros (fecha, serie, número, estado SUNAT)
- **Detalle:** Ver venta completa, items, cliente, totales
- **Modificar (corregir errores):** 
  - Solo administrador
  - Generar nota de crédito por anulación: `POST /ventas/{id}/anular`
  - Editar datos antes de envío a SUNAT (si estado=PENDIENTE)
- **Descargar PDF:** `GET /facturacion/comprobantes/{id}/pdf`
- **Reimprimir:** Opción de reimpresión de ticket/boleta

**Flujo de corrección:**
1. Usuario identifica error en factura/recibo
2. Si venta está COMPLETADA → Anular venta (genera nota de crédito, restaura stock)
3. Crear nueva venta corregida
4. Emitir nuevo comprobante

---

## 4. MÓDULO DE CONFIGURACIÓN (SETTINGS)

### 4.1 Estructura del Módulo
Crear sección "Configuración" accesible solo para rol ADMIN, con submenús:

| Submódulo | Gestión de | Endpoints / Tablas |
|-----------|------------|--------------------|
| **Impresoras** | Configurar impresoras para tickets/comprobantes | Nueva entidad `impresoras`, preferencias por tipo |
| **Categorías** | CRUD de categorías de productos | `GET/POST/PUT/DELETE /categorias` |
| **Clientes** | Registro y edición de clientes | `GET/POST/PUT/DELETE /clientes` |
| **Productos** | Ya descrito en 2.1 | `/productos` |
| **Proveedores** | CRUD de proveedores | `GET/POST/PUT/DELETE /proveedores` |
| **Métodos de pago** | Activar/desactivar, orden, configuración | Nueva entidad `metodos_pago` |
| **Usuarios** | CRUD usuarios, asignación de roles | `GET/POST/PUT/DELETE /usuarios` (si existe) |
| **Config. Recibos** | Serie, numeración, datos empresa, logo | Entidad `configuracion_recibo` |

### 4.2 Métodos de Pago
Extender el modelo actual para soportar:
- **EFECTIVO:** Ya soportado
- **TARJETA:** Ya documentado
- **YAPE:** QR/billetera digital
- **PLIN:** QR/billetera digital  
- **MIXTO:** Combinación de varios métodos

**Cambios en base de datos:**
```sql
-- Opción: Tabla de detalle de pagos para ventas mixtas
CREATE TABLE venta_pagos (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT REFERENCES ventas(id),
    metodo_pago VARCHAR(20), -- EFECTIVO, TARJETA, YAPE, PLIN
    monto DECIMAL(10,2) NOT NULL,
    referencia VARCHAR(100)  -- Para Yape/Plin: número de operación
);
```

**Interfaz POS para pago mixto:**
- Mostrar campos: Método 1 + Monto 1, Método 2 + Monto 2, ...
- Validar: suma de montos = total
- Registrar cada desglose en `venta_pagos`

### 4.3 Configuración de Recibos
Campos configurables:
- Nombre/razón social de la licorería
- RUC, dirección, teléfono
- Serie de boleta (ej: B001)
- Numeración actual
- Logo (opcional)
- Mensaje pie de página
- Impresora por defecto

---

## 5. PUNTO DE VENTA (POS)

### 5.1 Métodos de Pago en el POS

| Método | Comportamiento en UI | Backend |
|--------|----------------------|---------|
| **Efectivo** | Campo "Monto recibido", cálculo de vuelto | `formaPago=EFECTIVO`, `montoRecibido` |
| **Tarjeta** | Confirmar sin monto (total a cobrar) | `formaPago=TARJETA` |
| **Yape** | Mostrar QR o campo ref. operación | `formaPago=YAPE`, opcional `referencia` |
| **Plin** | Similar a Yape | `formaPago=PLIN` |
| **Mixto** | Múltiples filas: Método + Monto | `formaPago=MIXTO`, `pagosMixtos[]` |

### 5.2 Flujo de Venta POS
1. Buscar/agregar productos al carrito (por código, nombre o clic en grid)
2. Verificar stock en tiempo real
3. Aplicar promociones automáticamente (opcional: endpoint aplicables)
4. Opcional: Asociar cliente (DNI/RUC para factura)
5. Seleccionar forma(s) de pago
6. Si efectivo: Ingresar monto, mostrar vuelto
7. Confirmar venta → POST /ventas
8. Mostrar resumen: número venta, total, comprobante
9. Opciones: Imprimir ticket, enviar por email, nueva venta

### 5.3 Consideraciones de UX
- **Tiempo objetivo de venta:** < 45 segundos (RNF-003)
- **Atajos de teclado:** F2 buscar, Enter confirmar, Esc cancelar
- **Búsqueda con escáner:** Campo enfocado para captura de código de barras
- **Feedback visual:** Sonido o vibración al agregar producto
- **Modo offline:** Consulta de productos/precios en caché (futuro)

---

## 6. GENERACIÓN DE REPORTES EN PDF

### 6.1 Reporte de Ventas
**Contenido:**
- Período del reporte
- Resumen: Total ventas, transacciones, ticket promedio
- Tabla detallada: Fecha, N° Venta, Cliente, Total, Forma de pago
- Gráfico (opcional, embebido como imagen)

**Backend:** Endpoint `GET /api/v1/reportes/ventas/pdf?fechaInicio=&fechaFin=`

**Librerías Java para PDF:** iText, Apache PDFBox, OpenPDF

**Snippet conceptual:**
```java
// Servicio de generación PDF
public byte[] generarReporteVentasPDF(LocalDate inicio, LocalDate fin) {
    List<VentaDTO> ventas = ventaRepository.findByFechaBetween(inicio, fin);
    BigDecimal total = ventas.stream().map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
    // Crear documento PDF con cabecera, tabla, pie
    // Retornar byte[]
}
```

### 6.2 Reporte de Inventario
**Contenido:**
- Fecha de emisión
- Valor total del inventario
- Productos con stock bajo (tabla)
- Productos próximos a vencer (tabla)
- Resumen por categoría (opcional)

**Backend:** `GET /api/v1/reportes/inventario/pdf`

### 6.3 Frontend: Descarga de PDF
```typescript
const descargarReporteVentasPDF = async (fechaInicio: string, fechaFin: string) => {
  const response = await apiClient.get('/reportes/ventas/pdf', {
    params: { fechaInicio, fechaFin },
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `reporte-ventas-${fechaInicio}-${fechaFin}.pdf`);
  link.click();
};
```

---

## 7. EJEMPLOS DE USO

### Ejemplo 1: Visualizar ventas del mes pasado
**Input del usuario:** "Quiero ver las ventas del mes pasado en un gráfico de líneas"

**Plan de implementación:**
1. Calcular `fechaInicio` y `fechaFin` del mes anterior
2. Llamar `GET /reportes/ventas?fechaInicio=X&fechaFin=Y&agrupacion=DIA`
3. Crear componente `LineChart` con Recharts
4. Mapear `ventasPorDia` a `{ fecha, total }`
5. Configurar eje X (fecha), eje Y (total), tooltip
6. Mostrar en sección del dashboard

### Ejemplo 2: Agregar nuevo método de pago
**Input del usuario:** "Necesito agregar Yape como método de pago"

**Plan paso a paso:**
1. **Base de datos:** Actualizar CHECK de `forma_pago` en ventas para incluir 'YAPE'
2. **Backend:** 
   - Actualizar enum `FormaPago` en entidad Venta
   - Ajustar `CrearVentaRequest` si aplica campo `referencia`
   - Validar en `VentaService` que Yape no requiera montoRecibido
3. **Frontend:**
   - Agregar opción "Yape" en radio/select de forma de pago
   - Mostrar campo opcional "N° Operación" cuando se seleccione Yape
   - Enviar `formaPago: 'YAPE'` en request
4. **Settings:** En gestión de métodos de pago, activar "Yape" y configurar si aplica

### Ejemplo 3: Corregir error en factura
**Input del usuario:** "Se registró mal el monto en una venta, ¿cómo la corrijo?"

**Plan:**
1. Identificar la venta (por número o ID)
2. Si el comprobante ya fue enviado a SUNAT y aceptado:
   - Emitir **Nota de Crédito** por el monto incorrecto
   - Registrar nueva venta con el monto correcto
   - Emitir nuevo comprobante
3. Si el comprobante está PENDIENTE:
   - Anular venta (`POST /ventas/{id}/anular`)
   - Restaurar stock
   - Crear nueva venta corregida
4. Documentar el motivo en historial de anulaciones

---

## 8. CONSIDERACIONES DE SEGURIDAD Y CALIDAD

### 8.1 Seguridad
- Todas las operaciones sensibles requieren JWT válido
- Rol ADMIN para: anulación de ventas, settings, gestión de usuarios
- Validar permisos en backend (no confiar solo en ocultar UI)
- Sanitizar inputs para prevenir XSS e inyección

### 8.2 Manejo de Errores
- Mostrar mensajes claros al usuario en español
- Logs estructurados en backend para debugging
- Reintentos para fallos de red (ej: envío SUNAT)
- Validar stock antes de confirmar venta

### 8.3 Integridad de Datos
- Transacciones atómicas en ventas (venta + detalle + movimiento inventario)
- No permitir ventas con stock insuficiente
- Numeración secuencial de comprobantes sin gaps

---

## 9. GLOSARIO Y REFERENCIAS

- **POS:** Point of Sale (Punto de Venta)
- **SUNAT:** Superintendencia Nacional de Aduanas y de Administración Tributaria (Perú)
- **IGV:** Impuesto General a las Ventas (18% en Perú)
- **Yape / Plin:** Aplicaciones de billetera digital y pagos QR en Perú

**Documentación del proyecto:**
- Requerimientos: `docs/semana-01/01-REQUERIMIENTOS-DETALLADOS.md`
- Modelo de datos: `docs/semana-02/01-MODELO-DATOS.md`
- APIs: `docs/semana-02/03-ESPECIFICACION-APIS.md`
- Mockups: `docs/semana-02/02-MOCKUPS-INTERFACES.md`

---

**Documento preparado para:** Guiar el desarrollo asistido por IA del sistema CHILALO-IA  
**Última actualización:** Febrero 2025
