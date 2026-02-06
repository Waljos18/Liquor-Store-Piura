# ESPECIFICACIÓN: MANEJO DE INVENTARIO PARA PACKS DE CERVEZAS

## Sistema Web y App Móvil con IA para Gestión Integral de Licorería
**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Versión:** 1.0  
**Fecha:** Enero 2025

---

## 1. PRINCIPIO FUNDAMENTAL

**El inventario se maneja SIEMPRE en UNIDADES, no en packs.**

Los packs (sixpack, twelvepack) son únicamente una **agrupación comercial** para facilitar la venta y aplicar precios especiales, pero el control de stock se realiza a nivel de unidades individuales.

---

## 2. REGISTRO DE INVENTARIO

### 2.1. Ingreso de Packs de Cervezas

Cuando se ingresa un pack de cervezas (sixpack, twelvepack) al inventario:

**Proceso:**
1. El sistema **descompone automáticamente** el pack en unidades individuales
2. Se registra la entrada en el inventario como **unidades sueltas**
3. El stock del producto se incrementa según la cantidad de unidades del pack

**Ejemplo:**
- Se ingresa: **1 sixpack de Cerveza Pilsen**
- El sistema registra: **6 unidades** de Cerveza Pilsen
- Stock actual: Si había 10 unidades, ahora hay **16 unidades**

**Ejemplo:**
- Se ingresa: **2 twelvepack de Cerveza Cristal**
- El sistema registra: **24 unidades** de Cerveza Cristal (2 × 12)
- Stock actual: Si había 5 unidades, ahora hay **29 unidades**

### 2.2. Registro en Base de Datos

**Tabla: `movimiento_inventario`**
```sql
-- Ejemplo: Ingreso de 1 sixpack (6 unidades)
INSERT INTO movimiento_inventario (
    producto_id,
    tipo_movimiento,
    cantidad,
    motivo,
    usuario_id
) VALUES (
    1,  -- ID de Cerveza Pilsen
    'ENTRADA',
    6,  -- 6 unidades (no 1 pack)
    'Compra: 1 sixpack de Cerveza Pilsen',
    1   -- Usuario que registra
);
```

**Actualización de Stock:**
```sql
-- El stock se actualiza en unidades
UPDATE productos 
SET stock_actual = stock_actual + 6
WHERE id = 1;
```

---

## 3. VENTA DE PRODUCTOS

### 3.1. Venta de Unidades Individuales

Cuando se vende una unidad individual de cerveza (lata o botella):

**Proceso:**
1. El sistema descuenta **1 unidad** del stock del producto
2. Se registra el movimiento de salida
3. El stock se actualiza inmediatamente

**Ejemplo:**
- Stock inicial: **20 unidades** de Cerveza Pilsen
- Venta: **1 lata** de Cerveza Pilsen
- Stock final: **19 unidades**

### 3.2. Venta de Packs Completos

Cuando se vende un pack completo (sixpack o twelvepack):

**Proceso:**
1. El sistema verifica que haya stock suficiente en unidades
2. Se descuentan las unidades correspondientes al pack
3. Se aplica el precio del pack (no el precio unitario × cantidad)
4. Se registra la venta como pack, pero el inventario se actualiza en unidades

**Ejemplo:**
- Stock inicial: **20 unidades** de Cerveza Pilsen
- Venta: **1 sixpack** de Cerveza Pilsen (precio pack: S/. 20.00)
- Stock final: **14 unidades** (20 - 6)
- Precio cobrado: S/. 20.00 (precio del pack, no 6 × S/. 4.00)

### 3.3. Venta Mixta (Pack + Unidades Sueltas)

**Ejemplo:**
- Stock inicial: **20 unidades** de Cerveza Pilsen
- Venta: **1 sixpack** + **2 latas sueltas**
- Stock final: **12 unidades** (20 - 6 - 2)
- Precio: Precio del pack + (2 × precio unitario)

---

## 4. CONTROL DE INVENTARIO

### 4.1. Consulta de Stock

El sistema siempre muestra el stock en **unidades**, independientemente de cómo se haya ingresado:

**Ejemplo de Visualización:**
```
Producto: Cerveza Pilsen
Stock Actual: 24 unidades
Stock Mínimo: 15 unidades
Estado: ✅ Stock suficiente

Packs Disponibles:
- Sixpack: 4 packs completos (24 unidades ÷ 6)
- Twelvepack: 2 packs completos (24 unidades ÷ 12)
```

### 4.2. Alertas de Stock Bajo

