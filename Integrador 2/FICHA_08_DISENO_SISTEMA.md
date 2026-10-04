# FICHA 08 — DISEÑO DEL SISTEMA
## Sistema Web y App Móvil para Gestión Integral de Licorería
### Proyecto: Chilalo Shot

---

## 1. HISTORIAL DEL DOCUMENTO

### Información del Documento

| Observaciones | Modificado por | Fecha |
|---|---|---|
| Creación inicial: Diseño de interfaces móviles (Login, Dashboard, POS), interfaces web (POS, Ventas) y modelo de persistencia | Waljos18 | 04/04/2025 |
| Actualización: Inclusión de módulos Inventario, Clientes, Ventas Android; diagramas UML completos | Waljos18 | 05/04/2025 |

---

## 2. INTRODUCCIÓN

El presente documento describe el diseño técnico del **Sistema Web y Aplicación Móvil** para la licorería **"Chilalo Shot"** ubicada en Piura, Perú. El proyecto comprende tres componentes principales:

- **Backend:** API REST desarrollada con Spring Boot 3.2.5 (Java 17), base de datos PostgreSQL 15 y seguridad JWT.
- **Frontend Web:** Aplicación React 18 + TypeScript + Vite con Tailwind CSS para gestión administrativa y punto de venta web.
- **Aplicación Android:** App nativa Kotlin + Jetpack Compose + Hilt + Retrofit, orientada a gestión móvil en el punto de venta.

El diseño sigue una arquitectura en capas estricta (`Controller → Service → Repository → Entity`) en el backend y arquitectura MVVM (`ViewModel → Repository → Remote/Local`) en el cliente Android, garantizando separación de responsabilidades, escalabilidad y mantenibilidad.

---

## 3. OBJETIVOS

| N° | Objetivo |
|----|----------|
| 1 | Definir la especificación de casos de uso (ECU) para las interfaces móviles y web del sistema Chilalo Shot. |
| 2 | Documentar el diseño visual y funcional de cada pantalla (componentes, herramientas, formularios). |
| 3 | Establecer el modelo de persistencia (diagrama ER físico, clases, despliegue, secuencia y componentes). |
| 4 | Describir la relación Activity–ViewModel–Screen de la aplicación Android mediante Jetpack Navigation + Compose. |
| 5 | Servir de referencia técnica para el equipo de desarrollo e integración durante el sprint de construcción. |

---

## 4. ALCANCES

### 4.1 Incluido

| Módulo | Plataforma | Descripción |
|--------|-----------|-------------|
| Autenticación (Login/Logout) | Android + Web | Ingreso con usuario/contraseña, JWT, redirección por rol |
| Dashboard | Android + Web | KPIs de ventas del día, stock bajo, alertas en tiempo real |
| Punto de Venta (POS) | Android + Web | Búsqueda de productos, carrito, formas de pago, confirmar venta |
| Inventario | Android + Web | Lista de productos, stock, alertas de stock bajo/vencimiento |
| Clientes | Android + Web | CRUD clientes, puntos de fidelización |
| Ventas | Android + Web | Historial de ventas, filtros, detalle, emisión de comprobante |
| Productos | Android + Web | Catálogo, filtros por categoría, búsqueda |
| Facturación Electrónica | Web + Backend | Emisión boleta/factura SUNAT vía OSE |

### 4.2 Excluido

- Módulo de contabilidad completa
- Gestión de nómina de empleados
- E-commerce / venta online
- App para clientes finales
- Módulo de delivery

---

## 5. DISEÑO (ECU) Y SU PROPÓSITO

### 5.1 INTERFASE MÓVIL 01 — Autenticación / Login

| Cod. CU | Nombre Caso de Uso | RF | Descripción |
|---------|-------------------|----|-------------|
| CU-MOB-01 | Iniciar Sesión en App Móvil | RF-AUTH-01 | El usuario (Administrador o Vendedor) ingresa su nombre de usuario y contraseña en la aplicación Android. El sistema valida las credenciales contra el backend Spring Boot (`POST /api/v1/auth/login`), recibe un token JWT y lo persiste en DataStore. Si la autenticación es exitosa, navega a `MainScreen`; en caso contrario muestra mensaje de error. |
| CU-MOB-02 | Cerrar Sesión | RF-AUTH-02 | El usuario presiona el botón "Logout" en la TopAppBar del Dashboard. El sistema borra el token JWT del DataStore y redirige a `LoginScreen`. |

---

#### 5.1.1 DISEÑO INTERFASE MÓVIL 01 — Login Screen

**LA PANTALLA MUESTRA:**

Pantalla de fondo con degradado azul oscuro (brush: `#1E3A5F → #0D1B2A`). Centrado verticalmente, muestra un ícono de licorería (`Icons.Default.Liquor`), el título **"Chilalo Shot"** y subtítulo **"Sistema de Gestión"**. Debajo, una `Card` con bordes redondeados contiene los campos de ingreso y el botón de acción.

