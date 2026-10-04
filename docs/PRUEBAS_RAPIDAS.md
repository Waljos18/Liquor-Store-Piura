# Pruebas Rápidas del Proyecto

**Guía paso a paso para probar el sistema implementado**

---

## ⚡ Inicio Rápido

### Opción 1: Usar IntelliJ IDEA o Eclipse (Recomendado)

1. **Abrir proyecto:**
   - IntelliJ IDEA: `File > Open` → Selecciona la carpeta `backend`
   - Eclipse: `File > Import > Existing Maven Project` → Selecciona `backend`

2. **Configurar base de datos:**
   ```sql
   -- Ejecutar en psql
   CREATE DATABASE licoreria_db;
   \c licoreria_db
   CREATE USER licoreria_user WITH PASSWORD 'licoreria_pass';
   GRANT ALL PRIVILEGES ON DATABASE licoreria_db TO licoreria_user;
   ```

3. **Ejecutar:**
   - IntelliJ: Click derecho en `LicoreriaApplication.java` → `Run`
   - Eclipse: Click derecho en `LicoreriaApplication.java` → `Run As > Spring Boot App`

4. **Verificar:**
   - Abre: http://localhost:8080/swagger-ui.html

---

### Opción 2: Usar Maven desde Terminal

**Si tienes Maven instalado:**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Si NO tienes Maven:**

1. Descarga Maven: https://maven.apache.org/download.cgi
2. Agrega Maven al PATH de Windows
3. O usa el wrapper (si existe): `.\mvnw.cmd spring-boot:run`

---

## 🧪 Pruebas Básicas con Swagger UI

### Paso 1: Acceder a Swagger
1. Abre: http://localhost:8080/swagger-ui.html
2. Deberías ver todos los endpoints organizados por módulos

### Paso 2: Autenticarse
1. Busca el endpoint `POST /api/v1/auth/login`
2. Click en "Try it out"
3. Ingresa:
   ```json
   {
     "username": "admin",
     "password": "Admin123!"
   }
   ```
4. Click en "Execute"
5. **Copia el `accessToken` de la respuesta**

### Paso 3: Autorizar en Swagger
1. Click en el botón **"Authorize"** (arriba a la derecha)
2. Pega el `accessToken` en el campo "Value"
3. Click en "Authorize" y luego "Close"

### Paso 4: Probar Endpoints

#### Crear Categoría
- Endpoint: `POST /api/v1/categorias`
- Body:
  ```json
  {
    "nombre": "Cervezas",
    "descripcion": "Cervezas nacionales e importadas"
  }
  ```

#### Crear Producto
- Endpoint: `POST /api/v1/productos`
- Body:
  ```json
  {
    "nombre": "Cerveza Pilsen 355ml",
    "codigoBarras": "7701234567890",
    "categoriaId": 1,
    "precioCompra": 2.50,
    "precioVenta": 4.00,
    "stockActual": 50,
    "stockMinimo": 10
  }
  ```

#### Crear Cliente
- Endpoint: `POST /api/v1/clientes`
- Body:
  ```json
  {
    "tipoDocumento": "DNI",
    "numeroDocumento": "12345678",
    "nombre": "Juan Pérez",
    "telefono": "999888777"
  }
  ```

#### Crear Proveedor
- Endpoint: `POST /api/v1/proveedores`
- Body:
  ```json
  {
    "razonSocial": "Distribuidora ABC S.A.C.",
    "ruc": "20123456789",
    "telefono": "987654321"
  }
  ```

#### Registrar Compra
- Endpoint: `POST /api/v1/compras`
- Body:
  ```json
  {
    "proveedorId": 1,
    "items": [
      {
        "productoId": 1,
        "cantidad": 24,
        "precioUnitario": 2.50
      }
    ]
  }
  ```
- **Verifica:** El stock del producto debe aumentar

#### Crear Venta
- Endpoint: `POST /api/v1/ventas`
- Body:
  ```json
  {
    "clienteId": 1,
    "items": [
      {
        "productoId": 1,
        "cantidad": 2,
        "precioUnitario": 4.00
      }
    ],
    "formaPago": "EFECTIVO"
  }
  ```
- **Verifica:** 
  - Se crea la venta con número único
  - El stock disminuye
  - Se calculan subtotal, IGV y total

#### Emitir Boleta (Demo)
- Endpoint: `POST /api/v1/facturacion/demo`
- **Este endpoint crea una venta de prueba y genera la boleta automáticamente**
- **Verifica:** Devuelve el ID del comprobante generado

#### Enviar a SUNAT
- Endpoint: `POST /api/v1/facturacion/comprobantes/{id}/enviar`
- Reemplaza `{id}` con el ID del comprobante obtenido
- **Verifica:** El estado cambia a "ACEPTADO" (en modo pruebas)

---

## 📝 Pruebas con Postman o cURL

Si prefieres usar Postman o cURL, consulta el archivo `TEST_PROYECTO.md` que contiene todos los comandos detallados.

---

## ✅ Verificación Rápida

**El proyecto está funcionando si:**

1. ✅ El servidor inicia sin errores
2. ✅ Swagger UI se abre correctamente
3. ✅ El login devuelve un token
4. ✅ Puedes crear productos y categorías
5. ✅ Las ventas se crean y actualizan el inventario
6. ✅ Se generan comprobantes (XML + PDF)

---

## 🐛 Problemas Comunes

### "No se puede conectar a la base de datos"
- Verifica que PostgreSQL esté corriendo
- Verifica credenciales en `application.properties`

### "Puerto 8080 en uso"
- Cambia el puerto: `server.port=8081` en `application.properties`

### "Maven no encontrado"
- Usa un IDE (IntelliJ/Eclipse) que incluye Maven
- O instala Maven y agrégalo al PATH

---

## 📚 Documentación Completa

- **Guía de Ejecución:** `GUIA_EJECUCION.md`
- **Pruebas Detalladas:** `TEST_PROYECTO.md`
- **Documentación Sprint 3:** `docs/semana-05-06/01-ENTREGABLES-SPRINT-3.md`

---

**¡Listo para probar!** 🚀
