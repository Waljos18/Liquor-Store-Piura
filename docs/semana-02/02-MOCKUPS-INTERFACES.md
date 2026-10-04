# MOCKUPS DE INTERFACES
## Sistema Web y App Móvil con IA para Gestión Integral de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** 1.0  
**Fecha:** Enero 2025  
**Semana:** 2

---

## 1. DISEÑO DE INTERFAZ - PRINCIPIOS

### 1.1 Principios de Diseño
- **Simplicidad:** Interfaz intuitiva para uso con 1-2 personas
- **Rapidez:** Accesos rápidos a funciones más usadas
- **Claridad:** Información clara y fácil de entender
- **Responsive:** Adaptable a diferentes tamaños de pantalla
- **Accesibilidad:** Cumplir estándares básicos de accesibilidad

### 1.2 Paleta de Colores
- **Primario:** #1976D2 (Azul)
- **Secundario:** #FF6F00 (Naranja)
- **Éxito:** #4CAF50 (Verde)
- **Error:** #F44336 (Rojo)
- **Advertencia:** #FF9800 (Amarillo)
- **Fondo:** #F5F5F5 (Gris claro)
- **Texto:** #212121 (Gris oscuro)

---

## 2. MOCKUP: PANTALLA DE LOGIN

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              [LOGO LICORERÍA]                           │
│                                                         │
│         Sistema de Gestión de Licorería                 │
│                                                         │
│    ┌─────────────────────────────────────┐            │
│    │  Email o Username                    │            │
│    │  ┌─────────────────────────────────┐ │            │
│    │  │                                 │ │            │
│    │  └─────────────────────────────────┘ │            │
│    │                                       │            │
│    │  Contraseña                           │            │
│    │  ┌─────────────────────────────────┐ │            │
│    │  │  ••••••••                       │ │            │
│    │  └─────────────────────────────────┘ │            │
│    │                                       │            │
│    │  [ ] Recordar sesión                 │            │
│    │                                       │            │
│    │  ┌─────────────────────────────────┐ │            │
│    │  │      INICIAR SESIÓN             │ │            │
│    │  └─────────────────────────────────┘ │            │
│    │                                       │            │
│    │  ¿Olvidaste tu contraseña?           │            │
│    └─────────────────────────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elementos:**
- Campo de email/username
- Campo de contraseña (con opción mostrar/ocultar)
- Checkbox "Recordar sesión"
- Botón "Iniciar Sesión" (color primario)
- Enlace "¿Olvidaste tu contraseña?"

---

## 3. MOCKUP: DASHBOARD PRINCIPAL

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Licorería Piura    [🔔] [👤 Admin] [🚪 Salir]                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐│
│  │ Ventas Hoy   │  │ Productos    │  │ Stock Bajo   │  │ Alertas  ││
│  │              │  │              │  │              │  │          ││
│  │   S/ 1,250   │  │     245      │  │      12      │  │    3     ││
│  │  +15% vs ayer│  │  Activos     │  │  Productos   │  │  Pend.   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘│
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ VENTAS POR PERÍODO                                              ││
│  │                                                                 ││
│  │  Período: [Hoy] [Semana] [Mes] [Rango de fechas] [Año]         ││
│  │           (•)     ( )     ( )   [__/__/____ - __/__/____]  ( ) ││
│  │                                                                 ││
│  │  [Gráfico de líneas/barras - Ventas según período seleccionado] ││
│  │                                                                 ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                       │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐   │
│  │ Productos Más Vendidos   │  │ Productos con Stock Bajo     │   │
│  │                          │  │                              │   │
│  │ 1. Cerveza Pilsen        │  │ • Cerveza Cristal (5 unid)   │   │
│  │    45 unidades           │  │ • Ron Flor de Caña (2 unid) │   │
│  │                          │  │ • Whisky Chivas (1 unid)    │   │
│  │ 2. Ron Flor de Caña     │  │                              │   │
│  │    32 unidades           │  │ [Ver Todos]                 │   │
│  │                          │  │                              │   │
│  │ 3. Whisky Chivas        │  │                              │   │
│  │    28 unidades           │  │                              │   │
│  │                          │  │                              │   │
│  │ [Ver Reporte Completo]   │  │                              │   │
│  └──────────────────────────┘  └──────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Recomendaciones de IA                                           ││
│  │                                                                 ││
│  │ 💡 Sugerencia: Deberías comprar más Cerveza Pilsen.            ││
│  │    Predicción: Se agotará en 3 días                            ││
│  │                                                                 ││
│  │ 💡 Sugerencia: Crea un pack "Pack Fiesta" con:                  ││
│  │    - Cerveza Pilsen x6, Snacks x2, Hielo x1                    ││
│  │    [Aplicar Sugerencia]                                         ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Barra superior con menú hamburguesa, notificaciones, usuario y logout
- Tarjetas de métricas principales (Ventas, Productos, Stock, Alertas)
- **Selector de período de ventas:** Hoy, Semana, Mes, Rango de fechas (cualquier día), Año; el gráfico se actualiza según la selección
- Gráfico de ventas según período elegido
- Lista de productos más vendidos
- Lista de productos con stock bajo
- Panel de recomendaciones de IA

