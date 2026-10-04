# ACTA DE CONSTITUCIÓN DEL PROYECTO

| | |
|---|---|
| **Nombre del proyecto** | Sistema Web y Aplicación Móvil para la Gestión Integral de la Licorería Chilalo Shot |
| **Tipo de proyecto** | Desarrollo de Software – Sistema de Gestión Empresarial |
| **Organización cliente** | Licorería Chilalo Shot |
| **Patrocinador** | Propietario de Licorería Chilalo Shot |
| **Responsable del proyecto** | Alumno desarrollador (practicante) |
| **Fecha de constitución** | Marzo 2025 |
| **Versión** | 1.0 |

---

## 1. Propósito del documento

Este documento tiene como objetivo formalizar el inicio del proyecto de desarrollo de software para la licorería Chilalo Shot, ubicada en la ciudad de Piura. En él se describe el problema que se quiere resolver, los objetivos que se esperan alcanzar, el alcance de lo que se va a desarrollar y los principales aspectos de planificación como el cronograma, el presupuesto, los riesgos y los participantes involucrados.

El acta sirve como punto de partida oficial del proyecto y permite que tanto el responsable del desarrollo como el cliente tengan claro desde un inicio qué se va a hacer, cómo se va a hacer y qué resultados se esperan obtener.

---

## 2. Propósito y justificación

La licorería Chilalo Shot es un negocio familiar pequeño que opera en Piura con 1 a 2 empleados. Actualmente lleva sus ventas en cuadernos o de memoria, no tiene control de inventario, no emite comprobantes electrónicos como lo exige SUNAT y no cuenta con ninguna herramienta tecnológica que le ayude a gestionar mejor su negocio.

Esta situación le genera varios problemas concretos: pierde tiempo en cada venta, comete errores en los cálculos, a veces se queda sin stock de productos que se venden mucho sin darse cuenta, y está expuesta a multas por no cumplir con las obligaciones tributarias. Se estima que estas pérdidas y descuidos le pueden costar al negocio alrededor de S/. 33,000 al año.

El proyecto busca resolver esta situación desarrollando un sistema web y una aplicación móvil para Android que le permita a la licorería digitalizar sus ventas, controlar su inventario en tiempo real, emitir boletas y facturas electrónicas, gestionar promociones y obtener reportes útiles para tomar mejores decisiones. Además, el sistema incluirá un módulo de inteligencia artificial que ayudará a predecir la demanda y sugerir qué productos reponer o promocionar.

---

## 3. Descripción del proyecto

El proyecto consiste en diseñar, desarrollar e implementar un sistema de gestión integral para la licorería Chilalo Shot. La solución estará compuesta por dos partes principales:

- **Sistema web**: accesible desde cualquier navegador (Google Chrome, Edge, etc.), donde se podrán realizar todas las operaciones del negocio como ventas, gestión de productos, control de inventario, facturación electrónica, reportes y más. Está pensado para usarse en la computadora del local.

- **Aplicación móvil Android**: complementa al sistema web permitiendo que el administrador pueda revisar su inventario, consultar ventas y gestionar productos desde su celular o tablet, sin depender de estar frente a la computadora.

El sistema tendrá dos perfiles de usuario: **Administrador** (acceso completo) y **Vendedor** (acceso a ventas e inventario básico). Se desarrollará utilizando las siguientes tecnologías: React + TypeScript para el frontend web, Spring Boot con Java 17 para el backend, PostgreSQL como base de datos, y Kotlin con Jetpack Compose para la aplicación Android. Para el módulo de inteligencia artificial se usará Python.

---

## 4. Alcance del proyecto

### Lo que incluye el proyecto

