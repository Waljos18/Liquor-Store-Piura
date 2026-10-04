# SPRINT REVIEW — SPRINT 1
## Sistema Web y Aplicación Móvil – Licorería Chilalo Shot

---

## Información general del Sprint

| | |
|---|---|
| **Sprint** | Sprint 1 |
| **Objetivo del Sprint** | Dejar lista la estructura base del sistema: base de datos, autenticación, gestión de productos y configuración general |
| **Período** | Semanas 1 al 4 (4 semanas) |
| **Fecha de la revisión** | Fin de semana 4 |
| **Responsable del proyecto** | Alumno desarrollador (practicante) |
| **Asistentes a la revisión** | Alumno desarrollador · Propietario de Chilalo Shot · Docente evaluador |

---

## 1. Objetivo del Sprint y resultado general

El objetivo de este primer sprint era construir la base sobre la que se va a apoyar todo el sistema. Esto incluía diseñar la base de datos, levantar el backend con Spring Boot, implementar el login con roles y desarrollar el módulo de gestión de productos en el frontend web.

**Resultado general:** El objetivo del sprint se cumplió satisfactoriamente. Al final de las 4 semanas se cuenta con un sistema web funcional donde el propietario puede ingresar con su usuario, registrar y gestionar todos sus productos, y administrar los usuarios del sistema. La arquitectura quedó sólida y lista para construir los módulos de ventas e inventario en el Sprint 2.

---

## 2. Elementos del backlog planificados para este Sprint

| # | Historia de usuario / Tarea | Estado | Observaciones |
|---|---|:---:|---|
| 1 | Diseño del modelo de base de datos (diagrama entidad-relación) | ✅ Completado | Se diseñaron las tablas: productos, categorías, usuarios, roles, proveedores, clientes |
| 2 | Definición de la arquitectura del sistema (backend + frontend + Android) | ✅ Completado | Arquitectura REST: Spring Boot + React + PostgreSQL + Kotlin |
| 3 | Configuración del repositorio y entornos de desarrollo | ✅ Completado | Repositorio Git configurado con estructura backend / frontend / android |
| 4 | Mockups de interfaces principales (POS, productos, inventario, dashboard) | ✅ Completado | Diseños aprobados por el cliente en reunión de la semana 2 |
| 5 | Módulo de autenticación: login con JWT, roles Administrador y Vendedor | ✅ Completado | Tokens de acceso (1 hora) y refresh (24 horas), cifrado BCrypt |
| 6 | Recuperación de contraseña por correo electrónico | ✅ Completado | Envío de enlace de reset por email con token de seguridad |
| 7 | Gestión de usuarios: crear, editar, activar/desactivar desde Administrador | ✅ Completado | Solo el Administrador puede gestionar usuarios |
| 8 | Gestión de categorías: registro, edición y listado | ✅ Completado | Categorías con nombre y descripción, asociadas a productos |
| 9 | Gestión de productos: registro con todos los campos requeridos | ✅ Completado | Nombre, precio compra/venta, categoría, código de barras, stock mínimo/máximo, fecha de vencimiento, imagen |
| 10 | Búsqueda y filtrado de productos (por nombre, categoría, estado activo) | ✅ Completado | Filtros funcionando en la pantalla de productos del frontend |
| 11 | Configuración del sistema: parámetros generales del negocio | ✅ Completado | RUC, razón social, dirección, datos para facturación |
| 12 | Base de datos con migraciones automáticas Flyway | ✅ Completado | Migraciones V1 a V4 ejecutadas correctamente al iniciar el backend |
| 13 | Levantamiento de requerimientos con el cliente | ✅ Completado | Entrevista con el propietario de Chilalo Shot en semana 1 |

**Total planificado:** 13 tareas
**Total completado:** 13 tareas
**Porcentaje de avance:** 100%

---

## 3. Demostración de funcionalidades entregadas

A continuación se describe lo que se mostró al cliente durante la reunión de revisión del Sprint 1.

### 3.1 Login y control de acceso
Se demostró el ingreso al sistema con dos tipos de usuario:
- **Administrador** (`admin` / `Admin123!`): tiene acceso a todos los módulos del sistema, incluyendo gestión de usuarios, productos, categorías y configuración.
- **Vendedor**: tiene acceso limitado a ventas y consulta de productos, sin poder modificar configuraciones ni usuarios.