---

## 4. MOCKUP: PUNTO DE VENTA (POS)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [← Volver]  PUNTO DE VENTA                    [🛒 Carrito: 3]      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────┐  ┌─────────────────────────┐ │
│  │                                  │  │  RESUMEN DE VENTA       │ │
│  │  BÚSQUEDA DE PRODUCTOS           │  │                         │ │
│  │  ┌────────────────────────────┐  │  │  Productos:             │ │
│  │  │ [🔍] Código/Nombre...      │  │  │  1. Cerveza Pilsen x2   │ │
│  │  └────────────────────────────┘  │  │     S/ 8.00            │ │
│  │                                  │  │  2. Ron Flor Caña x1   │ │
│  │  CATEGORÍAS                      │  │     S/ 45.00            │ │
│  │  [Cervezas] [Vinos] [Licores]    │  │  3. Snacks x1           │ │
│  │  [Whiskies] [Ron] [Todos]        │  │     S/ 3.50            │ │
│  │                                  │  │                         │ │
│  │  PRODUCTOS                       │  │  ─────────────────────  │ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │  │  Subtotal:    S/ 56.50 │ │
│  │  │[img]│ │[img]│ │[img]│ │[img]│    │  │  Descuento:   S/ 0.00 │ │
│  │  │Pilsen│ │Cristal│ │Corona│ │Cusqueña│    │  │  IGV:         S/ 10.17 │ │
│  │  │S/4.00│ │S/4.50│ │S/5.00│ │S/4.50│    │  │  ─────────────────────  │ │
│  │  │Stock:20│ │Stock:15│ │Stock:8│ │Stock:12│    │  │  TOTAL:      S/ 66.67 │ │
│  │  └────┘ └────┘ └────┘ └────┘    │  │                         │ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │  │  FORMA DE PAGO          │ │
│  │  │[img]│ │[img]│ │[img]│ │[img]│    │  │  ( ) Efectivo          │ │
│  │  │Ron  │ │Whisky│ │Vino │ │Pisco│    │  │  ( ) Tarjeta           │ │
│  │S/45│ │ │S/120│ │S/35│ │S/25│    │  │  ( ) QR (Yape / Plin)   │ │
│  │  │Stock:5│ │Stock:3│ │Stock:10│ │Stock:8│    │  │  (•) Mixto            │ │
│  │  └────┘ └────┘ └────┘ └────┘    │  │                         │ │
│  │                                  │  │  Monto Recibido:        │ │
│  │  💡 Recomendación IA:            │  │  ┌─────────────────┐   │ │
│  │  "Clientes que compraron esto    │  │  │  S/ 70.00       │   │ │
│  │   también compraron: Snacks"     │  │  └─────────────────┘   │ │
│  │  [Agregar Snacks]                │  │                         │ │
│  │                                  │  │  Vuelto: S/ 3.33        │ │
│  │                                  │  │                         │ │
│  │                                  │  │  [CLIENTE]              │ │
│  │                                  │  │  ┌─────────────────┐   │ │
│  │                                  │  │  │ DNI/Cliente...  │   │ │
│  │                                  │  │  └─────────────────┘   │ │
│  │                                  │  │                         │ │
│  │                                  │  │  ┌───────────────────┐ │ │
│  │                                  │  │  │  FINALIZAR VENTA  │ │ │
│  │                                  │  │  └───────────────────┘ │ │
│  └──────────────────────────────────┘  └─────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Búsqueda rápida de productos
- Filtros por categoría
- Grid de productos con imagen, nombre, precio y stock
- Panel lateral con resumen de venta
- **Formas de pago:** Efectivo, Tarjeta, QR (Yape, Plin), Mixto
- Campo para monto recibido y cálculo de vuelto
- Búsqueda de cliente
- Recomendaciones de IA
- Botón grande "FINALIZAR VENTA"

