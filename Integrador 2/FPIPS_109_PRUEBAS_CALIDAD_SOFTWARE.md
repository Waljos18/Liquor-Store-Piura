# FPIPS-109 — IMPLEMENTACIÓN Y PRUEBAS DE CALIDAD DE SOFTWARE
## Sistema Web y App Móvil para Gestión Integral de Licorería
### Proyecto: Chilalo Shot · Versión 1.0 · Abril 2025

**Integrantes:**

| N° | Apellidos y Nombres |
|----|---------------------|
| 1 | Waljos18 |
| 2 | |
| 3 | |

---

## 1. HISTORIAL DEL DOCUMENTO

### Información del Documento

| Observaciones | Modificado por | Fecha |
|---|---|---|
| Creación del documento de pruebas de calidad. Cobertura completa de los módulos: Auth, POS Android, POS Web, Inventario, Clientes, Ventas, Facturación, Reportes | Waljos18 | 05/04/2025 |

---

## 2. INTRODUCCIÓN

El presente documento describe el plan y la especificación de pruebas de calidad de software del **Sistema Web y Aplicación Móvil "Chilalo Shot"**, sistema POS/ERP para la licorería "Chilalo Shot" de Piura, Perú.

El sistema está compuesto por tres componentes:
- **Backend:** API REST Spring Boot 3.2.5 / Java 17 / PostgreSQL 15 (puerto 8080)
- **Frontend Web:** React 18 + TypeScript + Vite + Tailwind CSS (puerto 5173)
- **App Android:** Kotlin + Jetpack Compose + Hilt + Retrofit

Las pruebas cubren los módulos de autenticación, punto de venta (POS), inventario, clientes, ventas, facturación electrónica y reportes, tanto en la plataforma web como en la aplicación Android.

---

## 3. OBJETIVOS

| N° | Objetivo |
|----|----------|
| 1 | Validar que todos los módulos del sistema funcionan según los requerimientos funcionales definidos en la FICHA-04. |
| 2 | Verificar la correcta integración entre el frontend/app Android y el backend Spring Boot. |
| 3 | Comprobar el flujo completo de venta: desde la búsqueda de productos hasta la emisión del comprobante electrónico SUNAT. |
| 4 | Asegurar que el control de stock se actualiza automáticamente tras cada venta, anulacion de venta o movimiento de inventario. |
| 5 | Verificar la seguridad del sistema: autenticación JWT, control de roles (ADMIN / VENDEDOR) y restricción de endpoints. |
| 6 | Documentar los resultados esperados de cada caso de prueba para su validación por el cliente. |

---

## 4. ALCANCES

### Módulos cubiertos por las pruebas:

| Módulo | Plataforma | Tipo de Prueba |
|--------|-----------|----------------|
| Autenticación (Login/Logout) | Android + Web | Funcional, Seguridad |
| Punto de Venta — POS | Android + Web | Funcional, Integración |
| Gestión de Inventario | Android + Web | Funcional |
| Gestión de Productos | Android + Web | Funcional |
| Gestión de Clientes | Android + Web | Funcional |
| Historial de Ventas | Android + Web | Funcional |
| Facturación Electrónica (SUNAT) | Web + Backend | Integración, Funcional |
| Reportes y Dashboard | Android + Web | Funcional |
| Anulaciones de Venta | Web + Backend | Funcional |

### Fuera del alcance:
- Pruebas de carga / estrés (JMeter)
- Pruebas de penetración de seguridad avanzada
- Módulo de IA/ML (predicción de demanda)

---

## 5. LISTA DE REQUERIMIENTOS FUNCIONALES

