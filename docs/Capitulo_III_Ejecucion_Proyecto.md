# CAPÍTULO III: EJECUCIÓN DEL PROYECTO

---

## 3.1. FASE DE INICIO

### 3.1.1. Presentación del Proyecto (Kick Off)

Para el lanzamiento del proyecto realizamos una presentación formal ante el cliente y los docentes del instituto. El evento Kick-Off lo organizamos en el aula de cómputo del instituto y fue una oportunidad importante para alinear expectativas con la dueña del negocio "Chilalo Shot" y con nuestros asesores. A continuación, se describen las doce láminas que presentamos ese día.

---

**Lámina 1 — Portada**

La primera diapositiva mostraba el nombre oficial del proyecto: *"Sistema Web y App Móvil con IA para Gestión Integral de Licorería — Chilalo Shot, Piura"*. Incluimos el logo del instituto, los nombres de los integrantes del equipo, el nombre del cliente y la fecha de presentación. Queríamos que desde el primer momento quedara claro de qué se trataba el proyecto y quiénes éramos responsables de sacarlo adelante.

---

**Lámina 2 — Agenda**

En esta lámina presentamos el orden de la exposición para que los asistentes supieran qué íbamos a tocar. Los puntos fueron: la organización cliente, la problemática detectada, la solución propuesta, el alcance, los objetivos, los costos estimados, el cronograma general, los supuestos y restricciones, los riesgos identificados y finalmente el equipo de trabajo. Seguir ese orden nos ayudó a que la presentación fluyera sin interrupciones.

---

**Lámina 3 — La Organización Cliente**

Aquí describimos brevemente a nuestro cliente. Chilalo Shot es una licorería pequeña ubicada en el distrito de Piura, que opera con apenas uno o dos empleados, siendo muchas veces el mismo dueño quien atiende. El negocio vende bebidas alcohólicas, cigarros y productos similares al por menor. Su misión es atender bien a sus clientes de manera rápida y cumplir con las obligaciones fiscales que exige SUNAT. Su visión, según nos comentó el dueño en las reuniones previas, es modernizarse y poder competir mejor con otras licorerías del sector.

---

**Lámina 4 — Descripción de la Necesidad**

Esta fue quizás la diapositiva más importante porque explicaba por qué el proyecto era necesario. El negocio llevaba sus ventas anotadas a mano en un cuaderno o a veces en Excel, lo que generaba errores frecuentes y hacía que cada venta tomara entre 3 y 5 minutos. Tampoco emitía boletas o facturas electrónicas como lo exige SUNAT, lo que lo exponía a multas. El inventario era prácticamente un misterio: no se sabía con exactitud qué había en stock, cuándo vencían los productos ni cuándo había que pedir más mercancía. No existían reportes de ningún tipo y mucho menos un programa de fidelización para los clientes frecuentes. Todo eso, sumado, representaba pérdidas estimadas de alrededor de S/ 33 000 al año, según el análisis que hicimos.

---

**Lámina 5 — Descripción de la Solución**

Acá presentamos lo que íbamos a desarrollar: un sistema completo formado por una aplicación web para administración y una aplicación móvil Android para el punto de venta, más un módulo de inteligencia artificial. La app web incluiría el punto de venta (POS), gestión de inventario con alertas, módulo de compras a proveedores, facturación electrónica conectada a SUNAT, promociones y packs de productos, reportes y un dashboard con indicadores clave. La app Android permitiría al vendedor registrar ventas desde el mostrador sin depender de una computadora. El módulo de IA daría recomendaciones de qué productos comprar según el historial de ventas.

---

**Lámina 6 — Alcance y Exclusiones**

Para evitar malentendidos dejamos muy claro qué sí y qué no incluía el proyecto. Dentro del alcance: POS, inventario, facturación electrónica SUNAT, promociones, packs, fidelización con puntos, reportes, usuarios con roles y la app Android. Fuera del alcance quedaron: contabilidad completa, planillas de personal, integración con bancos, tienda en línea para clientes, delivery, redes sociales y cualquier módulo que no se haya acordado desde el inicio. Explicamos que si el cliente pedía algo adicional, eso sería un cambio de alcance que habría que evaluar y acordar.

---

**Lámina 7 — Objetivos del Proyecto**

El objetivo general fue: *"Desarrollar e implementar un sistema web y app móvil con apoyo de inteligencia artificial para que la licorería Chilalo Shot gestione sus ventas, inventario, facturación y promociones de manera eficiente, cumpliendo con la normativa de SUNAT y mejorando la atención al cliente."*

Los objetivos específicos que presentamos fueron ocho:
1. Digitalizar el proceso de ventas mediante un POS ágil.
2. Automatizar la emisión de boletas y facturas electrónicas con SUNAT.
3. Controlar el inventario en tiempo real con alertas automáticas.
4. Gestionar promociones y packs de productos.
5. Generar reportes y un dashboard con indicadores del negocio.
6. Implementar un programa de fidelización de clientes con puntos.
7. Integrar un módulo de IA para recomendaciones de compra.
8. Ofrecer una interfaz sencilla para que cualquier persona pueda usarla sin capacitación extensa.

---

**Lámina 8 — Costos y Factibilidad Económica**

En esta parte explicamos el presupuesto. Como el desarrollo lo realizamos nosotros como proyecto formativo del instituto, el costo de recursos humanos fue de S/ 0. Las licencias de software también fueron gratuitas porque usamos herramientas de código abierto: Spring Boot, React, PostgreSQL, entre otras. Los únicos costos que podría tener el cliente son opcionales: hosting si quiere publicar el sistema en internet (entre S/ 0 y S/ 500 al año) y equipos de hardware como una impresora térmica o tablet si no tiene (entre S/ 0 y S/ 600 dependiendo lo que ya tenga). En total el proyecto puede costar al cliente entre S/ 0 y S/ 1 300, dependiendo de su situación actual.

El beneficio económico es claro: se estima reducir las pérdidas de S/ 33 000 anuales a menos de S/ 5 000, lo que haría que la inversión se recupere prácticamente desde el primer mes de uso. A esto se suma que cumplir con SUNAT evita multas que pueden ser bastante altas.

---

**Lámina 9 — Cronograma e Hitos**

Presentamos el cronograma general del proyecto dividido en fases con una duración total de 14 semanas. Los hitos principales fueron:

| Fase | Semanas | Hito |
|---|---|---|
| Análisis y diseño | 1 – 2 | Arquitectura y diseño de BD aprobados |
| Desarrollo backend | 3 – 6 | Backend funcional con SUNAT e IA básica |
| Frontend web | 7 – 9 | Sistema web operativo |
| POS (app móvil) | 10 – 11 | App Android lista |
| IA y optimización | 12 | Módulo IA integrado |
| Pruebas (QA) | 13 | Sistema probado y sin errores críticos |
| Despliegue y capacitación | 14 | Sistema en producción con usuario capacitado |

---

**Lámina 10 — Supuestos y Restricciones**