---

## 4.1 MOCKUP: BOLETAS Y FACTURAS

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Boletas y Facturas    [🔍 Buscar...]  [Filtros: Todas ▼]        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Tipo: [Todas] [Boletas] [Facturas]   Fecha: [__/__/____ - __/__/____]│
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Serie-Número  │ Tipo    │ Fecha     │ Cliente/DNI  │ Total  │Acciones│
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ B001-0000123  │ Boleta  │ 06/02/25  │ 45678901     │ S/ 66  │[👁][✏️]│
│  │ F001-0000456  │ Factura │ 05/02/25  │ Empresa S.A. │ S/ 320 │[👁][✏️]│
│  │ B001-0000122  │ Boleta  │ 05/02/25  │ 87654321     │ S/ 125 │[👁][✏️]│
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Mostrando 1-3 de 150 comprobantes              [<] 1 2 3 ... [>]   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

MODAL: VER / MODIFICAR COMPROBANTE
┌─────────────────────────────────────────────────────────────┐
│  Boleta B001-0000123                          [Imprimir] [X] │
├─────────────────────────────────────────────────────────────┤
│  Cliente/DNI: [45678901                    ]  (editable)    │
│  Fecha: [06/02/2025]  Hora: [14:32]                         │
│  Detalle:                                                    │
│  │ Producto        │ Cant. │ P.Unit │ Subtotal │             │
│  │ Cerveza Pilsen  │  2    │ 4.00   │ 8.00     │ [✏️]        │
│  │ Ron Flor Caña   │  1    │ 45.00  │ 45.00    │ [✏️]        │
│  │ Snacks          │  1    │ 3.50   │ 3.50     │ [✏️]        │
│  Subtotal: S/ 56.50   IGV: S/ 10.17   TOTAL: S/ 66.67        │
│  Forma de pago: Efectivo                                     │
│                                                              │
│  [Cancelar]  [Guardar cambios]  [Anular comprobante]         │
└─────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Listado de boletas y facturas con filtros por tipo y rango de fechas
- Búsqueda por número, cliente o DNI
- Acciones: Ver (👁) y Editar (✏️) para corregir errores
- Modal de detalle que permite modificar datos del comprobante (cliente, ítems, totales) y anular en caso necesario
- Opción de reimprimir comprobante

---