| NUM REQ FUNC | DESCRIPCIÓN |
|---|---|
| **RF01** | El sistema debe permitir al usuario autenticarse con usuario y contraseña, generando un token JWT válido por 1 hora. El sistema debe diferenciar los roles ADMIN y VENDEDOR. |
| **RF02** | El sistema debe permitir registrar ventas mediante el POS: buscar productos por nombre o código de barras, agregar al carrito, aplicar descuentos, seleccionar forma de pago (Efectivo, Tarjeta, Yape, Plin, Transferencia, Mixto) y confirmar la venta. |
| **RF03** | El sistema debe actualizar automáticamente el stock del producto al confirmar una venta. Debe mostrar alertas cuando el stock caiga por debajo del mínimo definido. |
| **RF04** | El sistema debe permitir gestionar el catálogo de productos: crear, editar, activar/desactivar; con filtrado por categoría y búsqueda por nombre. |
| **RF05** | El sistema debe permitir gestionar clientes: registro con tipo/número de documento, nombre, teléfono y email. Mostrar puntos de fidelización acumulados. |
| **RF06** | El sistema debe emitir comprobantes electrónicos (boleta y factura) integrados con SUNAT vía OSE, generando XML UBL 2.1 y almacenando el CDR de respuesta. |
| **RF07** | El sistema debe mostrar un dashboard con KPIs: ventas del día, monto total, ticket promedio, stock bajo. Los reportes deben filtrarse por rango de fechas. |
| **RF08** | El sistema debe permitir registrar anulaciones (parciales o totales) de ventas, restaurando automaticamente el stock de los productos anulados. |

---

## 6. LISTA DE CASOS DE USO

| NUM CASO USO | DESCRIPCIÓN |
|---|---|
| **CU01** | **Iniciar Sesión:** El usuario ingresa sus credenciales (usuario + contraseña). El sistema valida contra el backend, genera token JWT y redirige según rol. |
| **CU02** | **Registrar Venta en POS:** El cajero busca productos, los agrega al carrito, selecciona cliente (opcional), aplica descuento, elige forma de pago y confirma la venta. |
| **CU03** | **Emitir Comprobante Electrónico:** Tras una venta, el usuario solicita boleta o factura. El backend genera el XML, lo envía al OSE y registra la respuesta SUNAT. |
| **CU04** | **Consultar y Gestionar Inventario:** El administrador visualiza el stock actual, las alertas de stock bajo y los movimientos de inventario. Puede registrar movimientos manuales (entrada/salida/ajuste). |
| **CU05** | **Gestionar Productos:** El administrador crea, edita y activa/desactiva productos en el catálogo, asignando categoría, precio de venta, precio de compra, stock mínimo/máximo y código de barras. |
| **CU06** | **Gestionar Clientes:** El usuario registra o actualiza clientes con sus datos personales y tipo de documento (DNI/RUC). Puede consultar el historial de compras y los puntos de fidelización. |
| **CU07** | **Consultar Historial de Ventas:** El usuario visualiza las ventas registradas con filtros por fecha, forma de pago y estado. Puede ver el detalle de cada venta y emitir comprobante pendiente. |
| **CU08** | **Registrar Anulacion de Venta:** El administrador procesa una anulacion de venta (parcial por producto/cantidad o total), con motivo obligatorio. El sistema restaura el stock automaticamente. |

---

## 7. TRAZABILIDAD DE PRUEBAS — MATRIZ RF vs CU

| | **RF01** Auth | **RF02** POS | **RF03** Stock | **RF04** Productos | **RF05** Clientes | **RF06** Factura | **RF07** Reportes | **RF08** Anulac. |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **CU01** Iniciar Sesión | ✔ | | | | | | | |
| **CU02** Registrar Venta POS | ✔ | ✔ | ✔ | | ✔ | | | |
| **CU03** Emitir Comprobante | ✔ | | | | ✔ | ✔ | | |
| **CU04** Gestionar Inventario | ✔ | | ✔ | ✔ | | | | |
| **CU05** Gestionar Productos | ✔ | | ✔ | ✔ | | | | |
| **CU06** Gestionar Clientes | ✔ | | | | ✔ | | | |
| **CU07** Historial de Ventas | ✔ | ✔ | | | | ✔ | ✔ | |
| **CU08** Registrar Anulacion de Venta | ✔ | | ✔ | | | | | ✔ |

---

## 8. ESPECIFICACIÓN DE CASOS DE PRUEBA

---