- **Gestión de productos**: registro de productos con nombre, precio, categoría, código de barras, stock mínimo y máximo, fecha de vencimiento e imagen.
- **Punto de venta (POS) web**: pantalla de caja para hacer ventas rápidas, buscar productos, aplicar promociones automáticamente y cobrar con diferentes métodos de pago (efectivo, tarjeta, Yape, Plin, transferencia, mixto y crédito/fiado).
- **Facturación electrónica**: emisión de boletas y facturas electrónicas conectadas a SUNAT, generación de PDF y XML, y resumen diario de boletas (RCB).
- **Control de inventario**: actualización automática del stock con cada venta, alertas de productos con stock bajo o próximos a vencer, movimientos manuales de inventario y registro de mermas.
- **Compras y proveedores**: registro de órdenes de compra, recepción de mercadería (total o parcial) y gestión de proveedores.
- **Devoluciones**: registro de devoluciones por producto con motivo, restaurando el stock automáticamente.
- **Cuentas por cobrar (crédito/fiado)**: seguimiento de ventas al crédito y registro de pagos parciales o totales.
- **Apertura y cierre de caja**: control del efectivo al inicio y al final del turno, con detección de sobrantes o faltantes.
- **Gastos operativos**: registro de gastos del negocio con categorías definidas.
- **Promociones y packs**: creación de descuentos por porcentaje o monto, packs de productos y promociones temporales.
- **Clientes y fidelización**: registro de clientes con historial de compras, acumulación de puntos por venta y canje de puntos como descuento.
- **Reportes y dashboard**: resumen de ventas del día, semana o mes, ganancias, inventario, gastos, productos más vendidos y reportes exportables en PDF.
- **Inteligencia artificial**: módulo de recomendaciones de productos y predicción de demanda para ayudar al administrador a tomar mejores decisiones.
- **Aplicación Android**: módulo para gestionar inventario, consultar ventas, registrar productos y ver el dashboard desde el celular.
- **Administración**: gestión de usuarios, roles y permisos, configuración de facturación y parámetros del sistema, incluyendo recuperación de contraseña por correo.

### Lo que NO incluye el proyecto

- Aplicación de escritorio independiente (tipo Electron): el POS se usa directamente desde el navegador web.
- Modo sin conexión (offline): el sistema requiere conexión a internet para funcionar. No se contempla sincronización offline porque el negocio cuenta con internet estable.
- Sistema contable completo ni gestión de planilla de trabajadores.
- Tienda en línea (e-commerce) para venta a clientes por internet.
- Aplicación para clientes finales ni sistema de delivery.
- Integración con sistemas bancarios para cobros automáticos.
- Soporte para múltiples sucursales (el sistema es para un solo local).

---

## 5. Objetivos del proyecto

### Objetivo general

Desarrollar e implementar un sistema web y una aplicación móvil Android para la licorería Chilalo Shot en Piura, que permita digitalizar y automatizar sus operaciones de venta, inventario, facturación electrónica y gestión del negocio, con el fin de reducir pérdidas, cumplir con las obligaciones de SUNAT y mejorar la toma de decisiones del propietario.

### Objetivos específicos

1. Implementar un módulo de punto de venta (POS) web que permita registrar ventas en menos de 45 segundos, con múltiples formas de pago y emisión automática de comprobantes.
2. Integrar el sistema con la API de SUNAT para la emisión correcta de boletas y facturas electrónicas, garantizando el cumplimiento normativo.
3. Desarrollar un módulo de control de inventario en tiempo real con alertas automáticas de stock bajo y productos próximos a vencer.
4. Crear un módulo de reportes y dashboard que brinde información actualizada sobre ventas, ganancias, inventario y gastos al propietario.
5. Implementar un programa de fidelización con acumulación y canje de puntos para premiar a los clientes frecuentes.
6. Desarrollar la aplicación Android para que el administrador pueda gestionar el negocio desde su dispositivo móvil.
7. Integrar un módulo de inteligencia artificial que genere recomendaciones de reabastecimiento y predicciones de demanda basadas en el historial de ventas.

---

## 6. Resultados esperados y beneficios