## 4.2 MOCKUP: CONFIGURACIÓN (ADMIN)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Configuración                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Menú lateral (solo Admin):                                           │
│  ┌─────────────────────────┐                                        │
│  │ ⚙️ Impresoras            │  Configuración de impresoras (ticket,   │
│  │ 📁 Categorías            │  A4, térmica). Asignar por punto de    │
│  │ 👥 Clientes              │  venta o por tipo de comprobante.       │
│  │ 📦 Productos             │                                        │
│  │ 🚚 Proveedores           │  ┌──────────────────────────────────┐  │
│  │ 💳 Métodos de pago        │  │ Impresora por defecto: [▼ Térmica]│  │
│  │ 👤 Usuarios              │  │ Impresora facturas: [▼ A4]        │  │
│  │ 🧾 Config. comprobante    │  │ [Guardar]                         │  │
│  └─────────────────────────┘  └──────────────────────────────────┘  │
│                                                                       │
│  Cada ítem abre su pantalla de gestión (CRUD):                       │
│  • Categorías: nombre, descripción, estado                           │
│  • Clientes: DNI/RUC, nombre, dirección, contacto                     │
│  • Productos: (ver sección Gestión de Productos)                     │
│  • Proveedores: (ver sección Gestor de Proveedores)                  │
│  • Métodos de pago: Efectivo, Tarjeta, QR Yape, QR Plin, Mixto       │
│  • Usuarios: login, rol, permisos, estado                            │
│  • Config. comprobante: serie, numeración, tipo (boleta/factura),    │
│    datos de empresa (RUC, razón social, dirección) para facturación  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Sección **Configuración** accesible solo para rol Admin
- **Impresoras:** gestionar impresoras (ticket, A4, térmica) y asignación por POS o tipo de comprobante
- **Categorías:** CRUD de categorías de productos
- **Clientes:** CRUD de clientes (uso en facturas y POS)
- **Productos:** enlace a gestión de productos
- **Proveedores:** enlace a gestor de proveedores
- **Métodos de pago:** activar/desactivar y orden: Efectivo, Tarjeta, QR (Yape, Plin), Mixto
- **Usuarios:** CRUD de usuarios del sistema y roles
- **Configuración de comprobante:** series, numeración, datos de empresa para boletas y facturas

---

## 5. MOCKUP: GESTIÓN DE PRODUCTOS

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Productos                    [🔍 Buscar...]  [+ Nuevo Producto]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Filtros: [Todas] [Cervezas] [Vinos] [Licores] [Stock Bajo]          │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Código    │ Nombre          │ Categoría │ Precio  │ Stock │Acciones│
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ 7790310   │ Cerveza Pilsen  │ Cervezas  │ S/ 4.00 │  20   │[✏️][🗑️]│ │
│  │ 7790311   │ Cerveza Cristal │ Cervezas  │ S/ 4.50 │  15   │[✏️][🗑️]│ │
│  │ 7790312   │ Ron Flor Caña   │ Ron       │ S/ 45.00│   5   │[✏️][🗑️]│ │
│  │ 7790313   │ Whisky Chivas   │ Whiskies  │ S/ 120.00│   3   │[✏️][🗑️]│ │
│  │ 7790314   │ Vino Tinto      │ Vinos     │ S/ 35.00 │  10   │[✏️][🗑️]│ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Mostrando 1-5 de 245 productos                    [<] 1 2 3 [>]     │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

MODAL: NUEVO PRODUCTO
┌─────────────────────────────────────────────────────────────┐
│  Nuevo Producto                                    [X]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Código de Barras: [________________] ]                │
│                                                             │
│  Nombre: * [________________________________]                │
│                                                             │
│  Marca: [________________________________]                  │
│                                                             │
│  Categoría: * [▼ Cervezas                    ]              │
│                                                             │
│  Proveedor: [▼ Distribuidora Norte (opcional) ]              │
│                                                             │
│  Precio de Compra: [S/ ________]                            │
│  Precio de Venta: * [S/ ________]                           │
│                                                             │
│  Stock Inicial: [________]                                 │
│  Stock Mínimo: [________]                                  │
│  Stock Máximo: [________]                                  │
│                                                             │
│  Fecha de Vencimiento: [__/__/____]                        │
│                                                             │
│  Imagen: [📷 Subir Imagen]                                 │
│                                                             │
│  [Cancelar]  [Guardar Producto]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Lista de productos en tabla
- Filtros por categoría y stock
- Búsqueda de productos
- Botón "Nuevo Producto"
- Modal para crear/editar producto
- Acciones: Editar y Eliminar

---