### PRUEBA CU01 — Iniciar Sesión

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | Iniciar Sesión en el Sistema (Web y Android) |
| **DESCRIPCIÓN** | Verificar que el sistema autentica correctamente a los usuarios con credenciales válidas, genera un token JWT y rechaza credenciales inválidas con un mensaje de error apropiado. |
| **PRERREQUISITOS** | 1. El backend Spring Boot está en ejecución (`http://localhost:8080`). 2. Existe el usuario `admin` con contraseña `Admin123!` y rol `ADMIN` en la base de datos. 3. La aplicación web está en ejecución (`http://localhost:5173`) o la app Android está instalada. |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-01-01 | 1. Abrir la app/web. 2. Ingresar usuario: `admin`, contraseña: `Admin123!`. 3. Hacer clic en "Ingresar". | El sistema genera un token JWT. Se redirige al Dashboard principal. El nombre del usuario aparece en la interfaz. **Estado: PASS** |
| CP-01-02 | 1. Ingresar usuario: `admin`, contraseña: `wrongpassword`. 2. Hacer clic en "Ingresar". | El sistema muestra el mensaje de error "Usuario o contraseña incorrectos". No se genera token. No hay redirección. **Estado: PASS** |
| CP-01-03 | 1. Dejar el campo usuario vacío. 2. Ingresar contraseña. 3. Hacer clic en "Ingresar". | El sistema muestra validación de campo requerido. El botón no ejecuta la petición. **Estado: PASS** |
| CP-01-04 | 1. Iniciar sesión correctamente. 2. Copiar el token JWT. 3. Esperar más de 1 hora. 4. Intentar usar el token en un endpoint protegido. | El servidor responde `401 Unauthorized`. El sistema redirige al login. **Estado: PASS** |
| CP-01-05 | 1. Iniciar sesión como `vendedor` (rol VENDEDOR). 2. Intentar acceder a módulo de administración de usuarios. | El sistema deniega el acceso con `403 Forbidden`. El menú de administración no es visible. **Estado: PASS** |

---

### PRUEBA CU02 — Registrar Venta en POS

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | Registrar Venta en el Punto de Venta (POS) — Web y Android |
| **DESCRIPCIÓN** | Verificar el flujo completo de una venta: búsqueda de productos, adición al carrito, selección de forma de pago y confirmación. Verificar que el stock se descuenta correctamente y se genera el registro de venta en la base de datos. |
| **PRERREQUISITOS** | 1. Usuario autenticado (cualquier rol). 2. Existe al menos un producto activo con `stock_actual > 0` (ej.: "Cerveza Pilsen 650ml", precio S/. 5.00, stock: 50). 3. Backend ejecutándose. |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-02-01 | 1. Ir al módulo POS. 2. Buscar "Cerveza Pilsen" en la barra de búsqueda. 3. Verificar que aparece en la lista de resultados. | El producto "Cerveza Pilsen 650ml" aparece con nombre, precio S/. 5.00 y stock disponible. **Estado: PASS** |
| CP-02-02 | 1. Agregar 3 unidades de "Cerveza Pilsen" al carrito. 2. Verificar el total. | El carrito muestra 3 × S/. 5.00 = S/. 15.00. El subtotal y total se actualizan correctamente. **Estado: PASS** |
| CP-02-03 | 1. Con el carrito lleno, aplicar un descuento del 10%. 2. Confirmar la venta con forma de pago "Efectivo". | El total final es S/. 13.50. La venta se registra en BD. El stock de "Cerveza Pilsen" se reduce en 3 unidades (de 50 a 47). **Estado: PASS** |
| CP-02-04 | 1. Seleccionar forma de pago "Mixto". 2. Ingresar S/. 10.00 con Yape y el resto con Efectivo. 3. Confirmar venta. | La venta se registra con forma de pago MIXTO. El total de los dos métodos suma correctamente. **Estado: PASS** |
| CP-02-05 | 1. Intentar agregar un producto con `stock_actual = 0`. | El sistema muestra un mensaje "Sin stock disponible". No se permite agregar el producto al carrito. **Estado: PASS** |
| CP-02-06 | 1. Seleccionar un cliente registrado antes de confirmar la venta. 2. Confirmar la venta. | La venta queda asociada al cliente en BD. Los puntos de fidelización se acumulan según la configuración. **Estado: PASS** |
| CP-02-07 | 1. Ingresar el carrito en la app Android. 2. Confirmar la venta vía `POST /api/v1/ventas`. | La app recibe respuesta exitosa con el `numeroVenta` generado. El diálogo de éxito muestra el total y opciones de comprobante. **Estado: PASS** |

---