### Beneficios operativos

- **Ventas más rápidas**: se espera reducir el tiempo por venta de 3–5 minutos (proceso manual) a menos de 45 segundos con el POS digital.
- **Inventario bajo control**: el sistema actualizará el stock automáticamente con cada venta y enviará alertas cuando un producto esté por agotarse o por vencerse, evitando pérdidas.
- **Menos errores**: al automatizar los cálculos de precios, descuentos y cambio, se eliminan los errores humanos que antes generaban pérdidas o reclamos.
- **Información disponible en todo momento**: el dueño podrá revisar cómo va su negocio en cualquier momento desde su celular, sin esperar al cierre del día.

### Beneficios económicos

- **Reducción de pérdidas**: se estima que el control de inventario y la reducción de errores puede bajar las pérdidas anuales de S/. 33,000 a menos de S/. 5,000.
- **Sin multas de SUNAT**: al emitir comprobantes electrónicos correctamente, se elimina el riesgo de multas que antes podían superar los S/. 3,000 anuales.
- **Más ventas**: una atención más rápida y productos siempre disponibles puede traducirse en mayor satisfacción del cliente y aumento de ventas.

### Beneficios estratégicos

- El negocio quedará preparado para crecer, ya que el sistema puede manejar mayor volumen de ventas y productos sin necesidad de cambios grandes.
- El propietario tendrá datos reales de su negocio para tomar decisiones más informadas sobre qué comprar, qué promocionar y cuándo.
- La integración con SUNAT abre la posibilidad de emitir facturas a empresas, restaurantes y hoteles, ampliando el mercado potencial.

---

## 7. Requisitos de alto nivel

| Código | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| REQ-01 | Punto de venta (POS) web | Permite registrar una venta completa en menos de 45 segundos, con búsqueda de productos, múltiples formas de pago y aplicación automática de promociones |
| REQ-02 | Facturación electrónica SUNAT | Emite boletas y facturas electrónicas correctamente, genera XML y PDF, y envía el resumen diario de boletas (RCB) sin errores |
| REQ-03 | Control de inventario | Actualiza el stock en tiempo real con cada venta o movimiento, y genera alertas automáticas de stock bajo y vencimiento |
| REQ-04 | Gestión de compras | Permite registrar órdenes de compra y recibir mercadería total o parcialmente, actualizando el inventario |
| REQ-05 | Devoluciones y mermas | Registra devoluciones de ventas y mermas, restaurando o descontando el stock automáticamente |
| REQ-06 | Caja y gastos | Controla la apertura y cierre de caja diario, y permite registrar los gastos operativos del negocio |
| REQ-07 | Clientes y fidelización | Registra clientes, acumula puntos por ventas y permite el canje como descuento en futuras compras |
| REQ-08 | Reportes y dashboard | Genera reportes de ventas, inventario, ganancias y gastos con opción de exportar en PDF |
| REQ-09 | Inteligencia artificial | Ofrece recomendaciones de reabastecimiento y predicciones de demanda basadas en el historial de ventas |
| REQ-10 | Aplicación Android | Permite consultar inventario, ver ventas, gestionar productos y acceder al dashboard desde un dispositivo Android |
| REQ-11 | Seguridad y usuarios | Gestiona acceso con roles (Administrador / Vendedor), autenticación con JWT y cumplimiento de la Ley de Protección de Datos Personales |
| REQ-12 | Rendimiento | El sistema responde en menos de 500ms para el 95% de las solicitudes y está disponible el 99% del tiempo |

---

## 8. Criterios de éxito

### Técnicos
- El sistema web funciona correctamente en los navegadores más usados (Chrome, Edge).
- Las APIs del backend responden en menos de 500ms en condiciones normales de uso.
- La integración con SUNAT emite comprobantes sin errores en ambiente de pruebas y producción.
- La aplicación Android se conecta al backend sin problemas desde la red local y desde internet.
- No se presentan vulnerabilidades críticas de seguridad al momento de la entrega.