## 6. MOCKUP: GESTIÓN DE INVENTARIO

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Inventario              [📊 Reportes]  [➕ Ajuste]  [➕ Compra]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  ALERTAS DE INVENTARIO                                          │ │
│  │  ⚠️ 12 productos con stock bajo                                │ │
│  │  ⚠️ 3 productos próximos a vencer                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  PRODUCTOS CON STOCK BAJO                                       │ │
│  │                                                                 │ │
│  │  Producto              │ Stock Actual │ Stock Mín. │ Faltante │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │  Cerveza Cristal       │      5       │     15     │    10    │ │
│  │  Ron Flor de Caña     │      2       │     10     │     8    │ │
│  │  Whisky Chivas        │      1       │      5     │     4    │ │
│  │                                                                 │ │
│  │  [Generar Orden de Compra]                                      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  PRODUCTOS PRÓXIMOS A VENCER                                   │ │
│  │                                                                 │ │
│  │  Producto              │ Stock │ Fecha Venc. │ Días Restantes │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │  Cerveza Pilsen        │  20   │  20/02/2025 │       5        │ │
│  │  Snacks                │  15   │  22/02/2025 │       7        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  MOVIMIENTOS RECIENTES                                          │ │
│  │                                                                 │ │
│  │  Fecha       │ Producto        │ Tipo    │ Cantidad │ Usuario  │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │  15/01 10:30 │ Cerveza Pilsen │ SALIDA  │    -2    │ Admin    │ │
│  │  15/01 09:15 │ Ron Flor Caña  │ ENTRADA │    +10   │ Admin    │ │
│  │  14/01 16:45 │ Whisky Chivas  │ SALIDA  │    -1    │ Vendedor │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Panel de alertas destacado
- Lista de productos con stock bajo
- Lista de productos próximos a vencer
- Historial de movimientos de inventario
- Botones para acciones rápidas (Ajuste, Compra)

---

## 7. MOCKUP: GESTOR DE PROVEEDORES

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Proveedores              [🔍 Buscar...]  [+ Nuevo Proveedor]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Filtros: [Todos] [Activos] [Con productos asociados]                 │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ RUC/DNI   │ Razón Social / Nombre   │ Contacto    │ Productos │Acciones│
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ 20123456789│ Distribuidora Norte   │ 974-123456  │    45     │[✏️][🗑️]│ │
│  │ 10876543210│ Juan Pérez (Cervezas) │ 987-654321  │    12     │[✏️][🗑️]│ │
│  │ 20198765432│ Licores Piura S.A.C.  │ 965-111222  │    28     │[✏️][🗑️]│ │
│  │ 10456789012│ María López (Vinos)   │ 932-333444  │     8     │[✏️][🗑️]│ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Mostrando 1-4 de 12 proveedores                   [<] 1 [>]        │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

MODAL: NUEVO PROVEEDOR
┌─────────────────────────────────────────────────────────────┐
│  Nuevo Proveedor                                   [X]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tipo de documento: (•) RUC  ( ) DNI                        │
│                                                             │
│  Número (RUC/DNI): * [________________]                     │
│                                                             │
│  Razón Social / Nombre: * [________________________________] │
│                                                             │
│  Dirección: [________________________________________]       │
│                                                             │
│  Teléfono: [________________]                                │
│  Email: [________________________________]                   │
│                                                             │
│  Contacto (persona): [________________________________]       │
│                                                             │
│  Notas: [________________________________________]           │
│         [________________________________________]           │
│                                                             │
│  [Cancelar]  [Guardar Proveedor]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Lista de proveedores en tabla (RUC/DNI, razón social, contacto, cantidad de productos asociados)
- Filtros por estado y por “con productos asociados”
- Búsqueda de proveedores
- Botón "Nuevo Proveedor"
- Modal para crear/editar proveedor (datos fiscales, dirección, teléfono, email, contacto)
- Acciones: Editar y Eliminar (o desactivar)
- Integración: en "Nuevo Producto" y en "Registrar Compra" (Inventario) se puede seleccionar el proveedor

---

