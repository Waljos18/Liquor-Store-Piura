# PLANIFICACIÓN DE SPRINTS DEL PROYECTO
## Sistema Web y Aplicación Móvil – Licorería Chilalo Shot

**Metodología:** Scrum (Ágil)
**Duración total:** 14 semanas
**Número de sprints:** 3
**Equipo:** 1 alumno desarrollador (practicante)

---

## Distribución general del tiempo

| Sprint | Semanas | Duración | Enfoque principal |
|--------|---------|----------|-------------------|
| Sprint 1 | Semanas 1 – 4 | 4 semanas | Base del sistema: productos, usuarios y arquitectura |
| Sprint 2 | Semanas 5 – 9 | 5 semanas | Operaciones del negocio: ventas, inventario y facturación |
| Sprint 3 | Semanas 10 – 14 | 5 semanas | Funciones avanzadas: promociones, reportes, IA y app Android |

---

## SPRINT 1 — Base del sistema
**Semanas 1 al 4**
**Objetivo:** Dejar lista la estructura base del sistema: base de datos, autenticación, gestión de productos y la configuración general, de modo que en el Sprint 2 ya se pueda construir todo lo relacionado a ventas e inventario sin contratiempos.

### Actividades del Sprint

#### Semana 1–2: Análisis y diseño
- Levantamiento de requerimientos con el cliente (propietario de Chilalo Shot)
- Diseño del modelo de base de datos (diagrama entidad-relación)
- Definición de la arquitectura del sistema (backend REST + frontend React + Android)
- Diseño de mockups de las interfaces principales (POS, inventario, dashboard)
- Configuración del repositorio y entornos de desarrollo

#### Semana 3–4: Desarrollo — Módulo base
- **Gestión de productos:** registro, edición y eliminación de productos con nombre, precio de compra y venta, categoría, código de barras, stock mínimo y máximo, fecha de vencimiento e imagen
- **Gestión de categorías:** registro y organización de categorías de productos
- **Administración de usuarios:** creación de usuarios con roles Administrador y Vendedor, autenticación con JWT, recuperación de contraseña por correo
- **Configuración del sistema:** parámetros generales de la empresa y del sistema de facturación
- **Base de datos:** migraciones iniciales con Flyway (tablas de productos, categorías, usuarios)

### Entregable al final del Sprint 1
Sistema web con login seguro, gestión completa de productos y categorías, y administración de usuarios con roles. El cliente puede ingresar al sistema, registrar todos sus productos y configurar su negocio.

### Criterios de aceptación
- [ ] El login funciona correctamente con los roles Administrador y Vendedor
- [ ] Se pueden crear, editar y desactivar productos con todos sus campos
- [ ] Las categorías se gestionan correctamente y se asocian a los productos
- [ ] La base de datos está creada y las migraciones corren sin errores
- [ ] El sistema corre localmente y está listo para ser mostrado al cliente

---

## SPRINT 2 — Operaciones principales del negocio
**Semanas 5 al 9**
**Objetivo:** Implementar los módulos más importantes para el día a día del negocio: el punto de venta, la facturación electrónica con SUNAT y el control de inventario. Al terminar este sprint, el negocio ya puede operar digitalmente.

### Actividades del Sprint

#### Semana 5–6: Punto de venta y facturación
- **Punto de venta (POS) web:**
  - Búsqueda rápida de productos por nombre o código de barras
  - Carrito de compra con edición de cantidades y aplicación de descuentos
  - Múltiples formas de pago: Efectivo, Tarjeta, Yape, Plin, Transferencia, Mixto y Crédito/Fiado
  - Cálculo automático del vuelto
  - Historial de ventas con filtros por fecha, forma de pago y estado
- **Facturación electrónica:**
  - Integración con la API de SUNAT (ambiente de pruebas)
  - Emisión de boletas electrónicas (B001)
  - Emisión de facturas electrónicas (F001)
  - Generación de XML y PDF del comprobante
  - Resumen diario de boletas (RCB)

