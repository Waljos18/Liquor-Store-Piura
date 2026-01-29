# Guía de Pruebas con Postman

Esta guía te ayudará a configurar y usar la colección de Postman para probar todos los endpoints del backend de la licorería.

## 📋 Requisitos Previos

1. **Postman instalado**: Descarga e instala Postman desde [postman.com](https://www.postman.com/downloads/)
2. **Backend ejecutándose**: Asegúrate de que el backend esté corriendo en `http://localhost:8080`
3. **Base de datos configurada**: La base de datos PostgreSQL debe estar configurada y con datos iniciales

## 🚀 Configuración Inicial

### Paso 1: Importar la Colección

1. Abre Postman
2. Haz clic en **Import** (botón en la esquina superior izquierda)
3. Selecciona el archivo `LICORERIA_BACKEND.postman_collection.json`
4. La colección aparecerá en el panel izquierdo

### Paso 2: Importar el Entorno

1. Haz clic en **Import** nuevamente
2. Selecciona el archivo `LICORERIA_BACKEND.postman_environment.json`
3. En la esquina superior derecha, selecciona el entorno **"Licorería Backend - Local"**

### Paso 3: Verificar Variables

Las siguientes variables están configuradas:
- `base_url`: `http://localhost:8080` (ajusta si tu backend corre en otro puerto)
- `access_token`: Se llena automáticamente después del login
- `refresh_token`: Se llena automáticamente después del login

## 🔐 Autenticación

### Login Inicial

1. Ve a la carpeta **"01. Autenticación"**
2. Ejecuta la petición **"Login"**
3. Usa las credenciales por defecto:
   
   **Usuario Administrador:**
   ```json
   {
       "username": "admin",
       "password": "Admin123!"
   }
   ```
   
   **Usuario Vendedor:**
   ```json
   {
       "username": "vendedor",
       "password": "Admin123!"
   }
   ```
   
   > **Nota:** Ambos usuarios se crean automáticamente al iniciar la aplicación con la contraseña `Admin123!` (con mayúscula, minúscula, número y signo de exclamación).

4. Si el login es exitoso, los tokens se guardarán automáticamente en las variables de entorno
5. Todos los demás endpoints usarán automáticamente el `access_token`

### Refresh Token

Si el `access_token` expira:
1. Ejecuta la petición **"Refresh Token"** en la carpeta de Autenticación
2. El nuevo `access_token` se actualizará automáticamente

## 📚 Estructura de la Colección

La colección está organizada en las siguientes carpetas:

### 01. Autenticación
- **Login**: Iniciar sesión y obtener tokens
- **Refresh Token**: Renovar access token
- **Logout**: Cerrar sesión

### 02. Productos
- Listar productos (con filtros)
- Buscar producto (búsqueda rápida POS)
- Obtener producto por ID
- Crear producto
- Actualizar producto
- Desactivar producto

### 03. Clientes
- Listar clientes
- Obtener cliente por ID
- Obtener cliente por documento
- Crear cliente
- Actualizar cliente
- Eliminar cliente

### 04. Ventas
- Crear venta
- Listar ventas (con filtros)
- Obtener venta por ID
- Anular venta (solo ADMIN)

### 05. Compras
- Crear compra
- Listar compras (con filtros)
- Obtener compra por ID
- Anular compra (solo ADMIN)

### 06. Categorías
- Listar categorías
- Obtener categoría por ID
- Crear categoría
- Actualizar categoría
- Eliminar categoría

### 07. Proveedores
- Listar proveedores
- Obtener proveedor por ID
- Crear proveedor
- Actualizar proveedor
- Eliminar proveedor

### 08. Inventario
- Listar movimientos de inventario
- Ajustar stock manual
- Obtener stock actual

### 09. Promociones
- Listar promociones
- Obtener promoción por ID
- Crear promoción
- Actualizar promoción
- Eliminar promoción

### 10. Packs
- Listar packs
- Obtener pack por ID
- Crear pack
- Actualizar pack
- Eliminar pack

### 11. Facturación
- Emitir factura
- Emitir boleta
- Consultar comprobante

### 12. Usuarios
- Listar usuarios
- Obtener usuario por ID
- Crear usuario
- Actualizar usuario
- Desactivar usuario

## 🧪 Flujo de Pruebas Recomendado

### 1. Autenticación
```
Login → Verificar tokens guardados
```

### 2. Configuración Básica
```
Crear Categoría → Crear Proveedor → Crear Producto
```

### 3. Gestión de Clientes
```
Crear Cliente → Listar Clientes → Obtener Cliente por ID
```

### 4. Operaciones de Compra
```
Crear Compra → Listar Compras → Verificar Stock Actualizado
```

### 5. Operaciones de Venta
```
Crear Venta → Listar Ventas → Obtener Venta por ID
```

### 6. Funcionalidades Avanzadas
```
Crear Promoción → Crear Pack → Emitir Factura/Boleta
```

## 📝 Ejemplos de Uso

### Crear una Venta Completa

1. **Primero, asegúrate de tener productos y clientes:**
   - Crear Cliente (si no existe)
   - Verificar que existan productos con stock

2. **Crear la venta:**
   ```json
   {
       "clienteId": 1,
       "items": [
           {
               "productoId": 1,
               "cantidad": 2,
               "precioUnitario": 65.00
           }
       ],
       "formaPago": "EFECTIVO",
       "descuento": 0.00,
       "observaciones": "Venta de prueba"
   }
   ```

3. **Verificar la respuesta:**
   - Debe incluir el ID de la venta
   - Debe mostrar los detalles de los productos
   - Debe mostrar el total calculado

### Crear una Compra

```json
{
    "proveedorId": 1,
    "numeroFactura": "F001-000001",
    "fechaCompra": "2025-01-29",
    "items": [
        {
            "productoId": 1,
            "cantidad": 50,
            "precioUnitario": 45.00
        }
    ],
    "observaciones": "Compra de prueba"
}
```

## 🔍 Verificación de Respuestas

Todas las respuestas siguen el formato estándar:

```json
{
    "success": true,
    "data": { ... },
    "message": "Operación exitosa"
}
```

O en caso de error:

```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Mensaje de error"
    }
}
```

## ⚠️ Notas Importantes

1. **Autenticación**: La mayoría de endpoints requieren autenticación. Asegúrate de hacer login primero.

2. **Roles**: Algunos endpoints (como anular ventas/compras) requieren rol ADMIN.

3. **IDs**: Los IDs en los ejemplos (como `/productos/1`) son referenciales. Usa los IDs reales de tu base de datos.

4. **Fechas**: 
   - Para ventas: formato ISO DateTime (`2025-01-29T10:30:00Z`)
   - Para compras: formato ISO Date (`2025-01-29`)

5. **Stock**: Al crear ventas, verifica que haya suficiente stock disponible.

6. **Validaciones**: El backend valida todos los datos. Revisa los mensajes de error para entender qué falta.

## 🐛 Solución de Problemas

### Error 401 (Unauthorized)
- Verifica que hayas hecho login
- Verifica que el token no haya expirado (usa Refresh Token)
- Verifica que el header `Authorization` esté presente

### Error 404 (Not Found)
- Verifica que el ID del recurso exista
- Verifica que la URL sea correcta

### Error 400 (Bad Request)
- Verifica el formato JSON del body
- Verifica que todos los campos requeridos estén presentes
- Revisa los mensajes de validación en la respuesta

### Error 500 (Internal Server Error)
- Verifica los logs del backend
- Verifica que la base de datos esté conectada
- Verifica que los datos sean consistentes

## 📊 Monitoreo

Puedes usar el **Collection Runner** de Postman para ejecutar todas las pruebas automáticamente:

1. Haz clic derecho en la colección
2. Selecciona **Run collection**
3. Configura las opciones y ejecuta

## 🔄 Actualización de la Colección

Si se agregan nuevos endpoints al backend:
1. Actualiza manualmente la colección en Postman
2. O exporta la nueva versión desde Swagger UI (disponible en `/swagger-ui.html`)

## 📞 Soporte

Para más información sobre los endpoints, consulta:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Documentación de la API en `/api-docs`

---

¡Listo para probar! 🚀