Los supuestos que manejamos fueron: que el cliente ya tiene o puede obtener un certificado digital y credenciales OSE para SUNAT, que el local cuenta con conexión a internet (aunque también diseñamos un modo básico sin conexión para el POS Android), y que el cliente y su personal participarían en las reuniones de revisión que acordamos hacer cada dos semanas.

Las restricciones fueron: el plazo fijo de 14 semanas que impone el calendario académico del instituto, el uso obligatorio de las tecnologías definidas por el equipo (Spring Boot, React, Android con Kotlin) y el presupuesto prácticamente nulo para herramientas de pago.

---

**Lámina 11 — Riesgos**

Identificamos cinco riesgos principales y para cada uno definimos una respuesta:

| Riesgo | Respuesta |
|---|---|
| Problemas con la integración SUNAT/OSE | Probar desde el sprint 3 en ambiente de pruebas; no dejar para el final |
| Cambios frecuentes de requisitos del cliente | Usar metodología ágil con revisiones cada dos semanas para validar avances |
| Retrasos por complejidad técnica | Priorizar funcionalidades críticas; tener un margen en el cronograma |
| Que el cliente no adopte el sistema | Capacitación sencilla; interfaz fácil; acompañamiento las primeras semanas |
| Internet inestable en el local | Implementar modo offline en la app Android con sincronización posterior |

---

**Lámina 12 — Equipo del Proyecto**

Presentamos a cada integrante con su rol dentro del proyecto:

| Rol | Responsabilidad |
|---|---|
| Product Owner | Representa al cliente; define y prioriza el backlog |
| Scrum Master | Facilita las ceremonias Scrum; remueve impedimentos |
| Desarrollador Full Stack | Backend Spring Boot y frontend React |
| Desarrollador Backend / IA | APIs REST e integración del servicio de IA |
| Desarrollador POS / Android | App móvil Android con Kotlin y Jetpack Compose |
| QA / Tester | Pruebas funcionales, de integración y de aceptación |
| Diseñador UX/UI | Diseño de pantallas y experiencia de usuario |

---

### 3.1.2. Historias de Usuario

Para este proyecto elegimos un enfoque de gestión adaptativo (ágil), por lo que en lugar de hacer una lista de requisitos clásica, definimos las funcionalidades como Historias de Usuario (HU). Esto nos ayudó mucho porque al redactarlas desde la perspectiva del usuario final, fue más fácil entender para qué servía cada cosa y no perdernos en tecnicismos desde el comienzo.

Las historias las levantamos en dos reuniones con el dueño del negocio, donde básicamente le preguntamos "¿qué necesitas poder hacer con el sistema?" y fuimos anotando todo. Después las organizamos y les dimos el formato estándar.

**Tabla de Historias de Usuario**

| Código | Historia de Usuario | Criterios de Aceptación | Prioridad |
|---|---|---|---|
| HU-01 | Como **vendedor**, quiero **registrar ventas desde el punto de venta web**, para **atender a los clientes en menos de 45 segundos**. | El POS permite buscar productos, agregar ítems al carrito y confirmar la venta. El stock se descuenta automáticamente. | Alta |
| HU-02 | Como **vendedor**, quiero **buscar productos por nombre o código de barras**, para **agregar ítems al carrito rápidamente sin perder tiempo**. | La búsqueda responde en tiempo real. Si el producto no existe se muestra mensaje claro. | Alta |
| HU-03 | Como **vendedor**, quiero **registrar ventas con diferentes formas de pago** (efectivo, Yape, Plin, tarjeta, mixto), para **adaptarme a cómo quiera pagar el cliente**. | Todas las formas de pago funcionan. En pago mixto el sistema calcula automáticamente el segundo monto. En efectivo muestra el vuelto. | Alta |
| HU-04 | Como **administrador**, quiero **emitir boletas y facturas electrónicas conectadas a SUNAT**, para **cumplir con las obligaciones fiscales del negocio**. | El sistema genera XML UBL 2.1, lo envía al OSE y guarda la CDR. El PDF se puede descargar. | Alta |
| HU-05 | Como **administrador**, quiero **ver alertas cuando el stock de un producto esté bajo**, para **hacer pedidos a tiempo y no quedarme sin mercancía**. | El sistema muestra alertas automáticas cuando el stock baja del mínimo configurado. | Alta |
| HU-06 | Como **administrador**, quiero **gestionar productos y categorías** (crear, editar, desactivar), para **tener el catálogo siempre actualizado**. | CRUD completo de productos con campos: nombre, categoría, precio compra, precio venta, stock, código de barras, fecha de vencimiento. | Alta |
| HU-07 | Como **administrador**, quiero **registrar compras a proveedores y actualizar el inventario al recibirlas**, para **tener siempre el stock correcto en el sistema**. | Se puede crear una compra en estado PENDIENTE y marcarla como RECIBIDA cuando llega la mercancía. El stock sube automáticamente. | Alta |
| HU-08 | Como **administrador**, quiero **ver un dashboard con las ventas del día, la semana y el mes**, para **tener una idea rápida de cómo va el negocio sin revisar reportes largos**. | El dashboard muestra KPIs: total vendido, número de transacciones, ticket promedio y los productos más vendidos. | Alta |
| HU-09 | Como **administrador**, quiero **generar reportes de ventas filtrando por fechas**, para **analizar el rendimiento del negocio en cualquier período**. | Los reportes muestran totales, desglose por forma de pago, por categoría y por vendedor. Se puede exportar. | Media |
| HU-10 | Como **administrador**, quiero **crear promociones y packs de productos con descuentos**, para **incentivar la venta de ciertos productos y liquidar stock que no rota**. | Las promociones se aplican automáticamente en el POS si el cliente cumple la condición. | Media |
| HU-11 | Como **vendedor**, quiero **identificar al cliente en la venta y que acumule puntos de fidelización**, para **fidelizarlo y que prefiera volver a comprar aquí**. | Al asociar un cliente a la venta, el sistema acumula puntos según las reglas configuradas. Los puntos se ven en el perfil del cliente. | Media |
| HU-12 | Como **vendedor**, quiero **permitir que el cliente canjee sus puntos acumulados como descuento en la venta**, para **que el programa de fidelización tenga valor real**. | El POS muestra los puntos disponibles del cliente. Al canjear, calcula el descuento equivalente y lo aplica al total. | Media |
| HU-13 | Como **administrador**, quiero **registrar la apertura de caja con un monto inicial y hacer el cierre al final del día**, para **tener control del efectivo y detectar sobrantes o faltantes**. | El sistema registra la apertura con el monto inicial. El cierre muestra el resumen de ventas en efectivo y calcula la diferencia con el dinero real. | Media |
| HU-14 | Como **administrador**, quiero **registrar devoluciones de ventas indicando qué productos y qué cantidades se devuelven**, para **que el stock se restaure y el cliente quede conforme**. | Se puede hacer devolución parcial por producto. El stock se incrementa automáticamente y se registra un movimiento de inventario. | Media |
| HU-15 | Como **administrador**, quiero **registrar los gastos operativos del negocio** (agua, luz, alquiler, etc.), para **calcular la ganancia neta real y no solo las ventas brutas**. | CRUD de gastos con categoría, monto y fecha. Los reportes incluyen total de gastos y ganancia neta. | Media |
| HU-16 | Como **administrador**, quiero **registrar mermas de productos** (rotos, vencidos, derramados), para **que el inventario siempre refleje la realidad del almacén**. | Se puede registrar una merma seleccionando el producto, la cantidad y el motivo. El stock disminuye automáticamente. | Media |
| HU-17 | Como **administrador**, quiero **gestionar créditos y fiados a clientes con seguimiento de pagos**, para **no perder el control de lo que me deben**. | Se puede crear una venta en modalidad CREDITO. El sistema registra la deuda y permite registrar pagos parciales hasta saldar. | Media |
| HU-18 | Como **vendedor**, quiero **usar una aplicación Android para registrar ventas desde el mostrador**, para **no depender de la computadora y atender más rápido**. | La app Android permite login, búsqueda de productos, carrito, formas de pago y confirmación de venta con sincronización al backend. | Alta |
| HU-19 | Como **administrador**, quiero **que el sistema me sugiera qué productos debo comprar usando inteligencia artificial**, para **optimizar mis pedidos y reducir pérdidas por desabastecimiento o sobrestock**. | El módulo IA analiza el historial de ventas y muestra predicciones de demanda con sugerencias de cantidad a comprar. | Baja |
| HU-20 | Como **administrador**, quiero **crear y gestionar usuarios con roles diferenciados** (ADMIN y VENDEDOR), para **que cada persona solo acceda a lo que le corresponde**. | El administrador puede crear, editar y desactivar usuarios. Cada rol tiene permisos distintos verificados en el backend. | Alta |
| HU-21 | Como **usuario**, quiero **recuperar mi contraseña mediante un enlace enviado a mi correo**, para **poder acceder al sistema si la olvido sin tener que llamar al administrador**. | El sistema envía un correo con enlace temporal de recuperación. El enlace expira en un tiempo razonable. | Baja |
| HU-22 | Como **administrador**, quiero **recibir alertas de productos próximos a vencer**, para **tomar acción a tiempo** (promoción, devolución al proveedor o consumo propio). | El sistema muestra productos con fecha de vencimiento en los próximos 30 días con nivel de urgencia diferenciado. | Media |
| HU-23 | Como **administrador**, quiero **ver el historial completo de movimientos de inventario**, para **tener trazabilidad de cada entrada, salida y ajuste que ocurrió**. | El módulo de inventario muestra una lista filtrable de movimientos con fecha, tipo, producto, cantidad y responsable. | Media |

