# FICHA 05 - MODELO DE REQUISITOS: CASOS DE USO Y PROTOTIPOS
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería
### Proyecto: Chilalo Shot

---

## 1. HISTORIAL DEL DOCUMENTO

| Observaciones | Modificado por | Fecha |
|---------------|----------------|-------|
| Creación: Diagrama de paquete, modelos de caso de uso I/II, diagrama de actividad, especificación de casos de uso y prototipos | [Nombre] | [Fecha] |

---

## 2. CONTENIDO DEL DOCUMENTO

Este documento agrupa los entregables del **Modelo de Requisitos** del sistema Chilalo Shot:

1. **Diagrama de Paquete de Sistema** — Estructura de paquetes y subsistemas.
2. **Modelos de Caso de Uso (Modelo de Requisitos) I** — Vista general de actores y casos de uso.
3. **Modelos de Caso de Uso (Modelo de Requisitos) II** — Vista detallada por módulos.
4. **Diagrama de Actividad** — Flujos de procesos principales.
5. **Especificación de Casos de Uso** — Especificaciones detalladas (CUS).
6. **Prototipos (Interfaz de Usuario)** — Descripción de pantallas y prototipos.

---

## 3. DIAGRAMA DE PAQUETE DE SISTEMA

El **Diagrama de Paquete de Sistema** muestra la descomposición del sistema en paquetes (módulos/subsistemas) y sus dependencias, alineado con la arquitectura descrita en FICHA_02 y FICHA_04.

### 3.1 Paquetes principales

| Paquete | Contenido |
|---------|-----------|
| **Interfaz de Usuario** | Sistema Web (React) y Aplicación POS (Electron). |
| **Lógica de Negocio (Backend)** | Módulos: Ventas, Inventario, Facturación, Promociones, Reportes, Fidelización, IA. |
| **Datos** | Base de datos PostgreSQL. |
| **Integraciones Externas** | SUNAT/OSE y Servicio de IA (Python/FastAPI). |

### 3.2 Dependencias entre paquetes

- **Web** y **POS** consumen la API del **Backend**.
- **Backend** persiste en **PostgreSQL** y se comunica con **SUNAT/OSE** (facturación) y con el **Servicio de IA** (recomendaciones y predicción).
- **Módulo de Ventas** depende de Inventario (consulta stock), Facturación (emite comprobante), Promociones (aplica descuentos) y Fidelización (acumula puntos).

### 3.3 Archivo del diagrama

**Archivo PlantUML:** `FICHA_05_Diagrama_Paquete_Sistema.puml`