### PRUEBA CU03 — Emitir Comprobante Electrónico

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | Emitir Boleta o Factura Electrónica (SUNAT) |
| **DESCRIPCIÓN** | Verificar que el sistema genera correctamente el XML UBL 2.1, lo envía al OSE y registra el CDR de respuesta. Comprobar que el comprobante queda asociado a la venta en la tabla `comprobantes_electronicos`. |
| **PRERREQUISITOS** | 1. Existe una venta registrada en estado COMPLETADA. 2. El backend está configurado con el OSE en ambiente de pruebas (`ambiente=pruebas` en `application.properties`). 3. Usuario autenticado con rol ADMIN o VENDEDOR. |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-03-01 | 1. Ir al historial de ventas. 2. Seleccionar una venta COMPLETADA. 3. Hacer clic en "Emitir Boleta". 4. Ingresar DNI del cliente (ej.: 12345678). 5. Confirmar. | El sistema llama a `POST /api/v1/facturacion/boleta/{ventaId}`. Se genera el XML UBL 2.1. El OSE responde con el CDR. El comprobante queda en estado ACEPTADO en la BD. **Estado: PASS** |
| CP-03-02 | 1. Seleccionar una venta COMPLETADA. 2. Hacer clic en "Emitir Factura". 3. Ingresar RUC: 20123456789, razón social y dirección. 4. Confirmar. | Se genera la factura electrónica con los datos del cliente empresarial. El OSE confirma la recepción. Estado = ACEPTADO. **Estado: PASS** |
| CP-03-03 | 1. Intentar emitir comprobante para una venta que ya tiene comprobante emitido. | El sistema muestra el mensaje "Esta venta ya tiene un comprobante emitido" y no permite duplicar. **Estado: PASS** |
| CP-03-04 | 1. Emitir una boleta. 2. Verificar en la BD la tabla `comprobantes_electronicos`. | El registro contiene: `tipo=BOLETA`, `serie`, `numero`, `xml_content`, `pdf_url`, `estado_sunat=ACEPTADO`, `fecha_emision`. **Estado: PASS** |

---

### PRUEBA CU04 — Consultar y Gestionar Inventario

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | Gestión de Inventario — Alertas y Movimientos Manuales |
| **DESCRIPCIÓN** | Verificar que el sistema muestra las alertas de stock bajo y productos próximos a vencer. Comprobar que los movimientos manuales (ENTRADA, SALIDA, AJUSTE) actualizan el stock correctamente y generan el registro en `movimientos_inventario`. |
| **PRERREQUISITOS** | 1. Existe al menos un producto con `stock_actual <= stock_minimo`. 2. Existe al menos un producto con `fecha_vencimiento` dentro de los próximos 30 días. 3. Usuario autenticado con rol ADMIN. |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-04-01 | 1. Ir al módulo Inventario, pestaña "Alertas". 2. Verificar los productos con stock bajo. | La tabla muestra los productos con `stock_actual <= stock_minimo`. La barra visual `StockBar` refleja el nivel actual. El contador de alertas en el KPI superior es correcto. **Estado: PASS** |
| CP-04-02 | 1. En la pestaña Alertas, sección de vencimientos. 2. Verificar productos con fecha de vencimiento <= 30 días. | Los productos aparecen con badge "Urgente" (≤ 7 días) o "Advertencia" (8–30 días) según corresponda. **Estado: PASS** |
| CP-04-03 | 1. Ir a la pestaña "Movimientos". 2. Hacer clic en "Nuevo Movimiento". 3. Seleccionar tipo ENTRADA, producto "Cerveza Pilsen", cantidad 20, motivo "Compra de proveedor". 4. Guardar. | El stock del producto aumenta en 20 unidades. Se crea un registro en `movimientos_inventario` con `tipo=ENTRADA`, `stock_anterior`, `stock_nuevo` y `motivo`. **Estado: PASS** |
| CP-04-04 | 1. Registrar un movimiento tipo SALIDA con cantidad mayor al stock actual. | El sistema muestra error de validación "Cantidad de salida supera el stock disponible". No se realiza el movimiento. **Estado: PASS** |
| CP-04-05 | 1. Aplicar filtros en Movimientos: tipo=ENTRADA, fecha inicio y fecha fin. | La tabla muestra solo los movimientos que cumplen los filtros. La paginación (15/página) funciona correctamente. **Estado: PASS** |

---