| ID | Herramienta | Formulario / Descripción |
|----|-------------|--------------------------|
| IC-01 | `Icon` (Material3) | Ícono de licorería (`Liquor`) — 72 dp — color `#2563EB` |
| LBL-01 | `Text` (headlineMedium) | Título: **"Chilalo Shot"** |
| LBL-02 | `Text` (bodyMedium) | Subtítulo: **"Sistema de Gestión"** |
| CARD-01 | `Card` (ElevatedCard) | Contenedor principal de formulario — esquinas 16 dp |
| LBL-03 | `Text` (titleMedium) | Label: **"Iniciar Sesión"** |
| TXT-01 | `OutlinedTextField` | Campo: **Usuario** — `KeyboardType.Text` — ícono persona |
| TXT-02 | `OutlinedTextField` | Campo: **Contraseña** — `PasswordVisualTransformation` — ícono ojo |
| LBL-ERR | `Text` (bodySmall, color rojo) | Mensaje de error de autenticación (visible solo si hay error) |
| BTN-01 | `Button` (filled) | **"Ingresar"** — ancho completo — color primario `#2563EB` |
| PROG-01 | `CircularProgressIndicator` | Indicador de carga — visible mientras se procesa la petición |

**Flujo de interacción:**
1. Usuario escribe `username` en TXT-01.
2. Usuario escribe `password` en TXT-02.
3. Presiona BTN-01 → `LoginViewModel.login(username, password)`.
4. Se muestra PROG-01 mientras el ViewModel procesa.
5. Si éxito → `onNavigateToHome()` → `MainScreen`.
6. Si error → LBL-ERR muestra `"Usuario o contraseña incorrectos"`.

**Archivo:** `ui/login/LoginScreen.kt` · `ui/login/LoginViewModel.kt`

---

### 5.2 Interfase 02 Móvil — Dashboard / Menú Principal

| Cod. CU | Nombre Caso de Uso | RF | Descripción |
|---------|-------------------|----|-------------|
| CU-MOB-03 | Ver Dashboard Principal | RF-DASH-01 | El usuario autenticado accede al Dashboard que muestra KPIs del negocio: ventas del día (`totalVentasHoy`), monto total (`montoVentasHoy`), productos con stock bajo y alertas activas. Los datos se obtienen de `GET /api/v1/reportes/dashboard`. |
| CU-MOB-04 | Navegar entre Módulos | RF-NAV-01 | La `NavigationBar` inferior permite cambiar entre las pestañas: Inicio, Caja (POS), Productos, Ventas, Inventario y Clientes. |
| CU-MOB-05 | Configurar Servidor | RF-CFG-01 | El usuario puede cambiar la URL base del servidor (IP y puerto) mediante el diálogo `ServerConfigDialog` accesible desde el ícono de configuración en la TopAppBar del Dashboard. |

---

**Fecha de Actualización: 04/04/2025 · Versión: 1.0 · Preparado por: IDAT · Página: 4 de 10**

---

**LA PANTALLA MUESTRA:**

`Scaffold` con `CenterAlignedTopAppBar` (título "Chilalo Shot", íconos de refresh, wifi y logout) y `NavigationBar` inferior con 6 pestañas. El cuerpo es una `LazyColumn` con tarjetas KPI y sección de alertas.

| ID | Herramienta | Formulario / Descripción |
|----|-------------|--------------------------|
| TOPBAR-01 | `CenterAlignedTopAppBar` | Barra superior — título: **"Chilalo Shot"** — fondo `primaryContainer` |
| IC-WIFI | `IconButton` + `Icon` (Wifi/WifiOff) | Indicador de conectividad con el servidor — color verde/rojo |
| IC-REFRESH | `IconButton` + `Icon` (Refresh) | Recarga datos del dashboard — llama `DashboardViewModel.load()` |
| IC-LOGOUT | `IconButton` + `Icon` (Logout) | Cierra sesión — llama `onLogout()` |
| CARD-KPI-01 | `Card` (ElevatedCard) | KPI: **Ventas del Día** — ícono `Receipt` — valor numérico + total S/. |
| CARD-KPI-02 | `Card` (ElevatedCard) | KPI: **Stock Bajo** — ícono `Warning` — color ámbar si > 0 |
| CARD-KPI-03 | `Card` (ElevatedCard) | KPI: **Ingresos Hoy** — ícono `TrendingUp` — monto en soles |
| CARD-KPI-04 | `Card` (ElevatedCard) | KPI: **Productos Activos** — ícono `ShoppingCart` |
| NAV-01 | `NavigationBar` | Barra inferior — 6 ítems: Inicio · Caja · Productos · Ventas · Inventario · Clientes |
| NAV-ITEM-01..06 | `NavigationBarItem` | Cada ítem con ícono y etiqueta — seleccionado resaltado con color `primary` |
| PROG-01 | `CircularProgressIndicator` | Visible en el centro mientras `isLoading = true` |
| DIALOG-CFG | `ServerConfigDialog` | Diálogo emergente para configurar IP:Puerto del servidor backend |

