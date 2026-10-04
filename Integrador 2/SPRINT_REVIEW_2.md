# SPRINT REVIEW — SPRINT 2
## Sistema Web y Aplicación Móvil – Licorería Chilalo Shot

---

## Información general del Sprint

| | |
|---|---|
| **Sprint** | Sprint 2 |
| **Objetivo del Sprint** | Meta condensada: operación diaria digital — POS web, facturación electrónica SUNAT (sandbox), inventario y compras, caja, gastos, devoluciones, crédito y clientes |
| **Período** | Semanas 5 al 9 (5 semanas) |
| **Fecha de la revisión** | Fin de semana 9 |
| **Responsable del proyecto** | Alumno desarrollador (practicante) |
| **Asistentes a la revisión** | Alumno desarrollador · Propietario de Chilalo Shot · Docente evaluador |

---

## 1. Objetivo del Sprint y resultado general

El objetivo del Sprint 2 (versión condensada para documentación) era cerrar la **operación diaria digital**: POS, SUNAT en pruebas, inventario y compras, caja y operaciones complementarias (devoluciones, crédito, clientes).

**Resultado general:** El objetivo se cumplió. Al cierre del sprint el vendedor puede completar una venta con varias formas de pago, emitir boleta o factura en ambiente de pruebas, y el stock se actualiza con cada operación. El administrador dispone de alertas de inventario, módulo de compras y proveedores, cierre de caja y registro de gastos, además de devoluciones y ventas al crédito con seguimiento de cobranza.

---

## 2. Elementos del backlog planificados para este Sprint

| # | Historia de usuario / Tarea | Estado | Observaciones |
|---|---|:---:|---|
| 1 | POS web: búsqueda de productos, carrito, descuentos y formas de pago | ✅ Completado | Incluye efectivo, tarjeta, Yape, Plin, transferencia, mixto y crédito |
| 2 | POS: cálculo de vuelto e historial de ventas con filtros | ✅ Completado | |
| 3 | Integración SUNAT (sandbox): emisión boletas y facturas electrónicas | ✅ Completado | XML/PDF y envío según flujo OSE |
| 4 | Resumen diario de boletas (RCB) | ✅ Completado | |
| 5 | Descuento automático de stock por venta | ✅ Completado | |
| 6 | Alertas de stock bajo y de vencimiento | ✅ Completado | |
| 7 | Movimientos de inventario (entrada, salida, ajuste) | ✅ Completado | |
| 8 | Órdenes de compra y recepción de mercadería | ✅ Completado | |
| 9 | Gestión de proveedores | ✅ Completado | |
| 10 | Mermas con ajuste de stock | ✅ Completado | |
| 11 | Apertura y cierre de caja | ✅ Completado | |
| 12 | Gastos operativos por categoría | ✅ Completado | |
| 13 | Devoluciones y restauración de stock | ✅ Completado | |
| 14 | Cuentas por cobrar (crédito/fiado) y pagos | ✅ Completado | |
| 15 | Registro de clientes vinculado a ventas | ✅ Completado | |
| 16 | Stock visible en listado de productos / POS | ✅ Completado | Pedido del cliente en Sprint 1 |

En el **Excel del Sprint Review** el desglose técnico consta de **23 tareas** (T0201–T0223) agrupadas en **4 historias de usuario (HU-06 a HU-09)**.

**Total planificado (tabla Excel):** 23 tareas  
**Total completado:** 23  
**Porcentaje de avance:** 100%

---

## 3. Demostración (resumen)

Se mostró al propietario el flujo completo: venta en POS → descuento de inventario → emisión de boleta o factura → consulta de historial. También las alertas de inventario, una orden de compra recibida, cierre de caja del día y un caso de venta al crédito con registro de pago parcial.

---

## 4. Métricas del Sprint

| Indicador | Valor |
|---|---|
| Tareas / historias completadas | 16 |
| Porcentaje de cumplimiento | 100% |
| Horas estimadas de trabajo | ~100 h |

---

## 5. Incidentes destacados

Posibles temas típicos: ajustes en la integración con el ambiente de pruebas de SUNAT/OSE, o validación de series y correlativos. Documentar el incidente real en la versión final entregada al instituto.

---

## 6. Feedback del cliente y backlog Sprint 3

Feedback orientado a promociones, reportes, fidelización e IA según **PLANIFICACION_SPRINTS.md**.

---

## 7. Retrospectiva del Sprint (reflexión interna del equipo)

Como en el Sprint 1, la retrospectiva se realiza de forma individual como ejercicio de mejora continua.

### ¿Qué salió bien?
- Se cumplió el objetivo: operación digital con POS, descuento automático de stock y emisión de boletas/facturas en ambiente de pruebas SUNAT.
- La base del Sprint 1 (entidades, JWT, Flyway, arquitectura en capas) facilitó la lógica de ventas e inventario sin rediseñar el modelo.
- Inventario integrado con alertas, movimientos, compras, proveedores y mermas; módulos complementarios (caja, gastos, devoluciones, crédito, clientes) cerraron el ciclo operativo planificado.
- La demo al propietario mostró flujo extremo a extremo: venta → inventario → comprobante → cierre de caja y crédito con pago parcial.

### ¿Qué se puede mejorar?
- La integración SUNAT/OSE en pruebas exigió iteraciones (series, correlativos, XML); conviene documentar incidencias y soluciones para no repetir diagnósticos.
- El pago **mixto** y casos borde consumieron más tiempo del estimado; la UX y validaciones frontend/backend fueron más complejas de lo previsto.
- Poco margen para nuevas pruebas automatizadas: el tiempo se priorizó en funcionalidad y validación con el cliente.
- Historias muy anchas (POS completo, facturación) habrían ganado con desglose en subtareas visibles día a día.

### Acciones para el Sprint 3
- Dividir antes del sprint las historias complejas (promociones, fidelización, reportes, IA) en tareas pequeñas con criterios de aceptación claros.
- Reservar colchón para integraciones externas (SUNAT en certificación, IA, app Android) y pruebas en dispositivo real.
- Avanzar tests en servicios críticos del backend para no acumular deuda antes del cierre del proyecto.
- Coordinar con anticipación la revisión con el cliente de promociones, reportes y app Android.

---

## 8. Elementos a llevar al Sprint 3 (backlog actualizado)

| # | Elemento | Origen |
|---|---|---|
| 1 | Promociones y packs con aplicación en POS | Planificación Sprint 3 |
| 2 | Clientes, puntos y canje (fidelización) | Planificación Sprint 3 |
| 3 | Reportes, dashboard y exportación PDF/Excel | Planificación Sprint 3 |
| 4 | Módulo de inteligencia artificial | Planificación Sprint 3 |
| 5 | Aplicación Android (POS e inventario) | Planificación Sprint 3 |
| 6 | Integración final, pruebas y despliegue | Planificación Sprint 3 |

---

## 9. Conclusión del Sprint 2

El segundo sprint cerró de manera acorde al plan: el sistema permite la operación diaria de la licorería con POS, facturación electrónica en pruebas y control de inventario y finanzas operativas. La retrospectiva deja acciones concretas para abordar el Sprint 3, concentrado en valor agregado, integraciones y cierre del proyecto.

---

*Sprint Review elaborado como parte del Trabajo Académico Aplicado (TAA).*  
*Instituto de Educación Superior – Piura, Perú.*