Se mostró también la funcionalidad de **recuperación de contraseña**: el usuario ingresa su correo, recibe un enlace y puede restablecer su contraseña desde el navegador.

### 3.2 Gestión de categorías
Se demostró la pantalla de categorías donde el administrador puede:
- Registrar una nueva categoría (por ejemplo: Cervezas, Vinos, Licores, Whiskies, Cigarros)
- Editar el nombre de una categoría existente
- Ver el listado de todas las categorías activas

### 3.3 Gestión de productos
Esta fue la funcionalidad principal del sprint. Se demostró:
- **Registrar un producto nuevo** con: nombre, marca, categoría, precio de compra, precio de venta, código de barras, stock inicial, stock mínimo, stock máximo, fecha de vencimiento e imagen del producto.
- **Editar un producto** existente para actualizar precio o stock mínimo.
- **Buscar productos** por nombre o código de barras usando la barra de búsqueda.
- **Filtrar por categoría** para ver solo los productos de un tipo (ej: solo cervezas).
- **Desactivar un producto** que ya no se vende, sin eliminarlo de la base de datos.
- Se cargaron **10 productos reales de Chilalo Shot** como datos de prueba: Pilsen Callao 650ml, Cristal 650ml, Corona, Cartavio Black 125ml, Whisky Old Parr 750ml, entre otros.

### 3.4 Administración de usuarios
Se demostró cómo el administrador puede:
- Crear un nuevo usuario con nombre, correo y rol (Administrador o Vendedor)
- Ver el listado de usuarios activos del sistema
- Desactivar el acceso de un usuario sin eliminarlo

### 3.5 Configuración del sistema
Se mostró la pantalla de configuración donde se registraron los datos del negocio:
- Razón social: Chilalo Shot
- RUC: 10028596796
- Dirección del establecimiento en Piura
- Datos para la futura configuración de facturación electrónica con SUNAT

---

## 4. Lo que NO se completó en este Sprint

No hubo elementos del backlog sin completar en este sprint. Todas las tareas planificadas se terminaron dentro de las 4 semanas.

Sin embargo, durante el desarrollo surgieron dos tareas adicionales que no estaban en el plan original y que se pudieron incluir por tener tiempo disponible:

| Tarea adicional | Descripción |
|---|---|
| Configuración de seguridad de red (Android) | Se configuró el archivo `network_security_config.xml` para que la app Android pueda conectarse al backend durante el desarrollo, evitando problemas de certificados HTTP |
| Estructura base de la app Android | Se creó la estructura inicial del proyecto Android (Kotlin + Jetpack Compose + Hilt + Retrofit) con la pantalla de login funcional, adelantando trabajo del Sprint 3 |

---

## 5. Métricas del Sprint

| Indicador | Valor |
|---|---|
| Tareas planificadas | 13 |
| Tareas completadas | 13 |
| Tareas adicionales entregadas | 2 |
| Porcentaje de cumplimiento | 100% |
| Horas estimadas de trabajo | ~80 horas |
| Incidentes o bloqueos importantes | 1 (ver sección 6) |

---

## 6. Incidentes y bloqueos durante el Sprint

### Problema encontrado: configuración del entorno de desarrollo en Windows
Durante la semana 1, se presentó una dificultad para hacer correr simultáneamente el backend (Spring Boot en puerto 8080) y el frontend (Vite en puerto 5173) en la misma computadora con Windows 11. El problema era que el frontend no podía comunicarse con el backend por restricciones de CORS.

**Solución aplicada:** Se configuró correctamente el CORS en Spring Boot para permitir solicitudes desde `localhost:5173` y `localhost:3000`. Esto tomó aproximadamente 3 horas adicionales pero quedó resuelto antes de terminar la semana 1.

---

## 7. Feedback del cliente (propietario de Chilalo Shot)

Durante la reunión de revisión al final del Sprint 1, el propietario revisó el sistema en su computadora y dio los siguientes comentarios:

