# Guía de Pruebas del Proyecto - Sistema de Licorería

**Proyecto:** PROY-LICOR-PIURA-2025-001  
**Sprint:** 3 (Semana 5-6)

---

## 🚀 Pasos para Probar el Proyecto

### 1. Preparar el Entorno

#### Verificar Requisitos
```bash
# Verificar Java
java -version  # Debe ser 17 o superior

# Verificar Maven
mvn -version   # Debe ser 3.8 o superior

# Verificar PostgreSQL
psql --version # Debe ser 15 o superior
```

#### Configurar Base de Datos
```bash
# Crear base de datos y usuario
cd database
psql -U postgres -f setup.sql
```

---

### 2. Compilar el Proyecto

```bash
cd backend
mvn clean install
```

**Si hay errores de compilación:**
- Verifica que todas las dependencias estén descargadas: `mvn dependency:resolve`
- Revisa los logs de compilación para identificar problemas específicos

---

### 3. Ejecutar el Backend

```bash
cd backend
mvn spring-boot:run
```

**Verificar que el servidor esté corriendo:**
- Abre: http://localhost:8080/swagger-ui.html
- Deberías ver la documentación de Swagger con todos los endpoints

---

## 🧪 Pruebas por Módulo

### Prueba 1: Autenticación

**1.1 Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"Admin123!\"}"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": 1,
      "username": "admin",
      "rol": "ADMIN"
    }
  }
}
```

**Guarda el `accessToken` para las siguientes pruebas.**

---

### Prueba 2: Gestión de Productos

**2.1 Crear Categoría:**
```bash
curl -X POST http://localhost:8080/api/v1/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"nombre\":\"Cervezas\",\"descripcion\":\"Cervezas nacionales e importadas\"}"
```

**2.2 Crear Producto:**
```bash
curl -X POST http://localhost:8080/api/v1/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"nombre\":\"Cerveza Pilsen 355ml\",
    \"codigoBarras\":\"7701234567890\",
    \"categoriaId\":1,
    \"precioCompra\":2.50,
    \"precioVenta\":4.00,
    \"stockActual\":50,
    \"stockMinimo\":10
  }"
```

**2.3 Listar Productos:**
```bash
curl -X GET "http://localhost:8080/api/v1/productos?page=0&size=10" \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Prueba 3: Gestión de Clientes

**3.1 Crear Cliente:**
```bash
curl -X POST http://localhost:8080/api/v1/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"tipoDocumento\":\"DNI\",
    \"numeroDocumento\":\"12345678\",
    \"nombre\":\"Juan Pérez\",
    \"telefono\":\"999888777\"
  }"
```

---

### Prueba 4: Gestión de Proveedores y Compras

**4.1 Crear Proveedor:**
```bash
curl -X POST http://localhost:8080/api/v1/proveedores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"razonSocial\":\"Distribuidora ABC S.A.C.\",
    \"ruc\":\"20123456789\",
    \"telefono\":\"987654321\"
  }"
```

**4.2 Registrar Compra:**
```bash
curl -X POST http://localhost:8080/api/v1/compras \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"proveedorId\":1,
    \"items\":[
      {
        \"productoId\":1,
        \"cantidad\":24,
        \"precioUnitario\":2.50
      }
    ]
  }"
```

**Verificar:** El stock del producto debe aumentar de 50 a 74.

---

### Prueba 5: Módulo de Ventas

**5.1 Crear Venta:**
```bash
curl -X POST http://localhost:8080/api/v1/ventas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"clienteId\":1,
    \"items\":[
      {
        \"productoId\":1,
        \"cantidad\":2,
        \"precioUnitario\":4.00
      }
    ],
    \"formaPago\":\"EFECTIVO\"
  }"
```

**Verificar:**
- Se crea la venta con número único
- El stock del producto disminuye (de 74 a 72)
- Se calculan correctamente subtotal, IGV y total

**5.2 Listar Ventas:**
```bash
curl -X GET "http://localhost:8080/api/v1/ventas?page=0&size=10" \
  -H "Authorization: Bearer <TOKEN>"
```

**5.3 Obtener Venta:**
```bash
curl -X GET http://localhost:8080/api/v1/ventas/1 \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Prueba 6: Módulo de Inventario

**6.1 Ver Alertas de Stock Bajo:**
```bash
curl -X GET http://localhost:8080/api/v1/inventario/alertas/stock-bajo \
  -H "Authorization: Bearer <TOKEN>"
```

**6.2 Ver Movimientos de Inventario:**
```bash
curl -X GET "http://localhost:8080/api/v1/inventario/movimientos?page=0&size=10" \
  -H "Authorization: Bearer <TOKEN>"
```

**6.3 Ajustar Inventario:**
```bash
curl -X POST "http://localhost:8080/api/v1/inventario/ajustar?productoId=1&stockFisico=75" \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Prueba 7: Sistema de Promociones

**7.1 Crear Promoción:**
```bash
curl -X POST http://localhost:8080/api/v1/promociones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"nombre\":\"Descuento 10% en Cervezas\",
    \"tipo\":\"DESCUENTO_PORCENTAJE\",
    \"descuentoPorcentaje\":10.00,
    \"fechaInicio\":\"2025-01-01T00:00:00\",
    \"fechaFin\":\"2025-12-31T23:59:59\",
    \"productos\":[
      {
        \"productoId\":1,
        \"cantidadMinima\":1
      }
    ]
  }"
```