---

## 3.2. FASE DE PLANIFICACIÓN

### 3.2.1. Product Backlog y Sprint Backlog

Para organizar el trabajo del proyecto usamos un Product Backlog que contiene todas las historias de usuario priorizadas según el valor que aportan al negocio. La priorización la hicimos en conjunto con el cliente usando la técnica MoSCoW (Must Have, Should Have, Could Have, Won't Have). El backlog fue evolucionando durante el proyecto: algunas historias se dividieron en partes más pequeñas y otras se refinaron cuando el equipo empezó a entender mejor la complejidad real.

**Product Backlog Inicial (ordenado por prioridad)**

| Prioridad | Código | Historia de Usuario | Story Points | Sprint Asignado |
|---|---|---|---|---|
| 1 | HU-20 | Gestión de usuarios y roles | 5 | Sprint 1 |
| 2 | HU-06 | Gestión de productos y categorías | 5 | Sprint 1 |
| 3 | HU-01 | Registrar ventas desde el POS web | 13 | Sprint 2 |
| 4 | HU-02 | Buscar productos en POS | 5 | Sprint 2 |
| 5 | HU-03 | Formas de pago múltiples | 8 | Sprint 2 |
| 6 | HU-05 | Alertas de stock bajo | 5 | Sprint 2 |
| 7 | HU-23 | Historial de movimientos de inventario | 5 | Sprint 3 |
| 8 | HU-08 | Dashboard con KPIs | 8 | Sprint 3 |
| 9 | HU-07 | Registro de compras a proveedores | 8 | Sprint 3 |
| 10 | HU-04 | Facturación electrónica SUNAT | 13 | Sprint 3 |
| 11 | HU-09 | Reportes de ventas | 8 | Sprint 4 |
| 12 | HU-10 | Promociones y packs | 8 | Sprint 4 |
| 13 | HU-22 | Alertas de productos próximos a vencer | 5 | Sprint 4 |
| 14 | HU-18 | App Android para ventas | 13 | Sprint 5 |
| 15 | HU-11 | Fidelización: acumulación de puntos | 8 | Sprint 5 |
| 16 | HU-12 | Fidelización: canje de puntos en POS | 5 | Sprint 5 |
| 17 | HU-13 | Apertura y cierre de caja | 8 | Sprint 5 |
| 18 | HU-14 | Devoluciones de ventas | 8 | Sprint 6 |
| 19 | HU-15 | Registro de gastos operativos | 5 | Sprint 6 |
| 20 | HU-16 | Registro de mermas | 5 | Sprint 6 |
| 21 | HU-17 | Créditos y cuentas por cobrar | 8 | Sprint 6 |
| 22 | HU-19 | Módulo de IA para predicción de demanda | 13 | Sprint 7 |
| 23 | HU-21 | Recuperación de contraseña por correo | 3 | Sprint 7 |
| **Total** | | | **175 pts** | |

---

A continuación, describimos cada Sprint Backlog con las tareas concretas que el equipo planificó y ejecutó.

**Sprint Backlog — Sprint 1 (Semanas 1–2): Configuración y módulo base**

El primer sprint fue más de preparación que de desarrollo visible. Tuvimos que configurar todo el entorno, decidir la arquitectura y levantar la base de datos. No fue sencillo al principio porque no todos en el equipo habían trabajado antes con Spring Boot y Flyway juntos.

| Tarea | HU | Responsable | Estado |
|---|---|---|---|
| Configurar proyecto Spring Boot con dependencias base | HU-20 | Dev Full Stack | Hecho |
| Diseñar esquema de base de datos en PostgreSQL | HU-06, HU-20 | Dev Backend | Hecho |
| Crear migraciones Flyway V1–V5 (tablas base) | Todas | Dev Backend | Hecho |
| Implementar entidades JPA: Usuario, Producto, Categoría | HU-06 | Dev Full Stack | Hecho |
| Implementar autenticación JWT (login y refresh token) | HU-20 | Dev Backend | Hecho |
| Configurar roles ADMIN y VENDEDOR con Spring Security | HU-20 | Dev Backend | Hecho |
| Crear endpoints CRUD de usuarios | HU-20 | Dev Full Stack | Hecho |
| Crear endpoints CRUD de productos y categorías | HU-06 | Dev Full Stack | Hecho |
| Configurar proyecto React con Vite, Tailwind, React Router | HU-20 | Dev Full Stack | Hecho |
| Implementar pantalla de login en el frontend | HU-20 | Dev Full Stack | Hecho |
| Diseñar layout principal: sidebar y header | HU-20 | Diseñador UX/UI | Hecho |
| Pruebas de endpoints con Postman | Todas | QA | Hecho |

---

**Sprint Backlog — Sprint 2 (Semanas 3–4): POS web y módulo de ventas**

Este sprint fue bastante intenso. El POS era la funcionalidad más importante del sistema y la que el cliente más esperaba ver funcionando. El cálculo del pago mixto nos tomó un poco más de lo esperado porque había varios casos especiales que teníamos que manejar.

| Tarea | HU | Responsable | Estado |
|---|---|---|---|
| Implementar entidad Venta, DetalleVenta y relaciones | HU-01 | Dev Full Stack | Hecho |
| Implementar VentaService con lógica de descuento de stock | HU-01 | Dev Backend | Hecho |
| Implementar endpoint POST /ventas | HU-01 | Dev Full Stack | Hecho |
| Crear pantalla POS en React con barra de búsqueda | HU-02 | Dev Full Stack | Hecho |
| Implementar carrito de compras con edición de cantidades | HU-01 | Dev Full Stack | Hecho |
| Implementar panel de formas de pago (Efectivo, Yape, Plin, Tarjeta) | HU-03 | Dev Full Stack | Hecho |
| Implementar pago Mixto con cálculo automático del segundo monto | HU-03 | Dev Full Stack | Hecho |
| Implementar alertas de stock bajo en inventario | HU-05 | Dev Backend | Hecho |
| Migración Flyway V6: tabla venta_pagos | HU-03 | Dev Backend | Hecho |
| Crear pantalla de Inventario con tabs Alertas / Movimientos | HU-05 | Dev Full Stack | Hecho |
| Pruebas funcionales del flujo completo de venta | HU-01, HU-03 | QA | Hecho |

---

**Sprint Backlog — Sprint 3 (Semanas 5–6): Dashboard, compras y facturación SUNAT**

La integración con SUNAT fue el mayor desafío técnico del proyecto. Tuvimos que leer mucha documentación de la API del OSE y hacer bastantes pruebas en el ambiente sandbox antes de que funcionara. Al final lo logramos, aunque hubo un par de noches largas en el proceso.

| Tarea | HU | Responsable | Estado |
|---|---|---|---|
| Implementar Dashboard con KPIs (ventas hoy/semana/mes) | HU-08 | Dev Full Stack | Hecho |
| Implementar gráficos de ventas en Dashboard | HU-08 | Diseñador UX/UI | Hecho |
| Implementar entidades Proveedor, Compra, DetalleCompra | HU-07 | Dev Backend | Hecho |
| Implementar flujo PENDIENTE → RECIBIDA en compras | HU-07 | Dev Backend | Hecho |
| Crear pantalla de Compras en frontend | HU-07 | Dev Full Stack | Hecho |
| Implementar FacturacionService: generación XML UBL 2.1 | HU-04 | Dev Backend/IA | Hecho |
| Integrar firma digital del XML con certificado OSE | HU-04 | Dev Backend/IA | Hecho |
| Implementar envío al OSE y recepción de CDR | HU-04 | Dev Backend/IA | Hecho |
| Configurar ambiente sandbox SUNAT para pruebas | HU-04 | Dev Backend/IA | Hecho |
| Crear pantalla de emisión de boleta/factura en frontend | HU-04 | Dev Full Stack | Hecho |
| Migración Flyway V7: tabla comprobantes_electronicos | HU-04 | Dev Backend | Hecho |
| Pruebas de comprobantes en ambiente sandbox SUNAT | HU-04 | QA | Hecho |

---

**Sprint Backlog — Sprint 4 (Semanas 7–8): Reportes, promociones y alertas de vencimiento**

| Tarea | HU | Responsable | Estado |
|---|---|---|---|
| Implementar ReporteService con filtros por fecha | HU-09 | Dev Backend | Hecho |
| Agregar desglose por forma de pago y categoría en reportes | HU-09 | Dev Backend | Hecho |
| Crear pantalla de Reportes con selector de fechas | HU-09 | Dev Full Stack | Hecho |
| Implementar entidades Promocion y Pack con sus relaciones | HU-10 | Dev Backend | Hecho |
| Implementar lógica de aplicación automática de promociones en ventas | HU-10 | Dev Backend | Hecho |
| Crear pantalla de Promociones en frontend | HU-10 | Dev Full Stack | Hecho |
| Implementar alertas de productos próximos a vencer (30 días) | HU-22 | Dev Backend | Hecho |
| Mostrar alertas de vencimiento en pantalla de Inventario | HU-22 | Dev Full Stack | Hecho |
| Migración Flyway V8: stock mínimo por categoría | HU-05 | Dev Backend | Hecho |
| Mostrar packs en panel colapsable dentro del POS | HU-10 | Dev Full Stack | Hecho |
| Pruebas de reportes con distintos rangos de fecha | HU-09 | QA | Hecho |

---

**Sprint Backlog — Sprint 5 (Semanas 9–10): App Android, fidelización y apertura de caja**

El desarrollo de la app Android fue uno de los sprints más exigentes. Tuvimos que aprender bien Jetpack Compose porque algunos del equipo no lo habían usado en proyectos reales antes. Pero el resultado valió la pena porque la app quedó bastante fluida.

| Tarea | HU | Responsable | Estado |
|---|---|---|---|
| Configurar proyecto Android con Kotlin, Hilt y Retrofit | HU-18 | Dev Android | Hecho |
| Implementar pantalla de Login en Android | HU-18 | Dev Android | Hecho |
| Implementar pantalla de Dashboard en Android | HU-18 | Dev Android | Hecho |
| Implementar POSScreen con carrito y búsqueda de productos | HU-18 | Dev Android | Hecho |
| Implementar formas de pago en la app Android | HU-18 | Dev Android | Hecho |
| Implementar confirmación de venta y diálogo de éxito | HU-18 | Dev Android | Hecho |
| Implementar entidades Fidelizacion: Cliente, PuntosMovimiento | HU-11 | Dev Backend | Hecho |
| Implementar acumulación automática de puntos al confirmar venta | HU-11 | Dev Backend | Hecho |
| Implementar canje de puntos en POS web | HU-12 | Dev Full Stack | Hecho |
| Mostrar puntos disponibles al seleccionar cliente en POS | HU-12 | Dev Full Stack | Hecho |
| Implementar AperturaCaja y CierreCaja | HU-13 | Dev Backend | Hecho |
| Crear pantalla de Cierre de Caja con resumen del día | HU-13 | Dev Full Stack | Hecho |
| Migración Flyway V14: apertura_caja | HU-13 | Dev Backend | Hecho |
| Migración Flyway V17: fidelización | HU-11 | Dev Backend | Hecho |
| Pruebas del flujo completo en app Android | HU-18 | QA | Hecho |

---

**Sprint Backlog — Sprint 6 (Semanas 11–12): Devoluciones, gastos, mermas y créditos**

| Tarea | HU | Responsable | Estado |
|---|---|---|---|
| Implementar DevolucionService con restauración automática de stock | HU-14 | Dev Backend | Hecho |
| Crear pantalla de Devoluciones en frontend | HU-14 | Dev Full Stack | Hecho |
| Migración Flyway V12: devoluciones | HU-14 | Dev Backend | Hecho |
| Implementar GastoService con 6 categorías de gasto | HU-15 | Dev Backend | Hecho |
| Crear pantalla de Gastos en frontend | HU-15 | Dev Full Stack | Hecho |
| Agregar ganancia neta y total de gastos en Reportes | HU-15 | Dev Backend | Hecho |
| Migración Flyway V15: gastos | HU-15 | Dev Backend | Hecho |
| Implementar MermaService: descuento de stock + MovimientoInventario | HU-16 | Dev Backend | Hecho |
| Crear pantalla de Mermas con 6 motivos predefinidos | HU-16 | Dev Full Stack | Hecho |
| Migración Flyway V16: mermas | HU-16 | Dev Backend | Hecho |
| Implementar CuentaPorCobrarService y pagos parciales | HU-17 | Dev Backend | Hecho |
| Crear pantalla de Cuentas por Cobrar en frontend | HU-17 | Dev Full Stack | Hecho |
| Migración Flyway V13: credito/fiado | HU-17 | Dev Backend | Hecho |
| Pruebas de devoluciones parciales y créditos | HU-14, HU-17 | QA | Hecho |

---

**Sprint Backlog — Sprint 7 (Semanas 13–14): Módulo IA, correcciones finales y despliegue**

| Tarea | HU | Responsable | Estado |
|---|---|---|---|
| Desarrollar servicio de IA para predicción de demanda | HU-19 | Dev Backend/IA | Hecho |
| Integrar módulo IA con el backend Spring Boot | HU-19 | Dev Backend/IA | Hecho |
| Crear pantalla de IA en el frontend | HU-19 | Dev Full Stack | Hecho |
| Implementar recuperación de contraseña por email | HU-21 | Dev Backend | Hecho |
| Crear pantallas de Forgot Password y Reset Password | HU-21 | Dev Full Stack | Hecho |
| Migración Flyway V18: password_reset_tokens | HU-21 | Dev Backend | Hecho |
| Pruebas de regresión general (todos los módulos) | Todas | QA | Hecho |
| Corrección de bugs reportados en pruebas | Todas | Dev Full Stack | Hecho |
| Despliegue del sistema en el entorno del cliente | Todas | Dev Full Stack | Hecho |
| Capacitación al dueño y al vendedor | Todas | Scrum Master | Hecho |
| Entrega formal de la documentación final | Todas | Todo el equipo | Hecho |

---

### 3.2.2. Estimación de las Historias de Usuario

Para estimar el tamaño de cada historia de usuario utilizamos la técnica de **Planning Poker** con la escala de Fibonacci (1, 2, 3, 5, 8, 13, 21). Cada integrante del equipo de desarrollo estimaba de forma independiente y luego discutíamos cuando había diferencias grandes. Al principio nos costó un poco ponernos de acuerdo, pero con el tiempo el equipo fue calibrando mejor las estimaciones.

La velocidad promedio del equipo fue de aproximadamente **44 story points por sprint** durante los primeros cinco sprints. En el sprint 6 y 7 bajó un poco porque coincidimos con evaluaciones del instituto y algunos integrantes estaban más limitados de tiempo.

| Código | Historia de Usuario | Story Points | Complejidad |
|---|---|---|---|
| HU-01 | Registrar ventas desde el POS web | 13 | Alta |
| HU-02 | Buscar productos en POS | 5 | Media |
| HU-03 | Formas de pago múltiples | 8 | Media-Alta |
| HU-04 | Facturación electrónica SUNAT | 13 | Alta |
| HU-05 | Alertas de stock bajo | 5 | Media |
| HU-06 | Gestión de productos y categorías | 5 | Media |
| HU-07 | Registro de compras a proveedores | 8 | Media-Alta |
| HU-08 | Dashboard con KPIs | 8 | Media |
| HU-09 | Reportes de ventas | 8 | Media |
| HU-10 | Promociones y packs | 8 | Media |
| HU-11 | Fidelización: acumulación de puntos | 8 | Media |
| HU-12 | Fidelización: canje en POS | 5 | Media |
| HU-13 | Apertura y cierre de caja | 8 | Media |
| HU-14 | Devoluciones de ventas | 8 | Media |
| HU-15 | Registro de gastos operativos | 5 | Baja-Media |
| HU-16 | Registro de mermas | 5 | Baja-Media |
| HU-17 | Créditos y cuentas por cobrar | 8 | Media |
| HU-18 | App Android para ventas | 13 | Alta |
| HU-19 | Módulo de IA (predicción demanda) | 13 | Alta |
| HU-20 | Gestión de usuarios y roles | 5 | Media |
| HU-21 | Recuperación de contraseña | 3 | Baja |
| HU-22 | Alertas de vencimiento | 5 | Media |
| HU-23 | Historial de movimientos | 5 | Media |
| **TOTAL** | | **175 pts** | |

---

### 3.2.3. Sprint Planning

Al inicio de cada sprint realizábamos una sesión de Sprint Planning donde el equipo seleccionaba las historias del Product Backlog que íbamos a trabajar ese sprint, las descomponíamos en tareas y asignábamos responsables. Aquí presentamos el resumen de los sprint plannings realizados:

| Sprint | Duración | Story Points Comprometidos | HUs Incluidas | Objetivo del Sprint |
|---|---|---|---|---|
| Sprint 1 | Semanas 1–2 | 42 pts | HU-20, HU-06 + tareas de arquitectura | Tener el proyecto configurado con autenticación y CRUD de productos funcionando |
| Sprint 2 | Semanas 3–4 | 36 pts | HU-01, HU-02, HU-03, HU-05 | POS web funcional con registro de ventas y múltiples formas de pago |
| Sprint 3 | Semanas 5–6 | 37 pts | HU-07, HU-08, HU-04 | Dashboard operativo, compras a proveedores y facturación SUNAT integrada |
| Sprint 4 | Semanas 7–8 | 26 pts | HU-09, HU-10, HU-22, HU-23 | Reportes, promociones y alertas de vencimiento activas |
| Sprint 5 | Semanas 9–10 | 47 pts | HU-18, HU-11, HU-12, HU-13 | App Android funcional, programa de fidelización y control de caja |
| Sprint 6 | Semanas 11–12 | 31 pts | HU-14, HU-15, HU-16, HU-17 | Devoluciones, gastos, mermas y créditos completados |
| Sprint 7 | Semanas 13–14 | 21 pts | HU-19, HU-21 + QA + Deploy | Módulo IA, correcciones finales, despliegue y capacitación |

---

## 3.3. FASE DE EJECUCIÓN

### 3.3.1. Seguimiento y Validación de los Sprints (Sprint Review)

Al final de cada sprint realizamos una reunión de Sprint Review donde le mostramos al cliente el trabajo completado. El cliente revisaba si lo que habíamos hecho era lo que esperaba y nos daba su retroalimentación. Esta dinámica funcionó muy bien porque evitó que llegáramos al final del proyecto con sorpresas desagradables.

---

**Sprint Review — Sprint 1**

En la revisión del primer sprint mostramos el sistema base funcionando: la pantalla de login, el menú lateral con las secciones del sistema, la gestión de usuarios (crear usuario con rol ADMIN o VENDEDOR, editar, desactivar) y el CRUD de productos con sus categorías. El cliente quedó conforme aunque aclaró que faltaba agregar algunos campos a los productos, como la fecha de vencimiento, que habíamos dejado para después. Acordamos incluirlo en el siguiente sprint.

Resultado del sprint: **42 de 42 story points completados. ✔**

---

**Sprint Review — Sprint 2**

Esta revisión fue la más emocionante porque vimos por primera vez el POS funcionando. Le mostramos al dueño cómo podía buscar un producto por nombre, agregarlo al carrito, aplicar un descuento, cobrar con Yape y que el stock bajara automáticamente. Cuando vio eso, dijo que era exactamente lo que necesitaba. El pago mixto también lo revisamos y lo entendió bien. Quedó un pendiente: quería que en el comprobante después de la venta apareciera el nombre del vendedor. Lo anotamos para ajustarlo.

Resultado del sprint: **36 de 36 story points completados. ✔**

---

**Sprint Review — Sprint 3**

La revisión del tercer sprint fue la más técnica de todas. Le explicamos al cliente cómo funcionaba la facturación electrónica con SUNAT, que en este punto estaba probada en el ambiente sandbox. Vio cómo se generaba el XML, se enviaba al OSE y se descargaba el PDF de la boleta. También revisamos el dashboard con los KPIs y las compras a proveedores. Le gustó mucho el módulo de compras porque le permitía marcar cuando llegaba la mercancía y el inventario se actualizaba solo.

Hubo un ajuste: el cliente quería que en el dashboard también aparecieran los ingresos del día comparados con el día anterior. Lo añadimos como mejora en el sprint siguiente.

Resultado del sprint: **37 de 37 story points completados. ✔**

---

**Sprint Review — Sprint 4**

En este sprint le mostramos los reportes con filtros de fecha, el módulo de promociones donde podía crear descuentos por porcentaje o monto fijo, los packs de productos y las alertas de vencimiento en el inventario. El cliente aprovechó para decirnos que quería poder ver los reportes desglosados por vendedor, porque a veces trabaja con un empleado y quería saber cuánto vendió cada uno. Esa mejora la incorporamos en el sprint 5 dentro de los reportes y el cierre de caja.

Resultado del sprint: **26 de 26 story points completados. ✔**

---

**Sprint Review — Sprint 5**

La revisión del quinto sprint fue muy completa. Mostramos la app Android funcionando en el celular: login, dashboard, búsqueda de productos, carrito, pago y confirmación de venta. El dueño la probó él mismo con su teléfono y pudo registrar una venta de prueba sin ayuda nuestra. También revisamos el programa de fidelización con puntos y el módulo de apertura y cierre de caja. El cierre de caja fue especialmente bien recibido porque le mostraba el resumen del día con el desglose por forma de pago y si había sobrante o faltante en el efectivo.

Resultado del sprint: **47 de 47 story points completados. ✔**

---

**Sprint Review — Sprint 6**

En este sprint presentamos las funcionalidades más administrativas: devoluciones, gastos operativos, mermas y créditos/fiados. El cliente reconoció que el módulo de créditos era algo que no había pedido al inicio pero que lo necesitaba mucho porque tenía varios clientes que compraban al fiado. También le explicamos cómo los gastos (luz, agua, alquiler) ahora aparecen restados en el reporte para que vea la ganancia neta real y no solo el ingreso bruto.

Resultado del sprint: **31 de 31 story points completados. ✔**

---

**Sprint Review — Sprint 7**

En el último sprint mostramos el módulo de inteligencia artificial con predicciones de demanda basadas en el historial de ventas, la recuperación de contraseña por correo y los últimos ajustes del sistema. También hicimos el despliegue del sistema en el equipo del cliente y le dimos una capacitación de dos horas al dueño y a su empleado. La revisión final fue satisfactoria y el cliente firmó la conformidad de entrega.

Resultado del sprint: **21 de 21 story points completados. ✔**

---

### 3.3.2. Scrum Board y Burn Down Chart

Durante el desarrollo del proyecto usamos un tablero Scrum virtual en el que cada historia o tarea podía estar en uno de cuatro estados: **Por Hacer**, **En Progreso**, **En Revisión** y **Hecho**. Esto nos permitió ver de un vistazo cómo íbamos en cada sprint y quién tenía demasiadas cosas en progreso al mismo tiempo.

**Representación del Scrum Board — Sprint 2 (ejemplo)**

| Por Hacer | En Progreso | En Revisión | Hecho |
|---|---|---|---|
| — | Implementar pago Mixto | Pantalla de Inventario | Entidades Venta y DetalleVenta |
| — | Alertas de stock bajo | — | Endpoint POST /ventas |
| — | — | — | Carrito de compras |
| — | — | — | Búsqueda de productos en POS |

**Burn Down Chart — Resumen por Sprint**

El Burn Down Chart a nivel de proyecto muestra cómo fue reduciéndose la cantidad de story points pendientes semana a semana. Al no tener ningún retraso significativo, la curva real se mantuvo muy cercana a la curva ideal durante todo el proyecto.

| Semana | Story Points Restantes (Ideal) | Story Points Restantes (Real) |
|---|---|---|
| Inicio (sem 0) | 175 | 175 |
| Fin Sprint 1 (sem 2) | 133 | 133 |
| Fin Sprint 2 (sem 4) | 97 | 97 |
| Fin Sprint 3 (sem 6) | 60 | 60 |
| Fin Sprint 4 (sem 8) | 34 | 34 |
| Fin Sprint 5 (sem 10) | 0* aprox. | 3 (pendiente menor) |
| Fin Sprint 6 (sem 12) | 0 | 0 |
| Fin Sprint 7 (sem 14) | 0 | 0 |

*El sprint 5 tuvo una pequeña deuda técnica de 3 puntos que se resolvió al inicio del sprint 6 sin impacto en el cronograma general.

---

### 3.3.3. Mantenimiento del Product Backlog

A lo largo del proyecto el Product Backlog no se quedó estático. Lo revisamos al menos una vez por sprint junto con el cliente para añadir nuevas ideas, ajustar prioridades o retirar cosas que ya no eran relevantes. Aquí algunos de los cambios más importantes que hicimos:

**Cambios realizados al Product Backlog:**

| Semana | Tipo de Cambio | Descripción |
|---|---|---|
| Sprint 2 | Refinamiento | Se dividió HU-01 en subtareas más específicas para el carrito y el panel de pago |
| Sprint 3 | Nueva historia | El cliente solicitó que los reportes mostraran ventas desglosadas por vendedor (incorporada en HU-09 actualizada) |
| Sprint 4 | Ajuste de prioridad | HU-17 (créditos/fiado) subió de prioridad baja a media cuando el cliente enfatizó que lo usaba frecuentemente |
| Sprint 5 | Refinamiento | HU-18 se dividió en tareas más granulares por pantalla de la app Android |
| Sprint 6 | Nueva tarea | Se añadió soporte para mostrar el nombre del vendedor en la lista de ventas y en reportes |
| Sprint 7 | Eliminación | Se descartó la exportación de reportes a PDF en esta versión por falta de tiempo; queda para una siguiente iteración |

---

### 3.3.4. Pruebas de Aceptación

Las pruebas de aceptación las realizamos al final del proyecto, en la semana 13, con la participación del cliente y de nosotros como equipo. El objetivo era verificar que cada historia de usuario entregada funcionara como el cliente esperaba en condiciones reales de uso.

Para las pruebas preparamos una lista de escenarios concretos que recorrimos juntos con el dueño del negocio sentado frente al sistema. Él realizaba las acciones y nosotros observábamos si el resultado era el esperado.

**Tabla de Pruebas de Aceptación**

| ID Prueba | Historia de Usuario | Escenario | Resultado Esperado | Resultado Obtenido | Estado |
|---|---|---|---|---|---|
| PA-01 | HU-01 | Registrar una venta de 3 productos con descuento del 10% | Venta registrada, stock descontado, total correcto | Correcto | ✔ Aprobado |
| PA-02 | HU-03 | Pagar una venta S/ 85 con S/ 50 en efectivo y S/ 35 en Yape | Sistema calcula automáticamente el monto del segundo método | Correcto | ✔ Aprobado |
| PA-03 | HU-04 | Emitir una boleta electrónica para una venta | PDF generado, CDR recibida, estado "Enviada" en el sistema | Correcto | ✔ Aprobado |
| PA-04 | HU-05 | Consultar alertas de stock bajo en el módulo de inventario | Se muestran solo los productos con stock inferior al mínimo configurado | Correcto | ✔ Aprobado |
| PA-05 | HU-07 | Crear una compra a proveedor y marcarla como recibida | El stock de los productos sube al marcar como RECIBIDA | Correcto | ✔ Aprobado |
| PA-06 | HU-08 | Ver el dashboard al inicio del día | Se muestran ventas del día, semana y mes, y los productos más vendidos | Correcto | ✔ Aprobado |
| PA-07 | HU-10 | Crear una promoción de 15% de descuento en cervezas y registrar una venta | La promoción se aplica automáticamente al agregar el producto al carrito | Correcto | ✔ Aprobado |
| PA-08 | HU-11/12 | Identificar a un cliente frecuente en la venta, acumular puntos y luego canjearlos | Los puntos se acumulan correctamente; al canjear, el descuento se aplica al total | Correcto | ✔ Aprobado |
| PA-09 | HU-13 | Abrir caja con S/ 200 de fondo, registrar ventas y hacer el cierre | El cierre muestra el resumen correcto y calcula diferencia con el efectivo declarado | Correcto | ✔ Aprobado |
| PA-10 | HU-14 | Registrar la devolución de 2 unidades de un producto vendido | El stock aumenta en 2 y se registra el movimiento en el historial | Correcto | ✔ Aprobado |
| PA-11 | HU-15 | Registrar un gasto de S/ 120 por alquiler del local | El gasto aparece en los reportes y la ganancia neta se recalcula | Correcto | ✔ Aprobado |
| PA-12 | HU-16 | Registrar la merma de 4 botellas dañadas | El stock disminuye en 4 y aparece en el historial de movimientos | Correcto | ✔ Aprobado |
| PA-13 | HU-17 | Registrar una venta a crédito y luego registrar un pago parcial | La deuda disminuye con el pago parcial; el saldo pendiente se actualiza | Correcto | ✔ Aprobado |
| PA-14 | HU-18 | Registrar una venta completa desde la app Android | La venta se registra en el backend y el stock se actualiza igual que desde la web | Correcto | ✔ Aprobado |
| PA-15 | HU-19 | Consultar las predicciones de demanda del módulo IA | El sistema muestra los productos con mayor probabilidad de agotarse próximamente | Correcto | ✔ Aprobado |
| PA-16 | HU-20 | Crear un usuario con rol VENDEDOR e intentar acceder a configuración de usuarios | El sistema bloquea el acceso a la administración de usuarios para el rol VENDEDOR | Correcto | ✔ Aprobado |
| PA-17 | HU-21 | Solicitar recuperación de contraseña ingresando el correo registrado | Se recibe el correo con el enlace; al usarlo se puede cambiar la contraseña | Correcto | ✔ Aprobado |
| PA-18 | HU-22 | Verificar que se muestren alertas para productos con vencimiento en menos de 30 días | Los productos aparecen en la pestaña de alertas con badge de urgencia o advertencia | Correcto | ✔ Aprobado |

**Resumen de pruebas de aceptación:** 18 pruebas realizadas — 18 aprobadas — 0 rechazadas.

---

## 3.4. FASE DE TRANSICIÓN Y CIERRE

### 3.4.1. Retrospectivas de Sprint

Al terminar cada sprint realizamos una reunión de retrospectiva donde el equipo reflexionaba sobre lo que salió bien, lo que salió mal y qué podíamos mejorar para el siguiente sprint. Estas reuniones fueron cortas (máximo 45 minutos) pero muy útiles para no repetir los mismos errores.

---

**Retrospectiva — Sprint 1**

*¿Qué salió bien?*
El equipo se organizó rápido y pudimos dejar la arquitectura bien definida desde el inicio. Eso nos ahorró problemas más adelante. La configuración de Flyway con migraciones versionadas fue una muy buena decisión porque nunca tuvimos conflictos de base de datos entre compañeros.

*¿Qué salió mal?*
Subestimamos el tiempo que tomaría configurar Spring Security con JWT correctamente. Perdimos casi un día y medio en eso.

*¿Qué mejorar?*
Cuando alguien se atora más de dos horas con algo, pedir ayuda al equipo en lugar de seguir solo. También decidimos hacer revisiones diarias de 15 minutos por llamada para no desconectarnos entre los integrantes.

---

**Retrospectiva — Sprint 2**

*¿Qué salió bien?*
El POS quedó funcionando en el tiempo planificado. La lógica del carrito de compras fue más sencilla de lo que pensábamos porque habíamos diseñado bien las entidades en el sprint anterior.

*¿Qué salió mal?*
El pago mixto tomó más tiempo del estimado por los casos borde. Cuando el segundo método era también efectivo había un comportamiento extraño que tardamos en detectar.

*¿Qué mejorar?*
Para historias complejas como el pago mixto, dividirla en tareas más pequeñas antes del sprint para tener mejor visibilidad del avance.

---

**Retrospectiva — Sprint 3**

*¿Qué salió bien?*
Logramos integrar SUNAT en el tiempo que habíamos reservado. Tener un ambiente sandbox desde el inicio del sprint fue clave para ir probando a medida que avanzábamos.

*¿Qué salió mal?*
La documentación del OSE no siempre era clara y tuvimos que hacer varias pruebas de ensayo y error con el XML. En un momento el OSE devolvía un error 400 sin descripción útil y nos tomó tiempo resolverlo.

*¿Qué mejorar?*
Reservar siempre un día completo de "colchón" en las integraciones con servicios externos porque siempre hay algo inesperado.

---

**Retrospectiva — Sprint 4**

*¿Qué salió bien?*
El módulo de reportes quedó bien estructurado desde el backend, lo que hizo que agregar nuevos filtros fuera rápido.

*¿Qué salió mal?*
El módulo de promociones fue más complejo de lo esperado porque había que manejar varios tipos (porcentaje, monto fijo, 2x1) y aplicarlos automáticamente en el POS sin que el vendedor tuviera que hacer nada.

*¿Qué mejorar?*
En el próximo sprint priorizar las historias más complejas al inicio para no quedar apretados al final de la semana.

---

**Retrospectiva — Sprint 5**

*¿Qué salió bien?*
La app Android quedó mejor de lo esperado. Jetpack Compose resultó ser muy productivo una vez que el equipo se familiarizó con él. El cliente quedó muy emocionado al ver el sistema funcionando en su celular.

*¿Qué salió mal?*
La deuda de 3 story points al cierre del sprint fue por un bug en la sincronización del cierre de caja con la app Android que no logramos resolver a tiempo.

*¿Qué mejorar?*
Coordinar mejor los horarios del equipo para los sprints más cargados de trabajo.

---

**Retrospectiva — Sprint 6**

*¿Qué salió bien?*
El módulo de créditos/fiado fue bien recibido y el código quedó limpio porque reutilizamos patrones del módulo de ventas.

*¿Qué salió mal?*
Tuvimos dos días en que casi no avanzamos por las evaluaciones del instituto. Lo habíamos previsto pero aun así nos ajustamos al final.

*¿Qué mejorar?*
Comunicar con anticipación cuando hay semanas con carga académica alta para redistribuir tareas.

---

**Retrospectiva — Sprint 7 (Retrospectiva del Proyecto)**

*¿Qué salió bien?*
Entregamos el 100% de las historias comprometidas. El cliente quedó muy satisfecho con el resultado. La arquitectura del sistema está bien diseñada y sería fácil agregarle más funciones en el futuro.

*¿Qué salió mal?*
La exportación de reportes a PDF quedó fuera del alcance por tiempo. También habría sido bueno tener pruebas automatizadas desde el inicio en lugar de depender solo de pruebas manuales.

*¿Qué mejorar para proyectos futuros?*
- Estimar siempre con un 20% de margen adicional para las integraciones externas.
- Escribir pruebas unitarias desde el inicio del proyecto.
- Documentar los endpoints de la API desde el primer sprint, no al final.
- Acordar con el cliente desde el inicio un día fijo por semana para dudas, para evitar bloqueos largos esperando respuesta.

---

**Retrospectiva del Product Backlog**

Al cerrar el proyecto hicimos también una revisión del Product Backlog para documentar qué quedó para futuras iteraciones del sistema:

| Historia | Motivo por el que quedó fuera | Prioridad futura |
|---|---|---|
| Exportación de reportes a PDF | Falta de tiempo en el sprint 7; la funcionalidad fue descartada en la reunión de mantenimiento del backlog | Alta |
| Modo offline en app Android | Complejidad alta; se implementó la funcionalidad básica pero la sincronización completa quedó pendiente | Media |
| Integración con bancos para conciliación | Fuera de alcance desde el inicio; el cliente lo mencionó como deseo futuro | Baja |
| App móvil para clientes finales | Fuera de alcance; podría ser un proyecto separado | Baja |
| Notificaciones push en app Android | No fue solicitado formalmente; quedó identificado como mejora | Media |

---

### 3.4.2. Conformidad de los Entregables

Al finalizar el proyecto se realizó la verificación formal de que todos los entregables cumplían con los requisitos acordados desde el inicio. El cliente revisó cada módulo del sistema y firmó el acta de conformidad.

**Tabla de Conformidad de Entregables**

| Entregable | Descripción | Cumple Requisitos | Observación |
|---|---|---|---|
| Sistema Web — Módulo POS | Punto de venta con búsqueda, carrito, descuentos y formas de pago | Sí | El cliente confirma que el tiempo de registro bajó a menos de 45 segundos |
| Sistema Web — Módulo Inventario | Stock en tiempo real, alertas de stock bajo y vencimiento, movimientos | Sí | Incluye ajustes manuales y trazabilidad completa |
| Sistema Web — Facturación Electrónica | Generación y envío de boletas y facturas a SUNAT vía OSE | Sí | Probado en ambiente sandbox; credenciales de producción a configurar |
| Sistema Web — Compras a Proveedores | Flujo PENDIENTE → RECIBIDA con actualización automática de stock | Sí | |
| Sistema Web — Promociones y Packs | CRUD de promociones y aplicación automática en POS | Sí | |
| Sistema Web — Fidelización | Acumulación y canje de puntos por cliente | Sí | |
| Sistema Web — Caja | Apertura y cierre de caja con resumen por forma de pago | Sí | |
| Sistema Web — Devoluciones | Devolución parcial o total con restauración de stock | Sí | |
| Sistema Web — Gastos y Mermas | Registro de gastos operativos y mermas con impacto en reportes | Sí | |
| Sistema Web — Créditos/Fiado | Ventas a crédito y seguimiento de pagos parciales | Sí | |
| Sistema Web — Reportes | Reportes por período con desglose por vendedor, categoría y forma de pago | Sí | Exportación a PDF queda para siguiente versión |
| Sistema Web — Dashboard | KPIs en tiempo real: ventas, ticket promedio, productos más vendidos | Sí | |
| Sistema Web — Módulo IA | Predicciones de demanda basadas en historial de ventas | Sí | |
| App Android — POS Móvil | Registro de ventas desde dispositivo Android | Sí | Probado en dispositivo físico del cliente |
| Seguridad | Autenticación JWT, roles ADMIN/VENDEDOR, contraseñas encriptadas con BCrypt | Sí | |
| Documentación técnica | Colección Postman, guía de pruebas, modelo de análisis | Sí | |
| Capacitación | Sesión de capacitación de 2 horas al dueño y al empleado | Sí | Se entregó material de referencia rápida |

El cliente manifestó su conformidad con el sistema entregado y firmó el acta de cierre del proyecto. Se acordó además un período de soporte post-entrega de 30 días para resolver cualquier duda o ajuste menor que surgiera en la operación real del negocio.

---

*Fin del Capítulo III.*