### Funcionales
- Todos los módulos descritos en el alcance están implementados y funcionando.
- El POS permite completar una venta (incluyendo selección de productos, pago y emisión de comprobante) en menos de 45 segundos.
- Las alertas de stock bajo y vencimiento funcionan correctamente.
- Los reportes muestran información precisa y actualizada.

### De negocio
- El propietario puede operar el sistema sin dificultad después de una capacitación básica.
- El 100% de las ventas se registran en el sistema durante el periodo de prueba.
- Se emiten comprobantes electrónicos correctamente desde el primer día de uso en producción.

---

## 9. Hitos del proyecto

| N° | Hito | Semana aproximada | Entregable |
|----|------|-------------------|------------|
| 1 | Análisis y diseño aprobados | Semana 2 | Documento de requisitos, modelo de base de datos, mockups de interfaces |
| 2 | Backend core funcional | Semana 5 | APIs de ventas, inventario, productos y autenticación funcionando |
| 3 | Integración con SUNAT | Semana 6 | Emisión de boletas y facturas electrónicas en ambiente de pruebas |
| 4 | Sistema web funcional | Semana 9 | Todos los módulos del frontend web operativos y conectados al backend |
| 5 | Aplicación Android funcional | Semana 11 | App Android con POS, inventario, ventas y dashboard operativos |
| 6 | Módulo de IA integrado | Semana 12 | Recomendaciones de reabastecimiento y predicción de demanda disponibles |
| 7 | Pruebas y correcciones | Semana 13 | Sistema probado sin errores críticos |
| 8 | Entrega y capacitación | Semana 14 | Sistema en producción, usuario capacitado, documentación entregada |

---

## 10. Riesgos identificados

| Riesgo | Probabilidad | Impacto | Plan de respuesta |
|--------|:---:|:---:|---|
| Problemas de integración con la API de SUNAT (cambios en el servicio, errores de certificado digital) | Media | Alto | Hacer pruebas tempranas con el ambiente de sandbox de SUNAT; tener documentación actualizada de la API |
| Cambios en los requerimientos del cliente durante el desarrollo | Alta | Medio | Usar metodología ágil para adaptarse; documentar cada cambio acordado formalmente |
| Demoras en la entrega por dificultades técnicas inesperadas | Media | Alto | Priorizar las funcionalidades más importantes primero; tener un margen de tiempo de reserva al final |
| El cliente no tiene acceso a internet estable en el local | Media | Alto | Verificar la conectividad del establecimiento antes de iniciar; coordinar con el cliente la solución |
| Problemas con el certificado digital o el OSE para facturación | Media | Alto | Asesorar al cliente desde el inicio para que tramite su certificado digital con anticipación |
| El alumno no puede dedicar el tiempo necesario al proyecto | Baja | Alto | Planificar las semanas de trabajo con anticipación; comunicar al docente cualquier inconveniente a tiempo |
| Resistencia del propietario o empleado para usar el sistema nuevo | Media | Medio | Hacer la interfaz lo más sencilla posible; incluir una capacitación práctica al momento de la entrega |

### Oportunidades identificadas

1. **Mercado ampliable**: En Piura hay muchas licorerías pequeñas con los mismos problemas. Una vez terminado el proyecto, el sistema podría adaptarse para ser usado por otros negocios similares.
2. **Acceso al mercado corporativo**: Al emitir facturas electrónicas, Chilalo Shot podrá vender a empresas, restaurantes y hoteles que exigen comprobante.
3. **Ventaja competitiva local**: Pocas licorerías pequeñas en Piura cuentan con un sistema digital completo, lo que posiciona mejor a Chilalo Shot frente a la competencia.
4. **Base para crecer**: El sistema está diseñado de forma modular, por lo que en el futuro se pueden agregar nuevas funcionalidades sin tener que empezar de cero.