#### Semana 7–8: Control de inventario
- **Actualización automática de stock** con cada venta registrada
- **Alertas de stock bajo:** notificaciones cuando un producto baja del stock mínimo
- **Alertas de vencimiento:** notificaciones de productos próximos a vencer (7 días)
- **Movimientos de inventario:** registro manual de entradas, salidas y ajustes con motivo
- **Gestión de compras:** registro de órdenes de compra a proveedores, recepción total o parcial de mercadería
- **Gestión de proveedores:** registro con datos de contacto y productos que suministra
- **Mermas:** registro de productos dañados o vencidos con descuento automático del stock

#### Semana 9: Módulos complementarios
- **Apertura y cierre de caja:** registro del monto inicial, cierre con cuadre de efectivo y detección de sobrantes o faltantes
- **Gastos operativos:** registro de gastos del negocio por categoría (alquiler, servicios, etc.)
- **Devoluciones:** registro de productos devueltos por el cliente con restauración del stock
- **Cuentas por cobrar:** seguimiento de ventas al crédito y registro de pagos
- **Registro de clientes:** datos básicos de clientes para vincular a ventas

### Entregable al final del Sprint 2
Sistema web completamente operativo para el negocio: el vendedor puede hacer ventas, emitir boletas y facturas electrónicas, y el administrador tiene control total del inventario, caja, compras y gastos. Es posible operar el negocio en su totalidad con este sprint.

### Criterios de aceptación
- [ ] Una venta completa (productos + pago + comprobante) se registra en menos de 45 segundos
- [ ] Las boletas y facturas electrónicas se emiten correctamente en el ambiente de pruebas de SUNAT
- [ ] El stock se descuenta automáticamente al registrar una venta
- [ ] Las alertas de stock bajo y vencimiento aparecen correctamente
- [ ] El cierre de caja muestra el resumen correcto de ventas y efectivo
- [ ] Las compras actualizan el inventario al recibirlas

---

## SPRINT 3 — Funcionalidades avanzadas, IA y app Android
**Semanas 10 al 14**
**Objetivo:** Completar el sistema con las funciones que le dan valor agregado al negocio: promociones, programa de fidelización, reportes con analytics, módulo de inteligencia artificial y la aplicación Android. Este sprint también incluye las pruebas finales y la puesta en producción.

### Actividades del Sprint

#### Semana 10–11: Promociones, fidelización y app Android
- **Promociones y packs:**
  - Creación de packs de productos (ej: "pack de 6 cervezas")
  - Descuentos por porcentaje, monto fijo o volumen
  - Promociones temporales con fecha de inicio y fin
  - Promociones por categoría
  - Aplicación automática de promociones en el POS al agregar productos
- **Clientes y fidelización:**
  - Registro completo de clientes con historial de compras
  - Sistema de puntos: acumulación automática por monto de venta (ej: 1 punto cada S/. 5)
  - Canje de puntos como descuento en la siguiente compra
  - Panel de configuración de las reglas de fidelización
- **Aplicación Android:**
  - Login y autenticación
  - Dashboard con KPIs del negocio (ventas del día, stock bajo, etc.)
  - POS móvil: búsqueda de productos, carrito, formas de pago y confirmar venta
  - Gestión de inventario: consulta de stock, alertas y movimientos
  - Historial de ventas con detalle y emisión de comprobante

#### Semana 12: Reportes y analytics + Inteligencia Artificial
- **Reportes y dashboard:**
  - Dashboard ejecutivo con ventas del día, semana y mes
  - Reporte de ventas con filtros por fecha, forma de pago y vendedor
  - Reporte de inventario con productos con stock bajo y valor total del stock
  - Reporte de rentabilidad: ganancias brutas y netas (descontando gastos)
  - Gráficos de ventas por categoría, por día y por forma de pago
  - Exportación de reportes en PDF y Excel