### PRUEBA CU05 — Gestionar Productos

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | CRUD de Productos del Catálogo |
| **DESCRIPCIÓN** | Verificar las operaciones de creación, edición, búsqueda, filtrado y activación/desactivación de productos. Comprobar que las validaciones de campos obligatorios funcionan correctamente. |
| **PRERREQUISITOS** | 1. Usuario autenticado con rol ADMIN. 2. Existen categorías registradas en la BD (ej.: Cervezas, Vinos, Licores). |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-05-01 | 1. Ir a módulo Productos. 2. Hacer clic en "Nuevo Producto". 3. Completar: nombre="Ron Cartavio 750ml", categoría=Licores, precio=S/.35.00, stock mínimo=5. 4. Guardar. | El producto se crea correctamente y aparece en la lista. El `id` se genera automáticamente. El `activo=true` por defecto. **Estado: PASS** |
| CP-05-02 | 1. Intentar crear un producto sin nombre. 2. Hacer clic en Guardar. | El sistema muestra validación "El nombre es requerido". No se envía la petición al backend. **Estado: PASS** |
| CP-05-03 | 1. Buscar producto "Ron Cartavio" en la barra de búsqueda. | Los resultados filtran en tiempo real mostrando solo los productos que contienen "Ron Cartavio". **Estado: PASS** |
| CP-05-04 | 1. Filtrar productos por categoría "Cervezas". | La lista muestra solo los productos de la categoría Cervezas. El chip de categoría queda resaltado. **Estado: PASS** |
| CP-05-05 | 1. Seleccionar un producto activo. 2. Hacer clic en "Desactivar". | El producto cambia a `activo=false`. Ya no aparece en las búsquedas del POS. Sigue visible en el módulo de administración. **Estado: PASS** |
| CP-05-06 | 1. Editar el precio de venta de un producto existente. 2. Guardar. | El precio se actualiza en la BD. Las nuevas ventas usan el precio actualizado. **Estado: PASS** |

---

### PRUEBA CU06 — Gestionar Clientes

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | CRUD de Clientes y Consulta de Fidelización |
| **DESCRIPCIÓN** | Verificar el registro, edición y búsqueda de clientes. Comprobar que los puntos de fidelización se muestran correctamente y que las validaciones de documento evitan duplicados. |
| **PRERREQUISITOS** | 1. Usuario autenticado (cualquier rol). 2. Módulo de clientes accesible desde la navegación. |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-06-01 | 1. Ir al módulo Clientes. 2. Hacer clic en "Nuevo Cliente". 3. Ingresar tipo=DNI, número=12345678, nombre="Juan Pérez", teléfono=987654321. 4. Guardar. | El cliente se registra en BD. Aparece en la lista de clientes con `puntos_fidelizacion=0`. **Estado: PASS** |
| CP-06-02 | 1. Intentar registrar otro cliente con el mismo DNI 12345678. | El sistema muestra error "Ya existe un cliente con este número de documento". **Estado: PASS** |
| CP-06-03 | 1. Buscar cliente por nombre "Juan Pérez" en la barra de búsqueda. | La lista filtra en tiempo real mostrando el cliente "Juan Pérez". **Estado: PASS** |
| CP-06-04 | 1. Seleccionar el cliente "Juan Pérez". 2. Ver detalle: puntos de fidelización. 3. Registrar una venta de S/. 50 asociada al cliente. | Después de la venta, los puntos del cliente aumentan según la regla configurada (1 pto / S/. 5 → +10 puntos). **Estado: PASS** |
| CP-06-05 | 1. En el POS, intentar canjear puntos de fidelización al seleccionar un cliente con puntos. | El POS muestra los puntos disponibles. Al activar el canje, aplica el descuento calculado automáticamente. **Estado: PASS** |

---

### PRUEBA CU07 — Consultar Historial de Ventas

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | Historial de Ventas con Filtros y Detalle |
| **DESCRIPCIÓN** | Verificar que el módulo de ventas muestra el historial correctamente, que los filtros por fecha, forma de pago y estado funcionan, y que el detalle de cada venta es completo. Comprobar la paginación del servidor. |
| **PRERREQUISITOS** | 1. Usuario autenticado con cualquier rol. 2. Existen al menos 5 ventas registradas en distintas fechas y formas de pago. |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-07-01 | 1. Ir al módulo Ventas. 2. Seleccionar preset de fecha "Hoy". | La lista muestra solo las ventas del día actual. Los KPIs (total, cantidad, ticket promedio) se calculan sobre las ventas filtradas. **Estado: PASS** |
| CP-07-02 | 1. Seleccionar preset "Últimos 7 días". 2. Filtrar por forma de pago "Yape". | La lista muestra solo ventas de los últimos 7 días pagadas con Yape. **Estado: PASS** |
| CP-07-03 | 1. Seleccionar preset "Personalizado". 2. Ingresar fecha inicio y fecha fin. 3. Aplicar filtro. | La lista muestra las ventas dentro del rango personalizado. El fetch se dispara al cambiar las fechas. **Estado: PASS** |
| CP-07-04 | 1. Hacer clic en una venta de la lista para ver el detalle. | Se muestra el detalle: número de venta, fecha, cliente (si aplica), productos con cantidad y precio, forma de pago, total, estado y vendedor. **Estado: PASS** |
| CP-07-05 | 1. Verificar la paginación con más de 10 ventas. | Los botones de página cambian la vista correctamente. La paginación es del lado del servidor. **Estado: PASS** |
| CP-07-06 | 1. Seleccionar una venta sin comprobante emitido. 2. Hacer clic en "Emitir Boleta" desde el detalle. | Se abre el modal de emisión de boleta. Tras confirmar, el estado del comprobante aparece como ACEPTADO en el detalle de la venta. **Estado: PASS** |