## 8. MOCKUP: GESTIÓN DE PROMOCIONES

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Promociones          [💡 Sugerencias IA]  [+ Nueva Promoción]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  PROMOCIONES ACTIVAS                                           │ │
│  │                                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │ Pack Fiesta                                    [Activa ✓] │ │ │
│  │  │ Cerveza Pilsen x6 + Snacks x2 + Hielo x1                  │ │ │
│  │  │ Precio: S/ 25.00 (Ahorro: S/ 5.00)                       │ │ │
│  │  │ Válido hasta: 31/01/2025                                  │ │ │
│  │  │ [Editar] [Desactivar]                                     │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │ 2x1 en Cervezas                              [Activa ✓]  │ │ │
│  │  │ Lleva 2 cervezas, paga 1                                   │ │ │
│  │  │ Válido hasta: 25/01/2025                                   │ │ │
│  │  │ [Editar] [Desactivar]                                     │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  SUGERENCIAS DE IA                                             │ │
│  │                                                                 │ │
│  │  💡 Basado en tus ventas, te sugerimos crear:                  │ │
│  │  "Pack Verano" con:                                           │ │
│  • Cerveza Pilsen x6                                             │ │
│  • Hielo x2                                                      │ │
│  │  Precio sugerido: S/ 28.00                                    │ │
│  │  [Crear Promoción] [Descartar]                                │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Lista de promociones activas
- Tarjetas de promoción con información clave
- Panel de sugerencias de IA
- Botón para crear nueva promoción
- Estados de promociones (Activa/Inactiva)

---

## 9. MOCKUP: REPORTES Y ANALYTICS

```
┌─────────────────────────────────────────────────────────────────────┐
│ [☰] Reportes    [📄 Reporte Ventas PDF] [📄 Reporte Inventario PDF]  │
│                 [📥 Exportar]  [📧 Enviar por Email]                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Período: [Hoy ▼] [Esta Semana] [Este Mes] [Rango Personalizado]    │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  RESUMEN DE VENTAS                                             │ │
│  │                                                                 │ │
│  │  Total Ventas: S/ 8,500.00                                     │ │
│  │  Total Transacciones: 125                                      │ │
│  │  Ticket Promedio: S/ 68.00                                     │ │
│  │                                                                 │ │
│  │  [Gráfico de barras - Ventas por día]                         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐   │
│  │ Ventas por Categoría     │  │ Ventas por Forma de Pago    │   │
│  │                          │  │                              │   │
│  │  [Gráfico circular]       │  │  [Gráfico circular]         │   │
│  │                          │  │                              │   │
│  │  Cervezas: 45%           │  │  Efectivo: 60%               │   │
│  │  Licores: 30%            │  │  Tarjeta: 35%            │   │
│  │  Vinos: 15%               │  │  Transferencia: 5%       │   │
│  │  Otros: 10%               │  │                              │   │
│  └──────────────────────────┘  └──────────────────────────────┘   │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  TOP 10 PRODUCTOS MÁS VENDIDOS                                │ │
│  │                                                                 │ │
│  │  # │ Producto        │ Cantidad │ Total Ventas │ % del Total │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │  1 │ Cerveza Pilsen │   145    │  S/ 580.00   │    6.8%     │ │
│  │  2 │ Ron Flor Caña  │    89    │  S/ 4,005.00 │   47.1%     │ │
│  │  3 │ Whisky Chivas  │    32    │  S/ 3,840.00 │   45.2%     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  PREDICCIONES DE IA                                            │ │
│  │                                                                 │ │
│  │  📈 Predicción de Ventas Próxima Semana:                      │ │
│  │  Se esperan ventas de S/ 9,200.00 (+8.2% vs semana actual)    │ │
│  │                                                                 │ │
│  │  📦 Productos que se agotarán:                                │ │
│  │  • Cerveza Pilsen: en 3 días                                   │ │
│  │  • Ron Flor de Caña: en 5 días                                │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Selector de período
- **Generar Reporte de Ventas en PDF:** descarga un PDF con resumen de ventas, totales, transacciones, ticket promedio y (opcional) gráficos del período seleccionado
- **Generar Reporte de Inventario en PDF:** descarga un PDF con estado de stock, productos con stock bajo, próximos a vencer y movimientos recientes (desde Inventario o desde Reportes)
- Resumen de ventas con gráficos
- Gráficos por categoría y forma de pago
- Tabla de productos más vendidos
- Panel de predicciones de IA
- Opciones de exportación (Excel, etc.) y envío por email

---

## 10. CONSIDERACIONES DE DISEÑO RESPONSIVE

### 10.1 Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### 10.2 Adaptaciones Mobile
- Menú hamburguesa siempre visible
- Tarjetas apiladas verticalmente
- Botones de acción flotantes
- Formularios en una columna
- Tablas con scroll horizontal

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha de creación:** Enero 2025  
**Versión:** 1.0