**Archivo:** `ui/dashboard/DashboardScreen.kt` · `ui/dashboard/DashboardViewModel.kt` · `ui/main/MainScreen.kt`

---

### 5.3 Interfase 03 Móvil — Punto de Venta (POS) Android

| Cod. CU | Nombre Caso de Uso | RF | Descripción |
|---------|-------------------|----|-------------|
| CU-MOB-06 | Buscar Producto en POS | RF-POS-01 | El cajero escribe en la barra de búsqueda para filtrar productos por nombre o código de barras. Chips de categoría permiten filtrar por categoría. Llama `GET /api/v1/productos?search=&categoriaId=`. |
| CU-MOB-07 | Agregar Producto al Carrito | RF-POS-02 | Al tocar un producto de la lista, se añade al carrito (o incrementa su cantidad). El badge del botón "Ver carrito" se actualiza con el total de ítems. |
| CU-MOB-08 | Gestionar Carrito | RF-POS-03 | En el `ModalBottomSheet` del carrito: el cajero puede cambiar cantidad (+ / -), seleccionar cliente, aplicar descuento (%), elegir forma de pago (Efectivo/Tarjeta/Yape/Plin/Transferencia/Mixto) y confirmar la venta. |
| CU-MOB-09 | Confirmar Venta | RF-POS-04 | Al confirmar, se envía `POST /api/v1/ventas` con el carrito, forma de pago, cliente y descuento. Si exitoso, aparece el diálogo de éxito con opciones de emitir boleta o factura electrónica. |
| CU-MOB-10 | Emitir Comprobante desde POS | RF-POS-05 | Desde el diálogo de venta exitosa, el cajero puede emitir boleta (`POST /api/v1/facturacion/boleta/{ventaId}`) o factura (`POST /api/v1/facturacion/factura/{ventaId}`). |

---

**LA PANTALLA MUESTRA:**

Vista principal con `SearchBar` y `LazyRow` de chips de categoría arriba, `LazyVerticalGrid` de productos en el centro, y un `FloatingActionButton` (o barra inferior) con el total del carrito y botón de acceso. Al tocar "Ver carrito", aparece un `ModalBottomSheet` con los ítems, controles y opciones de pago.

| ID | Herramienta | Formulario / Descripción |
|----|-------------|--------------------------|
| SEARCH-01 | `SearchBar` / `OutlinedTextField` | Búsqueda de productos por nombre o código — `KeyboardType.Text` |
| CHIPS-CAT | `LazyRow` + `FilterChip` | Chips de categoría: Todas, Cervezas, Vinos, Licores, Gaseosas, etc. |
| GRID-PROD | `LazyVerticalGrid` (2 columnas) | Tarjetas de producto — nombre, precio, stock, badge de cantidad en carrito |
| CARD-PROD | `Card` | Tarjeta de producto — imagen/ícono, nombre, precio S/., stock actual |
| BADGE-QTY | `Badge` | Badge rojo sobre la tarjeta indicando cantidad en carrito |
| FAB-CARRITO | `ExtendedFloatingActionButton` | **"Ver carrito (N) · S/. XX.XX"** — abre `ModalBottomSheet` |
| SHEET-01 | `ModalBottomSheet` | Bottom sheet del carrito — lista de ítems, controles y pago |
| LIST-ITEMS | `LazyColumn` | Lista de ítems del carrito con nombre, precio unitario, subtotal |
| BTN-MINUS | `IconButton` + `Icon(Remove)` | Disminuye cantidad del ítem — mínimo 1 |
| TXT-QTY | `Text` | Cantidad actual del ítem en el carrito |
| BTN-PLUS | `IconButton` + `Icon(Add)` | Aumenta cantidad del ítem |
| DROP-CLIENTE | `ExposedDropdownMenuBox` | Selector de cliente (opcional) — lista de clientes registrados |
| TXT-DESCUENTO | `OutlinedTextField` | Campo descuento (%) — `KeyboardType.Decimal` |
| RADIO-PAGO | `RadioButton` × 6 | Forma de pago: Efectivo / Tarjeta / Yape / Plin / Transferencia / Mixto |
| BTN-CONFIRM | `Button` (filled, verde) | **"Confirmar Venta — S/. XX.XX"** — ancho completo |
| DIALOG-OK | `AlertDialog` | Diálogo de venta exitosa: N° venta, total, botones Boleta / Factura / Cerrar |