**7.2 Crear Pack:**
```bash
curl -X POST http://localhost:8080/api/v1/packs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"nombre\":\"Pack 6 Cervezas\",
    \"precioPack\":20.00,
    \"productos\":[
      {
        \"productoId\":1,
        \"cantidad\":6
      }
    ]
  }"
```

---

### Prueba 8: Facturación Electrónica

**8.1 Emitir Boleta (Demo):**
```bash
curl -X POST http://localhost:8080/api/v1/facturacion/demo \
  -H "Authorization: Bearer <TOKEN>"
```

**8.2 Emitir Boleta Manual:**
```bash
curl -X POST http://localhost:8080/api/v1/facturacion/emitir-boleta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"ventaId\":1,
    \"tipoDocumento\":\"DNI\",
    \"numeroDocumento\":\"12345678\",
    \"nombre\":\"Juan Pérez\"
  }"
```

**8.3 Descargar PDF:**
```bash
# Reemplaza {id} con el ID del comprobante obtenido
curl -X GET http://localhost:8080/api/v1/facturacion/comprobantes/{id}/pdf \
  -H "Authorization: Bearer <TOKEN>" \
  --output comprobante.pdf
```

**8.4 Ver XML:**
```bash
curl -X GET http://localhost:8080/api/v1/facturacion/comprobantes/{id}/xml \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Prueba 9: Integración SUNAT

**9.1 Enviar Comprobante a SUNAT:**
```bash
curl -X POST http://localhost:8080/api/v1/facturacion/comprobantes/{id}/enviar \
  -H "Authorization: Bearer <TOKEN>"
```

**Nota:** En modo `pruebas`, esto simula el envío sin conectarse realmente a SUNAT.

**9.2 Consultar Estado:**
```bash
curl -X GET http://localhost:8080/api/v1/facturacion/comprobantes/{id}/consultar \
  -H "Authorization: Bearer <TOKEN>"
```

**9.3 Listar Pendientes:**
```bash
curl -X GET http://localhost:8080/api/v1/facturacion/comprobantes/pendientes \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📋 Checklist de Pruebas

### Funcionalidades Core
- [ ] Autenticación (login, refresh, logout)
- [ ] CRUD de Productos
- [ ] CRUD de Categorías
- [ ] CRUD de Clientes
- [ ] CRUD de Proveedores
- [ ] Registro de Compras (actualiza stock)
- [ ] Creación de Ventas (valida stock, actualiza inventario)
- [ ] Anulación de Ventas (restaura stock)
- [ ] Gestión de Inventario (movimientos, alertas, ajustes)
- [ ] Sistema de Promociones
- [ ] Sistema de Packs
- [ ] Generación de Boletas/Facturas (XML + PDF)
- [ ] Envío a SUNAT (simulado en pruebas)
- [ ] Consulta de estado en SUNAT

### Validaciones
- [ ] Validación de stock antes de venta
- [ ] Validación de fechas en promociones
- [ ] Validación de permisos (ADMIN vs VENDEDOR)
- [ ] Manejo de errores en endpoints

---

## 🔍 Pruebas con Swagger UI

1. Abre: http://localhost:8080/swagger-ui.html
2. Haz clic en "Authorize" y pega el `accessToken`
3. Prueba cada endpoint directamente desde la interfaz

---

## 🐛 Solución de Problemas Comunes

### Error: "Connection refused" al iniciar
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `application.properties`

### Error: "Port 8080 already in use"
- Cambia el puerto en `application.properties`: `server.port=8081`
- O detén el proceso que usa el puerto 8080

### Error: "Table does not exist"
- Verifica que las migraciones de Flyway se ejecutaron
- Revisa los logs al iniciar la aplicación

### Error: "401 Unauthorized"
- Verifica que el token JWT sea válido
- Haz login nuevamente para obtener un token fresco

---

## 📊 Flujo Completo de Prueba

**Escenario:** Venta completa con facturación

1. **Crear datos base:**
   - Categoría: "Cervezas"
   - Producto: "Cerveza Pilsen 355ml" (stock: 50)
   - Cliente: "Juan Pérez" (DNI: 12345678)

2. **Registrar compra:**
   - Proveedor: "Distribuidora ABC"
   - Compra: 24 unidades a S/. 2.50
   - **Resultado:** Stock aumenta a 74

3. **Crear venta:**
   - Cliente: Juan Pérez
   - Producto: Cerveza Pilsen (2 unidades)
   - **Resultado:** Stock disminuye a 72, se crea venta #V-20250124-00001

4. **Emitir boleta:**
   - Genera XML y PDF
   - **Resultado:** Comprobante creado con estado PENDIENTE

5. **Enviar a SUNAT:**
   - Envía comprobante
   - **Resultado:** Estado cambia a ACEPTADO (en modo pruebas)

6. **Verificar:**
   - Movimientos de inventario registrados
   - Comprobante disponible para descarga
   - Estado actualizado en SUNAT

---

## ✅ Criterios de Éxito

El proyecto está funcionando correctamente si:

1. ✅ El servidor inicia sin errores
2. ✅ Swagger UI es accesible
3. ✅ El login funciona y devuelve token
4. ✅ Se pueden crear productos, categorías y clientes
5. ✅ Las compras actualizan el stock correctamente
6. ✅ Las ventas validan stock y actualizan inventario
7. ✅ Se generan comprobantes (XML + PDF)
8. ✅ El envío a SUNAT funciona (simulado en pruebas)
9. ✅ Las promociones y packs se crean correctamente
10. ✅ Las alertas de inventario funcionan

---

**¿Problemas?** Revisa los logs en la consola o contacta al equipo de desarrollo.