Las alertas se basan en **unidades**, no en packs:

**Ejemplo:**
- Stock mínimo configurado: **15 unidades**
- Stock actual: **10 unidades**
- Alerta: "Stock bajo: Faltan 5 unidades para alcanzar el mínimo"

---

## 5. ESTRUCTURA DE DATOS

### 5.1. Tabla: `productos`
```sql
CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    stock_actual INTEGER NOT NULL DEFAULT 0,  -- SIEMPRE en unidades
    stock_minimo INTEGER,
    stock_maximo INTEGER,
    precio_venta DECIMAL(10,2) NOT NULL,     -- Precio por unidad
    ...
);
```

### 5.2. Tabla: `packs`
```sql
CREATE TABLE packs (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio_pack DECIMAL(10,2) NOT NULL,      -- Precio del pack completo
    activo BOOLEAN DEFAULT TRUE,
    ...
);
```

### 5.3. Tabla: `pack_productos`
```sql
CREATE TABLE pack_productos (
    id BIGSERIAL PRIMARY KEY,
    pack_id BIGINT REFERENCES packs(id),
    producto_id BIGINT REFERENCES productos(id),
    cantidad INTEGER NOT NULL,               -- Cantidad de unidades en el pack
    ...
);
```

**Ejemplo de Registro:**
```sql
-- Pack: Sixpack Cerveza Pilsen
INSERT INTO packs (nombre, precio_pack) VALUES ('Sixpack Pilsen', 20.00);

INSERT INTO pack_productos (pack_id, producto_id, cantidad) 
VALUES (1, 1, 6);  -- 6 unidades por pack
```

---

## 6. FLUJO DE PROCESOS

### 6.1. Flujo: Ingreso de Pack

```
1. Usuario ingresa: "1 sixpack de Cerveza Pilsen"
   ↓
2. Sistema identifica el pack y sus componentes
   ↓
3. Sistema descompone: 1 sixpack = 6 unidades
   ↓
4. Sistema actualiza stock: stock_actual += 6
   ↓
5. Sistema registra movimiento: ENTRADA, cantidad=6, motivo="Compra: 1 sixpack"
   ↓
6. Stock final: unidades incrementadas
```

### 6.2. Flujo: Venta de Unidad Individual

```
1. Usuario vende: "1 lata de Cerveza Pilsen"
   ↓
2. Sistema verifica stock: stock_actual >= 1
   ↓
3. Sistema descuenta: stock_actual -= 1
   ↓
4. Sistema registra movimiento: SALIDA, cantidad=1, motivo="Venta individual"
   ↓
5. Stock final: 1 unidad menos
```

### 6.3. Flujo: Venta de Pack

```
1. Usuario vende: "1 sixpack de Cerveza Pilsen"
   ↓
2. Sistema identifica pack: sixpack = 6 unidades
   ↓
3. Sistema verifica stock: stock_actual >= 6
   ↓
4. Sistema descuenta: stock_actual -= 6
   ↓
5. Sistema aplica precio: precio_pack (no precio_unitario × 6)
   ↓
6. Sistema registra movimiento: SALIDA, cantidad=6, motivo="Venta: 1 sixpack"
   ↓
7. Stock final: 6 unidades menos
```

---

## 7. CASOS ESPECIALES

### 7.1. Stock Insuficiente para Pack Completo

**Escenario:**
- Stock disponible: **4 unidades** de Cerveza Pilsen
- Cliente solicita: **1 sixpack** (requiere 6 unidades)

**Solución:**
- El sistema **NO permite** vender el pack completo
- Opciones:
  1. Vender las 4 unidades disponibles como unidades sueltas
  2. Mostrar mensaje: "Stock insuficiente para pack completo. Disponible: 4 unidades"

### 7.2. Venta Parcial de Pack

**Escenario:**
- Cliente quiere comprar **3 latas** de un sixpack (romper el pack)

**Solución:**
- El sistema permite vender unidades individuales
- Se descuentan **3 unidades** del stock
- Se cobra: **3 × precio_unitario** (no precio del pack)
- El pack se "rompe" automáticamente al vender unidades sueltas

---

## 8. REPORTES Y CONSULTAS

### 8.1. Reporte de Inventario

El reporte muestra:
- **Stock en unidades** (columna principal)
- **Equivalencia en packs** (columna informativa)