- **Inteligencia artificial:**
  - Recomendaciones de reabastecimiento basadas en el historial de ventas
  - Predicción de demanda: qué productos se venden más en ciertos días u horarios
  - Sugerencias de promociones basadas en patrones de compra
  - Análisis de productos con mayor rotación y menor rotación
  - Asistente virtual (chatbot) para consultas básicas del negocio

#### Semana 13–14: Integración final, pruebas y despliegue
- **Integraciones:**
  - Integración con lectores de código de barras (entrada manual o por escáner USB)
  - Configuración para impresoras térmicas (impresión de tickets de venta)
- **Pruebas:**
  - Pruebas funcionales de todos los módulos
  - Pruebas de integración con SUNAT en producción
  - Pruebas de la app Android en dispositivo físico
  - Corrección de errores encontrados
- **Despliegue y entrega:**
  - Configuración del servidor de producción (nube)
  - Migración y carga inicial de datos reales del negocio (productos, precios, categorías)
  - Capacitación al propietario y vendedor (mínimo 1 hora práctica)
  - Entrega de manual de usuario básico

### Entregable al final del Sprint 3
Sistema completo en producción: el negocio puede operar con el sistema web y la app Android desde el primer día. El propietario tiene acceso a reportes y recomendaciones de IA, y el vendedor puede usar el POS con las promociones y el programa de puntos activos.

### Criterios de aceptación
- [ ] Las promociones y packs se aplican automáticamente en el POS
- [ ] Los puntos de fidelización se acumulan y canjean correctamente
- [ ] Los reportes muestran información correcta y se exportan bien en PDF/Excel
- [ ] El módulo de IA genera al menos recomendaciones de reabastecimiento
- [ ] La app Android permite hacer una venta completa y consultar el inventario
- [ ] El sistema está desplegado en producción y accesible desde internet
- [ ] El propietario y vendedor han sido capacitados y pueden operar el sistema

---

## Resumen de funcionalidades por sprint

| Funcionalidad | Sprint 1 | Sprint 2 | Sprint 3 |
|---|:---:|:---:|:---:|
| Gestión de productos | ✅ | | |
| Administración de usuarios y roles | ✅ | | |
| Configuración del sistema | ✅ | | |
| Punto de venta (POS) web | | ✅ | |
| Facturación electrónica SUNAT | | ✅ | |
| Control de inventario y alertas | | ✅ | |
| Compras y proveedores | | ✅ | |
| Apertura y cierre de caja | | ✅ | |
| Gastos operativos | | ✅ | |
| Devoluciones y mermas | | ✅ | |
| Crédito y cuentas por cobrar | | ✅ | |
| Promociones y packs | | | ✅ |
| Clientes y fidelización | | | ✅ |
| Reportes y dashboard | | | ✅ |
| Inteligencia artificial | | | ✅ |
| Aplicación Android | | | ✅ |
| Integración lectores/impresoras | | | ✅ |
| Pruebas y despliegue | | | ✅ |

---

## Matriz de comunicaciones del proyecto

| Interesado | Información a comunicar | Formato | Frecuencia | Canal |
|---|---|---|---|---|
| Propietario (cliente) | Avance del sprint, demo de funcionalidades | Reunión presencial o videollamada | Al final de cada sprint (cada 4–5 semanas) | WhatsApp + Google Meet |
| Docente evaluador | Avance del TAA, entregables académicos | Documento escrito + sustentación | Según calendario académico | Correo / Plataforma institucional |
| Alumno desarrollador | Seguimiento personal de tareas | Lista de tareas / Trello | Diario | Trello o Notion |
| Vendedor del local | Capacitación y pruebas de usuario | Demo práctica | Sprint 3 (semana 13–14) | Presencial en el local |

---

*Documento elaborado como parte del Trabajo Académico Aplicado (TAA).*
*Instituto de Educación Superior – Piura, Perú. Marzo 2025.*