**Archivo:** `ui/pos/POSScreen.kt` · `ui/pos/POSViewModel.kt` · `data/repository/PosRepository.kt`

---

### 5.4 Interfase 04 Web — Punto de Venta (POS) React

| Cod. CU | Nombre Caso de Uso | RF | Descripción |
|---------|-------------------|----|-------------|
| CU-WEB-01 | Realizar Venta en POS Web | RF-WEB-POS-01 | El vendedor busca productos por texto o filtra por chips de categoría, los agrega al carrito, aplica descuentos, selecciona forma de pago (incluyendo MIXTO con dos métodos) y confirma la venta. Tras la venta puede emitir boleta/factura electrónica en línea. |
| CU-WEB-02 | Aplicar Pago MIXTO | RF-WEB-POS-02 | Al seleccionar MIXTO, aparecen dos campos: primer método con monto y segundo método con cálculo automático del resto. |
| CU-WEB-03 | Emitir Comprobante Post-Venta | RF-WEB-POS-03 | Panel post-venta con resumen de la transacción y botones de emisión de boleta y factura electrónica mediante modales inline. |

---

**LA PANTALLA MUESTRA:**

Diseño en dos columnas: izquierda (catálogo + búsqueda) y derecha (carrito). Barra de chips de categoría en la parte superior del catálogo. Panel inferior del carrito con tabla inline, descuento, selector de forma de pago y botón de cobro.

| ID | Herramienta | Formulario / Descripción |
|----|-------------|--------------------------|
| INPUT-SEARCH | `<input>` (Tailwind) | Buscador de productos — debounce 300 ms — mínimo 2 caracteres |
| CHIPS-CAT | `<button>` chips (Tailwind) | Categorías de producto — activa resalto con `bg-blue-600` |
| GRID-PROD | `<div>` grid CSS | Cuadrícula de productos — 3 columnas en desktop, 2 en tablet |
| CARD-PROD | `<div>` card | Tarjeta de producto: nombre, marca, precio, stock — clic para agregar |
| TABLE-CARRITO | `<table>` (Tailwind) | Tabla del carrito: producto, cantidad editable inline, precio, subtotal, eliminar |
| INPUT-DESC | `<input type="number">` | Campo de descuento: porcentaje o monto fijo — toggle entre modos |
| SELECT-PAGO | `<select>` o botones radio | Forma de pago: Efectivo / Tarjeta / Yape / Plin / Transferencia / Mixto |
| PANEL-MIXTO | `<div>` condicional | Visible solo si MIXTO: campo monto método 1, selector método 2, monto 2 auto-calculado |
| SELECT-CLIENTE | `<select>` buscable | Selector de cliente (opcional) — muestra puntos de fidelización disponibles |
| DIV-TOTAL | `<div>` resumen | Subtotal, descuento, IGV (18%), **Total** a pagar |
| BTN-COBRAR | `<button>` primary | **"Cobrar S/. XX.XX"** — ejecuta `POST /api/v1/ventas` |
| PANEL-POSTSALE | `<div>` deslizable | Panel post-venta: N° venta, total, botones Boleta / Factura |
| MODAL-BOLETA | `<dialog>` / modal | Formulario de emisión de boleta — dni cliente, confirmación |
| MODAL-FACTURA | `<dialog>` / modal | Formulario de emisión de factura — RUC, razón social, dirección |

**Archivo:** `frontend/src/pages/POS.tsx`

---

### 5.5 Interfase 05 Web — Gestión de Inventario

| Cod. CU | Nombre Caso de Uso | RF | Descripción |
|---------|-------------------|----|-------------|
| CU-WEB-04 | Ver Alertas de Inventario | RF-INV-01 | Pestaña Alertas muestra tabla de productos con stock bajo y tabla de productos por vencer, con indicadores visuales (`StockBar`, badges Urgente/Advertencia). |
| CU-WEB-05 | Registrar Movimiento Manual | RF-INV-02 | Modal que permite registrar movimientos de tipo ENTRADA / SALIDA / AJUSTE para un producto, con campo de motivo libre. |
| CU-WEB-06 | Ver Historial de Movimientos | RF-INV-03 | Pestaña Movimientos con filtros (tipo, rango de fechas, producto) y paginación servidor (15 por página). |

---

## 6. MODELO DE PERSISTENCIA

### 6.1 DIAGRAMA ENTIDAD-RELACIÓN — FÍSICO

**Servidor:** localhost (desarrollo) / servidor de producción
**Puerto DB:** 5432
**Base de datos:** `licoreria_db`
**Motor:** PostgreSQL 15
**Usuario app:** `licoreria_user`

