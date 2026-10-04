# MAPA DE PROCESO OPERATIVO: REALIZAR VENTA EN POS

**Proyecto:** Chilalo Shot / PIDS3 – Sistema Gestión Integral de Licorería  
**Proceso:** P3 – Realizar venta en punto de venta (POS)  
**Versión:** 1.0  
**Fecha:** Febrero 2025

---

## 1. PROPÓSITO

Permitir al vendedor (o dueño) registrar una venta de forma rápida y precisa: seleccionar productos, aplicar promociones automáticas, registrar forma de pago y entregar comprobante (ticket y/o boleta/factura electrónica) al cliente, reduciendo el tiempo de atención y los errores de cálculo.

**Objetivo de tiempo:** 30–45 segundos por venta.

---

## 2. ALCANCE

- **Actor principal:** Vendedor / Empleado (o Dueño/Administrador).
- **Participantes:** Cliente (recibe productos y comprobantes), Sistema (POS, inventario, promociones, IA, SUNAT).
- **Incluye:** Búsqueda de productos, carrito, promociones/packs, pago, comprobante electrónico opcional, actualización de inventario, recomendaciones IA opcionales.
- **Excepciones documentadas:** Producto sin stock, error/conexión SUNAT, pago insuficiente.

---

## 3. DIAGRAMA DEL PROCESO OPERATIVO

El flujo detallado está en **PlantUML** (diagrama de actividades con pistas Vendedor/Sistema):

**Archivo:** `docs/MAPA_PROCESO_OPERATIVO_REALIZAR_VENTA.puml`

Abrir en [plantuml.com](https://www.plantuml.com/plantuml/uml) o con cualquier visor/plugin PlantUML para ver el diagrama completo.

---

## 4. ETAPAS DEL PROCESO (RESUMEN)

| # | Etapa | Responsable | Descripción |
|---|--------|-------------|-------------|
| 1 | Inicio de venta | Vendedor | Iniciar nueva venta en POS. Sistema prepara carrito y búsqueda. |
| 2 | Armado del carrito | Vendedor + Sistema | Buscar producto (código, nombre, categoría); solicitar agregar con cantidad. Sistema valida stock, agrega ítem, aplica promociones/packs, calcula totales y opcionalmente muestra recomendaciones IA. Si no hay stock, muestra alerta y no agrega. |
| 3 | Cierre del carrito | Vendedor | Decidir si agrega más productos o continúa al pago. |
| 4 | Registro de pago | Vendedor + Sistema | Registrar forma de pago (efectivo, tarjeta, transferencia, mixto). Si es efectivo, ingresar monto recibido; sistema calcula y muestra vuelto. |
| 5 | Comprobante electrónico (opcional) | Vendedor + Sistema | Si el cliente requiere boleta/factura: vendedor registra DNI o RUC y nombre. Sistema genera comprobante, envía a SUNAT vía OSE, almacena CDR y genera PDF. Si no hay conexión o hay error, venta se guarda y comprobante se encola para reintento posterior. |
| 6 | Cierre de la venta | Sistema | Registrar venta, actualizar stock, registrar movimientos de inventario, imprimir/mostrar ticket. Si se emitió comprobante electrónico, poner PDF a disposición. |

---

## 5. ENTRADAS Y SALIDAS

| Tipo | Elemento |
|------|----------|
| **Entradas** | Usuario autenticado (vendedor); productos buscados y cantidades; forma de pago y monto recibido (si aplica); datos del cliente para comprobante (DNI/RUC, nombre) si aplica. |
| **Salidas** | Venta registrada; stock actualizado; movimientos de inventario; ticket de venta; boleta o factura electrónica (y PDF) si aplica; puntos de fidelización para el cliente si aplica. |

---

## 6. EXCEPCIONES Y REGLAS DE NEGOCIO

| Situación | Comportamiento |
|-----------|----------------|
| **Producto sin stock suficiente** | Sistema muestra alerta y no permite agregar al carrito. |
| **Pago insuficiente** | Sistema no confirma la venta; debe indicar monto faltante o permitir cambiar forma de pago/monto. |
| **Error o falta de conexión con SUNAT** | Sistema guarda la venta y deja el comprobante en cola; se reintenta el envío al recuperar conexión; se entrega ticket de venta. |
| **Modo offline** | Ventas se almacenan localmente; comprobantes electrónicos se emiten cuando haya conexión. |

---

## 7. RELACIÓN CON OTROS PROCESOS

- **P4 (Gestionar inventario):** Se actualiza el stock y se registran movimientos con cada venta.
- **P5 (Emitir comprobantes electrónicos):** Se dispara desde este proceso cuando el cliente requiere boleta/factura.
- **P7 (Promociones y packs):** El sistema aplica automáticamente las reglas vigentes en el carrito.
- **P8 (Clientes y fidelización):** Se puede asociar cliente a la venta y acumular/canjear puntos.
- **P10 (IA):** Opcionalmente se muestran recomendaciones de productos durante el armado del carrito.

---

## 8. REFERENCIAS

- FICHA_03 – CUN "Realizar venta en punto de venta (POS)".
- Requerimientos detallados (semana-01) – RF-009 a RF-012, Caso de uso "Realizar Venta Rápida".
- MAPA_PROCESOS_PROYECTO.md – Proceso P3.

---

**Documento elaborado por:** Equipo de Desarrollo – Proyecto Chilalo Shot  
**Versión:** 1.0
