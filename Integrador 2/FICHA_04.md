# FICHA 04 - DEFINICIÓN DE REQUERIMIENTOS
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería
### Proyecto: Chilalo Shot

---

## 1. HISTORIAL DEL DOCUMENTO

### Información del Documento

| Observaciones | Modificado por | Fecha |
|---------------|----------------|-------|
| Creación inicial del documento de definición de requerimientos | [Nombre] | [Fecha] |
| | | |
| | | |

---

## 2. INFORMACIÓN DEL PROYECTO

### 2.1 Situación actual

La licorería "Chilalo Shot" opera actualmente con procesos mayormente manuales: registro de ventas en libretas o hojas de cálculo, control de inventario mediante conteo físico periódico (con precisión estimada del 70%), emisión de comprobantes en papel o mediante sistemas externos no integrados, y gestión de promociones de forma manual. Esto genera tiempos de venta de 3-5 minutos por transacción, errores en cálculos y totales, pérdidas por productos vencidos o desabastecimiento (estimadas en S/. 33,000 anuales), riesgo de multas por incumplimiento con SUNAT y poca información consolidada para la toma de decisiones. No existe uso de inteligencia artificial ni de un punto de venta (POS) integrado. El proyecto tiene como objetivo implementar un sistema web y aplicación POS con IA que centralice ventas, inventario, facturación electrónica, promociones y reportes, reduciendo tiempos operativos, mejorando la precisión del inventario y cumpliendo normativas fiscales.

---

## 3. DEFINICIÓN DE REQUERIMIENTOS

### 3.1 REQUERIMIENTO DE USUARIO

#### 3.1.1 Requerimiento funcional (Desarrollo de Prototipo)

| Requerimiento Funcional | Descripción |
|-------------------------|-------------|
| **RF01** | **Punto de venta (POS):** Sistema de venta rápida que permita búsqueda de productos (por nombre, código de barras), aplicación automática de promociones, cálculo de totales, múltiples formas de pago e historial de ventas. Tiempo objetivo de venta: 30-45 segundos. Funcionalidad offline básica para operar sin conexión temporal. |
| **RF02** | **Facturación electrónica:** Emisión de boletas y facturas electrónicas integradas con SUNAT mediante OSE; generación de XML y PDF; envío de resumen diario de boletas (RCB). Cumplimiento 100% con normativa vigente. |
| **RF03** | **Control de inventario:** Gestión de productos (registro, categorías, precios, código de barras, stock mínimo/máximo, fechas de vencimiento). Actualización automática del stock con las ventas. Alertas de stock bajo y productos próximos a vencer. Precisión de inventario objetivo >98%. |
| **RF04** | **Promociones y packs:** Creación y gestión de promociones (descuentos por porcentaje/monto/volumen, 2x1, packs). Aplicación automática en el POS. Sugerencias automáticas de IA basadas en patrones de venta (opcional en prototipo). |
| **RF05** | **Reportes y analytics:** Dashboard ejecutivo con métricas clave (ventas, inventario, rentabilidad). Reportes por período con exportación a Excel/PDF. Insights automáticos de IA (recomendaciones, predicción de demanda, optimización de inventario) integrados en el sistema. |

#### 3.1.2 Requerimientos de Validación (Pruebas)

| Requerimiento de Validación | Descripción |
|-----------------------------|-------------|
| **RV01** | **Pruebas funcionales:** Validar que todos los módulos principales (POS, inventario, facturación electrónica, promociones, reportes) funcionen según especificación; flujos de venta completos (búsqueda, promoción, pago, comprobante); integración con SUNAT en ambiente de pruebas; y que la precisión de inventario y tiempos de venta cumplan los criterios definidos. |
| **RV02** | **Pruebas de aceptación:** El cliente (dueño/empleado) validará el sistema en ambiente de pruebas: realización de ventas reales, emisión de comprobantes de prueba, consulta de reportes y uso del POS en condiciones similares a producción. Se documentarán criterios de aceptación por módulo y se registrará la aprobación antes del despliegue a producción. |

#### 3.1.3 Requerimientos de Entrenamiento al Usuario

- **Capacitación en uso del POS:** Entrenamiento al dueño y empleados en el flujo de venta (búsqueda de productos, aplicación de promociones, formas de pago, emisión de ticket o comprobante electrónico) y en el uso del modo offline cuando no haya conexión.
- **Capacitación en administración:** Entrenamiento al administrador en gestión de productos, categorías, stock mínimo/máximo, alertas; configuración de promociones y packs; y parámetros de facturación (OSE, certificado digital).
- **Capacitación en reportes y SUNAT:** Uso del dashboard, interpretación de reportes de ventas e inventario, exportación a Excel/PDF; y procedimientos de emisión de comprobantes electrónicos y envío de resúmenes (RCB) a SUNAT.
- **Material de apoyo:** Manual de usuario (digital o impreso) y, si aplica, videos cortos o guías paso a paso para consulta posterior. Sesiones de acompañamiento post-implementación para resolver dudas durante los primeros días de uso.