#### Tablas principales y relaciones

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│  usuarios   │       │    productos     │       │ categorias  │
│─────────────│       │─────────────────│       │─────────────│
│ PK id BIGINT│       │ PK id     BIGINT│       │ PK id BIGINT│
│ username    │       │ codigo_barras   │       │ nombre      │
│ password    │       │ nombre    TEXT  │◄──────│ FK cat_id   │
│ nombre      │       │ marca     TEXT  │       │ activa BOOL │
│ email       │       │ precio_venta DEC│       └─────────────┘
│ rol (ADMIN/ │       │ stock_actual INT│
│  VENDEDOR)  │       │ stock_minimo INT│
│ activo BOOL │       │ stock_maximo INT│
└──────┬──────┘       │ fecha_vencim.  │
       │              │ activo BOOL    │
       │              └────────┬───────┘
       │                       │
       ▼                       ▼
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   ventas    │       │  detalle_ventas  │       │  clientes   │
│─────────────│       │─────────────────│       │─────────────│
│ PK id BIGINT│◄──────│ PK id     BIGINT│       │ PK id BIGINT│
│ numero_venta│  1:N  │ FK venta_id     │       │ tipo_doc    │
│ fecha TIMESTM       │ FK producto_id  │──────►│ nro_doc     │
│ subtotal DEC│       │ FK pack_id (NULL)       │ nombre      │
│ descuento   │       │ cantidad   INT  │       │ telefono    │
│ impuesto DEC│       │ precio_unit DEC │       │ email       │
│ total    DEC│       │ descuento  DEC  │       │ puntos_fidel│
│ vuelto   DEC│       │ subtotal   DEC  │       └─────────────┘
│ forma_pago  │       └─────────────────┘
│ estado      │
│ FK cliente_id──────────────────────────────────────────────►┘
│ FK usuario_id──────►usuarios
└─────────────┘

┌──────────────────────────┐    ┌───────────────────────┐
│ comprobantes_electronicos│    │ movimientos_inventario │
│──────────────────────────│    │───────────────────────│
│ PK id           BIGINT   │    │ PK id          BIGINT  │
│ FK venta_id     BIGINT   │    │ FK producto_id BIGINT  │
│ tipo (BOLETA/FACTURA)    │    │ FK usuario_id  BIGINT  │
│ serie     VARCHAR(4)     │    │ tipo (ENTRADA/SALIDA/  │
│ numero    VARCHAR(8)     │    │       AJUSTE/MERMA)    │
│ xml_content TEXT         │    │ cantidad       INT     │
│ pdf_url   TEXT           │    │ stock_anterior INT     │
│ estado_sunat VARCHAR(20) │    │ stock_nuevo    INT     │
│ fecha_emision TIMESTAMP  │    │ motivo         TEXT    │
└──────────────────────────┘    │ fecha          TIMESTM │
                                └───────────────────────┘

┌─────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   packs     │    │  pack_productos  │    │   promociones    │
│─────────────│    │─────────────────│    │──────────────────│
│ PK id BIGINT│◄───│ FK pack_id      │    │ PK id    BIGINT  │
│ nombre TEXT │    │ FK producto_id  │    │ nombre   TEXT    │
│ precio DEC  │    │ cantidad    INT │    │ tipo     VARCHAR │
│ activo BOOL │    └─────────────────┘    │ valor    DEC     │
└─────────────┘                          │ activo   BOOL    │
                                         │ fecha_ini DATE   │
                                         │ fecha_fin DATE   │
                                         └──────────────────┘