---

### PRUEBA CU08 — Registrar Anulacion de Venta

| Campo | Detalle |
|-------|---------|
| **NOMBRE DEL CASO DE USO** | Registrar Anulacion de Venta (Parcial o Total) |
| **DESCRIPCIÓN** | Verificar que el sistema procesa correctamente una anulacion de venta. Comprobar que el stock de los productos anulados se restaura automaticamente y que se genera el registro en `anulaciones_venta`. |
| **PRERREQUISITOS** | 1. Usuario autenticado con rol ADMIN. 2. Existe una venta COMPLETADA con al menos 2 productos distintos. 3. Ninguno de los productos anulados debe estar eliminado del catalogo. |

#### Casos de Prueba:

| N° | PASOS | RESULTADO ESPERADO |
|----|-------|--------------------|
| CP-08-01 | 1. Ir al historial de ventas. 2. Seleccionar una venta COMPLETADA. 3. Hacer clic en "Registrar Anulacion". 4. Seleccionar todos los productos. 5. Ingresar motivo "Error de registro". 6. Confirmar. | La anulacion se registra en `anulaciones_venta`. El stock de cada producto se restaura con las cantidades originales. El estado de la venta cambia a ANULADA. **Estado: PASS** |
| CP-08-02 | 1. En el formulario de anulacion, seleccionar solo 1 de los 2 productos. 2. Ingresar cantidad = 1 (anulacion parcial). 3. Confirmar. | Solo el producto seleccionado recupera stock. El otro producto mantiene su stock reducido. La venta pasa a estado ANULADA_PARCIAL. **Estado: PASS** |
| CP-08-03 | 1. Intentar confirmar una anulacion sin ingresar el motivo. | El sistema muestra error de validación "El motivo es requerido". No se procesa la anulacion. **Estado: PASS** |
| CP-08-04 | 1. Intentar registrar una anulacion de una venta que ya fue anulada totalmente. | El sistema muestra "Esta venta ya fue anulada completamente". No se permite la operación. **Estado: PASS** |
| CP-08-05 | 1. Registrar una anulacion. 2. Verificar la tabla `movimientos_inventario`. | Se registra un movimiento de tipo ENTRADA para cada producto anulado, con motivo "Anulacion de venta #XXX". **Estado: PASS** |

---

## 9. RESUMEN DE RESULTADOS DE PRUEBAS

| Caso de Prueba | Módulo | Total Pruebas | PASS | FAIL | Pendiente |
|---|---|:---:|:---:|:---:|:---:|
| CU01 | Autenticación | 5 | 5 | 0 | 0 |
| CU02 | POS — Registro de Venta | 7 | 7 | 0 | 0 |
| CU03 | Facturación Electrónica | 4 | 4 | 0 | 0 |
| CU04 | Inventario | 5 | 5 | 0 | 0 |
| CU05 | Productos | 6 | 6 | 0 | 0 |
| CU06 | Clientes | 5 | 5 | 0 | 0 |
| CU07 | Historial de Ventas | 6 | 6 | 0 | 0 |
| CU08 | Anulaciones de Venta | 5 | 5 | 0 | 0 |
| **TOTAL** | | **43** | **43** | **0** | **0** |

**Cobertura estimada:** 43 casos de prueba sobre 8 módulos principales — cobertura funcional > 90%.

---

*Fecha de Actualización: 05/04/2025 · Versión: 1.0 · Preparado por: IDAT · Página: 1 de 1*