---

### 3.2 REQUERIMIENTO TÉCNICO

#### 3.2.1 Requerimientos de interfaz

| Requerimiento de interfaz | Descripción |
|---------------------------|-------------|
| **RI01** | **Interfaz web responsive:** El sistema web debe ser accesible desde navegadores estándar (Chrome, Firefox, Edge) y adaptarse a diferentes tamaños de pantalla (escritorio y tablet). Navegación clara entre módulos (ventas, inventario, facturación, promociones, reportes, administración). |
| **RI02** | **Interfaz POS (Electron):** La aplicación de punto de venta debe tener interfaz optimizada para uso en mostrador: búsqueda rápida (teclado y/o lector de código de barras), lista de ítems en venta, totales visibles, botones grandes para formas de pago y emisión de comprobante. Soporte para impresora térmica y lector de código de barras. |
| **RI03** | **Consistencia y usabilidad:** Diseño consistente en colores, tipografía e iconografía en todo el sistema. Mensajes de error y confirmación claros. Curva de aprendizaje mínima para usuarios con conocimientos tecnológicos básicos. Cumplimiento de buenas prácticas de accesibilidad (contraste, etiquetado). |
| **RI04** | **Integración con hardware:** Interfaz preparada para integración con lector de código de barras (entrada de código automática en POS) e impresora térmica (impresión de tickets y comprobantes). Configuración de dispositivos desde el módulo de administración cuando aplique. |

#### 3.2.2 Requerimientos de carga inicial de datos y/o Migración de Datos

**Requerimiento de Carga**

| Requerimiento de Carga | Descripción |
|------------------------|-------------|
| **RCI01** | **Carga inicial de productos:** Permite importar o registrar de forma masiva el catálogo de productos (nombre, categoría, código, precio, stock inicial, stock mínimo/máximo, fecha de vencimiento si aplica). Soporte para carga desde archivo (Excel/CSV) o registro manual por lotes. |
| **RCI02** | **Carga inicial de clientes:** Permite importar o registrar clientes existentes (nombre, documento, contacto) para historial y programa de fidelización. Opción de carga desde archivo o registro manual. |
| **RCI03** | **Carga de parámetros y configuración:** Configuración inicial de categorías de productos, formas de pago, datos del establecimiento para facturación (RUC, razón social, dirección), y parámetros de OSE y certificado digital para SUNAT. |

**Requerimiento de Migración**

| Requerimiento de Migración | Descripción |
|----------------------------|-------------|
| **RM01** | **Migración desde hojas de cálculo o sistemas previos:** Si el cliente dispone de datos en Excel o sistema anterior, el proyecto debe definir formato estándar (plantilla) para migrar productos, clientes y, si aplica, movimientos de inventario o ventas históricas, con validación de datos antes de la carga. |
| **RM02** | **Migración de datos de facturación:** Asegurar que la numeración y secuencia de comprobantes electrónicos sean coherentes con la normativa SUNAT y con cualquier historial previo que deba conservarse. Definir criterios de corte y respaldo de datos antiguos. |
| **RM03** | **Respaldo y rollback:** Antes de cualquier carga o migración masiva, se debe realizar respaldo de la base de datos. Definir procedimiento de rollback en caso de fallo o datos incorrectos. |

#### 3.2.3 Requerimientos de infraestructura

| Requerimiento de Infraestructura | Descripción |
|----------------------------------|-------------|
| **RIF01** | **Servidor de aplicación:** Infraestructura para hospedar el backend (Spring Boot) y el frontend web (React), ya sea en nube (Render, Railway, Vercel u otro) o en servidor local. Requisitos mínimos según carga esperada (CPU, RAM, disco). |
| **RIF02** | **Base de datos:** Base de datos PostgreSQL (cloud o local) con espacio suficiente para datos transaccionales, catálogo de productos, ventas, comprobantes y logs. Configuración de respaldos automáticos y retención definida. |
| **RIF03** | **Servicio de IA (opcional en prototipo):** Servicio (por ejemplo Python/FastAPI) para modelos de recomendación, predicción de demanda y optimización de inventario. Puede hospedarse en la misma nube o en servicio separado con acceso desde el backend. |
| **RIF04** | **Conectividad:** Conexión a internet estable en el establecimiento para el sistema web y para la sincronización del POS y envío de comprobantes a SUNAT. El POS debe poder operar en modo offline con sincronización posterior. |
| **RIF05** | **Estaciones de trabajo POS:** Al menos un equipo (PC o tablet) con sistema operativo compatible con Electron (Windows, macOS o Linux) para la aplicación POS, con puertos USB para lector de código de barras e impresora térmica cuando se requieran. |
| **RIF06** | **Disponibilidad:** Objetivo de disponibilidad del sistema del 99% (uptime) en horario de operación del negocio. Plan de contingencia ante caídas de red o del servidor (por ejemplo uso de POS offline y sincronización al recuperar conexión). |