```

**Migraciones Flyway aplicadas (última: V18):**

| Versión | Descripción |
|---------|-------------|
| V1 | Schema base: usuarios, categorias, productos, clientes, ventas, detalle_ventas |
| V2 | Comprobantes electrónicos, movimientos_inventario |
| V3 | Packs y pack_productos |
| V4 | Promociones y promocion_productos |
| V5 | Formas de pago: Efectivo, Tarjeta, Transferencia, Mixto, Yape, Plin |
| V6 | venta_pagos (pagos mixtos) |
| V7 | Proveedores y compras |
| V8 | Stock mínimo por categoría (UPDATE masivo) |
| V9 | Drop triggers de stock (control manual vía Service) |
| V10 | Categoría Cigarros |
| V11 | Compras: estados PENDIENTE / RECIBIDA |
| V12 | Devoluciones: devoluciones_venta + detalle_devolucion |
| V13 | Crédito/Fiado: forma_pago CREDITO + cuentas_por_cobrar |
| V14 | Apertura de caja: aperturas_caja |
| V15 | Gastos operativos: gastos |
| V16 | Mermas: motivos predefinidos, descuenta stock |
| V17 | Fidelización: config_fidelizacion + puntos_movimientos |
| V18 | Recuperación de contraseña: password_reset_tokens |

---

### 6.2 RELACIÓN ACTIVITY — VIEWMODEL — SCREEN (Android)

La aplicación Android usa **Jetpack Compose** con navegación basada en un único `Activity` (arquitectura Single Activity). No hay `Fragments` clásicos — las pantallas son `@Composable` functions.

```
ACTIVITY: MainActivity
│   (com.licoreria.chilalo.MainActivity)
│   → Inicializa Hilt, aplica tema, lanza ChilaloApp()
│
├── COMPOSABLE: ChilaloApp()
│   └── ChilaloNavGraph(authRepository, scope, onLogout)
│       ├── isLoggedIn == null  → SplashScreen (carga)
│       ├── isLoggedIn == false → LoginScreen.kt
│       │   ViewModel: LoginViewModel (HiltViewModel)
│       │   Recurso visual: LoginScreen composable
│       │
│       └── isLoggedIn == true  → MainScreen.kt
│           ├── NavigationBar (6 pestañas)
│           │
│           ├── TAB "Inicio" → DashboardScreen.kt
│           │   ViewModel: DashboardViewModel
│           │   SettingsViewModel (diálogo config servidor)
│           │
│           ├── TAB "Caja"  → POSScreen.kt
│           │   ViewModel: POSViewModel
│           │   BottomSheet: CarritoSheet
│           │   Dialog: VentaExitosaDialog
│           │
│           ├── TAB "Productos" → ProductosScreen.kt
│           │   ViewModel: ProductosViewModel
│           │
│           ├── TAB "Ventas" → VentasScreen.kt
│           │   ViewModel: VentasViewModel
│           │   BottomSheet: DetalleVentaSheet
│           │
│           ├── TAB "Inventario" → InventarioScreen.kt
│           │   ViewModel: InventarioViewModel
│           │
│           └── TAB "Clientes" → ClientesScreen.kt
│               ViewModel: ClientesViewModel

CONFIGURACIÓN DE RED:
  SettingsViewModel → NetworkModule (AppModule.kt)
  Base URL: http://<IP>:8080/api/v1/
  Emulador: http://10.0.2.2:8080/api/v1/
```

**Módulo DI (Hilt):**

```
AppModule.kt
├── provideRetrofit(baseUrl: String) → Retrofit
├── provideProductoApi(retrofit) → ProductoApi
├── provideCategoriaApi(retrofit) → CategoriaApi
├── provideClienteApi(retrofit) → ClienteApi
├── provideVentaApi(retrofit) → VentaApi
└── provideFacturacionApi(retrofit) → FacturacionApi

NetworkModule.kt
└── provideBaseUrl(dataStore) → String (reactivo, configurable en runtime)
```

---

### 6.3 DIAGRAMA DE CLASES

#### Backend — Entidades JPA (capa `entity`)

```
+------------------+      +-------------------+      +------------------+
|    Usuario        |      |     Producto       |      |    Categoria     |
|------------------|      |-------------------|      |------------------|
| - id: Long        |      | - id: Long         |      | - id: Long       |
| - username: String|      | - codigoBarras:Str |      | - nombre: String |
| - password: String|      | - nombre: String   |      | - descripcion:Str|
| - nombre: String  |      | - marca: String    |      | - stockMinimo:Int|
| - email: String   |      | - precioVenta: Dec |      | - activa: Boolean|
| - rol: RolEnum    |      | - precioCompra:Dec |      +------------------+
| - activo: Boolean |      | - stockActual: Int |
+------------------+      | - stockMinimo: Int |
                           | - stockMaximo: Int |
                           | - categoria: Cat   |◄────── Categoria
                           | - activo: Boolean  |
                           +-------------------+

+------------------+      +-------------------+      +------------------+
|     Venta         |      |   DetalleVenta    |      |     Cliente      |
|------------------|      |-------------------|      |------------------|
| - id: Long        |      | - id: Long         |      | - id: Long       |
| - numeroVenta:Str |      | - venta: Venta     |◄──┐  | - tipoDoc: String|
| - fecha: Timestamp|      | - producto:Producto|   │  | - nroDoc: String |
| - subtotal: Dec   |      | - cantidad: Int    │   │  | - nombre: String |
| - descuento: Dec  |      | - precioUnit: Dec  │   │  | - telefono: Str  |
| - impuesto: Dec   |      | - descuento: Dec   │   │  | - email: String  |
| - total: Dec      |      | - subtotal: Dec    │   │  | - puntos: Int    |
| - formaPago: Enum |      +-------------------+   │  +------------------+
| - estado: Enum    |◄──────────────────────────────┘
| - cliente: Cliente|◄──── Cliente
| - usuario: Usuario|◄──── Usuario
+------------------+
```

#### Android — Arquitectura MVVM

```
+-------------------+    +----------------------+    +------------------+
|  POSViewModel      |    |   PosRepository       |    |   VentaApi       |
|-------------------|    |----------------------|    |------------------|
| - _productos       |    | - ventaApi: VentaApi  |    | crearVenta(req)  |
| - _carrito         |◄───| - productoApi:ProdApi |    | POST /ventas     |
| - _uiState         |    | - categoriaApi:CatApi |    +------------------+
| agregarAlCarrito() |    | listarProductos()     |
| confirmarVenta()   |    | crearVenta()          |
| limpiarCarrito()   |    | listarCategorias()    |
+-------------------+    +----------------------+
        ▲
        │ collectAsState()