**Aspectos positivos:**
- Le pareció que la pantalla de productos es clara y fácil de usar. Dijo que le gustó poder ver la imagen del producto directamente en la lista.
- Valoró que se puedan filtrar los productos por categoría, ya que en su negocio tiene muchos tipos de bebidas.
- Le gustó que el sistema tenga dos niveles de usuario, porque así puede dar acceso al vendedor sin que este pueda cambiar precios o configuraciones importantes.

**Observaciones y pedidos para el siguiente sprint:**
- Preguntó si en la pantalla de ventas va a poder ver rápidamente si un producto está agotado. Se confirmó que sí, que en el Sprint 2 se verá el stock en tiempo real en el POS.
- Solicitó que en la lista de productos aparezca el stock actual de cada producto para tenerlo visible de un vistazo. **→ Se agrega al backlog del Sprint 2.**
- Mencionó que algunos de sus productos los vende en presentaciones distintas (botella, media botella, caja de 6) y preguntó si se pueden registrar así. Se le explicó que se registrarán como productos distintos o como packs en el Sprint 3.

---

## 8. Retrospectiva del Sprint (reflexión interna del equipo)

Como este es un proyecto académico desarrollado por un solo alumno, la retrospectiva se realiza de forma individual como un ejercicio de mejora continua.

### ¿Qué salió bien?
- Dedicar las primeras dos semanas al diseño y análisis antes de escribir código fue una buena decisión. Evitó tener que rehacer la base de datos después.
- El uso de Flyway para las migraciones de la base de datos funcionó muy bien; permite llevar un historial ordenado de todos los cambios al esquema.
- La arquitectura en capas (Controller → Service → Repository → Entity) del backend mantiene el código organizado y fácil de entender.

### ¿Qué se puede mejorar?
- Se perdió tiempo buscando cómo configurar Tailwind CSS con Vite en la primera semana. Para el siguiente sprint conviene revisar la documentación antes de empezar una tecnología nueva.
- La estimación de tiempo para el módulo de productos fue optimista; tomó casi el doble porque se decidió agregar filtros y búsqueda en el frontend, lo que no estaba en el plan inicial.

### Acciones para el Sprint 2
- Planificar con más detalle las tareas del frontend para no subestimar el tiempo.
- Empezar desde el principio con los tests del backend para no acumularlos al final.
- Coordinar con el cliente con más anticipación para la reunión de validación.

---

## 9. Elementos a llevar al Sprint 2 (backlog actualizado)

Los siguientes elementos entran al backlog del Sprint 2 como resultado de esta revisión:

| # | Elemento | Origen |
|---|---|---|
| 1 | Mostrar el stock actual de cada producto en la lista de productos | Pedido del cliente en la revisión del Sprint 1 |
| 2 | Módulo de Punto de Venta (POS) web completo | Planificado en Sprint 2 |
| 3 | Facturación electrónica – integración con SUNAT | Planificado en Sprint 2 |
| 4 | Control de inventario con alertas automáticas | Planificado en Sprint 2 |
| 5 | Gestión de compras y proveedores | Planificado en Sprint 2 |
| 6 | Apertura y cierre de caja | Planificado en Sprint 2 |
| 7 | Gastos operativos | Planificado en Sprint 2 |
| 8 | Devoluciones y mermas | Planificado en Sprint 2 |
| 9 | Crédito y cuentas por cobrar | Planificado en Sprint 2 |

---

## 10. Conclusión del Sprint 1

El primer sprint cerró de manera exitosa. Se logró construir la base técnica del sistema: la base de datos está diseñada e implementada, el backend responde correctamente a las peticiones del frontend, el sistema de autenticación funciona con seguridad, y el módulo de gestión de productos está completamente operativo.

El cliente quedó satisfecho con lo presentado y tiene expectativas positivas sobre lo que viene en el Sprint 2, que es el más importante del proyecto: el punto de venta y la facturación electrónica. El equipo (el alumno desarrollador) entra al Sprint 2 con claridad sobre lo que se debe construir y con las bases técnicas ya resueltas.

---

*Sprint Review elaborado como parte del Trabajo Académico Aplicado (TAA).*
*Instituto de Educación Superior – Piura, Perú. Marzo 2025.*