#### 3.2.4 Requerimientos de seguridad

| Requerimiento de Seguridad | Descripción |
|----------------------------|-------------|
| **RS01** | **Autenticación y autorización:** Control de acceso mediante usuario y contraseña. Roles definidos (Administrador, Vendedor) con permisos diferenciados (por ejemplo: solo vendedor en POS y consultas; administrador para configuración, reportes y gestión de usuarios). Sesiones con tiempo de expiración y cierre de sesión seguro. |
| **RS02** | **Protección de datos personales:** Cumplimiento con la Ley N° 29733 (Ley de Protección de Datos Personales) del Perú. Datos de clientes y empleados tratados solo para los fines del sistema; almacenamiento seguro y acceso restringido. No compartir datos con terceros salvo obligación legal (por ejemplo SUNAT). |
| **RS03** | **Comunicación y almacenamiento seguro:** Uso de HTTPS en todas las comunicaciones web. Contraseñas almacenadas con hash seguro (no en texto plano). Certificados y credenciales de SUNAT (certificado digital, claves OSE) protegidos y no expuestos en el frontend o en logs. |
| **RS04** | **Respaldo y recuperación:** Respaldos periódicos de la base de datos y configuración crítica. Procedimiento documentado de recuperación ante fallos. Registro de auditoría (logs) de acciones sensibles (cambios de configuración, emisión masiva de comprobantes, altas/bajas de usuarios) para trazabilidad. |

#### 3.2.5 Requerimientos de documentación

| Requerimiento de documentación | Descripción |
|--------------------------------|-------------|
| **RD01** | **Documentación de usuario:** Manual de usuario que describa el uso del POS, módulos de inventario, promociones, reportes y facturación; procedimientos de emisión de comprobantes y envío a SUNAT; y solución de incidencias frecuentes. Disponible en formato digital (PDF o integrado en el sistema). |
| **RD02** | **Documentación técnica:** Documentación de arquitectura del sistema, modelo de datos, APIs principales e integraciones (SUNAT, IA). Instrucciones de despliegue, configuración de entorno y respaldos. Dirigida al equipo técnico o al responsable de mantenimiento. |

#### 3.2.6 Requerimientos de garantía, soporte y mantenimiento

| Requerimiento | Descripción |
|---------------|-------------|
| **De Garantía** | Período de garantía post-implementación (por ejemplo 30 o 60 días) para corrección de defectos o fallos que impidan el uso normal del sistema según especificación. Exclusión de fallos por mal uso, modificaciones no autorizadas o problemas de infraestructura externa (SUNAT, internet). |
| **De Soporte** | Canal de soporte (correo, canal acordado) para reportar incidencias y consultas durante el período de garantía y, si se acuerda, un período adicional. Tiempos de respuesta según severidad (crítico: sistema no usable; alto: funcionalidad importante afectada; medio/bajo: mejoras o consultas). En proyecto académico/practicante, el alcance se define según disponibilidad del desarrollador. |
| **De Mantenimiento** | Mantenimiento correctivo para corrección de errores y mantenimiento evolutivo para mejoras o adaptaciones (por ejemplo cambios en normativa SUNAT) según acuerdo. Definir si incluye actualizaciones de dependencias (frameworks, librerías) y parches de seguridad dentro del período acordado. |

#### 3.2.7 Requerimientos adicionales y/o especiales de producto

| Requerimiento adicional/especial | Descripción |
|----------------------------------|-------------|
| **RA-E01** | **Integración con SUNAT y OSE:** El sistema debe integrarse con un OSE (Operador de Servicios Electrónicos) compatible con SUNAT. El cliente es responsable de contar con certificado digital y cuenta OSE; el proyecto debe documentar los pasos de configuración y pruebas en ambiente de SUNAT antes de producción. Diseño flexible para eventual cambio de OSE si fuera necesario. |
| **RA-E02** | **Escalabilidad y extensibilidad:** La arquitectura debe permitir, en fases futuras, incorporar app móvil Android (Kotlin + Firebase), múltiples sucursales o integraciones adicionales (delivery, redes sociales), sin requerir reescritura completa del núcleo del sistema. Código modular, APIs bien definidas y base de datos preparada para extensiones (por ejemplo sucursal, punto de emisión). |

---

**Fecha de actualización:** [Fecha]  
**Versión:** 1.0  
**Preparado por:** [Nombre]