+-------------------+
|   POSScreen.kt    |
| (Composable UI)   |
+-------------------+
```

---

### 6.4 DIAGRAMA DE DESPLIEGUE

```
┌─────────────────────────────────────────────────────────────────┐
│                    RED LOCAL (Wi-Fi)                             │
│                                                                 │
│  ┌─────────────────────┐       ┌──────────────────────────────┐ │
│  │  DISPOSITIVO ANDROID │       │    SERVIDOR / PC LOCAL       │ │
│  │─────────────────────│       │──────────────────────────────│ │
│  │  App: Chilalo Shot  │       │  ┌────────────────────────┐  │ │
│  │  (APK debug/release)│       │  │  Backend Spring Boot   │  │ │
│  │  Kotlin + Compose   │◄─────►│  │  Puerto: 8080          │  │ │
│  │  Hilt + Retrofit    │ HTTP  │  │  Java 17 / Maven       │  │ │
│  │  DataStore (JWT)    │       │  └──────────┬─────────────┘  │ │
│  └─────────────────────┘       │             │ JDBC           │ │
│                                │  ┌──────────▼─────────────┐  │ │
│  ┌─────────────────────┐       │  │  PostgreSQL 15          │  │ │
│  │  NAVEGADOR WEB      │       │  │  Puerto: 5432           │  │ │
│  │─────────────────────│       │  │  DB: licoreria_db       │  │ │
│  │  React 18 + Vite    │◄─────►│  └────────────────────────┘  │ │
│  │  Puerto: 5173 (dev) │ HTTP  │                              │ │
│  │  Puerto: 80 (prod)  │       │  ┌────────────────────────┐  │ │
│  └─────────────────────┘       │  │  Frontend Estático      │  │ │
│                                │  │  (npm run build → dist/)│  │ │
│                                │  └────────────────────────┘  │ │
│                                └──────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                INTERNET (SUNAT/OSE)                       │  │
│  │  Backend → HTTPS → OSE (Nubefact/similar) → SUNAT        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6.5 DIAGRAMA DE ESTADOS

#### Estados de una Venta

```
                    ┌──────────┐
                    │  INICIO  │
                    └────┬─────┘
                         │ cajero agrega ítems
                         ▼
                  ┌─────────────┐
                  │  EN_CARRITO │ ◄──── agregar/quitar ítems
                  └──────┬──────┘
                         │ confirmar venta
                         ▼
                  ┌─────────────┐
                  │  PROCESANDO │ (POST /api/v1/ventas)
                  └──────┬──────┘
                    ┌────┴────┐
              error │         │ éxito
                    ▼         ▼
              ┌─────────┐  ┌──────────┐
              │  ERROR  │  │COMPLETADA│ ──► emitir comprobante (opcional)
              └─────────┘  └──────────┘
                                │
                                │ solicitar devolución
                                ▼
                          ┌──────────┐
                          │DEVUELTA  │ (parcial o total)
                          └──────────┘
```

#### Estados de un Comprobante Electrónico

```
   ┌──────────┐    emitir     ┌──────────────┐   SUNAT acepta  ┌──────────┐
   │  VENTA   │──────────────►│  EN_PROCESO  │────────────────►│ ACEPTADO │
   │COMPLETADA│               └──────┬───────┘                 └──────────┘
   └──────────┘                      │ SUNAT rechaza
                                     ▼
                               ┌──────────┐
                               │RECHAZADO │ ──► corregir y reintentar
                               └──────────┘
```

---

### 6.6 DIAGRAMA DE SECUENCIA

#### Flujo: Confirmar Venta en App Android

```
Usuario     POSScreen    POSViewModel   PosRepository   VentaApi    Backend API   PostgreSQL
  │             │              │               │             │            │             │
  │──tap BTN──►│              │               │             │            │             │
  │            │──confirmarV()►│               │             │            │             │
  │            │              │──crearVenta()►│             │            │             │
  │            │              │               │──POST /v►   │            │             │
  │            │              │               │  /ventas    │──────────►│             │
  │            │              │               │             │            │──INSERT─────►│
  │            │              │               │             │            │◄────OK───────│
  │            │              │               │             │◄──VentaDTO─│             │
  │            │              │               │◄──Response──│             │             │
  │            │              │◄──Result.OK───│             │            │             │
  │            │◄──UiState────│               │             │            │             │
  │            │  (Exitosa)   │               │             │            │             │
  │◄──Dialog──│              │               │             │            │             │
  │  Venta OK  │              │               │             │            │             │
```