---

## 11. Interesados del proyecto

| Interesado | Rol en el proyecto | Interés principal | Influencia |
|---|---|---|:---:|
| Propietario de Chilalo Shot | Cliente / Usuario principal (Administrador) | Que el sistema sea fácil de usar, reduzca pérdidas y cumpla con SUNAT | Alta |
| Vendedor del local | Usuario final (Vendedor) | Que el POS sea rápido y no complique su trabajo diario | Media |
| Clientes de la licorería | Usuarios indirectos | Atención más rápida, precios correctos y comprobante de pago | Baja |
| SUNAT | Entidad reguladora | Cumplimiento de la obligación de emitir comprobantes electrónicos | Alta |
| OSE (Operador de Servicios Electrónicos) | Proveedor de servicio | Correcto envío y validación de comprobantes | Media |
| Docente / Instituto | Evaluador académico | Que el proyecto cumpla con los requisitos del TAA | Alta |
| Alumno desarrollador | Responsable del proyecto | Desarrollar una solución funcional y bien documentada | Alta |

---

## 12. Cronograma preliminar

**Duración total del proyecto:** 14 semanas

| Fase | Actividades principales | Semanas |
|------|------------------------|---------|
| **Fase 1: Análisis y diseño** | Levantamiento de requerimientos, modelo de base de datos, mockups, arquitectura | 1 – 2 |
| **Fase 2: Desarrollo backend** | APIs REST (ventas, inventario, productos, usuarios, facturación, compras, caja, gastos, devoluciones, fidelización) | 3 – 6 |
| **Fase 3: Desarrollo frontend web** | Interfaces de POS, inventario, reportes, configuración, todos los módulos | 7 – 9 |
| **Fase 4: Desarrollo app Android** | Pantallas de POS, inventario, ventas, dashboard en Kotlin + Jetpack Compose | 10 – 11 |
| **Fase 5: IA y optimización** | Módulo de recomendaciones y predicción de demanda en Python | 12 |
| **Fase 6: Pruebas y correcciones** | Pruebas funcionales, corrección de errores, pruebas con el cliente | 13 |
| **Fase 7: Despliegue y capacitación** | Instalación en producción, capacitación al usuario, entrega de documentación | 14 |

---

## 13. Presupuesto preliminar

El proyecto es desarrollado por un alumno practicante como parte de su Trabajo Académico Aplicado, por lo que se utilizan en su mayoría herramientas gratuitas y recursos propios.

| Concepto | Costo estimado |
|----------|:--------------:|
| Mano de obra del desarrollador (practicante) | S/. 0 (proyecto académico) |
| Computadora / laptop (equipo propio del alumno) | S/. 0 |
| Conexión a internet (propia) | S/. 0 |
| IDEs y herramientas de desarrollo (VS Code, IntelliJ Community, Android Studio) | S/. 0 |
| Hosting en la nube (Render, Railway o similar – tier gratuito) | S/. 0 |
| Base de datos en la nube (Supabase, Neon – tier gratuito) | S/. 0 |
| Dominio web (opcional) | S/. 45 aprox. |
| Certificado digital SUNAT (responsabilidad del cliente) | Por cuenta del cliente |
| OSE para facturación electrónica (responsabilidad del cliente) | Por cuenta del cliente |
| **Total estimado del proyecto** | **S/. 45 – S/. 150** |

> **Nota:** Los costos son mínimos porque se trata de un proyecto académico. El alumno usa sus propios equipos, software libre y servicios en la nube con plan gratuito. Los únicos costos que podrían generarse son el dominio web y, si se decide alojar el sistema en un servidor pagado, el costo mensual de hosting (aproximadamente S/. 30–50/mes).

---

## 14. Supuestos