Para generar la imagen: copie el contenido del archivo en [PlantUML Online](https://www.plantuml.com/plantuml/uml) o use la extensión PlantUML en Cursor/VS Code (`Alt+D`).

---

## 4. MODELOS DE CASO DE USO (MODELO DE REQUISITOS) I

**Vista general:** actores del sistema y casos de uso de negocio (CUN) agrupados por categoría, como base del modelo de requisitos.

### 4.1 Referencia

- **FICHA_03** — Análisis de Casos de Uso de Negocio (CUN), lista de actores, lista de CUN y relaciones.
- **Diagrama:** `FICHA_03_Diagrama_CUN.puml` (actores y CUN por categorías: Operaciones, Gestión comercial, Análisis e IA).

### 4.2 Actores (resumen)

| Actor | Tipo | Descripción breve |
|-------|------|-------------------|
| Dueño/Administrador | Interno | Configuración, inventario, facturación, promociones, clientes, reportes. |
| Vendedor/Empleado | Interno | Ventas en POS, consulta stock, clientes. |
| Cliente | Externo | Participa en la venta; recibe comprobantes y fidelización. |
| SUNAT | Externo | Recibe comprobantes electrónicos. |
| Sistema de IA | Sistema | Recomendaciones, predicción de demanda, insights. |

### 4.3 Casos de uso de negocio (resumen)

| Categoría | Casos de uso |
|-----------|--------------|
| **Operaciones** | Realizar venta en POS, Gestionar inventario, Emitir comprobantes electrónicos |
| **Gestión comercial** | Gestionar promociones y packs, Gestionar clientes y fidelización |
| **Análisis e IA** | Consultar reportes y analytics, Obtener recomendaciones y predicciones de IA |

---

## 5. MODELOS DE CASO DE USO (MODELO DE REQUISITOS) II

**Vista detallada por módulos:** casos de uso del sistema (CUS) desglosados por paquete funcional.

### 5.1 Referencia a diagramas

Los diagramas siguientes están en la carpeta `integrador 3/diagramas/`:

| Archivo | Descripción |
|---------|-------------|
| `casos_de_uso_sistema.puml` | Diagrama completo: todos los actores y casos de uso por paquete (Autenticación, POS, Inventario, Facturación, Promociones, Reportes, IA, Fidelización). |
| `casos_de_uso_pos.puml` | Detalle del módulo Punto de Venta. |
| `casos_de_uso_inventario.puml` | Detalle del módulo Inventario. |
| `casos_de_uso_facturacion_fidelizacion.puml` | Facturación electrónica y programa de fidelización. |
| `casos_de_uso_resumido.puml` | Vista resumida (un caso de uso por área). |

### 5.2 Casos de uso por paquete (resumen)

| Paquete | Casos de uso principales |
|---------|---------------------------|
| **Autenticación** | Iniciar sesión, Cerrar sesión, Gestionar usuarios y roles |
| **POS** | Registrar venta, Buscar producto, Agregar producto, Aplicar pago, Imprimir ticket, Modo offline, Sincronizar |
| **Inventario** | Gestionar productos, Registrar entrada/pack, Consultar stock, Alertas, Historial de movimientos |
| **Facturación** | Emitir boleta/factura electrónica, Consultar estado, Generar PDF/XML |
| **Promociones** | Crear packs y promociones, Aplicar promoción en venta |
| **Reportes** | Ver dashboard, Reportes de ventas/inventario, Exportar Excel/PDF |
| **IA** | Recomendaciones, Predicción de demanda, Sugerencias de compra |
| **Fidelización** | Registrar cliente, Consultar puntos, Canjear puntos, Acumular puntos en venta |

---

## 6. DIAGRAMA DE ACTIVIDAD

Los **diagramas de actividad** describen el flujo de los procesos principales del sistema.

### 6.1 Diagramas disponibles

| Archivo | Descripción |
|---------|-------------|
| `integrador 3/diagramas/flujo_sistema_completo.puml` | Flujo principal: inicio de sesión → POS (buscar, agregar, promociones) → decisión stock → facturación (boleta/factura) → pago → inventario (descontar stock) → fidelización (puntos) → fin. |
| `integrador 3/diagramas/flujo_todos_procesos.puml` | Flujo general por módulos (venta, inventario, fin). |
| `integrador 3/diagramas/flujo_entrada_inventario.puml` | Flujo de entrada de inventario (unidades y packs) y alertas. |

### 6.2 Descripción del flujo principal de venta

1. **Vendedor/Admin:** Iniciar sesión y acceder al sistema.
2. **POS:** Buscar producto (código, nombre, categoría), agregar al carrito, aplicar promociones.
3. **Decisión:** ¿Stock suficiente? — Si no: mostrar “Stock insuficiente” y no completar venta.
4. **Decisión:** ¿Cliente requiere factura? — Si: emitir factura electrónica y enviar a SUNAT/OSE; Si no: emitir boleta electrónica y enviar a SUNAT/OSE.
5. Registrar forma de pago e imprimir ticket.
6. **Inventario:** Descontar unidades del stock y registrar movimiento de salida.
7. **Fidelización:** Si el cliente está registrado, acumular puntos.
8. Venta registrada / Fin.

Para generar las imágenes: usar el contenido de cada `.puml` en [PlantUML Online](https://www.plantuml.com/plantuml/uml) o la extensión PlantUML.

---

## 7. ESPECIFICACIÓN DE CASOS DE USO

A continuación se usa una plantilla estándar para **Casos de Uso del Sistema (CUS)** y se ejemplifica con tres casos.

### 7.1 Plantilla de especificación CUS

| Campo | Descripción |
|-------|-------------|
| **Identificador** | CUS-XX |
| **Nombre** | Nombre del caso de uso |
| **Actor principal** | Quien inicia el caso de uso |
| **Actores secundarios** | Otros actores que participan |
| **Precondiciones** | Estado del sistema antes de iniciar |
| **Postcondiciones** | Estado del sistema al terminar correctamente |
| **Flujo básico** | Pasos numerados del flujo principal |
| **Flujos alternativos** | Variantes (ej. otro tipo de pago) |
| **Flujos de excepción** | Errores (ej. stock insuficiente, fallo SUNAT) |
| **Requisitos especiales** | Usabilidad, rendimiento, seguridad |

### 7.2 CUS-01: Registrar venta en POS

| Campo | Contenido |
|-------|-----------|
| **Identificador** | CUS-01 |
| **Nombre** | Registrar venta en POS |
| **Actor principal** | Vendedor |
| **Actores secundarios** | Cliente, Sistema (aplicación de promociones, inventario, facturación, fidelización) |
| **Precondiciones** | Usuario autenticado con rol Vendedor; existe al menos un producto activo con stock. |
| **Postcondiciones** | Venta registrada; stock actualizado; si aplica, comprobante emitido y puntos acumulados. |
| **Flujo básico** | 1. Vendedor inicia nueva venta. 2. Busca y agrega productos al carrito. 3. Sistema aplica promociones y muestra total. 4. Vendedor registra forma de pago. 5. Si el cliente pide comprobante, vendedor ingresa datos y sistema emite boleta/factura. 6. Sistema registra venta, actualiza inventario y, si corresponde, puntos. 7. Se imprime ticket y se entrega comprobante al cliente. |
| **Flujos alternativos** | 4a. Pago con tarjeta: se registra referencia o autorización. 5a. Sin comprobante: solo ticket. |
| **Flujos de excepción** | E1. Stock insuficiente: sistema informa y no permite completar cantidad. E2. Error al enviar comprobante a SUNAT: se guarda venta en estado “pendiente de envío” y se reintenta o se notifica. E3. Modo offline: venta se guarda localmente y se sincroniza al reconectar. |
| **Requisitos especiales** | Tiempo de venta objetivo 30–45 s; soporte para lector de código de barras y teclado. |

### 7.3 CUS-02: Emitir boleta electrónica

| Campo | Contenido |
|-------|-----------|
| **Identificador** | CUS-02 |
| **Nombre** | Emitir boleta electrónica |
| **Actor principal** | Vendedor |
| **Actores secundarios** | Sistema (OSE/SUNAT) |
| **Precondiciones** | Venta registrada con ítems y total; datos del cliente (DNI, nombre) ingresados; certificado digital y OSE configurados; conexión a internet disponible. |
| **Postcondiciones** | Boleta generada en formato UBL 2.1; enviada a SUNAT vía OSE; CDR almacenado; PDF disponible para entrega. |
| **Flujo básico** | 1. Desde la venta, vendedor solicita “Emitir boleta”. 2. Sistema construye XML UBL 2.1, firma con certificado y envía al OSE. 3. OSE transmite a SUNAT. 4. Sistema recibe CDR y actualiza estado. 5. Sistema genera PDF. 6. Vendedor imprime o envía PDF al cliente. |
| **Flujos alternativos** | 3a. SUNAT rechaza: sistema muestra motivo; se corrige y se reenvía si aplica. |
| **Flujos de excepción** | E1. OSE/SUNAT no disponible: venta queda en “comprobante pendiente”; reintento automático o manual. E2. Certificado inválido o vencido: mensaje claro y documentación de renovación. |
| **Requisitos especiales** | Cumplimiento 100% con normativa SUNAT; no exponer certificado en frontend ni en logs. |

### 7.4 CUS-03: Gestionar producto (alta/edición)

| Campo | Contenido |
|-------|-----------|
| **Identificador** | CUS-03 |
| **Nombre** | Gestionar producto (alta/edición) |
| **Actor principal** | Administrador |
| **Actores secundarios** | Sistema (inventario) |
| **Precondiciones** | Usuario autenticado con rol Administrador. |
| **Postcondiciones** | Producto creado o actualizado en catálogo; si hay stock inicial, movimiento de entrada registrado. |
| **Flujo básico** | 1. Administrador accede al módulo de inventario y elige “Nuevo producto” o un producto existente. 2. Ingresa/edita: nombre, categoría, código de barras, precio, stock mínimo/máximo, fecha de vencimiento (si aplica). 3. En alta, puede indicar stock inicial. 4. Confirma. 5. Sistema valida y guarda; si hay stock inicial, registra movimiento de entrada. |
| **Flujos alternativos** | 2a. Código de barras duplicado: sistema avisa y no permite guardar hasta corregir. |
| **Flujos de excepción** | E1. Datos obligatorios faltantes: mensaje por campo. E2. Stock inicial negativo: no permitir. |
| **Requisitos especiales** | Precisión de inventario >98%; soporte para carga masiva (Excel/CSV) según RCI01. |

---

## 8. PROTOTIPOS (INTERFAZ DE USUARIO)

Descripción de las pantallas principales que debe contemplar el sistema (prototipos de interfaz de usuario), alineados con RI01–RI04 (FICHA_04).

### 8.1 Sistema Web (React) — Responsive

| Pantalla | Descripción |
|----------|-------------|
| **Login** | Usuario y contraseña; recordar sesión (opcional); enlace “Olvidé mi contraseña” si aplica. |
| **Dashboard** | Métricas clave: ventas del día/semana, alertas de stock bajo, productos por vencer; accesos rápidos a POS, inventario, reportes. |
| **Menú principal** | Navegación por módulos: Ventas (POS), Inventario, Facturación, Promociones, Clientes/Fidelización, Reportes, Administración (usuarios, configuración). |
| **Inventario** | Listado de productos con búsqueda y filtros; botones Alta/Editar/Eliminar; formulario de producto (nombre, categoría, código, precio, stock min/max, vencimiento). |
| **Reportes** | Filtros por período; gráficos de ventas e inventario; tabla de datos; botón Exportar (Excel/PDF). |
| **Promociones** | Listado de promociones y packs; crear/editar con vigencia, productos y reglas (%, monto, 2x1, pack). |

### 8.2 Aplicación POS (Electron)

| Pantalla | Descripción |
|----------|-------------|
| **Login POS** | Usuario y contraseña; indicador de estado de conexión (en línea / offline). |
| **Pantalla de venta** | Área de búsqueda (código de barras, nombre); lista de ítems del carrito (producto, cantidad, precio, descuento, subtotal); total a pagar; botones grandes: Efectivo, Tarjeta, Otro; botón “Cobrar” y “Imprimir ticket”; opción “Emitir boleta/factura”. |
| **Modal cliente / comprobante** | Para boleta/factura: DNI/RUC, nombre, dirección si aplica; botón Emitir y descargar PDF. |
| **Barra inferior** | Total de la venta actual; indicador de modo offline y cola de sincronización. |

### 8.3 Criterios de usabilidad (resumen)

- **Consistencia:** Misma paleta de colores, tipografía e iconografía en Web y POS (RI03).
- **POS:** Botones grandes, búsqueda rápida y soporte para teclado y lector de código de barras (RI02).
- **Web:** Navegación clara entre módulos y adaptación a escritorio y tablet (RI01).
- **Hardware:** Interfaz preparada para lector de código de barras e impresora térmica (RI04).

### 8.4 Herramientas sugeridas para prototipos

- **Wireframes:** Figma, Balsamiq o lápiz y papel.
- **Prototipos navegables:** Figma, Adobe XD o React (maquetas estáticas).
- Los prototipos pueden guardarse en una carpeta `prototipos/` o enlazarse desde este documento cuando estén disponibles.

---

**Fecha de actualización:** [Fecha]  
**Versión:** 1.0  
**Preparado por:** [Nombre]