#### Flujo: Emisión de Boleta desde Web

```
Frontend     POS.tsx    api/facturacion   Backend        OSE/SUNAT
   │            │               │              │              │
   │──click──►│               │              │              │
   │  "Boleta" │               │              │              │
   │            │──POST /boleta►│              │              │
   │            │   /{ventaId}  │──────────────►│              │
   │            │               │  generarXML()│              │
   │            │               │  firmarXML() │──────────────►│
   │            │               │              │              │──validar──►SUNAT
   │            │               │              │              │◄──CDR──────│
   │            │               │◄──ComprobanteDTO────────────│              │
   │            │◄──Response────│              │              │
   │◄──Modal──│               │              │              │
   │  "Boleta  │               │              │              │
   │   emitida"│               │              │              │
```

---

### 6.7 DIAGRAMA DE COMPONENTES

```
┌────────────────────────────────────────────────────────────────────┐
│                        SISTEMA CHILALO SHOT                         │
│                                                                    │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐ │
│  │     APP ANDROID (APK)        │  │       FRONTEND WEB (React)   │ │
│  │─────────────────────────────│  │──────────────────────────────│ │
│  │ ┌───────────┐ ┌───────────┐ │  │ ┌──────────┐ ┌────────────┐  │ │
│  │ │LoginScreen│ │DashScreen │ │  │ │ Login.tsx│ │Dashboard   │  │ │
│  │ └───────────┘ └───────────┘ │  │ └──────────┘ │.tsx        │  │ │
│  │ ┌───────────┐ ┌───────────┐ │  │              └────────────┘  │ │
│  │ │ POSScreen │ │VentasScr. │ │  │ ┌──────────┐ ┌────────────┐  │ │
│  │ └───────────┘ └───────────┘ │  │ │  POS.tsx │ │Inventory   │  │ │
│  │ ┌───────────┐ ┌───────────┐ │  │ └──────────┘ │.tsx        │  │ │
│  │ │InvScreen  │ │ClienteScr │ │  │              └────────────┘  │ │
│  │ └───────────┘ └───────────┘ │  │ ┌──────────┐ ┌────────────┐  │ │
│  │        ▲                    │  │ │Ventas.tsx│ │Reports.tsx │  │ │
│  │  Hilt DI + ViewModels       │  │ └──────────┘ └────────────┘  │ │
│  │  Retrofit + OkHttp          │  │    React Context API         │ │
│  └──────────────┬──────────────┘  └──────────────┬───────────────┘ │
│                 │ HTTP/JSON REST                  │ HTTP/JSON REST  │
│  ┌──────────────▼─────────────────────────────────▼───────────────┐ │
│  │                  BACKEND API REST (Spring Boot)                  │ │
│  │─────────────────────────────────────────────────────────────────│ │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐  │ │
│  │  │AuthControll│ │VentaContrl │ │InvControll │ │FacturContrl │  │ │
│  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └──────┬──────┘  │ │
│  │        │              │              │               │          │ │
│  │  ┌─────▼──────────────▼──────────────▼───────────────▼──────┐  │ │
│  │  │              Capa de Servicios (Business Logic)           │  │ │
│  │  │  AuthService · VentaService · InventarioService           │  │ │
│  │  │  FacturacionService · ReporteService · ClienteService     │  │ │
│  │  └──────────────────────────────┬────────────────────────────┘  │ │
│  │                                 │ JPA / Hibernate               │ │
│  │  ┌──────────────────────────────▼────────────────────────────┐  │ │
│  │  │              Capa de Repositorios (Spring Data JPA)        │  │ │
│  │  └──────────────────────────────┬────────────────────────────┘  │ │
│  └─────────────────────────────────┼───────────────────────────────┘ │
│                                    │ JDBC                            │
│  ┌─────────────────────────────────▼───────────────────────────────┐ │
│  │              BASE DE DATOS PostgreSQL 15                         │ │
│  │  licoreria_db · Flyway Migrations V1–V18                        │ │
│  │  Tablas: usuarios · productos · categorias · clientes           │ │
│  │          ventas · detalle_ventas · comprobantes_electronicos     │ │
│  │          movimientos_inventario · packs · promociones            │ │
│  │          cuentas_por_cobrar · aperturas_caja · gastos · mermas  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │            INTEGRACIÓN EXTERNA — SUNAT / OSE                    │ │
│  │  FacturacionService → SunatService → OSE API → SUNAT           │ │
│  │  Ambiente: pruebas (sandbox) | Formato: UBL 2.1 XML            │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

---

**Fecha de Actualización: 05/04/2025 · Versión: 1.0 · Preparado por: IDAT · Página: 10 de 10**