1. El negocio Chilalo Shot cuenta con al menos una computadora y conexión a internet estable en el local para usar el sistema web.
2. El propietario o una persona del negocio tiene disponibilidad para participar en reuniones de validación y pruebas durante el desarrollo.
3. El cliente tramitará su certificado digital y contratará un OSE para la facturación electrónica antes de la implementación en producción.
4. El alumno tendrá acceso a un dispositivo Android para desarrollar y probar la aplicación móvil.
5. Las normativas de SUNAT para facturación electrónica no cambiarán de forma significativa durante las 14 semanas del proyecto.
6. Se dispondrá de datos de prueba del negocio (productos, precios, categorías) para cargar en el sistema durante las pruebas.

---

## 15. Restricciones

1. **Tiempo:** El proyecto debe completarse en un máximo de 14 semanas, de acuerdo al calendario académico.
2. **Equipo de desarrollo:** El proyecto es desarrollado por un único alumno practicante, lo que limita la velocidad de desarrollo y el alcance de funcionalidades.
3. **Presupuesto:** No se cuenta con presupuesto para contratar servicios de pago ni hardware adicional.
4. **Tecnologías:** Se usarán las tecnologías definidas en la arquitectura (React, Spring Boot, PostgreSQL, Kotlin). Cambios tecnológicos importantes requieren justificación.
5. **Cumplimiento tributario:** El sistema debe cumplir obligatoriamente con las normativas de SUNAT vigentes para la emisión de comprobantes electrónicos.
6. **Protección de datos:** El sistema debe cumplir con la Ley N° 29733 (Ley de Protección de Datos Personales del Perú).
7. **Sin modo offline:** El sistema requiere conexión a internet. No se desarrollará modo sin conexión porque el negocio cuenta con internet estable y añadiría complejidad innecesaria.
8. **Un solo local:** El sistema está diseñado para una sola tienda. No contempla múltiples sucursales en esta versión.

---

## 16. Factores críticos de éxito

1. **Participación activa del cliente**: que el propietario valide los avances y dé retroalimentación oportuna en cada entrega.
2. **Integración exitosa con SUNAT**: que la emisión de comprobantes electrónicos funcione correctamente desde el principio, ya que es el requisito más crítico del negocio.
3. **Interfaz sencilla y rápida**: que el POS sea tan fácil de usar que el vendedor no necesite más de 30 minutos de capacitación para empezar a trabajar con él.
4. **Entregas cumplidas en el cronograma**: que cada fase se entregue en el tiempo previsto para no comprometer las fases siguientes.
5. **Pruebas con datos reales**: realizar las pruebas finales con productos, precios y clientes reales del negocio para asegurar que todo funcione en condiciones reales.

---

## 17. Metodología de desarrollo

Para este proyecto se usará una **metodología ágil basada en Scrum**, adaptada al contexto de un proyecto académico individual. Los motivos por los que se eligió este enfoque son:

- Permite entregar el sistema de forma incremental, mostrando avances funcionales en cada sprint.
- Facilita adaptarse a los cambios en los requerimientos que pueden surgir a medida que el cliente ve el sistema en funcionamiento.
- Hace más visible el progreso del proyecto para el docente evaluador.
- Es la metodología más usada en la industria del desarrollo de software actualmente.

**Configuración de los sprints:**
- Duración de cada sprint: 2 semanas
- Reunión de planificación al inicio de cada sprint
- Revisión del avance con el cliente al final de cada sprint
- Retrospectiva para mejorar el proceso en el siguiente sprint

---

## 18. Aprobación del proyecto

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Patrocinador / Cliente | | _______________ | ___/___/_____ |
| Responsable del proyecto | | _______________ | ___/___/_____ |
| Docente evaluador | | _______________ | ___/___/_____ |

---

*Documento elaborado por el alumno desarrollador del proyecto como parte del Trabajo Académico Aplicado (TAA).*
*Instituto de Educación Superior – Piura, Perú.*
*Versión 1.0 – Marzo 2025*