**Ejemplo:**
```
Producto          | Stock (unidades) | Sixpacks | Twelvepacks
------------------|------------------|----------|------------
Cerveza Pilsen    | 24               | 4        | 2
Cerveza Cristal   | 18               | 3        | 1
Cerveza Cusqueña  | 12               | 2        | 1
```

### 8.2. Historial de Movimientos

Todos los movimientos se registran en unidades:

```
Fecha       | Tipo    | Cantidad | Motivo
------------|---------|----------|--------------------------
2025-01-15  | ENTRADA | 6        | Compra: 1 sixpack
2025-01-15  | SALIDA  | 1        | Venta individual
2025-01-15  | SALIDA  | 6        | Venta: 1 sixpack
```

---

## 9. RESUMEN Y RECOMENDACIONES

### ✅ Lo que SÍ se hace:
1. **Inventario siempre en unidades** - El stock se maneja exclusivamente en unidades individuales
2. **Packs se descomponen al ingresar** - Al registrar un pack, se convierte automáticamente en unidades
3. **Ventas descuentan unidades** - Cada venta (pack o unidad) descuenta unidades del stock
4. **Reportes en unidades** - Todos los reportes muestran stock en unidades

### ❌ Lo que NO se hace:
1. **NO se almacena stock en packs** - No existe un campo "stock_packs" separado
2. **NO se mantienen packs "cerrados"** - No se rastrea si un pack está completo o roto
3. **NO se requiere "romper" packs manualmente** - Las unidades se pueden vender libremente

### 🎯 Ventajas de este Enfoque:
1. **Simplicidad:** Un solo sistema de control (unidades)
2. **Flexibilidad:** Permite vender packs completos o unidades sueltas sin restricciones
3. **Precisión:** El stock siempre refleja la realidad física del inventario
4. **Escalabilidad:** Funciona para cualquier tipo de pack (sixpack, twelvepack, etc.)

---

## 10. IMPLEMENTACIÓN TÉCNICA

### 10.1. Servicio de Inventario

```java
@Service
public class InventarioService {
    
    /**
     * Registra entrada de pack descomponiéndolo en unidades
     */
    public void registrarEntradaPack(Long packId, Integer cantidadPacks, Long usuarioId) {
        Pack pack = packRepository.findById(packId).orElseThrow();
        List<PackProducto> productos = pack.getProductos();
        
        for (PackProducto packProducto : productos) {
            Producto producto = packProducto.getProducto();
            Integer unidadesPorPack = packProducto.getCantidad();
            Integer totalUnidades = cantidadPacks * unidadesPorPack;
            
            // Actualizar stock en unidades
            producto.setStockActual(producto.getStockActual() + totalUnidades);
            productoRepository.save(producto);
            
            // Registrar movimiento
            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProducto(producto);
            movimiento.setTipoMovimiento("ENTRADA");
            movimiento.setCantidad(totalUnidades);
            movimiento.setMotivo("Compra: " + cantidadPacks + " " + pack.getNombre());
            movimiento.setUsuarioId(usuarioId);
            movimientoRepository.save(movimiento);
        }
    }
    
    /**
     * Procesa venta de pack descontando unidades
     */
    public void procesarVentaPack(Long packId, Integer cantidadPacks) {
        Pack pack = packRepository.findById(packId).orElseThrow();
        List<PackProducto> productos = pack.getProductos();
        
        // Verificar stock suficiente
        for (PackProducto packProducto : productos) {
            Producto producto = packProducto.getProducto();
            Integer unidadesNecesarias = cantidadPacks * packProducto.getCantidad();
            
            if (producto.getStockActual() < unidadesNecesarias) {
                throw new StockInsuficienteException(
                    "Stock insuficiente para " + pack.getNombre() + 
                    ". Disponible: " + producto.getStockActual() + " unidades"
                );
            }
        }
        
        // Descontar unidades
        for (PackProducto packProducto : productos) {
            Producto producto = packProducto.getProducto();
            Integer unidadesADescontar = cantidadPacks * packProducto.getCantidad();
            
            producto.setStockActual(producto.getStockActual() - unidadesADescontar);
            productoRepository.save(producto);
            
            // Registrar movimiento
            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProducto(producto);
            movimiento.setTipoMovimiento("SALIDA");
            movimiento.setCantidad(unidadesADescontar);
            movimiento.setMotivo("Venta: " + cantidadPacks + " " + pack.getNombre());
            movimientoRepository.save(movimiento);
        }
    }
}
```

---

**Documento preparado por:** Equipo de Desarrollo  
**Fecha de creación:** Enero 2025  
**Versión:** 1.0
